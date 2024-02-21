import React, { useEffect, useRef, useState } from 'react'
import { useGoogleMaps } from '../GoogleMapsContext'

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
  as?: React.ElementType | string
  onLoaded?: (autocomplete: google.maps.places.AutocompleteService) => void
  options?: Omit<google.maps.places.AutocompletionRequest, 'input'>
  renderResult?: (
    predictions: google.maps.places.AutocompletePrediction[]
  ) => React.ReactNode
  children?: React.ReactNode
}

/**
 * Autocomplete component for Google Maps Places API.
 *
 * @component
 * @returns {React.ReactNode} The Autocomplete component.
 */
export function Autocomplete({
  as: Component = 'input',
  onLoaded,
  options,
  renderResult,
  children,
  value,
  ...rest
}: AutoCompleteProps) {
  const { scriptLoaded } = useGoogleMaps()
  const autoComplete = useRef<google.maps.places.AutocompleteService | null>(
    null
  )
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([])

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

  useEffect(() => {
    if (autoComplete.current && onLoaded) {
      onLoaded(autoComplete.current)
    }
  } , [autoComplete.current, onLoaded])

  return (
    <AutocompleteContext.Provider
      value={{ autoComplete: autoComplete.current }}
    >
      <Component value={value} {...rest} />
      {predictions.length > 0 && renderResult
        ? renderResult(predictions)
        : null}
      {children}
    </AutocompleteContext.Provider>
  )
}
