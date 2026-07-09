import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ConnectCardFormPage from '../route';

vi.mock('~/components/modals/connect-card/connect-form.component', () => ({
  default: () => <div data-testid='connect-card-form' />,
}));
vi.mock('~/components/modals/connect-card/confirmation.component', () => ({
  default: () => <div data-testid='connect-card-confirmation' />,
}));
vi.mock('~/lib/google-translate', () => ({
  translatePageToSpanish: vi.fn(),
}));

import { translatePageToSpanish } from '~/lib/google-translate';

describe('ConnectCardFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('self-translates to Spanish when landed on with ?lang=es', () => {
    render(
      <MemoryRouter initialEntries={['/connect-card?lang=es']}>
        <ConnectCardFormPage />
      </MemoryRouter>,
    );
    expect(translatePageToSpanish).toHaveBeenCalledTimes(1);
  });

  it('does not translate for the plain English page', () => {
    render(
      <MemoryRouter initialEntries={['/connect-card']}>
        <ConnectCardFormPage />
      </MemoryRouter>,
    );
    expect(translatePageToSpanish).not.toHaveBeenCalled();
  });
});
