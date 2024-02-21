import { useMemo, useState } from 'react'

import {
  GoogleMapsProvider,
  Places,
  Map,
  useCurrentPosition
} from 'react-gmaps-utils'

const CustomInput: React.FC<React.HTMLProps<HTMLInputElement>> = ({
  ...rest
}) => {
  return (
    <div className='Helloo' style={{margin: 10}}>
      <input {...rest} />
    </div>
  )
}

const defaultPosition = { lat: 25.276987, lng: 55.296249 }
const App = () => {
  const [query, setQuery] = useState('')
  const { position: currentPosition } = useCurrentPosition({
    defaultPosition: defaultPosition
  })
  const options = useMemo(() => {
    return {
      center: currentPosition || undefined,
      zoom: 15
    }
  }, [currentPosition])
  return (
    <GoogleMapsProvider apiKey={import.meta.env.VITE_API_KEY}>
      <div>My App</div>
      <div className='container'>
        <div className='places-container'>
          <Places>
            <Places.Autocomplete
              as={CustomInput}
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              options={{ types: ['(cities)'] }}
              className='input'
              renderResult={(predictions, handleClick) => {
                return (
                  <div className='dropdown'>
                    {predictions.map((prediction) => (
                      <div
                        className='dropdown-item'
                        key={prediction.place_id}
                        onClick={() => handleClick(prediction)}
                      >
                        <span>{prediction.description}</span>
                      </div>
                    ))}
                  </div>
                )
              }}
              onItemClick={(place) => {
                console.log(place)
              }}
            />
          </Places>
        </div>
        <Map id='map' options={options}>
          <Map.Marker position={currentPosition} />
        </Map>
      </div>
    </GoogleMapsProvider>
  )
}

export default App
