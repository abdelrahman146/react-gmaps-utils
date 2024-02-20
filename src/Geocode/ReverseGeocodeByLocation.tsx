import React, { useEffect } from 'react';
import { useGeocode } from './Geocode';

interface ReverseGeocodeByLocationProps {
  position: google.maps.LatLngLiteral;
  onAddressReceived: (result: google.maps.GeocoderResult) => void;
}

/**
 * Reverse geocodes the given location and calls the `onAddressReceived` callback with the first result.
 * @param position - The position to reverse geocode.
 * @param onAddressReceived - The callback function to be called with the reverse geocoded address.
 * @returns The JSX element.
 */
export function ReverseGeocodeByLocation({ position, onAddressReceived }: ReverseGeocodeByLocationProps): JSX.Element {
  const { geocode } = useGeocode();

  useEffect(() => {
    if (geocode && position) {
      geocode.geocode({ location: position }, (results, status) => {
        if (status === 'OK') {
          if (results && results[0]) {
            onAddressReceived(results[0]);
          }
        }
      });
    }
  }, [geocode, position]);

  return <React.Fragment></React.Fragment>;
}
