import * as Form from '@radix-ui/react-form';
import { useEffect, useState } from 'react';
import { Button } from '~/primitives/button/button.primitive';
import {
  formControlBaseStyles,
  formControlFocusStyles,
  formErrorMessageStyles,
  formLabelStyles,
  nativeRadioStyles,
} from '~/primitives/inputs/form-control.styles';
import { cn } from '~/lib/utils';
import { useFetcher } from 'react-router-dom';
import { renderInputField } from '../connect-card/connect-form.component';
import { LoaderReturnType } from '~/routes/set-a-reminder/loader';
import { pushFormEvent } from '~/lib/gtm';

interface ReminderProps {
  setServiceTime: (time: string) => void;
  onSuccess: () => void;
  url: string;
}

const ReminderForm: React.FC<ReminderProps> = ({
  setServiceTime,
  onSuccess,
  url,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoaderReturnType | null>(null);

  const loadFetcher = useFetcher();
  const submitFetcher = useFetcher();

  useEffect(() => {
    loadFetcher.load(`/set-a-reminder?location=${url}`);
  }, [url]);

  useEffect(() => {
    if (loadFetcher.state === 'idle' && loadFetcher.data) {
      const data = loadFetcher.data as LoaderReturnType;
      setFormData(data);
    }
  }, [loadFetcher.state, loadFetcher.data]);

  useEffect(() => {
    if (submitFetcher.state === 'idle' && submitFetcher.data) {
      setLoading(false);
      const data = submitFetcher.data as { error?: string };
      if (data.error) {
        setError(data.error);
      } else {
        pushFormEvent('form_complete', 'set_a_reminder', 'Set a Reminder');
        onSuccess();
      }
    }
  }, [submitFetcher.state, submitFetcher.data, onSuccess]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const submission = new FormData(event.currentTarget);
    submission.append('campus', formData?.campusName || '');

    try {
      submitFetcher.submit(submission, {
        method: 'post',
        action: '/set-a-reminder',
      });
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  const { serviceTimes, campusName, user } = formData || {};
  const isEspanol = campusName?.includes('Español');
  const isOnline = url?.includes('everywhere');
  const firstName = user?.firstName || null;
  const lastName = user?.lastName || null;
  const phoneNumber = null;
  const email = user?.email || null;

  return (
    <>
      <h2 className='mb-6 text-3xl text-navy font-bold'>
        {isEspanol
          ? 'Visítanos'
          : isOnline
            ? 'Set A Reminder!'
            : 'Plan a Visit!'}
      </h2>
      <Form.Root
        onSubmit={handleSubmit}
        className='flex flex-col md:grid text-left grid-cols-1 gap-y-3 gap-x-6 md:grid-cols-2'
      >
        {renderInputField(
          'firstName',
          isEspanol ? 'Primer nombre' : 'First Name',
          'text',
          isEspanol
            ? 'Profavor ingrese su primer nombre'
            : 'Please enter your first name',
          firstName || undefined,
        )}
        {renderInputField(
          'lastName',
          isEspanol ? 'Apellido' : 'Last Name',
          'text',
          isEspanol
            ? 'Porfavor ingrese su apellido'
            : 'Please enter your last name',
          lastName || undefined,
        )}
        {renderInputField(
          'phone',
          isEspanol ? 'Númbero de teléfono' : 'Phone',
          'number',
          isEspanol
            ? 'Porfavor ingrese un número de teléfono válido'
            : 'Please enter a valid number',
          phoneNumber || undefined,
        )}
        {renderInputField(
          'email',
          isEspanol ? 'Correo electrónico' : 'Email',
          'text',
          isEspanol
            ? 'Porfavor ingrese un correo electrónico válido'
            : 'Please enter a valid email',
          email || undefined,
        )}

        <Form.Field name='campus' className='flex flex-col'>
          <Form.Label className={formLabelStyles}>Campus</Form.Label>
          <Form.Control asChild>
            <select
              className={cn(
                'appearance-none text-neutral-400',
                formControlBaseStyles,
                formControlFocusStyles,
              )}
              required
              disabled
              style={{
                backgroundImage: `url('/assets/icons/chevron-down.svg')`,
                backgroundSize: '24px',
                backgroundPosition: 'calc(100% - 2%) center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <option>{campusName}</option>
            </select>
          </Form.Control>
        </Form.Field>

        <Form.Field name='serviceTime' className='flex flex-col'>
          <Form.Label className={formLabelStyles}>
            {isEspanol ? 'Horarios de Servicios' : 'Service Time'}
          </Form.Label>
          <Form.Control asChild>
            {serviceTimes && (
              <select
                className={cn(
                  'appearance-none cursor-pointer',
                  formControlBaseStyles,
                  formControlFocusStyles,
                )}
                required
                onChange={(e) => setServiceTime(e.target.value)}
                style={{
                  backgroundImage: `url('/assets/icons/chevron-down.svg')`,
                  backgroundSize: '24px',
                  backgroundPosition: 'calc(100% - 2%) center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <option value={''}>
                  {isEspanol
                    ? 'Seleccione un horario de servicio'
                    : 'Select a Service Time'}
                </option>
                {serviceTimes?.map(({ hour }) =>
                  hour.map((time: string, index: number) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  )),
                )}
              </select>
            )}
          </Form.Control>
          <Form.Message className={formErrorMessageStyles} match='valueMissing'>
            {isEspanol
              ? 'Porfavor seleccione un horario de servicio'
              : 'Please select a service time'}
          </Form.Message>
        </Form.Field>

        <Form.Field
          name='beenToCF'
          className='flex flex-col col-span-1 md:col-span-2 mt-4'
        >
          <Form.Label className={formLabelStyles}>
            {isEspanol
              ? '¿Ha estado en Christ Fellowship antes?'
              : 'Have you been to Christ Fellowship before?'}
          </Form.Label>
          <div className='flex flex-wrap gap-x-6 gap-y-2' role='radiogroup'>
            <label className='inline-flex items-center gap-2 text-sm cursor-pointer'>
              <input
                type='radio'
                name='beenToCF'
                value='true'
                required
                className={nativeRadioStyles}
              />
              {isEspanol ? 'Sí' : 'Yes'}
            </label>
            <label className='inline-flex items-center gap-2 text-sm cursor-pointer'>
              <input
                type='radio'
                name='beenToCF'
                value='false'
                className={nativeRadioStyles}
              />
              No, {isEspanol ? 'es mi primera vez' : "it's my first time"}
            </label>
          </div>
          <Form.Message className={formErrorMessageStyles} match='valueMissing'>
            {isEspanol
              ? 'Porfavor indique si ha estado en Christ Fellowship antes.'
              : 'Please let us know if you have been to Christ Fellowship before.'}
          </Form.Message>
        </Form.Field>

        {error && <p className='text-alert col-span-2 text-center'>{error}</p>}

        <Form.Submit className='mt-6 mx-auto col-span-1 md:col-span-2' asChild>
          <Button
            className='w-40 h-12'
            size='md'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Loading...' : isEspanol ? 'Enviar' : 'Submit'}
          </Button>
        </Form.Submit>
      </Form.Root>
    </>
  );
};

export default ReminderForm;
