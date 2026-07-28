import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { appleLink, googleLink } from '~/lib/utils';
import { YesHero } from '../yes-devotional-hero.component';

vi.mock('~/lib/scroll-to-anchor', () => ({
  scrollToAnchor: vi.fn(() => true),
}));

import { scrollToAnchor } from '~/lib/scroll-to-anchor';

function getCardLink(text: string) {
  const link = screen.getByText(text).closest('a');
  if (!link) {
    throw new Error(`Expected card link for "${text}"`);
  }
  return link;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('YesHero', () => {
  it('scrolls to the devotional section instead of opening a new tab', () => {
    render(<YesHero />);

    const devotionalLink = getCardLink(
      'A three-week devotional to start your relationship with Jesus.',
    );
    expect(devotionalLink).toHaveAttribute('href', '#devo');
    expect(devotionalLink).not.toHaveAttribute('target', '_blank');

    fireEvent.click(devotionalLink);
    expect(scrollToAnchor).toHaveBeenCalledWith('devo');
  });

  it('uses each English card link instead of overriding clicks', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<YesHero />);

    expect(
      getCardLink(
        'Access resources, submit prayers, & get involved in our app',
      ),
    ).toHaveAttribute('href', googleLink);

    const bibleAppLink = getCardLink(
      'Download the free Bible App from YouVersion',
    );
    expect(bibleAppLink).toHaveAttribute('href', 'https://www.bible.com/app');
    expect(fireEvent.click(bibleAppLink)).toBe(true);
    expect(openSpy).not.toHaveBeenCalled();
  });

  it.each([
    [
      'English',
      undefined,
      'Access resources, submit prayers, & get involved in our app',
    ],
    [
      'Spanish',
      true,
      'Accede a recursos, envía oraciones y participa en nuestra app',
    ],
  ] as const)(
    'sends the %s app card to the App Store on Apple devices',
    (_language, isSpanish, copy) => {
      // The device is only knowable in the browser, so the SSR'd href stays on
      // Google Play and the click has to redirect Apple users.
      vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      );
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      render(<YesHero isSpanish={isSpanish} />);

      const appLink = getCardLink(copy);
      expect(appLink).toHaveAttribute('href', googleLink);

      expect(fireEvent.click(appLink)).toBe(false);
      expect(openSpy).toHaveBeenCalledWith(appleLink, '_blank');
    },
  );

  it('leaves the Spanish app card on Google Play for non-Apple devices', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<YesHero isSpanish />);

    const appLink = getCardLink(
      'Accede a recursos, envía oraciones y participa en nuestra app',
    );
    expect(appLink).toHaveAttribute('href', googleLink);
    expect(fireEvent.click(appLink)).toBe(true);
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('links the Spanish YouVersion card to the Bible app', () => {
    render(<YesHero isSpanish />);

    expect(
      getCardLink('Descarga la app de la Biblia YouVersion gratis'),
    ).toHaveAttribute('href', 'https://www.bible.com/app');
  });
});
