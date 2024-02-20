# google-maps-react

google-maps-react is a React library that provides components and hooks for integrating Google Maps functionality into your React applications.

## Installation

You can install google-maps-react using npm:

```bash
npm install google-maps-react
```

## Usage

### GoogleMapsProvider

The `GoogleMapsProvider` component is used to load the Google Maps script and provide a context for other components to access the Google Maps API.

```jsx
import { GoogleMapsProvider } from 'google-maps-react'

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
import { Map } from 'google-maps-react'

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
import { Map } from 'google-maps-react'

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
import { Places } from 'google-maps-react'

function MyAutocomplete() {
  return (
    <Places>
      <Places.Autocomplete
        options={{
          types: ['geocode'],
          componentRestrictions: { country: 'us' }
        }}
        renderResult={(predictions, handleClick) => (
          <ul>
            {predictions.map((prediction) => (
              <li
                key={prediction.place_id}
                onClick={() => handleClick(prediction)}
              >
                {prediction.description}
              </li>
            ))}
          </ul>
        )}
      />
    </Places>
  )
}
```

### ReverseGeocodeByLocation

The `ReverseGeocodeByLocation` component performs reverse geocoding based on a specified location.

```jsx
import { ReverseGeocodeByLocation } from 'google-maps-react'

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
import { MapEvent } from 'google-maps-react'

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
import { useCurrentPosition } from 'google-maps-react'

function MyComponent() {
  const { position, loading, error, getCurrentPosition } = useCurrentPosition()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      Latitude: {position?.lat}
      <br />
      Longitude: {position?.lng}
      <br />
      <button onClick={getCurrentPosition}>Get Current Position</button>
    </div>
  )
}
```

## Note

This library requires an API key from Google Maps. Make sure to replace `"YOUR_API_KEY"` with your actual API key in the `GoogleMapsProvider` component.

## License

MIT © [abdelrahman146](https://github.com/abdelrahman146)
