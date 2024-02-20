import { Geocode as GeocodeContainer, useGeocode } from './Geocode';
import { ReverseGeocodeByLocation } from './ReverseGeocodeByLocation';

/**
 * Geocode module.
 * @module Geocode
 */

/**
 * Geocode object.
 * @type {Object}
 * @property {Function} ReverseGeocodeByLocation - Function to reverse geocode by location.
 * @property {Function} useGeocode - Function to use geocode.
 */
export const Geocode = Object.assign(GeocodeContainer, { ReverseGeocodeByLocation, useGeocode });
