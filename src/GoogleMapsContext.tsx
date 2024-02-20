/**
 * @file This file contains the implementation of the GoogleMapsContext component and related hooks.
 */

import React, { useEffect, useState } from 'react';

/**
 * Context object for Google Maps.
 */
const GoogleMapsContext = React.createContext<{
  scriptLoaded: boolean;
}>({
  scriptLoaded: false,
});

/**
 * Hook to access the Google Maps context.
 * @returns The Google Maps context object.
 */
export function useGoogleMaps() {
  return React.useContext(GoogleMapsContext);
}

/**
 * Props for the GoogleMapsProvider component.
 */
interface GoogleMapsProviderProps {
  children?: React.ReactNode;
  apiKey: string;
}

/**
 * Provider component for the Google Maps context.
 * @param props - The component props.
 * @returns The rendered GoogleMapsProvider component.
 */
export function GoogleMapsProvider({ children, apiKey }: GoogleMapsProviderProps) {
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

  /**
   * This is a custom hook that will load the google maps script.
   */
  useEffect(() => {
    let script = document.getElementById('google-maps-script') as HTMLScriptElement;
    if (script) {
      if (script.getAttribute('loaded') === 'true') {
        setScriptLoaded(true);
      } else {
        script.onload = () => {
          setScriptLoaded(true);
          script.setAttribute('loaded', 'true');
        };
      }
      return;
    }
    script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
      script.setAttribute('loaded', 'true');
    };
    document.body.appendChild(script);
  }, []);

  return <GoogleMapsContext.Provider value={{ scriptLoaded }}>{children}</GoogleMapsContext.Provider>;
}
