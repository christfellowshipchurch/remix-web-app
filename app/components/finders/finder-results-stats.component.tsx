import { Stats } from 'react-instantsearch';

import { cn } from '~/lib/utils';

type FinderResultsStatsProps = {
  rootClassName?: string;
  /**
   * When set, shows this number instead of wrapping InstantSearch `Stats`.
   * Use when the UI count differs from Algolia `nbHits` (e.g. class finder groups hits by `classType`).
   */
  hitCount?: number;
};

export function FinderResultsStats({
  rootClassName,
  hitCount,
}: FinderResultsStatsProps) {
  if (hitCount !== undefined) {
    return (
      <p className={cn('text-text-secondary mb-6', rootClassName)}>
        {hitCount.toLocaleString()} Results Found
      </p>
    );
  }

  return (
    <Stats
      classNames={{
        root: cn('text-text-secondary mb-6', rootClassName),
      }}
      translations={{
        rootElementText: ({ nbHits }) =>
          `${nbHits.toLocaleString()} Results Found`,
      }}
    />
  );
}
