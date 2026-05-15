import {
  useLoaderData,
  useSearchParams,
  useLocation,
  useNavigation,
} from 'react-router-dom';
import { useMemo } from 'react';

import { ContentItemHit } from '~/routes/search/types';
import { Icon } from '~/primitives/icon/icon';
import { cn } from '~/lib/utils';
import { ArticleCard } from '../components/article-card.component';
import { useScrollToSearchResultsOnLoad } from '~/hooks/use-scroll-to-search-results-on-load';

import { AllArticlesReturnType } from '../loader';
import { ALL_ARTICLES_CATEGORY_FACET } from '../all-articles-page';
import {
  parseAllArticlesUrlState,
  allArticlesUrlStateToParams,
} from '../all-articles-url-state';

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

/** See .github/ALGOLIA-URL-STATE-REUSABILITY.md — URL-driven finder (Algolia only in loader). */
export function AllArticles() {
  const {
    initialArticleHits,
    articleCategoryFacets,
    articlesNbPages,
    articlesPage,
  } = useLoaderData<AllArticlesReturnType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigation = useNavigation();

  const urlState = useMemo(
    () => parseAllArticlesUrlState(searchParams),
    [searchParams],
  );

  const isLoading =
    navigation.state === 'loading' &&
    navigation.location?.pathname === location.pathname;

  useScrollToSearchResultsOnLoad(searchParams, (params) => {
    const s = parseAllArticlesUrlState(params);
    return !!(
      (s.query?.trim?.()?.length ?? 0) > 0 ||
      (s.refinementList && Object.keys(s.refinementList).length > 0)
    );
  });

  const selectedCategories =
    urlState.refinementList?.[ALL_ARTICLES_CATEGORY_FACET] ?? [];

  const applyUrlState = (next: ReturnType<typeof parseAllArticlesUrlState>) => {
    setSearchParams(allArticlesUrlStateToParams(next), {
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
        [ALL_ARTICLES_CATEGORY_FACET]: [value],
      },
    });
  };

  const removeCategory = (value: string) => {
    const rl = {
      ...(urlState.refinementList as Record<string, string[]> | undefined),
    };
    const current = rl[ALL_ARTICLES_CATEGORY_FACET] ?? [];
    const next = current.filter((v) => v !== value);
    if (next.length === 0) {
      delete rl[ALL_ARTICLES_CATEGORY_FACET];
    } else {
      rl[ALL_ARTICLES_CATEGORY_FACET] = next;
    }
    const refinementList = Object.keys(rl).length > 0 ? rl : undefined;
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

  const isFirstPage = articlesPage <= 0;
  const isLastPage =
    articlesNbPages <= 0 || articlesPage >= articlesNbPages - 1;

  return (
    <section className='relative pb-28 pt-8 md:pt-16 min-h-screen bg-white content-padding pagination-scroll-to'>
      <div className='relative max-w-screen-content mx-auto'>
        <div className='mb-4'>
          <div className='flex gap-2 md:gap-4 flex-nowrap px-1 pb-4 overflow-x-auto scrollbar-hide'>
            {articleCategoryFacets.map((item) => {
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

        {isLoading && initialArticleHits.length === 0 && (
          <AllArticlesLoadingSkeleton />
        )}

        <div className='min-h-[320px]'>
          {initialArticleHits.length === 0 && !isLoading ? (
            <p className='text-text-secondary text-center py-8'>
              No articles found. Try adjusting your filters or search.
            </p>
          ) : initialArticleHits.length === 0 && isLoading ? null : (
            <div
              className={cn(
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4 xl:gap-8! justify-center items-center',
                isLoading && 'opacity-60 pointer-events-none',
              )}
            >
              {initialArticleHits.map((hit) => (
                <ArticleHit hit={hit} key={hit.objectID} />
              ))}
            </div>
          )}
        </div>

        {articlesNbPages > 1 && (
          <div className='flex items-center justify-start gap-4 mt-16'>
            <PaginationButton
              isDisabled={isFirstPage}
              onClick={() => goToPage(articlesPage - 1)}
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
              {articlesPage + 1}
            </PaginationButton>

            <PaginationButton
              isDisabled={isLastPage}
              onClick={() => goToPage(articlesPage + 1)}
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

const ArticleHit = ({ hit }: { hit: ContentItemHit }) => {
  return <ArticleCard article={hit} />;
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

const AllArticlesLoadingSkeleton = () => {
  return (
    <div className='flex flex-col gap-8 pt-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4 xl:gap-8! justify-center items-center'>
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
