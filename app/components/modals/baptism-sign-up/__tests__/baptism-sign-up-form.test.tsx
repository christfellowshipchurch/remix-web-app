import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import BaptismSignUpForm from '../baptism-sign-up-form.component';
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

function renderForm(onSuccess = vi.fn()) {
  return render(
    <MemoryRouter initialEntries={['/baptism-sign-up']}>
      <BaptismSignUpForm onSuccess={onSuccess} />
    </MemoryRouter>,
  );
}

// Builds a YYYY-MM-DD string exactly `years` before today using local calendar
// components, so the component's age math lands on the intended whole age.
function dateYearsAgo(years: number) {
  const now = new Date();
  const year = now.getFullYear() - years;
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function setBirthdate(years: number) {
  const input = document.querySelector(
    "input[type='date']",
  ) as HTMLInputElement;
  fireEvent.change(input, { target: { value: dateYearsAgo(years) } });
}

describe('BaptismSignUpForm', () => {
  beforeEach(() => {
    mockFetcherState = { state: 'idle', data: undefined };
    vi.clearAllMocks();
  });

  it('renders the heading', () => {
    renderForm();
    expect(screen.getByText('Sign Up for Baptism')).toBeInTheDocument();
  });

  it('renders the base fields and submit button', () => {
    renderForm();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Cell Phone')).toBeInTheDocument();
    expect(screen.getByText('Home Campus')).toBeInTheDocument();
    expect(screen.getByText('Birthdate')).toBeInTheDocument();
    expect(screen.getByText('T-Shirt Size')).toBeInTheDocument();
    expect(
      screen.getByText('Tell us why now is your time to get baptized!'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you comfortable with sharing your story on platform before being baptized?',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('renders the three share-your-story radio options', () => {
    renderForm();
    const radios = document.querySelectorAll(
      "input[type='radio'][name='shareYourStory']",
    );
    expect(radios.length).toBe(3);
    expect(screen.getByText('No Preference')).toBeInTheDocument();
  });

  it('shows a live remaining-character count for the story field', () => {
    renderForm();
    expect(screen.getByText('200 characters remaining')).toBeInTheDocument();
    const textarea = document.querySelector(
      "textarea[name='myStory']",
    ) as HTMLInputElement;
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(screen.getByText('195 characters remaining')).toBeInTheDocument();
  });

  it('populates the campus select from fetcher data', () => {
    mockFetcherState = {
      state: 'idle',
      data: {
        campuses: [
          { guid: 'guid-1', name: 'Palm Beach Gardens' },
          { guid: 'guid-2', name: 'Stuart' },
        ],
      },
    };
    renderForm();
    expect(screen.getByText('Palm Beach Gardens')).toBeInTheDocument();
    expect(screen.getByText('Stuart')).toBeInTheDocument();
  });

  it("calls fetcher.load('/baptism-sign-up') on mount", () => {
    renderForm();
    expect(mockLoad).toHaveBeenCalledWith('/baptism-sign-up');
  });

  it('shows no age-based fields before a birthdate is entered', () => {
    renderForm();
    expect(screen.queryByText('Are you in High School?')).not.toBeInTheDocument();
    expect(
      screen.queryByText("Guardian's First Name"),
    ).not.toBeInTheDocument();
  });

  it('shows no additional fields when age is over 18', () => {
    renderForm();
    setBirthdate(25);
    expect(screen.queryByText('Are you in High School?')).not.toBeInTheDocument();
    expect(
      screen.queryByText("Guardian's First Name"),
    ).not.toBeInTheDocument();
  });

  it('always reveals Grade + Guardian fields (no High School question) when under 18', () => {
    renderForm();
    setBirthdate(10);
    expect(screen.queryByText('Are you in High School?')).not.toBeInTheDocument();
    expect(screen.getByText('Grade')).toBeInTheDocument();
    expect(screen.getByText("Guardian's First Name")).toBeInTheDocument();
    expect(screen.getByText("Guardian's Last Name")).toBeInTheDocument();
    expect(screen.getByText("Guardian's Email")).toBeInTheDocument();
    expect(screen.getByText("Guardian's Phone Number")).toBeInTheDocument();
    expect(
      screen.getByText('Relation to the participant'),
    ).toBeInTheDocument();
  });

  it('asks the High School question at exactly 18 and reveals guardian fields only when answered Yes', () => {
    renderForm();
    setBirthdate(18);

    // High School question appears; guardian fields hidden until answered.
    expect(screen.getByText('Are you in High School?')).toBeInTheDocument();
    expect(
      screen.queryByText("Guardian's First Name"),
    ).not.toBeInTheDocument();

    // Answer Yes -> guardian block + Grade appear.
    fireEvent.click(
      document.querySelector(
        "input[name='areYouInHighSchool'][value='True']",
      ) as HTMLInputElement,
    );
    expect(screen.getByText('Grade')).toBeInTheDocument();
    expect(screen.getByText("Guardian's First Name")).toBeInTheDocument();

    // Answer No -> guardian block hidden again.
    fireEvent.click(
      document.querySelector(
        "input[name='areYouInHighSchool'][value='False']",
      ) as HTMLInputElement,
    );
    expect(
      screen.queryByText("Guardian's First Name"),
    ).not.toBeInTheDocument();
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

  it('shows an error message from fetcher data', () => {
    mockFetcherState = {
      state: 'idle',
      data: { error: 'Something went wrong' },
    };
    renderForm();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('submits to /baptism-sign-up on form submit', () => {
    renderForm();
    fireEvent.submit(document.querySelector('form') as HTMLFormElement);
    expect(mockSubmit).toHaveBeenCalledWith(expect.any(FormData), {
      method: 'post',
      action: '/baptism-sign-up',
    });
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
      'baptism_sign_up',
      'Baptism Sign Up',
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(calls).toEqual(['pushFormEvent', 'onSuccess']);
  });
});
