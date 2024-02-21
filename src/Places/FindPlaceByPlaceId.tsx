import React, { useEffect } from 'react';
import { usePlaces } from './Places';

interface FindPlaceByPlaceIdProps {
  placeId?: string | null;
  onPlaceReceived?: (place: google.maps.places.PlaceResult | null) => void;
}

export function FindPlaceByPlaceId({ placeId, onPlaceReceived }: FindPlaceByPlaceIdProps): JSX.Element {
  const { places } = usePlaces();

  useEffect(() => {
    if (places && placeId) {
      places.getDetails({ placeId }, (result, status) => {
        if (status === 'OK') {
          onPlaceReceived?.(result);
        }
      });
    }
  }, [places, placeId]);

  return <React.Fragment></React.Fragment>;
}
