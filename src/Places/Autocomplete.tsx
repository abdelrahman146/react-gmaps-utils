import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  ElementType
} from 'react'
import { useGoogleMaps } from '../GoogleMapsContext'

/**
 * Autocomplete component for Google Maps Places API.
 *
 * @component
 * @returns {React.ReactNode} The Autocomplete component.
 */

type AutocompleteProps<C extends ElementType = 'input'> = {
  as?: C
  onLoaded?: (autocomplete: google.maps.places.AutocompleteService) => void
  options?: Omit<google.maps.places.AutocompletionRequest, 'input'>
  shouldFetch?: boolean
  renderResult?: (
    predictions: google.maps.places.AutocompletePrediction[]
  ) => React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<C>, 'as'>

export interface AutocompleteRef {
  close: () => void
  focus: () => void
}

export const Autocomplete = forwardRef(
  <C extends ElementType = 'input'>(
    {
      as: Component = 'input' as C,
      onLoaded,
      options,
      renderResult,
      shouldFetch = true,
      value,
      ...rest
    }: AutocompleteProps<C>,
    ref: React.Ref<AutocompleteRef>
  ) => {
    const { scriptLoaded } = useGoogleMaps()
    const componentRef = useRef<HTMLInputElement>(null);
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
      if (autoComplete.current && value !== '' && shouldFetch) {
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
    }, [autoComplete.current, onLoaded])

    useImperativeHandle(ref, () => ({
      close: () => {
        setPredictions([])
      },
      focus: () => {
        componentRef.current?.focus()
      }
    }))

    return (
      <React.Fragment>
        <Component ref={componentRef} value={value} {...rest as any} />
        {predictions.length > 0 && renderResult
          ? renderResult(predictions)
          : null}
      </React.Fragment>
    )
  }
) as <C extends ElementType>(
  props: AutocompleteProps<C> & { ref?: React.Ref<AutocompleteRef> }
) => JSX.Element
