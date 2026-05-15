import { type MetaFunction } from 'react-router';
import { createMeta } from '~/lib/meta-utils';
import { LegalHtmlDocument } from '~/components/legal/legal-html-document.component';
import { privacyPolicy } from '~/lib/legal/privacy-policy-and-terms.data';

export const meta: MetaFunction = () => {
  return createMeta({
    title: 'Privacy Policy',
    description:
      'Read the Christ Fellowship Church Privacy Policy to understand how we collect, use, and protect your information.',
    path: '/privacy-policy',
  });
};

export default function PrivacyPolicyPage() {
  return <LegalHtmlDocument title='Privacy Policy' html={privacyPolicy} />;
}
