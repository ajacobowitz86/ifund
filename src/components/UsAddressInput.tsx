'use client';

import { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import {
  SERVICE_STATES_LABEL,
  addressIsInServiceStates,
  isAllowedServiceState,
  predictionIsInServiceStates,
} from '@/lib/service-states';

const libraries: ('places')[] = ['places'];

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

function stateCodeFromPlace(place: google.maps.places.PlaceResult): string | null {
  const component = place.address_components?.find((item) =>
    item.types.includes('administrative_area_level_1'),
  );
  return component?.short_name ?? null;
}

function GoogleServiceAreaAddressInput({
  value,
  onChange,
  required,
  className,
}: UsAddressInputProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const attributionRef = useRef<HTMLDivElement | null>(null);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

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
    if (!isLoaded) return;

    const query = value.trim();
    if (query.length < 3) {
      return;
    }

    const handle = window.setTimeout(() => {
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
      }

      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'us' },
          types: ['address'],
          sessionToken: sessionTokenRef.current,
        },
        (results, status) => {
          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !results
          ) {
            setPredictions([]);
            return;
          }

          setPredictions(
            results.filter(predictionIsInServiceStates).slice(0, 6),
          );
        },
      );
    }, 200);

    return () => window.clearTimeout(handle);
  }, [isLoaded, value]);

  const selectPrediction = (
    prediction: google.maps.places.AutocompletePrediction,
  ) => {
    if (!attributionRef.current) return;

    const places = new google.maps.places.PlacesService(attributionRef.current);
    places.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['formatted_address', 'address_components', 'geometry'],
        sessionToken: sessionTokenRef.current ?? undefined,
      },
      (place, status) => {
        sessionTokenRef.current = null;
        setOpen(false);

        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !place?.formatted_address
        ) {
          setError('That address could not be confirmed. Please try another.');
          return;
        }

        if (!isAllowedServiceState(stateCodeFromPlace(place))) {
          setError(
            `Please choose an address in ${SERVICE_STATES_LABEL}.`,
          );
          onChange('');
          return;
        }

        setError(null);
        onChange(place.formatted_address);
        setPredictions([]);
      },
    );
  };

  if (loadError) {
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
            <li key={prediction.place_id}>
              <button
                type="button"
                className="w-full px-4 py-2 text-left font-sans text-sm text-brand-navy hover:bg-brand-canvas"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectPrediction(prediction)}
              >
                {prediction.description}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-brand-slate">
        Address lookup is limited to {SERVICE_STATES_LABEL}.
      </p>
      {error && <p className="text-xs text-amber-700">{error}</p>}
      <div ref={attributionRef} className="hidden" />
    </div>
  );
}

/**
 * Property address input limited to NY, NJ, PA, CT, and FL.
 * Uses Google Places Autocomplete when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set.
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
