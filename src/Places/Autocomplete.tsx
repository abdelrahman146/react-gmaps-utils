import React, { useEffect, useRef, useState } from 'react'
import { useGoogleMaps } from '../GoogleMapsContext'
import { usePlaces } from './Places'

/**
 * Context for Autocomplete component.
 */
const AutocompleteContext = React.createContext<{
  autoComplete: google.maps.places.AutocompleteService | null
}>({
  autoComplete: null
})

export function useAutocomplete() {
  return React.useContext(AutocompleteContext)
}

export type AutocompleteInputProps = Omit<
  React.HTMLProps<HTMLInputElement>,
  'as'
>

interface AutoCompleteProps extends AutocompleteInputProps {
  as?: React.ElementType | string;
  options?: Omit<google.maps.places.AutocompletionRequest, 'input'>
  onItemClick?: (prediction: google.maps.places.PlaceResult) => void
  renderResult?: (
    predictions: google.maps.places.AutocompletePrediction[],
    handleClick: (place: google.maps.places.AutocompletePrediction) => void
  ) => React.ReactNode
  children?: React.ReactNode
}

/**
 * Autocomplete component for Google Maps Places API.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ElementType} [props.as='input'] - The component to render as.
 * @param {Object} [props.options] - Additional options for the Autocomplete service.
 * @param {React.ReactNode} [props.children] - The child elements to render.
 * @param {Function} [props.renderResult] - The function to render the autocomplete results.
 * @param {Function} [props.onItemClick] - The function to handle when an item is clicked.
 * @param {string} props.value - The current value of the autocomplete input.
 * @param {any} rest - Additional props to pass to the rendered component.
 * @returns {React.ReactNode} The Autocomplete component.
 */
export function Autocomplete({
  as: Component = 'input',
  options,
  children,
  renderResult,
  onItemClick,
  value,
  ...rest
}: AutoCompleteProps) {
  const { scriptLoaded } = useGoogleMaps()
  const { places } = usePlaces()
  const autoComplete = useRef<google.maps.places.AutocompleteService | null>(
    null
  )
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([])

  const handleClick = (place: google.maps.places.AutocompletePrediction) => {
    if (onItemClick && places) {
      places.getDetails({ placeId: place.place_id }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          if (place) {
            onItemClick(place)
          }
        }
      })
    }
    setPredictions([])
  }

  useEffect(() => {
    if (scriptLoaded && !autoComplete.current) {
      autoComplete.current = new google.maps.places.AutocompleteService()
    }
  }, [scriptLoaded])

  useEffect(() => {
    if (autoComplete.current && value !== '') {
      autoComplete.current.getPlacePredictions(
        {
          input: String(value),
          ...options
        },
        (predictions) => {
          if (predictions) {
            setPredictions(predictions)
          }
        }
      )
    } else {
      setPredictions([])
    }
  }, [value])

  return (
    <AutocompleteContext.Provider
      value={{ autoComplete: autoComplete.current }}
    >
      <Component
        value={value}
        {...rest}
      />
      {predictions.length > 0 && renderResult
        ? renderResult(predictions, handleClick)
        : null}
      {children}
    </AutocompleteContext.Provider>
  )
}
