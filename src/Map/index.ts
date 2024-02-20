import { Map as MapContainer, useMap } from './Map';
import { MapMarker, useMarker } from './MapMarker';
import { MapEvent } from './MapEvent';

/**
 * Represents a Map component.
 * @namespace Map
 */
export const Map = Object.assign(MapContainer, {
  /**
   * Represents a Marker component.
   * @namespace Marker
   */
  Marker: Object.assign(MapMarker, { useMarker }),
  /**
   * Represents an Event component.
   * @namespace Event
   */
  Event: MapEvent,
  /**
   * Custom hook for using the Map component.
   * @function useMap
   * @returns {MapProps} The map properties.
   */
  useMap,
});
