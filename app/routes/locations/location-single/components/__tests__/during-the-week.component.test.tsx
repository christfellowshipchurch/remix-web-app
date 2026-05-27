import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { DuringTheWeek } from '../during-the-week.component';

describe('DuringTheWeek', () => {
  it('renders services that still use the legacy Algolia minstryType key', () => {
    render(
      <MemoryRouter>
        <DuringTheWeek
          weeklyMinistryServices={[
            {
              minstryType: 'cf-kids',
              dayOfWeek: 'Mondays',
              serviceTimes: '6:30 PM',
              learnMoreUrl: '/kids',
            },
          ]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText(/6:30 PM \| Kids/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Kids Link' })).toHaveAttribute(
      'href',
      '/kids',
    );
  });
});
