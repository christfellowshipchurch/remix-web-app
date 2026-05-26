import { Link } from 'react-router-dom';

import { Button } from '~/primitives/button/button.primitive';
import Icon from '~/primitives/icon';
import HtmlRenderer from '~/primitives/html-renderer';
import { ContentItemHit } from '~/routes/search/types';

export function formatEventCardDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const FeaturedEventCard = ({ card }: { card: ContentItemHit }) => {
  const {
    title,
    coverImage,
    startDateTime,
    locations,
    summary,
    url,
    htmlContent,
  } = card;

  const image = coverImage?.sources[0]?.uri || '';
  const formattedDate = startDateTime ? formatEventCardDate(startDateTime) : '';
  const campus =
    locations && locations.length > 1
      ? 'Multiple Locations'
      : locations?.[0]?.name || 'Christ Fellowship Church';
  const eventPath = `/events/${url}`;
  const cardContent = (showButton: boolean) => (
    <>
      <img
        src={image}
        alt={title}
        className='w-full md:w-1/2 aspect-video md:aspect-auto max-w-[720px] h-full object-cover'
      />

      <div className='flex flex-col justify-center gap-4 bg-white p-5 md:p-12 w-full md:h-[400px] lg:h-[420px] xl:h-[450px]'>
        <div className='flex flex-col gap-4'>
          <ul className='flex gap-4'>
            <li className='flex items-center gap-1'>
              {startDateTime && <Icon name='calendarAlt' color='black' />}
              <p className='text-sm'>{formattedDate}</p>
            </li>

            <li className='flex items-center gap-1'>
              {campus && <Icon name='map' color='black' />}
              <p className='text-sm'>{campus}</p>
            </li>
          </ul>

          <h4 className='font-extrabold text-[28px] leading-tight text-pretty'>
            {title}
          </h4>
          {summary ? (
            <p>{summary}</p>
          ) : (
            <HtmlRenderer
              html={htmlContent || ''}
              className={`line-clamp-5  ${htmlContent ? 'block' : 'hidden'}`}
            />
          )}
        </div>

        {showButton ? (
          <Button intent='secondary' className='font-normal' href={eventPath}>
            Save my spot
          </Button>
        ) : null}
      </div>
    </>
  );

  return (
    <>
      <Link
        to={eventPath}
        className='flex flex-col items-center justify-center size-full overflow-hidden rounded-xl border border-neutral-lighter md:hidden'
        prefetch='intent'
      >
        {cardContent(false)}
      </Link>

      <div className='hidden md:flex md:h-[400px] lg:h-[420px] xl:h-[450px] md:flex-row items-center justify-center size-full overflow-hidden rounded-xl border border-neutral-lighter'>
        {cardContent(true)}
      </div>
    </>
  );
};
