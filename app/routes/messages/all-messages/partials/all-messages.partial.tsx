import {
  useLoaderData,
  useSearchParams,
  useLocation,
  useNavigation,
} from 'react-router-dom';
import { useMemo } from 'react';

import { SectionTitle } from '~/components';
import { ResourceCard } from '~/primitives/cards/resource-card';
import type { ContentItemHit } from '~/routes/search/types';
import { Icon } from '~/primitives/icon/icon';
import { cn, getFirstParagraph } from '~/lib/utils';
import { useScrollToSearchResultsOnLoad } from '~/hooks/use-scroll-to-search-results-on-load';
import { HubsTagsRefinementLoadingSkeleton } from '~/components/hubs-tags-refinement';

import type { AllMessagesLoaderReturnType } from '../loader';
import { SERMON_PRIMARY_CATEGORY_FACET } from '../messages-page';
import {
  parseAllMessagesUrlState,
  allMessagesUrlStateToParams,
} from '../all-messages-url-state';

const pillVisualClass =
  'rounded-[999px] text-sm font-semibold transition-colors duration-300';

const unselectedPillClass = cn(
  'flex shrink-0 items-center',
  pillVisualClass,
  'w-fit max-w-full cursor-pointer justify-center whitespace-nowrap bg-gray px-4 py-2 text-text-primary hover:bg-neutral-200 md:py-2.5',
);

const selectedPillClass = cn(
  'grid w-max max-w-[min(100%,calc(100vw-2.5rem))] shrink-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-0.5',
  pillVisualClass,
  'cursor-default bg-ocean/10 px-4 py-2 text-left text-ocean hover:bg-ocean/10 md:py-2.5',
);

const removeButtonClass =
  'shrink-0 cursor-pointer rounded-full p-0.5 text-ocean transition-colors hover:bg-ocean/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-1';

