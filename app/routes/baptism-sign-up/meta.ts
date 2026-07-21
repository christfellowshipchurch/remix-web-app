import type { MetaFunction } from 'react-router-dom';
import { createMeta } from '~/lib/meta-utils';

export const meta: MetaFunction = () => {
  return createMeta({
    title: 'Sign Up for Baptism',
    description: 'Sign up for baptism at Christ Fellowship.',
    path: 'baptism-sign-up',
  });
};
