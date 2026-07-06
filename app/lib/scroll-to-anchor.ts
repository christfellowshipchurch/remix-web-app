import { ANCHOR_SCROLL_OFFSET } from '~/components/navbar/scroll-offset.constants';

export function scrollToAnchor(
  id: string,
  options?: { behavior?: 'auto' | 'smooth'; offset?: number },
): boolean {
  const element = document.getElementById(id);
  if (!element) return false;

  const offset = options?.offset ?? ANCHOR_SCROLL_OFFSET;
  const offsetTop = element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: offsetTop,
    behavior: options?.behavior ?? 'smooth',
  });

  return true;
}
