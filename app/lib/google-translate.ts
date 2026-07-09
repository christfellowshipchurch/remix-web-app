/**
 * In-page Spanish translation via the Google Translate website widget.
 *
 * Browsers expose no JS API to trigger their native translate UI, so the
 * closest equivalent is loading Google's widget script with the `googtrans`
 * cookie pre-set: on init it machine-translates the page in place and keeps
 * translating content mounted later (modals, Rock-fetched form options).
 *
 * The widget's hosts must stay allowlisted in the CSP built in app/root.tsx.
 */

const CONTAINER_ID = 'google_translate_element';
const STYLE_ID = 'google-translate-style';
const SCRIPT_SRC =
  'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: { pageLanguage: string; autoDisplay?: boolean },
          containerId: string,
        ) => unknown;
      };
    };
  }
}

/** The widget's banner iframe pushes the page down 40px; keep it hidden. */
function injectWidgetStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    body > .skiptranslate { display: none !important; }
    body { top: 0 !important; }
    #${CONTAINER_ID} { display: none; }
  `;
  document.head.appendChild(style);
}

export function translatePageToSpanish(): void {
  if (typeof document === 'undefined') return;

  // The widget reads this cookie on init to pick the target language.
  document.cookie = 'googtrans=/en/es; path=/';

  // Widget already mounted (e.g. after a manual revert): drive its select.
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (combo) {
    combo.value = 'es';
    combo.dispatchEvent(new Event('change'));
    return;
  }

  // Script already requested and still loading; init will pick up the cookie.
  if (document.getElementById(CONTAINER_ID)) return;

  injectWidgetStyles();
  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  document.body.appendChild(container);

  window.googleTranslateElementInit = () => {
    const TranslateElement = window.google?.translate?.TranslateElement;
    if (!TranslateElement) return;
    new TranslateElement(
      { pageLanguage: 'en', autoDisplay: false },
      CONTAINER_ID,
    );
  };

  const script = document.createElement('script');
  script.src = SCRIPT_SRC;
  script.async = true;
  document.body.appendChild(script);
}

/**
 * Revert to the original (English) page. Needed because this is an SPA:
 * navigating away from a Spanish-triggered page doesn't reload, so without
 * this the translated state would silently carry over to the next page.
 */
export function resetPageTranslation(): void {
  if (typeof document === 'undefined') return;

  document.cookie =
    'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (combo) {
    combo.value = 'en';
    combo.dispatchEvent(new Event('change'));
  }
}
