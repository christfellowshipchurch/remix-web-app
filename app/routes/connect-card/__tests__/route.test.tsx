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
  resetPageTranslation: vi.fn(),
}));

import {
  translatePageToSpanish,
  resetPageTranslation,
} from '~/lib/google-translate';

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

  it('reverts the translation when the visitor leaves the page', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/connect-card?lang=es']}>
        <ConnectCardFormPage />
      </MemoryRouter>,
    );
    expect(resetPageTranslation).not.toHaveBeenCalled();
    unmount();
    expect(resetPageTranslation).toHaveBeenCalledTimes(1);
  });

  it('does not revert anything when the page was never translated', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/connect-card']}>
        <ConnectCardFormPage />
      </MemoryRouter>,
    );
    unmount();
    expect(resetPageTranslation).not.toHaveBeenCalled();
  });
});
