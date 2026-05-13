import { describe, it, expect } from 'vitest';
import {
  getCoordinatesForCountry,
  COUNTRY_COORDINATES,
} from '../country-coordinates';

describe('getCoordinatesForCountry', () => {
  it('returns coordinates for a known country', () => {
    const result = getCoordinatesForCountry('Guatemala');
    expect(result).toEqual({ lat: 15.7835, lng: -90.2308 });
  });

  it('returns null for an unknown country', () => {
    expect(getCoordinatesForCountry('Atlantis')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(getCoordinatesForCountry('')).toBeNull();
  });

  it('is case-sensitive on exact match (matches Rock dropdown values)', () => {
    expect(getCoordinatesForCountry('guatemala')).toBeNull();
    expect(getCoordinatesForCountry('Guatemala')).not.toBeNull();
  });

  it('includes all countries from the dropdown list', () => {
    expect(COUNTRY_COORDINATES['United States']).toBeDefined();
    expect(COUNTRY_COORDINATES['Dominican Republic']).toBeDefined();
    expect(COUNTRY_COORDINATES['Bosnia and Herzegovina']).toBeDefined();
  });
});
