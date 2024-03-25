import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'

import {
  GoogleMapsProvider,
  Places,
  Map,
  useCurrentPosition,
  Autocomplete
} from 'react-gmaps-utils'

const CustomInput = forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement>>((props, ref) => {
  return (
    <div className='Helloo' style={{ margin: 10 }}>
      <input ref={ref} {...props} />
    </div>
  )
})

const defaultPosition = { lat: 25.276987, lng: 55.296249 }
const App = () => {
  console.log("app  rendered");
  const [query, setQuery] = useState('')
  const autocompleteRef = useRef<{close: () => void, focus: () => void}>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)
  const [placeId, setPlaceId] = useState<string | null>(null);
  const { position: currentPosition } = useCurrentPosition({
    getPositionOnInit: false
  })
  const options = useMemo(() => {
    return {
      center: currentPosition || defaultPosition,
      zoom: 15
    }
  }, [currentPosition]);
  
  useEffect(() => {
    if(autocompleteRef.current){
      autocompleteRef.current.focus();
    }
  }, [autocompleteRef.current]);

  return (
    <GoogleMapsProvider apiKey={import.meta.env.VITE_API_KEY}>
      <div>My App</div>
      <div className='container'>
        <div className='places-container'>
          <Places
            onLoaded={(places) => {
              placesService.current = places
            }}
          >
            <Autocomplete
              as={CustomInput}
              ref={autocompleteRef}
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              options={{ types: ['(cities)'] }}
              className='input'
              renderResult={(predictions) => {
                return (
                  <div className='dropdown'>
                    {predictions.map((prediction) => (
                      <div
                        className='dropdown-item'
                        key={prediction.place_id}
                        onClick={() => {
                          setPlaceId(prediction.place_id)
                          autocompleteRef.current?.close()
                        }}
                      >
                        <span>{prediction.description}</span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            <Places.FindPlaceByPlaceId placeId={placeId} onPlaceReceived={(place) => {console.log(place?.geometry?.location?.toJSON())}} />
          </Places>
        </div>
        <Map id='map' options={options}>
          <Map.Marker position={defaultPosition} />
        </Map>
      </div>
    </GoogleMapsProvider>
  )
}

export default App
