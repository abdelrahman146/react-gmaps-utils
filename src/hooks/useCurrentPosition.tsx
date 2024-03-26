import { useEffect, useState } from 'react'

type Position = google.maps.LatLngLiteral

interface UseCurrentPositionOptions {
  onInit?: {
    getPosition?: boolean
    ipBased?: boolean
  }
}

const cache: {ip?: Position, current?: Position} = {};

/**
 * Custom hook that retrieves the current position of the user.
 * @param options - Optional configuration options.
 * @returns An object containing the current position, loading state, error message, and a function to manually retrieve the current position.
 */
export const useCurrentPosition = (options: UseCurrentPositionOptions = {}) => {
  const [position, setPosition] = useState<Position | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const getCurrentPosition = () => {
    setLoading(true)
    setError(null)

    const handlePosition = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords
      setPosition({ lat: latitude, lng: longitude })
      cache.current = { lat: latitude, lng: longitude };
      setLoading(false)
      setTimeout(() => { cache.current = undefined; }, 1000 * 60 * 10);
    }

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message)
      setPosition(null)
      setLoading(false)
    }

    if (cache.current) {
      setPosition(cache.current);
      setLoading(false);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handlePosition, handleError)
    } else {
      const error: GeolocationPositionError = {
        code: 2,
        message: 'Geolocation is not supported',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      }
      handleError(error)
    }
  }

  const getIPBasedPosition = async () => {
    setLoading(true)
    setError(null)
    if (cache.ip) {
      setPosition(cache.ip);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      const { latitude, longitude } = data
      setPosition({ lat: parseFloat(latitude), lng: parseFloat(longitude) })
      cache.ip = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
    } catch (error) {
      setError(error.message)
      setPosition(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (options.onInit?.getPosition && !options.onInit?.ipBased) {
      getCurrentPosition()
    } else if (options.onInit?.getPosition && options.onInit?.ipBased) {
      getIPBasedPosition()
    }
  }, [])

  return { position, loading, error, getCurrentPosition, getIPBasedPosition }
}
