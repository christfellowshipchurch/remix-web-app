import { Link, useLocation } from 'react-router-dom';
import Icon from '~/primitives/icon';

interface BreadcrumbsProps {
  mode?: 'light' | 'dark';
}

/**
 * ASCII slug → display label for breadcrumbs when capitalization alone
 * cannot recover accents (e.g. `espanol` → `Español`). URLs stay unchanged.
 */
const BREADCRUMB_SLUG_LABELS: Record<string, string> = {
  espanol: 'Español',
};

function breadcrumbLabelFromSegment(segment: string): string {
  const decoded = decodeURIComponent(segment);
  const mapped = BREADCRUMB_SLUG_LABELS[decoded.toLowerCase()];
  if (mapped) return mapped;

  return decoded
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function Breadcrumbs({ mode = 'dark' }: BreadcrumbsProps) {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const textColor = mode === 'dark' ? 'text-neutral-700' : 'text-neutral-300';

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const isCurrentPage = index === pathSegments.length - 1;
    const label = breadcrumbLabelFromSegment(segment);

    return (
      <div
        key={path}
        className={`flex items-center gap-1 md:gap-4 ${textColor}`}
      >
        <Icon
          id='breadcrumbs-caret'
          className='text-ocean min-w-[20px] block'
          size={20}
          name='caretRight'
        />
        {isCurrentPage ? (
          <span className='text-sm line-clamp-2' aria-current='page'>
            {label}
          </span>
        ) : (
          <Link to={path}>
            <span className='hover:underline text-sm line-clamp-2'>
              {label}
            </span>
          </Link>
        )}
      </div>
    );
  });

  return (
    <div className={`flex items-center gap-4 ${textColor}`}>
      <Link to='/'>
        <span
          className={`hover:underline text-sm ${
            mode == 'dark' ? 'text-neutral-500' : 'text-neutral-400'
          }`}
        >
          Home
        </span>
      </Link>
      {breadcrumbs}
    </div>
  );
}
