import { describe, expect, it } from 'vitest';
import { getSpanishRockSubmitValue } from '../connect-card-rock-values';

const COMMUNITY_GUID = '288ca790-1fb1-4386-9cfa-5fa1c4fbb7cf';
const JOURNEY_GUID = 'e9abcf96-cbe4-4d6f-8d22-fa5c44736b2c';
const BAPTISM_GUID = '2c0481e1-6228-4828-8273-7199ff908028';
const OTHER_GUID = '1d408930-f300-46f8-8200-b465a51049e3';

describe('getSpanishRockSubmitValue', () => {
  it('maps general options to Spanish Rock checkbox labels', () => {
    expect(getSpanishRockSubmitValue(COMMUNITY_GUID)).toBe(
      'Encontrar comunidad',
    );
    expect(getSpanishRockSubmitValue(OTHER_GUID)).toBe('Otro');
  });

  it('maps next-step options to Rock single-select values', () => {
    expect(getSpanishRockSubmitValue(JOURNEY_GUID)).toBe('1');
    expect(getSpanishRockSubmitValue(BAPTISM_GUID)).toBe('2');
  });
});
