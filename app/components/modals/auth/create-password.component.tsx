import * as Form from '@radix-ui/react-form';
import React, { useState } from 'react';
import { Button } from '~/primitives/button/button.primitive';
import Icon from '~/primitives/icon';
import { cn } from '~/lib/utils';
import { formControlTrailingIconStyles } from '~/primitives/inputs/form-control.styles';
import {
  radixFormLabelClassName,
  radixInputClassName,
  RadixFormErrorMessage,
  FormFieldErrorText,
} from '~/primitives/inputs/form-radix-field';

interface CreatePasswordProps {
  onSubmit: (password: string) => void;
}

const CreatePassword: React.FC<CreatePasswordProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      onSubmit(password);
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='text-center'>
      <h2 className='mb-6 text-5xl font-bold'>Sign Up</h2>
      <p className='mb-6 text-lg text-text_primary'>
        Choose a strong password for your account.
      </p>
      <Form.Root
        onSubmit={handleSubmit}
        className='flex flex-col p-4 text-left'
      >
        <Form.Field name='password' className='flex flex-col'>
          <Form.Label className={radixFormLabelClassName}>Password*</Form.Label>
          <div className='relative'>
            <Form.Control asChild>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className={cn(
                  radixInputClassName,
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
          <RadixFormErrorMessage match='tooShort'>
            Password must be at least 8 characters long
          </RadixFormErrorMessage>
        </Form.Field>
        <Form.Field name='confirmPassword' className='mt-4 flex flex-col'>
          <Form.Label className={radixFormLabelClassName}>
            Confirm Password*
          </Form.Label>
          <Form.Control asChild>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={radixInputClassName}
            />
          </Form.Control>
          <RadixFormErrorMessage match='valueMissing'>
            Please confirm your password
          </RadixFormErrorMessage>
        </Form.Field>
        {error && <FormFieldErrorText>{error}</FormFieldErrorText>}

        <Form.Submit className='mt-8' asChild>
          <Button size='md' type='submit' disabled={loading}>
            {loading ? 'Creating...' : 'Create Password'}
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default CreatePassword;
