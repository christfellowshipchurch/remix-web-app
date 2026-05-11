/**
 * We will plan to rework this component once we have a way to fetch the related messages.
 */

import { Button } from '~/primitives/button/button.primitive';
import { useLoaderData } from 'react-router-dom';
import { SectionTitle } from '~/components';
import { useMemo } from 'react';
import { createSearchClient } from '~/lib/create-search-client';
import { allMessagesUrlStateToParams } from '../../all-messages/all-messages-url-state';
import { LoaderReturnType } from '../loader';
import { RelatedMessagesCarousel } from '../components/messages-carousel.component';
import { Configure, InstantSearch } from 'react-instantsearch';
import { HitsWrapper } from '~/components/hits-wrapper';

export const RelatedMessages = () => {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, message } =
    useLoaderData<LoaderReturnType>();
  const searchClient = useMemo(
    () =>
      createSearchClient(ALGOLIA_APP_ID || '', ALGOLIA_SEARCH_API_KEY || ''),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY],
  );

  const topic = message.primaryCategories[0]?.value?.trim();
  const viewAllMessagesHref = useMemo(() => {
    if (!topic) {
      return '/messages';
    }
    const params = allMessagesUrlStateToParams({
      refinementList: { sermonPrimaryCategories: [topic] },
    });
    const qs = params.toString();
    return qs ? `/messages?${qs}` : '/messages';
  }, [topic]);

  // Create filter for the primary category and sermon type
  // If primary category exists, filter by it; otherwise show all sermons (Recent)
  const categoryFilter = message.primaryCategories[0]?.value
    ? `contentType:"Sermon" AND sermonPrimaryCategories:"${message.primaryCategories[0]?.value}" AND NOT title:"${message.title}" AND NOT seriesName:"${message.seriesTitle}"`
    : `contentType:"Sermon" AND NOT title:"${message.title}" AND NOT seriesName:"${message.seriesTitle}"`;

  return (
    <InstantSearch
      indexName='dev_contentItems'
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure filters={categoryFilter} hitsPerPage={10} />

      <HitsWrapper>
        <div className='bg-white w-full flex justify-center content-padding'>
          <div className='flex w-full  flex-col items-center py-12 md:py-24 max-w-screen-content'>
            {/* Header */}
            <div className='flex w-full flex-row items-end justify-between gap-4'>
              <div className='flex min-w-0 flex-1 flex-col gap-6 md:gap-8'>
                <SectionTitle sectionTitle='related messages.' />
                <h2 className='text-text font-extrabold text-[28px] lg:text-[32px] leading-tight'>
                  Other Messages On This Topic
                </h2>
              </div>
              <div className='hidden md:flex shrink-0 items-end text-lg font-semibold'>
                <Button
                  href={viewAllMessagesHref}
                  size='md'
                  className='rounded-none'
                  intent='primary'
                >
                  View All
                </Button>
              </div>
            </div>

            <RelatedMessagesCarousel />

            <div className='flex md:hidden pt-16 shrink-0 w-full text-lg font-semibold'>
              <Button
                href={viewAllMessagesHref}
                size='md'
                className='rounded-sm'
                intent='secondary'
              >
                View All
              </Button>
            </div>
          </div>
        </div>
      </HitsWrapper>
    </InstantSearch>
  );
};
