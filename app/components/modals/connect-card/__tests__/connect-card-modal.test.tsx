import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConnectCardModal } from '../connect-card-modal';

vi.mock('~/lib/gtm', () => ({ pushFormEvent: vi.fn() }));
vi.mock('~/lib/google-translate', () => ({
  translatePageToSpanish: vi.fn(),
}));
// The flow loads Rock data via fetchers; irrelevant to trigger behavior.
vi.mock('../connect-card-flow.component', () => ({
  default: () => <div data-testid='connect-card-flow' />,
}));

import { translatePageToSpanish } from '~/lib/google-translate';

describe('ConnectCardModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('translates the page to Spanish when opened from a Spanish campus', () => {
    render(<ConnectCardModal isEspanol />);
    fireEvent.click(screen.getByText('Conéctate'));
    expect(translatePageToSpanish).toHaveBeenCalledTimes(1);
  });

  it('does not translate when opened from an English campus', () => {
    render(<ConnectCardModal />);
    fireEvent.click(screen.getByText('Get Connected'));
    expect(translatePageToSpanish).not.toHaveBeenCalled();
  });
});
