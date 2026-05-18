import type { ReactNode } from 'react';
import { ResourceCard } from '~/primitives/cards/resource-card';
import {
  Carousel,
  CarouselArrows,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from '~/primitives/shadcn-primitives/carousel';
import { ContentItemHit } from '~/routes/search/types';
import {
  FeaturedEventCard,
  formatEventCardDate,
} from '../components/featured-card.component';

export function FeaturedEventsSectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className='w-full py-28 content-padding bg-gray'>
      <div className='flex min-h-88 flex-col max-w-screen-content mx-auto md:min-h-112'>
        {children}
      </div>
    </div>
  );
}

/** Featured block from loader data (no InstantSearch). */
export function FeaturedEventsFromHits({ hits }: { hits: ContentItemHit[] }) {
  const firstHit = hits[0];
  const remainingHits = hits.slice(1);

  if (!firstHit) {
    return null;
  }

  return (
    <>
      <FeaturedEventCard card={firstHit} />

      <div className='hidden mt-16 lg:mt-24 md:grid grid-cols-2 lg:grid-cols-3 gap-4 place-items-center md:place-items-start'>
        {remainingHits.map((hit) => (
          <OtherFeatureEventCardHit hit={hit} key={hit.objectID} />
        ))}
      </div>

      {remainingHits.length > 0 && (
        <div className='-ml-5 md:ml-0 mt-12 md:hidden'>
          <Carousel
            opts={{
              align: 'start',
            }}
            className='w-full'
          >
            <CarouselContent className='py-2 gap-4'>
              {remainingHits.map((hit, index) => (
                <CarouselItem
                  key={hit.objectID}
                  className='w-full basis-[360px] pl-0'
                  style={{
                    marginLeft: index === 0 ? '20px' : '0px',
                    marginRight:
                      index === remainingHits.length - 1 ? '20px' : '0px',
                  }}
                >
                  <OtherFeatureEventCardHit hit={hit} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className='w-full relative mt-4 pb-4'>
              <div className='absolute h-12 top-7 left-5'>
                <CarouselDots
                  activeClassName='bg-ocean'
                  inactiveClassName='bg-neutral-lighter'
                />
              </div>

              <div className='absolute h-12 right-44 lg:right-44 2xl:right-36 3xl:right-28'>
                <CarouselArrows />
              </div>
            </div>
          </Carousel>
        </div>
      )}
    </>
  );
}

const OtherFeatureEventCardHit = ({ hit }: { hit: ContentItemHit }) => {
  const formattedDate = formatEventCardDate(hit.startDateTime);

  return (
    <ResourceCard
      className='min-w-[360px] w-[360px] md:w-full md:min-w-0'
      resource={{
        id: hit.objectID,
        contentChannelId: '78', // EVENT type from builder-utils.ts
        contentType: 'EVENTS',
        name: hit.title,
        summary: hit.summary || '',
        image: hit.coverImage.sources[0].uri,
        pathname: `/events/${hit.url}`,
        startDate: formattedDate,
        location:
          hit.locations && hit.locations.length > 1
            ? 'Multiple Locations'
            : hit.locations?.[0]?.name || 'Christ Fellowship Church',
      }}
    />
  );
};
