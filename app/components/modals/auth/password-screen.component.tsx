import * as Form from '@radix-ui/react-form';
import React, { useEffect, useState } from 'react';
import { Button } from '~/primitives/button/button.primitive';
import Icon from '~/primitives/icon';
import { cn } from '~/lib/utils';
import {
  formControlBaseStyles,
  formControlErrorStyles,
  formControlTrailingIconStyles,
} from '~/primitives/inputs/form-control.styles';
import {
  radixFormLabelClassName,
  RadixFormErrorMessage,
  FormFieldErrorText,
} from '~/primitives/inputs/form-radix-field';

interface PasswordScreenProps {
  onSubmit: (password: string) => Promise<void>;
}

const PasswordScreen: React.FC<PasswordScreenProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Focus on the password input when the component mounts
    document.getElementById('password')?.focus();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(password);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes('Invalid credentials')) {
        setError('Invalid password. Please try again.');
      } else {
        setError(errorMessage);
      }
      setLoading(false); // Ensure loading is set to false when an error occurs

      const input = document.getElementById('password') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
      return; // Stop further execution
    }

    setLoading(false); // Ensure loading is set to false when no error occurs
  };

  return (
    <div className='text-center'>
      <h2 className='mb-6 text-5xl font-bold'>Log In</h2>
      <Form.Root
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 p-4 text-left'
      >
        <Form.Field name='password' className='flex flex-col'>
          <Form.Label className={radixFormLabelClassName}>Password*</Form.Label>
          <div className='relative'>
            <Form.Control asChild>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className={cn(
                  error ? formControlErrorStyles : formControlBaseStyles,
                  formControlTrailingIconStyles,
                )}
              />
            </Form.Control>
            <span
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-navy'
            >
              <Icon name={showPassword ? 'eye' : 'eyeSlash'} size={24} />
            </span>
          </div>
          <RadixFormErrorMessage match='valueMissing'>
            Please enter a password
          </RadixFormErrorMessage>
        </Form.Field>
        {error && <FormFieldErrorText>{error}</FormFieldErrorText>}
        <Form.Submit className='mt-2' asChild>
          <Button size='md' type='submit' disabled={loading}>
            {loading ? 'Loading...' : 'Log In'}
          </Button>
        </Form.Submit>
      </Form.Root>
      <div className='flex justify-center gap-1 text-neutral-600'>
        {/* TODO: create a password reset page... */}
        <a href='/' className='underline  hover:text-black'>
          Forgot your password?
        </a>
      </div>
    </div>
  );
};

export default PasswordScreen;
