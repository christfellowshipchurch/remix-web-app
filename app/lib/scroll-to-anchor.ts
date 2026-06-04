import { ANCHOR_SCROLL_OFFSET } from '~/components/navbar/scroll-offset.constants';

export function scrollToAnchor(
  id: string,
  options?: { behavior?: 'auto' | 'smooth' },
): boolean {
  const element = document.getElementById(id);
  if (!element) return false;

  const offsetTop =
    element.getBoundingClientRect().top + window.scrollY - ANCHOR_SCROLL_OFFSET;

  window.scrollTo({
    top: offsetTop,
    behavior: options?.behavior ?? 'smooth',
  });

  return true;
}
