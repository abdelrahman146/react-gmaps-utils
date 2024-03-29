# react-gmaps-utils

[![npm package](https://img.shields.io/npm/v/react-gmaps-utils)](https://www.npmjs.com/package/react-gmaps-utils)
[![npm downloads](https://img.shields.io/npm/dt/react-gmaps-utils)](https://www.npmjs.com/package/react-gmaps-utils)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-gmaps-utils)](https://www.npmjs.com/package/react-gmaps-utils)

react-gmaps-utils is a React library that provides components and hooks for integrating Google Maps functionality into your React applications.

## Installation

You can install react-gmaps-utils using npm:

```bash
npm install react-gmaps-utils
npm install --save-dev @types/google.maps
```

## Usage

### GoogleMapsProvider

The `GoogleMapsProvider` component is used to load the Google Maps script and provide a context for other components to access the Google Maps API.

```jsx
import { GoogleMapsProvider } from 'react-gmaps-utils'

function App() {
  return (
    <GoogleMapsProvider apiKey='YOUR_API_KEY'>
      {/* Your application components */}
    </GoogleMapsProvider>
  )
}
```

### Map

The `Map` component renders a Google Map and provides various options for customization.

```jsx
import { Map } from 'react-gmaps-utils'

function MyMap() {
  return (
    <Map
      options={{
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 10
      }}
    >
      {/* Optional child components */}
    </Map>
  )
}
```

### Marker

The `Marker` component adds a marker to the map at a specified position.

```jsx
import { Map } from 'react-gmaps-utils'

function MyMapWithMarker() {
  return (
    <Map
      options={{
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 10
      }}
    >
      <Map.Marker position={{ lat: 37.7749, lng: -122.4194 }} />
    </Map>
  )
}
```

### Autocomplete

The `Autocomplete` component provides an input field with autocomplete functionality for places.

```jsx
import { Places, Autocomplete } from 'react-gmaps-utils'
import { useMemo, useRef, useState } from 'react'

function MyAutocomplete() {
  const [query, setQuery] = useState('')
  const autocompleteRef = useRef<{close: () => void}>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)
  const [placeId, setPlaceId] = useState<string | null>(null);
  return (
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
  )
}
```

The component also has `shouldFetch` which is a boolean that you can pass to prevent the autocomplete from fetching suggestions. example usecase could be if you want to make the fetch occurs only if there was a user interaction. 

### ReverseGeocodeByLocation

The `ReverseGeocodeByLocation` component performs reverse geocoding based on a specified location.

```jsx
import { ReverseGeocodeByLocation } from 'react-gmaps-utils'

function MyReverseGeocoder() {
  return (
    <ReverseGeocodeByLocation
      position={{ lat: 37.7749, lng: -122.4194 }}
      onAddressReceived={(result) => console.log(result)}
    />
  )
}
```

### MapEvent

The `MapEvent` component listens for events on the map and executes a callback function when the event is triggered.

```jsx
import { MapEvent } from 'react-gmaps-utils'

function MyMapEvent() {
  const handleMapClick = (map, event) => {
    console.log('Map clicked at:', event.latLng.lat(), event.latLng.lng())
  }

  return (
    <Map
      options={{
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 10
      }}
    >
      <Map.Event event='click' callback={handleMapClick} />
    </Map>
  )
}
```

## Custom Hooks

### useCurrentPosition

The `useCurrentPosition` hook retrieves the current position of the user.

```jsx
import { useCurrentPosition } from 'react-gmaps-utils'

function MyComponent() {
  const { position, loading, error, getCurrentPosition, getIPBasedPosition } = useCurrentPosition({
    onInit: {
      getPosition: true,
      ipBased: true,
    }
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      Latitude: {position?.lat}
      <br />
      Longitude: {position?.lng}
      <br />
      <button onClick={getCurrentPosition}>Get Exact Location</button>
    </div>
  )
}
```

## Note

This library requires an API key from Google Maps. Make sure to replace `"YOUR_API_KEY"` with your actual API key in the `GoogleMapsProvider` component.

## License

MIT © [abdelrahman146](https://github.com/abdelrahman146)
