import { useEffect, useState } from 'react';

type Position = google.maps.LatLngLiteral;

interface UseCurrentPositionOptions {
  getPositionOnInit?: boolean;
}

/**
 * Custom hook that retrieves the current position of the user.
 * @param options - Optional configuration options.
 * @returns An object containing the current position, loading state, error message, and a function to manually retrieve the current position.
 */
export const useCurrentPosition = (options: UseCurrentPositionOptions = {}) => {
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getPositionOnInit = true } = options;

  const getCurrentPosition = () => {
    setLoading(true);
    setError(null);
    

    const handlePosition = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setPosition({ lat: latitude, lng: longitude });
      setLoading(false);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
      setPosition(null);
      setLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handlePosition, handleError);
    } else {
      const error: GeolocationPositionError = {
        code: 2,
        message: 'Geolocation is not supported',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      };
      handleError(error);
    }
  };

  useEffect(() => {
    if(getPositionOnInit) {
      getCurrentPosition();
    }
  }, []);

  return { position, loading, error, getCurrentPosition };
};
