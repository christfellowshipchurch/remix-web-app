import { type MetaFunction } from 'react-router-dom';
import { createMeta } from '~/lib/meta-utils';

export const meta: MetaFunction = () => {
  return createMeta({
    title: 'Rock Content',
    description: 'Rock RMS embedded content',
    noIndex: true,
  });
};
