import { type MetaFunction } from 'react-router';
import { createMeta } from '~/lib/meta-utils';
import { LegalHtmlDocument } from '~/components/legal/legal-html-document.component';
import { termsOfUse } from '~/lib/legal/privacy-policy-and-terms.data';

export const meta: MetaFunction = () => {
  return createMeta({
    title: 'Terms of Use',
    description:
      'Read the Christ Fellowship Church Terms of Use that govern your access to and use of our websites, mobile app, and services.',
    path: '/terms-of-use',
  });
};

export default function TermsOfUsePage() {
  return <LegalHtmlDocument title='Terms of Use' html={termsOfUse} />;
}
