import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pushFormEvent } from '~/lib/gtm';
import GroupFinderNotifyForm from '../group-finder-notify-form.component';

vi.mock('~/lib/gtm', () => ({ pushFormEvent: vi.fn() }));

let mockFetcherState = {
  state: 'idle' as 'idle' | 'submitting' | 'loading',
  data: undefined as unknown,
};
const mockSubmit = vi.fn();
const mockLoad = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useFetcher: () => ({
      state: mockFetcherState.state,
      data: mockFetcherState.data,
      submit: mockSubmit,
      load: mockLoad,
    }),
  };
});

function renderForm(onSuccess = vi.fn()) {
  return render(
    <MemoryRouter>
      <GroupFinderNotifyForm onSuccess={onSuccess} />
    </MemoryRouter>,
  );
}

describe('GroupFinderNotifyForm', () => {
  beforeEach(() => {
    mockFetcherState = { state: 'idle', data: undefined };
    vi.clearAllMocks();
  });

  it('renders notify fields', () => {
    renderForm();

    expect(screen.getByText('Get Notified')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Campus')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('loads campus options from the notify resource route', () => {
    renderForm();

    expect(mockLoad).toHaveBeenCalledWith('/group-finder-notify');
  });

  it('shows campuses in the select when fetcher data loads', async () => {
    mockFetcherState = {
      state: 'idle',
      data: {
        campuses: [
          {
            id: 10,
            guid: 'campus-guid-10',
            name: 'Palm Beach Gardens',
          },
        ],
      },
    };

    renderForm();

    expect(
      await screen.findByRole('option', { name: 'Palm Beach Gardens' }),
    ).toBeInTheDocument();
  });

  it('submits to the notify resource route', async () => {
    const user = userEvent.setup();
    mockFetcherState = {
      state: 'idle',
      data: {
        campuses: [
          {
            id: 10,
            guid: 'campus-guid-10',
            name: 'Palm Beach Gardens',
          },
        ],
      },
    };
    renderForm();

    await screen.findByRole('option', { name: 'Palm Beach Gardens' });
    await user.type(screen.getByLabelText('First Name'), 'Test');
    await user.type(screen.getByLabelText('Last Name'), 'Person');
    await user.type(
      screen.getByLabelText('Email Address'),
      'test@example.com',
    );
    await user.type(screen.getByLabelText('Phone'), '5555555555');
    await user.selectOptions(screen.getByLabelText('Campus'), 'campus-guid-10');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(expect.any(FormData), {
        method: 'post',
        action: '/group-finder-notify',
      });
    });
  });

  it('shows Loading... on submit button when submitting', () => {
    mockFetcherState = { state: 'submitting', data: undefined };

    renderForm();

    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('shows error message from fetcher data', () => {
    mockFetcherState = {
      state: 'idle',
      data: { error: 'Something went wrong' },
    };

    renderForm();

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('fires the GTM event before calling onSuccess after a successful submission', () => {
    const onSuccess = vi.fn();
    mockFetcherState = {
      state: 'idle',
      data: { success: true },
    };

    renderForm(onSuccess);

    expect(pushFormEvent).toHaveBeenCalledWith(
      'form_complete',
      'group_finder_notify',
      'Group Finder Notify Me',
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(vi.mocked(pushFormEvent).mock.invocationCallOrder[0]).toBeLessThan(
      onSuccess.mock.invocationCallOrder[0],
    );
  });
});
