import { describe, expect, it } from 'vitest';
import { getRockEmbedOrigin } from '../rock-iframe-resize';

describe('getRockEmbedOrigin', () => {
  it('returns the origin for valid Rock URLs', () => {
    expect(
      getRockEmbedOrigin(
        'https://rock.christfellowship.church/page/5886?OpportunityId=abc',
      ),
    ).toBe('https://rock.christfellowship.church');
  });

  it('returns null for invalid URLs', () => {
    expect(getRockEmbedOrigin('not-a-url')).toBeNull();
  });
});
