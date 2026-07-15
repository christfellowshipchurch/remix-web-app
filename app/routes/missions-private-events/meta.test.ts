import { describe, expect, it } from 'vitest';

import { meta } from './meta';

describe('missions-private-events metadata', () => {
  it('prevents search engines from indexing the privately shared finder', () => {
    const robots = meta({} as Parameters<typeof meta>[0]).find(
      (entry) => 'name' in entry && entry.name === 'robots',
    );

    expect(robots).toMatchObject({ content: 'noindex, nofollow' });
  });
});