/** URL-driven finder — Algolia only in `loader.ts`. */
export function AllMessages() {
  const {
    allMessagesHits,
    sermonCategoryFacets,
    allMessagesNbPages,
    allMessagesPage,
  } = useLoaderData<AllMessagesLoaderReturnType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigation = useNavigation();

  const urlState = useMemo(
    () => parseAllMessagesUrlState(searchParams),
    [searchParams],
  );

  const isLoading =
    navigation.state === 'loading' &&
    navigation.location?.pathname === location.pathname;

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseAllMessagesUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

  const selectedCategories =
    urlState.refinementList?.[SERMON_PRIMARY_CATEGORY_FACET] ?? [];

  const applyUrlState = (next: ReturnType<typeof parseAllMessagesUrlState>) => {
    setSearchParams(allMessagesUrlStateToParams(next), {
      replace: true,
      preventScrollReset: true,
    });
  };

  const selectCategory = (value: string) => {
    applyUrlState({
      ...urlState,
      page: 0,
      refinementList: {
        ...urlState.refinementList,
        [SERMON_PRIMARY_CATEGORY_FACET]: [value],
      },
    });
  };

  const removeCategory = (value: string) => {
    const rl = {
      ...(urlState.refinementList as Record<string, string[]> | undefined),
    };
    const current = rl[SERMON_PRIMARY_CATEGORY_FACET] ?? [];
    const next = current.filter((v) => v !== value);
    if (next.length === 0) {
      delete rl[SERMON_PRIMARY_CATEGORY_FACET];
    } else {
      rl[SERMON_PRIMARY_CATEGORY_FACET] = next;
    }
    const refinementList =
      Object.keys(rl).length > 0 ? rl : undefined;
    applyUrlState({
      ...urlState,
      page: 0,
      refinementList,
    });
  };

  const goToPage = (nextPage: number) => {
    applyUrlState({
      ...urlState,
      page: Math.max(0, nextPage),
    });
    const scrollTarget = document.querySelector('.pagination-scroll-to');
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isFirstPage = allMessagesPage <= 0;
  const isLastPage =
    allMessagesNbPages <= 0 || allMessagesPage >= allMessagesNbPages - 1;

  return (
    <section className='relative py-32 min-h-screen bg-white content-padding pagination-scroll-to'>
      <div className='relative max-w-screen-content mx-auto'>
        <SectionTitle
          className='mb8'
          sectionTitle='all messages.'
          title='Christ Fellowship Church Messages'
        />

        <div className='mt-10 mb-12'>
          <div className='flex gap-2 md:gap-4 flex-nowrap px-1 pb-4 overflow-x-auto scrollbar-hide'>
            {sermonCategoryFacets.map((item) => {
              const isRefined = selectedCategories.includes(item.value);
              return isRefined ? (
                <div
                  key={item.value}
                  className={selectedPillClass}
                  role='group'
                  aria-label={`Active filter ${item.label}`}
                >
                  <span className='min-w-0 break-words leading-snug'>
                    {item.label}
                  </span>
                  <button
                    type='button'
                    className={cn(removeButtonClass, 'self-start pt-0.5')}
                    aria-label={`Remove filter ${item.label}`}
                    onClick={() => removeCategory(item.value)}
                  >
                    <Icon name='x' className='text-ocean' size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type='button'
                  key={item.value}
                  className={unselectedPillClass}
                  onClick={() => selectCategory(item.value)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading && allMessagesHits.length === 0 && (
          <AllMessagesLoadingSkeleton />
        )}

        <div className='min-h-[320px]'>
          {allMessagesHits.length === 0 && !isLoading ? (
            <p className='text-text-secondary text-center py-8'>
              No messages found. Try adjusting your filters or search.
            </p>
          ) : allMessagesHits.length === 0 && isLoading ? null : (
            <div
              className={cn(
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4 xl:!gap-8 justify-center items-center',
                isLoading && 'opacity-60 pointer-events-none',
              )}
            >
              {allMessagesHits.map((hit) => (
                <MessageHit hit={hit} key={hit.objectID} />
              ))}
            </div>
          )}
        </div>

        {allMessagesNbPages > 1 && (
          <div className='flex items-center justify-start gap-4 mt-16'>
            <PaginationButton
              isDisabled={isFirstPage}
              onClick={() => goToPage(allMessagesPage - 1)}
              href='#'
              className='w-12 h-12'
            >
              <Icon name='chevronLeft' size={24} />
            </PaginationButton>

            <PaginationButton
              isActive
              onClick={() => {}}
              href='#'
              className='w-12 h-12 bg-navy text-white'
            >
              {allMessagesPage + 1}
            </PaginationButton>

            <PaginationButton
              isDisabled={isLastPage}
              onClick={() => goToPage(allMessagesPage + 1)}
              href='#'
              className='w-12 h-12'
            >
              <Icon name='chevronRight' size={24} />
            </PaginationButton>
          </div>
        )}
      </div>
    </section>
  );
}

const MessageHit = ({ hit }: { hit: ContentItemHit }) => {
  const formattedDate = hit.startDateTime
    ? new Date(hit.startDateTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const imageUri = hit.coverImage?.sources?.[0]?.uri ?? '';

  return (
    <ResourceCard
      resource={{
        id: hit.objectID,
        contentChannelId: '63',
        contentType: 'MESSAGES',
        author:
          hit?.author?.firstName && hit?.author?.lastName
            ? `${hit.author.firstName} ${hit.author.lastName}`
            : 'Christ Fellowship Team',
        image: imageUri,
        name: hit.title,
        summary: hit.summary ?? getFirstParagraph(hit.htmlContent || ''),
        pathname: `/messages/${hit.url}`,
        startDate: formattedDate,
      }}
    />
  );
};

interface PaginationButtonProps {
  children: React.ReactNode;
  isDisabled?: boolean;
  isActive?: boolean;
  href: string;
  onClick: () => void;
  className?: string;
}

const PaginationButton = ({
  children,
  isDisabled = false,
  isActive = false,
  href,
  onClick,
  className = '',
}: PaginationButtonProps) => {
  if (isDisabled) {
    return (
      <span
        className={`${className} inline-flex items-center justify-center border-2 border-neutral-200 text-neutral-200 cursor-not-allowed`}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={`${className} inline-flex items-center justify-center border-2 ${
        isActive
          ? 'border-navy bg-navy text-white'
          : 'border-navy text-navy hover:bg-navy hover:text-white'
      } transition-colors duration-200 cursor-pointer`}
    >
      {children}
    </a>
  );
};

const AllMessagesLoadingSkeleton = () => {
  return (
    <div className='flex flex-col gap-8 pt-8'>
      <HubsTagsRefinementLoadingSkeleton />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4 xl:!gap-8 justify-center items-center'>
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className='w-[460px] h-[360px] bg-gray-100 animate-pulse rounded-lg'
          />
        ))}
      </div>
    </div>
  );
};
