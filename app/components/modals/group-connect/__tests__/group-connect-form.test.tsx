import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import GroupConnectForm from '../group-connect-form.component';

vi.mock('~/lib/gtm', () => ({ pushFormEvent: vi.fn() }));
vi.mock('~/lib/rock-config', () => ({
  RockCampuses: [
    { name: 'Palm Beach Gardens', pathname: 'palm-beach-gardens' },
    { name: 'Stuart', pathname: 'stuart' },
  ],
}));

let mockFetcherState = {
  state: 'idle' as 'idle' | 'submitting' | 'loading',
  data: undefined as unknown,
};
const mockSubmit = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useFetcher: () => ({
      state: mockFetcherState.state,
      data: mockFetcherState.data,
      submit: mockSubmit,
    }),
  };
});

import { pushFormEvent } from '~/lib/gtm';

function renderForm(props: Partial<{ groupId: string; campus: string; onSuccess: () => void }> = {}) {
  return render(
    <MemoryRouter>
      <GroupConnectForm
        groupId={props.groupId ?? 'grp-1'}
        campus={props.campus}
        onSuccess={props.onSuccess ?? vi.fn()}
      />
    </MemoryRouter>
  );
}

describe('GroupConnectForm', () => {
  beforeEach(() => {
    mockFetcherState = { state: 'idle', data: undefined };
    vi.clearAllMocks();
  });

  it('renders firstName, lastName, phone, and email fields', () => {
    renderForm();
    expect(screen.getByText('First Name*')).toBeInTheDocument();
    expect(screen.getByText('Last Name*')).toBeInTheDocument();
    expect(screen.getByText('Phone*')).toBeInTheDocument();
    expect(screen.getByText('Email*')).toBeInTheDocument();
  });

  it('does not render a birthDate input', () => {
    renderForm();
    expect(document.querySelector('input[name="birthDate"]')).not.toBeInTheDocument();
  });

  it('does not render gender radio buttons', () => {
    renderForm();
    expect(document.querySelector('input[type="radio"]')).not.toBeInTheDocument();
  });

  it('renders hidden groupId input with correct value', () => {
    renderForm({ groupId: 'test-group-42' });
    const hiddenInput = document.querySelector('input[name="groupId"]') as HTMLInputElement;
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput.value).toBe('test-group-42');
  });

  it('does not render campus select when campus prop is undefined', () => {
    renderForm();
    expect(screen.queryByText('Campus')).not.toBeInTheDocument();
    expect(document.querySelector('select[name="campus"]')).not.toBeInTheDocument();
  });

  it('renders campus select when campus prop is provided', () => {
    renderForm({ campus: 'Palm Beach Gardens' });
    expect(screen.getByText('Campus')).toBeInTheDocument();
    expect(document.querySelector('select[name="campus"]')).toBeInTheDocument();
    expect(screen.getByText('Palm Beach Gardens')).toBeInTheDocument();
    expect(screen.getByText('Stuart')).toBeInTheDocument();
  });

  it("shows 'Loading...' button text when form is submitting", () => {
    mockFetcherState = { state: 'submitting', data: undefined };
    renderForm();
    expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();
  });

  it('shows error message from fetcher data', () => {
    mockFetcherState = { state: 'idle', data: { error: 'Something went wrong' } };
    renderForm();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('calls pushFormEvent and onSuccess when fetcher returns success', () => {
    const onSuccess = vi.fn();
    const { rerender } = render(
      <MemoryRouter>
        <GroupConnectForm groupId="grp-1" onSuccess={onSuccess} />
      </MemoryRouter>
    );

    act(() => {
      mockFetcherState = { state: 'idle', data: { success: true } };
      rerender(
        <MemoryRouter>
          <GroupConnectForm groupId="grp-1" onSuccess={onSuccess} />
        </MemoryRouter>
      );
    });

    expect(pushFormEvent).toHaveBeenCalledWith('form_complete', 'group_signup', 'Group/Class Signup');
    expect(onSuccess).toHaveBeenCalled();

    const gtmOrder = (pushFormEvent as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0];
    const successOrder = (onSuccess as ReturnType<typeof vi.fn>).mock.invocationCallOrder[0];
    expect(gtmOrder).toBeLessThan(successOrder);
  });
});
