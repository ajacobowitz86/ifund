'use client';

import { useState } from 'react';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';

const libraries: ('places')[] = ['places'];

const usAutocompleteOptions: google.maps.places.AutocompleteOptions = {
  componentRestrictions: { country: 'us' },
  fields: ['formatted_address', 'address_components', 'geometry'],
  types: ['address'],
};

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

function GoogleUsAddressInput({
  value,
  onChange,
  required,
  className,
}: UsAddressInputProps) {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const onLoadAutocomplete = (autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (place.formatted_address) {
      onChange(place.formatted_address);
    }
  };

  if (loadError) {
    return (
      <div className="space-y-2">
        <PlainAddressInput
          value={value}
          onChange={onChange}
          required={required}
          className={className}
          placeholder="Enter US street address, city, state, zip"
        />
        <p className="text-xs text-amber-700">
          Google Maps could not load. Enter the US address manually.
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
        placeholder="Loading US address lookup..."
      />
    );
  }

  return (
    <Autocomplete
      onLoad={onLoadAutocomplete}
      onPlaceChanged={onPlaceChanged}
      options={usAutocompleteOptions}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={className}
        placeholder="Start typing a US street address"
        autoComplete="street-address"
      />
    </Autocomplete>
  );
}

/**
 * US-only property address input.
 * Uses Google Places Autocomplete when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set.
 */
export default function UsAddressInput(props: UsAddressInputProps) {
  const hasMapsKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  if (!hasMapsKey) {
    return (
      <div className="space-y-2">
        <PlainAddressInput
          {...props}
          placeholder="Enter US street address, city, state, zip"
        />
        <p className="text-xs text-slate-500">
          Add <code className="font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to
          enable US address autocomplete.
        </p>
      </div>
    );
  }

  return <GoogleUsAddressInput {...props} />;
}
