import * as Form from '@radix-ui/react-form';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ConnectCardForm, {
  renderInputField,
  renderCheckboxField,
} from '../connect-form.component';

vi.mock('~/lib/gtm', () => ({ pushFormEvent: vi.fn() }));

// Configurable fetcher state
let mockFormFetcherState = {
  state: 'idle' as 'idle' | 'submitting' | 'loading',
  data: undefined as unknown,
};
let mockPrefillFetcherState = {
  state: 'idle' as 'idle' | 'submitting' | 'loading',
  data: undefined as unknown,
};
const mockLoad = vi.fn();
const mockSubmit = vi.fn();
const mockPrefillLoad = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useFetcher: (options?: { key?: string }) =>
      options?.key === 'connect-card-prefill'
        ? {
            state: mockPrefillFetcherState.state,
            data: mockPrefillFetcherState.data,
            load: mockPrefillLoad,
            submit: vi.fn(),
          }
        : {
            state: mockFormFetcherState.state,
            data: mockFormFetcherState.data,
            load: mockLoad,
            submit: mockSubmit,
          },
  };
});

function LocationProbe() {
  const location = useLocation();
  return <div data-testid='location-search'>{location.search}</div>;
}

function renderForm(onSuccess = vi.fn(), initialEntry = '/connect-card') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ConnectCardForm onSuccess={onSuccess} />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe('renderInputField', () => {
  it('renders label text', () => {
    render(
      <MemoryRouter>
        <Form.Root>
          {renderInputField('email', 'Email', 'text', 'Required')}
        </Form.Root>
      </MemoryRouter>,
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders input with correct type', () => {
    render(
      <MemoryRouter>
        <Form.Root>
          {renderInputField('phone', 'Phone', 'number', 'Required')}
        </Form.Root>
      </MemoryRouter>,
    );
    expect(document.querySelector("input[type='number']")).toBeInTheDocument();
  });

  it('applies defaultValue', () => {
    render(
      <MemoryRouter>
        <Form.Root>
          {renderInputField('name', 'Name', 'text', 'Required', 'John')}
        </Form.Root>
      </MemoryRouter>,
    );
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
  });
});

describe('renderCheckboxField', () => {
  it('renders checkbox input', () => {
    const option = { guid: 'guid-1', value: 'Join a Group' };
    render(
      <MemoryRouter>
        <Form.Root>{renderCheckboxField(option, 0)}</Form.Root>
      </MemoryRouter>,
    );
    expect(
      document.querySelector("input[type='checkbox']"),
    ).toBeInTheDocument();
  });

  it('renders checkbox label', () => {
    const option = { guid: 'guid-1', value: 'Join a Group' };
    render(
      <MemoryRouter>
        <Form.Root>{renderCheckboxField(option, 0)}</Form.Root>
      </MemoryRouter>,
    );
    expect(screen.getByText('Join a Group')).toBeInTheDocument();
  });
});

describe('ConnectCardForm', () => {
  beforeEach(() => {
    mockFormFetcherState = { state: 'idle', data: undefined };
    mockPrefillFetcherState = { state: 'idle', data: undefined };
    vi.clearAllMocks();
  });

  it("renders the 'Get Connected' heading", () => {
    renderForm();
    expect(screen.getByText('Get Connected')).toBeInTheDocument();
  });

  it('renders First Name, Last Name, Phone, Email fields', () => {
    renderForm();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders Campus select with placeholder option', () => {
    renderForm();
    expect(screen.getByText('Select a Campus')).toBeInTheDocument();
  });

  it('renders decision checkbox', () => {
    renderForm();
    expect(
      screen.getByText('I made a decision to follow Christ today'),
    ).toBeInTheDocument();
  });

  it('renders Submit button', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows campuses in select when fetcher data loads', () => {
    mockFormFetcherState = {
      state: 'idle',
      data: {
        campuses: [
          { guid: 'guid-1', name: 'Palm Beach Gardens' },
          { guid: 'guid-2', name: 'Stuart' },
        ],
        allThatApplies: [],
      },
    };
    renderForm();
    expect(screen.getByText('Palm Beach Gardens')).toBeInTheDocument();
    expect(screen.getByText('Stuart')).toBeInTheDocument();
  });

  it("shows 'I am looking to:' section with checkboxes from fetcher data", () => {
    mockFormFetcherState = {
      state: 'idle',
      data: {
        campuses: [],
        allThatApplies: [
          { guid: 'g1', value: 'Join a Group' },
          { guid: 'g2', value: 'Get Baptized' },
        ],
      },
    };
    renderForm();
    expect(screen.getByText('I am looking to:')).toBeInTheDocument();
    expect(screen.getByText('Join a Group')).toBeInTheDocument();
    expect(screen.getByText('Get Baptized')).toBeInTheDocument();
  });

  it('shows Loading... on submit button when submitting', () => {
    mockFormFetcherState = { state: 'submitting', data: undefined };
    renderForm();
    expect(
      screen.getByRole('button', { name: /loading/i }),
    ).toBeInTheDocument();
  });

  it('shows error message from fetcher data', () => {
    mockFormFetcherState = {
      state: 'idle',
      data: { error: 'Something went wrong' },
    };
    renderForm();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it("reveals 'Other' text input when Other checkbox is toggled", () => {
    mockFormFetcherState = {
      state: 'idle',
      data: {
        campuses: [],
        allThatApplies: [{ guid: 'guid-other', value: 'Other' }],
      },
    };
    renderForm();
    const checkbox = document.querySelector(
      "input[type='checkbox'][value='guid-other']",
    ) as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    // otherContent field is not present before toggling
    expect(
      document.querySelector("input[name='otherContent']"),
    ).not.toBeInTheDocument();
    fireEvent.click(checkbox);
    // After click, otherContent text input appears
    expect(
      document.querySelector("input[name='otherContent']"),
    ).toBeInTheDocument();
  });

  it("calls fetcher.load('/connect-card') on mount", () => {
    renderForm();
    expect(mockLoad).toHaveBeenCalledWith('/connect-card');
  });

  it('loads prefill data for a valid rckipid and removes it from the URL', async () => {
    renderForm(vi.fn(), '/connect-card?rckipid=token-123&foo=bar');

    await waitFor(() => {
      expect(mockPrefillLoad).toHaveBeenCalledWith(
        '/api/connect-card-prefill?rckpid=token-123',
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('location-search')).toHaveTextContent(
        '?foo=bar',
      );
    });
  });

  it('loads prefill data for the mobile app rckpid alias and removes it from the URL', async () => {
    renderForm(vi.fn(), '/connect-card?rckpid=token-123&foo=bar');

    await waitFor(() => {
      expect(mockPrefillLoad).toHaveBeenCalledWith(
        '/api/connect-card-prefill?rckpid=token-123',
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('location-search')).toHaveTextContent(
        '?foo=bar',
      );
    });
  });

  it('does not call the prefill API for an invalid rckipid and removes it from the URL', async () => {
    renderForm(vi.fn(), '/connect-card?rckipid=%7B%7Bbad%7D%7D&foo=bar');

    await waitFor(() => {
      expect(screen.getByTestId('location-search')).toHaveTextContent(
        '?foo=bar',
      );
    });
    expect(mockPrefillLoad).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        "We couldn't prefill your info, but you can still complete the form.",
      ),
    ).toBeInTheDocument();
  });

  it('does not call the prefill API when rckipid is missing', () => {
    renderForm(vi.fn(), '/connect-card?foo=bar');

    expect(mockPrefillLoad).not.toHaveBeenCalled();
    expect(screen.getByTestId('location-search')).toHaveTextContent('?foo=bar');
  });

  it('applies successful prefill data to editable fields', async () => {
    mockFormFetcherState = {
      state: 'idle',
      data: {
        campuses: [{ guid: 'campus-guid', name: 'Palm Beach Gardens' }],
        allThatApplies: [],
      },
    };
    mockPrefillFetcherState = {
      state: 'idle',
      data: {
        status: 'success',
        prefill: {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          phone: '555-123-4567',
          campus: 'campus-guid',
        },
      },
    };

    renderForm(vi.fn(), '/connect-card?rckipid=token-123');

    expect(await screen.findByDisplayValue('Jane')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('555-123-4567')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Campus' })).toHaveValue(
      'campus-guid',
    );

    fireEvent.change(screen.getByDisplayValue('Jane'), {
      target: { value: 'Janet' },
    });
    expect(screen.getByDisplayValue('Janet')).toBeInTheDocument();
  });

  it('shows a non-blocking message when prefill fails and still submits to connect-card', async () => {
    mockPrefillFetcherState = {
      state: 'idle',
      data: { status: 'error', message: 'Unable to load prefill data' },
    };

    renderForm(vi.fn(), '/connect-card?rckipid=token-123');

    expect(
      await screen.findByText(
        "We couldn't prefill your info, but you can still complete the form.",
      ),
    ).toBeInTheDocument();

    fireEvent.submit(document.querySelector('form') as HTMLFormElement);
    expect(mockSubmit).toHaveBeenCalledWith(expect.any(FormData), {
      method: 'post',
      action: '/connect-card',
    });
  });
});
