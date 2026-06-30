import { describe, expect, it } from 'vitest';
import { mapSiteBannerFromRockItem } from '../loader';

describe('mapSiteBannerFromRockItem', () => {
  it('maps banner content and the first CTA link from Rock key-value format', () => {
    const result = mapSiteBannerFromRockItem({
      id: '1',
      contentChannelId: '100',
      title: 'Crisis Fund',
      name: 'Crisis Fund',
      content: '<p>Venezuela Earthquake Relief</p>',
      attributeValues: {
        callsToAction: {
          value: 'GIVE NOW^https://pushpay.com/g/christfellowship',
          valueFormatted: '',
        },
      },
      attributes: {},
      startDateTime: '2026-06-30T00:59:00',
      expireDateTime: '',
    });

    expect(result).toEqual({
      content: '<p>Venezuela Earthquake Relief</p>',
      link: 'https://pushpay.com/g/christfellowship',
    });
  });

  it('returns empty banner data when Rock returns no active item', () => {
    expect(mapSiteBannerFromRockItem(null)).toEqual({
      content: '',
      link: '',
    });
  });
});
