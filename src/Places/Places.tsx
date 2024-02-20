import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from '../GoogleMapsContext';

/**
 * Context for managing Google Maps PlacesService.
 */
const PlacesContext = React.createContext<{
  places: google.maps.places.PlacesService | null;
}>({
  places: null,
});

export function usePlaces() {
  return React.useContext(PlacesContext);
}

interface PlacesProps {
  children?: React.ReactNode;
}

/**
 * Renders a component that provides access to the Google Maps Places API.
 *
 * @param {React.PropsWithChildren<PlacesProps>} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
export function Places({ children }: PlacesProps): JSX.Element {
  const { scriptLoaded } = useGoogleMaps();
  const places = useRef<google.maps.places.PlacesService | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scriptLoaded && !places.current && divRef.current) {
      places.current = new google.maps.places.PlacesService(divRef.current);
    }
  }, [scriptLoaded, divRef.current]);

  return (
    <PlacesContext.Provider value={{ places: places.current }}>
      <div ref={divRef}></div>
      {children}
    </PlacesContext.Provider>
  );
}
