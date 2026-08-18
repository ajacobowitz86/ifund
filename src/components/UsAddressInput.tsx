'use client';

import { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import {
  SERVICE_STATES_LABEL,
  addressIsInServiceStates,
  isAllowedServiceState,
  predictionIsInServiceStates,
} from '@/lib/service-states';

type UsAddressInputProps = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
};

function PlainAddressInput({
  value,
  onChange,
  required,
  className,
  placeholder,
}: UsAddressInputProps & { placeholder: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={className}
      placeholder={placeholder}
      autoComplete="street-address"
    />
  );
}

function stateCodeFromPlace(place: google.maps.places.Place): string | null {
  const component = place.addressComponents?.find((item) =>
    item.types.includes('administrative_area_level_1'),
  );
  return component?.shortText ?? null;
}

declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}

function GoogleServiceAreaAddressInput({
  value,
  onChange,
  required,
  className,
}: UsAddressInputProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const [predictions, setPredictions] = useState<
    google.maps.places.PlacePrediction[]
  >([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapsAuthFailed, setMapsAuthFailed] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    const previous = window.gm_authFailure;
    window.gm_authFailure = () => {
      setMapsAuthFailed(true);
      previous?.();
    };
    return () => {
      window.gm_authFailure = previous;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!isLoaded || mapsAuthFailed) return;

    const query = value.trim();
    if (query.length < 3) {
      return;
    }

    let cancelled = false;
    const handle = window.setTimeout(() => {
      void (async () => {
        try {
          const { AutocompleteSuggestion, AutocompleteSessionToken } =
            (await google.maps.importLibrary(
              'places',
            )) as google.maps.PlacesLibrary;

          if (cancelled) return;

          if (!sessionTokenRef.current) {
            sessionTokenRef.current = new AutocompleteSessionToken();
          }

          const { suggestions } =
            await AutocompleteSuggestion.fetchAutocompleteSuggestions({
              input: query,
              includedRegionCodes: ['us'],
              region: 'us',
              includedPrimaryTypes: ['street_address', 'premise', 'subpremise'],
              sessionToken: sessionTokenRef.current,
            });

          if (cancelled) return;

          setPredictions(
            (suggestions ?? [])
              .map((suggestion) => suggestion.placePrediction)
              .filter(
                (prediction): prediction is google.maps.places.PlacePrediction =>
                  Boolean(prediction),
              )
              .filter((prediction) =>
                predictionIsInServiceStates({
                  description: prediction.text.text,
                }),
              )
              .slice(0, 6),
          );
        } catch {
          if (!cancelled) {
            setPredictions([]);
          }
        }
      })();
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [isLoaded, mapsAuthFailed, value]);

  const selectPrediction = async (
    prediction: google.maps.places.PlacePrediction,
  ) => {
    setOpen(false);

    try {
      const place = prediction.toPlace();
      await place.fetchFields({
        fields: ['formattedAddress', 'addressComponents'],
      });
      sessionTokenRef.current = null;

      if (!place.formattedAddress) {
        setError('That address could not be confirmed. Please try another.');
        return;
      }

      if (!isAllowedServiceState(stateCodeFromPlace(place))) {
        setError(`Please choose an address in ${SERVICE_STATES_LABEL}.`);
        onChange('');
        return;
      }

      setError(null);
      onChange(place.formattedAddress);
      setPredictions([]);
    } catch {
      sessionTokenRef.current = null;
      setError('That address could not be confirmed. Please try another.');
    }
  };

  if (loadError || mapsAuthFailed) {
    return (
      <div className="space-y-2">
        <PlainAddressInput
          value={value}
          onChange={onChange}
          required={required}
          className={className}
          placeholder="Enter street address in NY, NJ, PA, CT, or FL"
        />
        <p className="text-xs text-amber-700">
          Google Places could not load. Enter an address in {SERVICE_STATES_LABEL}.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <PlainAddressInput
        value={value}
        onChange={onChange}
        required={required}
        className={className}
        placeholder="Loading address lookup..."
      />
    );
  }

  return (
    <div ref={containerRef} className="relative space-y-2">
      <input
        type="text"
        value={value}
        required={required}
        className={className}
        placeholder="Start typing an address in NY, NJ, PA, CT, or FL"
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setError(null);
          onChange(event.target.value);
          setOpen(true);
        }}
        onBlur={() => {
          if (value.trim() && !addressIsInServiceStates(value)) {
            setError(`Please choose an address in ${SERVICE_STATES_LABEL}.`);
          }
        }}
      />
      {open && value.trim().length >= 3 && predictions.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-brand-navy/15 bg-brand-white py-1 shadow-lg">
          {predictions.map((prediction) => (
            <li key={prediction.placeId}>
              <button
                type="button"
                className="w-full px-4 py-2 text-left font-sans text-sm text-brand-navy hover:bg-brand-canvas"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  void selectPrediction(prediction);
                }}
              >
                {prediction.text.text}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-brand-slate">
        Address lookup is limited to {SERVICE_STATES_LABEL}.
      </p>
      {error && <p className="text-xs text-amber-700">{error}</p>}
    </div>
  );
}

/**
 * Property address input limited to NY, NJ, PA, CT, and FL.
 * Uses Google Places Autocomplete (New) when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set.
 */
export default function UsAddressInput(props: UsAddressInputProps) {
  const hasMapsKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  if (!hasMapsKey) {
    return (
      <div className="space-y-2">
        <PlainAddressInput
          {...props}
          placeholder="Enter street address in NY, NJ, PA, CT, or FL"
        />
        <p className="text-xs text-brand-slate">
          Lending area: {SERVICE_STATES_LABEL}.
        </p>
      </div>
    );
  }

  return <GoogleServiceAreaAddressInput {...props} />;
}
