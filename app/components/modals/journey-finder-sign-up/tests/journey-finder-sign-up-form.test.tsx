import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import JourneyFinderSignUpForm from '../journey-finder-sign-up-form.component';
import { pushFormEvent } from '~/lib/gtm';

vi.mock('~/lib/gtm', () => ({ pushFormEvent: vi.fn() }));

let mockFetcherState = {
  state: 'idle' as 'idle' | 'submitting' | 'loading',
  data: undefined as unknown,
};
const mockLoad = vi.fn();
const mockSubmit = vi.fn();

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
      load: mockLoad,
      submit: mockSubmit,
    }),
  };
});

function renderForm(
  onSuccess = vi.fn(),
  initialEntries: string[] = ['/journey-finder-sign-up?Group=test-guid-123'],
) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <JourneyFinderSignUpForm onSuccess={onSuccess} />
    </MemoryRouter>,
  );
}

describe('JourneyFinderSignUpForm', () => {
  beforeEach(() => {
    mockFetcherState = { state: 'idle', data: undefined };
    vi.clearAllMocks();
  });

  it('renders the heading', () => {
    renderForm();
    expect(screen.getByText('Journey Finder Sign Up')).toBeInTheDocument();
  });

  it('renders First Name, Last Name, Cell Phone, Email Address fields', () => {
    renderForm();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Cell Phone')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('renders all five AtCF radio options', () => {
    renderForm();
    expect(screen.getByText('Less than 1 month')).toBeInTheDocument();
    expect(screen.getByText('1-6 months')).toBeInTheDocument();
    expect(screen.getByText('7-12 months')).toBeInTheDocument();
    expect(screen.getByText('1-5 years')).toBeInTheDocument();
    expect(screen.getByText('Over 5 years')).toBeInTheDocument();
    const radios = document.querySelectorAll(
      "input[type='radio'][name='atCF']",
    );
    expect(radios.length).toBe(5);
  });

  it('renders the optional hopeToGet textarea', () => {
    renderForm();
    expect(
      screen.getByText(
        'What do you hope to gain from this Journey Experience?',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector("textarea[name='hopeToGet']"),
    ).toBeInTheDocument();
  });

  it('includes a hidden Group input populated from the URL search param', () => {
    renderForm();
    const hidden = document.querySelector(
      "input[type='hidden'][name='Group']",
    ) as HTMLInputElement;
    expect(hidden).toBeInTheDocument();
    expect(hidden.value).toBe('test-guid-123');
  });

  it('renders Submit button', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows Loading... and disables submit while submitting', () => {
    mockFetcherState = { state: 'submitting', data: undefined };
    renderForm();
    const btn = screen.getByRole('button', {
      name: /loading/i,
    }) as HTMLButtonElement;
    expect(btn).toBeInTheDocument();
    expect(btn.disabled).toBe(true);
  });

  it('shows error message from fetcher data', () => {
    mockFetcherState = {
      state: 'idle',
      data: { error: 'Something went wrong' },
    };
    renderForm();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it("calls fetcher.load('/journey-finder-sign-up') on mount", () => {
    renderForm();
    expect(mockLoad).toHaveBeenCalledWith('/journey-finder-sign-up');
  });

  it('fires pushFormEvent before onSuccess when submission succeeds', () => {
    const calls: string[] = [];
    (pushFormEvent as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => {
        calls.push('pushFormEvent');
      },
    );
    const onSuccess = vi.fn(() => {
      calls.push('onSuccess');
    });
    mockFetcherState = { state: 'idle', data: { success: true } };
    renderForm(onSuccess);

    expect(pushFormEvent).toHaveBeenCalledWith(
      'form_complete',
      'journey_finder_sign_up',
      'Journey Finder Sign Up',
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(calls).toEqual(['pushFormEvent', 'onSuccess']);
  });
});
