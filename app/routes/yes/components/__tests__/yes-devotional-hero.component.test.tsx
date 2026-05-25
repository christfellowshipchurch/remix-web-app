import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { googleLink } from '~/lib/utils';
import { YesHero } from '../yes-devotional-hero.component';

function getCardLink(text: string): HTMLAnchorElement {
  const link = screen.getByText(text).closest('a');
  expect(link).toBeInstanceOf(HTMLAnchorElement);
  return link as HTMLAnchorElement;
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
      getCardLink('Access resources, submit prayers, & get involved in our app'),
    ).toHaveAttribute('href', googleLink);

    const bibleAppLink = getCardLink(
      'Download the free Bible App from YouVersion',
    );
    expect(bibleAppLink).toHaveAttribute('href', 'https://www.bible.com/app');
    expect(fireEvent.click(bibleAppLink)).toBe(true);
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('links the Spanish YouVersion card to the Bible app', () => {
    render(<YesHero isSpanish />);

    expect(
      getCardLink('Descarga la app de la Biblia YouVersion gratis'),
    ).toHaveAttribute('href', 'https://www.bible.com/app');
  });
});
