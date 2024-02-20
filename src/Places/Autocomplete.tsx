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
  'onChange' | 'value'
>

interface AutoCompleteProps extends AutocompleteInputProps {
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
 * @param {AutoCompleteProps} props - The props for the Autocomplete component.
 * @param {Array} props.options - Additional options for the Autocomplete component.
 * @param {ReactNode} props.children - The child elements of the Autocomplete component.
 * @param {Function} props.renderResult - The function to render the autocomplete results.
 * @param {Function} props.onItemClick - The function to handle the click event on an autocomplete result.
 * @returns {JSX.Element} The Autocomplete component.
 */
export function Autocomplete({
  options,
  children,
  renderResult,
  onItemClick,
  ...rest
}: AutoCompleteProps) {
  const { scriptLoaded } = useGoogleMaps()
  const { places } = usePlaces()
  const autoComplete = useRef<google.maps.places.AutocompleteService | null>(
    null
  )
  const [query, setQuery] = useState('')
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
    if (autoComplete.current && query !== '') {
      autoComplete.current.getPlacePredictions(
        {
          input: query,
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
  }, [query])

  return (
    <AutocompleteContext.Provider
      value={{ autoComplete: autoComplete.current }}
    >
      <input
        onChange={(e) => {
          setQuery(e.target.value)
        }}
        value={query}
        {...rest}
      />
      {predictions.length > 0 && renderResult
        ? renderResult(predictions, handleClick)
        : null}
      {children}
    </AutocompleteContext.Provider>
  )
}
