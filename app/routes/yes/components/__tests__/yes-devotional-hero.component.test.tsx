import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { appleLink, googleLink } from '~/lib/utils';
import { YesHero } from '../yes-devotional-hero.component';

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
  it('uses each English card link instead of overriding clicks', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<YesHero />);

    expect(
      getCardLink('A two-week course to start your relationship with Jesus.'),
    ).toHaveAttribute('href', googleLink);
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

  it('uses the same configured links for Spanish cards', () => {
    render(<YesHero isSpanish />);

    expect(
      getCardLink(
        'Un curso de dos semanas para comenzar tu relación con Jesús.',
      ),
    ).toHaveAttribute('href', googleLink);
    expect(
      getCardLink(
        'Accede a recursos, envía oraciones y participa en nuestra app',
      ),
    ).toHaveAttribute('href', googleLink);
    expect(
      getCardLink('Descarga la app de la Biblia YouVersion gratis'),
    ).toHaveAttribute('href', 'https://www.bible.com/app');
  });

  it('uses the Apple app store link for church app cards on Apple devices', () => {
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('iPhone');

    render(<YesHero isSpanish />);

    expect(
      getCardLink(
        'Un curso de dos semanas para comenzar tu relación con Jesús.',
      ),
    ).toHaveAttribute('href', appleLink);
    expect(
      getCardLink(
        'Accede a recursos, envía oraciones y participa en nuestra app',
      ),
    ).toHaveAttribute('href', appleLink);
    expect(
      getCardLink('Descarga la app de la Biblia YouVersion gratis'),
    ).toHaveAttribute('href', 'https://www.bible.com/app');
  });
});
