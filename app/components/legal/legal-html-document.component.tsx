import HTMLRenderer from '~/primitives/html-renderer';

import './legal-html-document.styles.css';

interface LegalHtmlDocumentProps {
  title: string;
  html: string;
}

export function LegalHtmlDocument({ title, html }: LegalHtmlDocumentProps) {
  return (
    <main className='flex flex-col min-h-screen bg-white'>
      {/* Page header banner */}
      <div className='bg-dark-navy'>
        <div className='mx-auto w-full max-w-4xl px-6 py-16 md:px-10 md:py-24'>
          <p className='mb-3 text-sm font-semibold uppercase tracking-widest text-ocean'>
            Christ Fellowship
          </p>
          <h1 className='heading-h2 text-white'>{title}</h1>
        </div>
      </div>

      {/* Content — HTMLRenderer sanitizes; typography in legal-html-document.styles.css */}
      <div className='mx-auto w-full max-w-4xl px-6 py-14 md:px-10 md:py-20'>
        <HTMLRenderer html={html} className='legal-html-document' />
      </div>
    </main>
  );
}
