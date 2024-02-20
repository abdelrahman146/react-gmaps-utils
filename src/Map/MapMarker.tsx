import React, { useRef, useEffect } from 'react';
import { useMap } from './Map';

interface MapMarkerProps {
  position: google.maps.LatLngLiteral | null;
  options?: Omit<google.maps.MarkerOptions, 'position'>;
  children?: React.ReactNode;
}

/**
 * Context for the map marker.
 */
const MapMarkerContext = React.createContext<{
  marker: google.maps.Marker | null;
}>({
  marker: null,
});

export function useMarker() {
  return React.useContext(MapMarkerContext);
}

/**
 * Renders a marker on a Google Map.
 *
 * @param position - The position of the marker on the map.
 * @param options - Additional options for the marker.
 * @param children - The content to be rendered inside the marker.
 * @returns The rendered marker component.
 */
export function MapMarker({ position, options, children }: MapMarkerProps): JSX.Element {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const { map } = useMap();

  useEffect(() => {
    if (map && position) {
      if (!markerRef.current) {
        markerRef.current = new google.maps.Marker({ map, position, ...options });
      } else {
        markerRef.current.setPosition(position);
      }
    }
  }, [map, position]);

  return <MapMarkerContext.Provider value={{ marker: markerRef.current }}>{children}</MapMarkerContext.Provider>;
}
