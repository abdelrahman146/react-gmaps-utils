/**
 * This file exports the `Places` module, which includes the `Autocomplete` component and the `usePlaces` hook.
 * 
 * @packageDocumentation
 */

import { Autocomplete, useAutocomplete } from './Autocomplete';
import { Places as PlacesContainer, usePlaces } from './Places';

/**
 * The `Places` module is a collection of components and hooks related to places.
 */
export const Places = Object.assign(PlacesContainer, {
  /**
   * The `Autocomplete` component provides an input field with autocomplete functionality for places.
   */
  Autocomplete: Object.assign(Autocomplete, { useAutocomplete }),
  /**
   * The `usePlaces` hook provides functionality for fetching and managing places data.
   */
  usePlaces,
});
