import { sanitizeCmsHtml } from '~/lib/sanitize';

interface LegalHtmlDocumentProps {
  title: string;
  html: string;
}

export function LegalHtmlDocument({ title, html }: LegalHtmlDocumentProps) {
  return (
    <main className='flex flex-col min-h-screen bg-white'>
      <div className='mx-auto w-full max-w-4xl px-6 py-16 md:px-10 md:py-24'>
        <h1 className='mb-10 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl'>
          {title}
        </h1>
        <div
          className='prose prose-neutral max-w-none text-base leading-relaxed text-gray-700'
          dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(html) }}
        />
      </div>
    </main>
  );
}
