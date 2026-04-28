import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { FinderHero } from '../index';

const defaultProps = {
  bgColor: 'white' as const,
  bgImage: '/test-image.jpg',
  title: 'Class Title',
  mobileDescription: '<p>Mobile description</p>',
  desktopDescription: '<p>Desktop description</p>',
};

function renderFinderHero(
  props: Partial<React.ComponentProps<typeof FinderHero>> = {},
) {
  return render(
    <MemoryRouter>
      <FinderHero {...defaultProps} {...props} />
    </MemoryRouter>,
  );
}

describe('FinderHero', () => {
  it('does not render a back link by default', () => {
    renderFinderHero();

    expect(
      screen.queryByRole('link', { name: 'Back to All Classes' }),
    ).not.toBeInTheDocument();
  });

  it('renders the configured back link', () => {
    renderFinderHero({
      backLink: {
        href: '/class-finder',
        label: 'Back to All Classes',
      },
    });

    expect(
      screen.getByRole('link', { name: 'Back to All Classes' }),
    ).toHaveAttribute('href', '/class-finder');
  });

  it('renders custom CTAs in the class topic CTA placements', () => {
    renderFinderHero({
      topic: 'Bible Study',
      ctas: [
        {
          render: () => <button type='button'>Class Trailer</button>,
        },
      ],
    });

    expect(
      screen.getAllByRole('button', { name: 'Class Trailer' }),
    ).toHaveLength(2);
  });
});
