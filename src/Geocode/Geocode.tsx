import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from '../GoogleMapsContext';

const GeocodeContext = React.createContext<{ geocode: google.maps.Geocoder | null }>({ geocode: null });

export function useGeocode() {
  return React.useContext(GeocodeContext);
}

interface GeocodeProps {
  onLoaded?: (geocode: google.maps.Geocoder) => void;
  children?: React.ReactNode;
}

/**
 * Geocode component that provides a geocoder instance to its children.
 * @param children - The children components.
 * @returns The Geocode component.
 */
export function Geocode({ children, onLoaded }: GeocodeProps): JSX.Element {
  const { scriptLoaded } = useGoogleMaps();
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (scriptLoaded && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }
  }, [scriptLoaded]);

  useEffect(() => {
    if (geocoderRef.current) {
      onLoaded?.(geocoderRef.current);
    }
  } , [geocoderRef.current, onLoaded]);

  return <GeocodeContext.Provider value={{ geocode: geocoderRef.current }}>{children}</GeocodeContext.Provider>;
}
