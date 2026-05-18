import { useEffect, useState } from 'react';

import Icon from '~/primitives/icon';

export function GroupFinderQueryInput({
  query,
  onQueryCommit,
}: {
  query: string | undefined;
  onQueryCommit: (nextQuery: string) => void;
}) {
  const [localQuery, setLocalQuery] = useState(query ?? '');

  useEffect(() => {
    setLocalQuery(query ?? '');
  }, [query]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = localQuery.trim();
      const committed = (query ?? '').trim();
      if (trimmed !== committed) {
        onQueryCommit(localQuery);
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [localQuery, onQueryCommit, query]);

  return (
    <div className='w-full md:w-[240px] lg:w-[250px] xl:w-[266px] flex items-center rounded-lg border border-[#DEE0E3] focus-within:border-ocean py-2'>
      <Icon name='searchAlt' className='text-neutral-default ml-3' size={16} />
      <input
        type='search'
        value={localQuery}
        onChange={(event) => setLocalQuery(event.target.value)}
        placeholder='Search'
        aria-label='Search groups'
        className='w-full flex-grow text-base text-neutral-default placeholder:text-neutral-default px-2 py-1 focus:outline-none md:text-sm'
      />
    </div>
  );
}
