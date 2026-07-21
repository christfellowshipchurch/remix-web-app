import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormStep } from './clickthrough-registration.component';

vi.mock(
  '~/components/modals/baptism-sign-up/baptism-sign-up-form.component',
  () => ({
    default: ({ onSuccess }: { onSuccess: (details: object) => void }) => (
      <button
        type='button'
        onClick={() => onSuccess({ firstName: 'Ada', lastName: 'Lovelace' })}
      >
        Submit Baptism form
      </button>
    ),
  }),
);

vi.mock('~/components/modals/baptism-sign-up/confirmation.component', () => ({
  default: ({
    details,
    buttonText,
    onContinue,
  }: {
    details: { title: string; campus: string; name: string };
    buttonText: string;
    onContinue: () => void;
  }) => (
    <div>
      <p>{details.title}</p>
      <p>{details.campus}</p>
      <p>{details.name}</p>
      <button type='button' onClick={onContinue}>
        {buttonText}
      </button>
    </div>
  ),
}));

describe('FormStep', () => {
  it('uses the native Baptism form, shows event details on success, and resets for another registration', () => {
    const onResetRegistration = vi.fn();

    render(
      <FormStep
        groupGuid='baptism-group'
        groupType='Baptism'
        selectedCampus='Palm Beach Gardens'
        selectedDate='2026-08-02'
        selectedDay='Sunday'
        selectedTime='10:00 AM'
        onResetRegistration={onResetRegistration}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Submit Baptism form' }),
    );

    expect(screen.getByText('Baptism Details')).toBeInTheDocument();
    expect(screen.getByText('Palm Beach Gardens')).toBeInTheDocument();
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'Register someone else' }),
    );

    expect(onResetRegistration).toHaveBeenCalledOnce();
    expect(
      screen.getByRole('button', { name: 'Submit Baptism form' }),
    ).toBeInTheDocument();
  });
});
