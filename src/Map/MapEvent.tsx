import React, { useEffect, useCallback } from 'react';
import { useMap } from './Map';
import { useGoogleMaps } from '../GoogleMapsContext';

interface MapEventProps {
  event: string;
  callback: (map: google.maps.Map, event?: any) => void;
}

/**
 * Renders a map event component.
 * @param event - The event name to listen for.
 * @param callback - The callback function to be executed when the event is triggered.
 * @returns The rendered map event component.
 */
export function MapEvent({ event, callback }: MapEventProps): JSX.Element {
  const { scriptLoaded } = useGoogleMaps();
  const { map } = useMap();
  const cb = useCallback(callback.bind(null, map), [callback, map]);

  useEffect(() => {
    if (!scriptLoaded) return;
    if (!map) return;
    const listener = map.addListener(event, cb);
    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, scriptLoaded, event, cb]);

  return <React.Fragment></React.Fragment>;
}
