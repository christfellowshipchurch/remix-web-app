import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConnectCardModal } from '../connect-card-modal';

vi.mock('~/lib/gtm', () => ({ pushFormEvent: vi.fn() }));
// The flow loads Rock data via fetchers; irrelevant to trigger behavior.
vi.mock('../connect-card-flow.component', () => ({
  default: () => <div data-testid='connect-card-flow' />,
}));

function renderModal(props: React.ComponentProps<typeof ConnectCardModal>) {
  return render(
    <MemoryRouter>
      <ConnectCardModal {...props} />
    </MemoryRouter>,
  );
}

describe('ConnectCardModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('links Spanish campuses to the self-translating standalone page', () => {
    renderModal({ isEspanol: true });
    const trigger = screen.getByText('Conéctate').closest('a');
    expect(trigger).toHaveAttribute('href', '/connect-card?lang=es');
  });

  it('opens the in-page modal (not a link) for English campuses', () => {
    renderModal({});
    expect(screen.getByText('Get Connected').closest('a')).toBeNull();
    expect(screen.queryByTestId('connect-card-flow')).not.toBeInTheDocument();
  });
});
