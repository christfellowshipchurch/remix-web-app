import { useMemo } from 'react';
import type React from 'react';

import { cn } from '~/lib/utils';
import {
  CLASS_SINGLE_CAROUSEL_MOBILE_PEEK_CONTENT_GAP_CLASS,
  CLASS_SINGLE_CAROUSEL_MOBILE_PEEK_ITEM_CLASS,
  classSingleCarouselSlideGridColsClass,
  useClassSingleCarouselLayoutMode,
} from '../hooks/use-class-single-carousel-cards-per-slide';
import { Button } from '~/primitives/shadcn-primitives/button';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  useCarousel,
} from '~/primitives/shadcn-primitives/carousel';
import Icon from '~/primitives/icon';
import { UpcomingSessionCard } from './upcoming-session-card.component';
import { ClassHitType } from '../../types';

function UpcomingCarouselNavRow() {
  const { api, scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();
  const slideCount = api?.scrollSnapList().length ?? 0;
  if (slideCount <= 1) return null;

  return (
    <div className='mt-6 flex w-full flex-row items-center justify-between gap-4 px-1'>
      <CarouselDots
        className='justify-start gap-2'
        activeClassName='h-2 w-2 bg-ocean'
        inactiveClassName='h-2 w-2 bg-neutral-lighter'
      />
      <div className='flex shrink-0 items-center gap-2 pr-5 md:pr-12 lg:pr-0'>
        <Button
          type='button'
          variant='outline'
          size='icon'
          disabled={!canScrollPrev}
          className={cn(
            'size-12 rounded-full border-ocean text-ocean',
            'hover:border-navy hover:text-navy',
            'disabled:border-[#AAAAAA] disabled:text-[#AAAAAA]',
          )}
          aria-label='Previous slide'
          onClick={scrollPrev}
        >
          <Icon name='arrowBack' className='size-6' />
        </Button>
        <Button
          type='button'
          variant='outline'
          size='icon'
          disabled={!canScrollNext}
          className={cn(
            'size-12 rounded-full border-ocean text-ocean',
            'hover:border-navy hover:text-navy',
            'disabled:border-[#AAAAAA] disabled:text-[#AAAAAA]',
          )}
          aria-label='Next slide'
          onClick={scrollNext}
        >
          <Icon name='arrowRight' className='size-6' />
        </Button>
      </div>
    </div>
  );
}

const DESKTOP_CAROUSEL_CHUNK = 4;

export function UpcomingSessionsCarousel({
  hits,
  resetKey,
  extraCard,
}: {
  hits: ClassHitType[];
  resetKey: string;
  extraCard?: React.ReactNode;
}) {
  const layoutMode = useClassSingleCarouselLayoutMode();
  const isDesktopChunkGrid = layoutMode === 'chunk';

  const slides = useMemo(() => {
    const out: ClassHitType[][] = [];
    for (let i = 0; i < hits.length; i += DESKTOP_CAROUSEL_CHUNK) {
      out.push(hits.slice(i, i + DESKTOP_CAROUSEL_CHUNK));
    }
    return out;
  }, [hits]);

  if (hits.length === 0) {
    return null;
  }

  return (
    <Carousel
      key={`${resetKey}-${layoutMode}`}
      opts={{ align: 'start', containScroll: 'trimSnaps' }}
      className='w-full max-w-[1296px]'
    >
      <CarouselContent
        className={cn(
          'ml-0 py-3',
          isDesktopChunkGrid ? 'gap-6 xl:gap-8' : null,
          !isDesktopChunkGrid
            ? CLASS_SINGLE_CAROUSEL_MOBILE_PEEK_CONTENT_GAP_CLASS
            : null,
        )}
      >
        {!isDesktopChunkGrid ? (
          <>
            {hits.map((hit, idx) => (
              <CarouselItem
                key={hit.objectID ?? idx}
                className={CLASS_SINGLE_CAROUSEL_MOBILE_PEEK_ITEM_CLASS}
              >
                <div className='flex h-full min-h-0 w-full min-w-0 max-w-full justify-center'>
                  <UpcomingSessionCard hit={hit} />
                </div>
              </CarouselItem>
            ))}
            {extraCard && (
              <CarouselItem
                className={CLASS_SINGLE_CAROUSEL_MOBILE_PEEK_ITEM_CLASS}
              >
                <div className='flex h-full min-h-0 w-full min-w-0 max-w-full justify-center'>
                  {extraCard}
                </div>
              </CarouselItem>
            )}
          </>
        ) : (
          <>
            {slides.map((chunk, slideIndex) => {
              const isLastSlide = slideIndex === slides.length - 1;
              const showExtraInSlide =
                isLastSlide &&
                extraCard &&
                chunk.length < DESKTOP_CAROUSEL_CHUNK;
              return (
                <CarouselItem key={slideIndex} className='basis-full pl-0'>
                  <div
                    className={cn(
                      'grid w-full auto-rows-fr items-stretch gap-x-4 gap-y-6 xl:gap-x-8',
                      classSingleCarouselSlideGridColsClass(
                        DESKTOP_CAROUSEL_CHUNK,
                      ),
                    )}
                  >
                    {chunk.map((hit, idx) => (
                      <div
                        key={idx}
                        className='flex h-full min-h-0 w-full justify-center sm:justify-start'
                      >
                        <UpcomingSessionCard hit={hit} />
                      </div>
                    ))}
                    {showExtraInSlide && extraCard}
                  </div>
                </CarouselItem>
              );
            })}
            {extraCard &&
              slides.length > 0 &&
              slides[slides.length - 1].length === DESKTOP_CAROUSEL_CHUNK && (
                <CarouselItem className='basis-full pl-0'>
                  <div
                    className={cn(
                      'grid w-full auto-rows-fr items-stretch gap-x-4 gap-y-6 xl:gap-x-8',
                      classSingleCarouselSlideGridColsClass(
                        DESKTOP_CAROUSEL_CHUNK,
                      ),
                    )}
                  >
                    {extraCard}
                  </div>
                </CarouselItem>
              )}
          </>
        )}
      </CarouselContent>
      <UpcomingCarouselNavRow />
    </Carousel>
  );
}
