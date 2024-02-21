/**
 * This file exports the `Places` module, which includes the `Autocomplete` component and the `usePlaces` hook.
 * 
 * @packageDocumentation
 */
export * from './Autocomplete';
import { Places as PlacesContainer, usePlaces } from './Places';
import { FindPlaceByPlaceId } from './FindPlaceByPlaceId';

/**
 * The `Places` module is a collection of components and hooks related to places.
 */
export const Places = Object.assign(PlacesContainer, {
  /**
   * The `usePlaces` hook provides functionality for fetching and managing places data.
   */
  FindPlaceByPlaceId,
  usePlaces,
});
