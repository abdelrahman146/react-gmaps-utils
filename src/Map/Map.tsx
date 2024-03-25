import React, { memo, useEffect, useRef, useId, useState } from 'react'
import { useGoogleMaps } from '../GoogleMapsContext'

/**
 * Context for the Google Maps component.
 */
const MapContext = React.createContext<{
  map: google.maps.Map | null
  mapLoaded: boolean
}>({
  map: null,
  mapLoaded: false
})

export function useMap() {
  return React.useContext(MapContext)
}

export interface MapProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'> {
  options?: google.maps.MapOptions
  onLoaded?: (map: google.maps.Map) => void
  children?: React.ReactNode
}

/**
 * Renders a Google Map component.
 *
 * @component
 * @param {MapProps} props - The props for the Map component.
 * @param {google.maps.MapOptions} props.options - The options for configuring the map.
 * @param {ReactNode} props.children - The child components to be rendered within the map.
 * @param {...any} props.rest - Additional props to be spread onto the map container element.
 * @returns {JSX.Element} The rendered Map component.
 */
export const Map = memo(
  ({ options, children, onLoaded, ...rest }: MapProps) => {
    const { scriptLoaded } = useGoogleMaps()
    // const mapRef = useRef<google.maps.Map | null>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const [mapLoaded, setMapLoaded] = React.useState(false)
    const genId = useId()

    useEffect(() => {
      if (!map) return
      if (!options) return
      map.setOptions(options)
    }, [options])

    /**
     * This effect will create the map instance once the google maps script is loaded
     */
    useEffect(() => {
      if (!mapContainerRef.current) return
      if (!scriptLoaded) return
      setMap(new google.maps.Map(mapContainerRef.current, options))
    }, [scriptLoaded, mapContainerRef.current])

    useEffect(() => {
      console.log('map', map)
      if (map && onLoaded) {
        onLoaded(map)
      }
    }, [map, onLoaded])

    useEffect(() => {
      if (map) {
        google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
          setMapLoaded(true)
        })
      }
    }, [map, onLoaded])

    return (
      <MapContext.Provider value={{ map, mapLoaded }}>
        <div ref={mapContainerRef} id={`map-${genId}`} {...rest}></div>
        {children}
      </MapContext.Provider>
    )
  }
)
