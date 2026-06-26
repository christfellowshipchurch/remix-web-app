import { type MetaFunction } from 'react-router-dom';
import { createMeta } from '~/lib/meta-utils';
import type { loader } from './loader';
import { getRockPageEmbedMetaTitle } from './rock-page.data';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createMeta({
    title: getRockPageEmbedMetaTitle(data?.embed),
    description: 'Rock RMS embedded content',
    noIndex: true,
  });
};
