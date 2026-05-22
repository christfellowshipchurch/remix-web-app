import { Link } from 'react-router-dom';
import { Icon } from '~/primitives/icon/icon';
import { weekdaySpanishTranslation } from '../util';

export type WeeklyMinistryService = {
  ministryType?: string;
  minstryType?: string;
  daysOfWeek?: string;
  dayOfWeek?: string;
  times?: string;
  serviceTimes?: string;
  learnMoreLink?: string;
  learnMoreUrl?: string;
  planAVisit?: boolean;
  planMyvisit?: string;
};

type WeeklyMinistryServiceDisplay = {
  ministryType: string;
  dayOfWeek: string;
  serviceTimes: string;
  learnMoreUrl: string;
};

function normalizeWeeklyMinistryService(
  service: WeeklyMinistryService,
): WeeklyMinistryServiceDisplay | null {
  const ministryType = (service.ministryType ?? service.minstryType ?? '').trim();
  const dayOfWeek = (service.daysOfWeek ?? service.dayOfWeek ?? '').trim();
  const serviceTimes = (service.times ?? service.serviceTimes ?? '').trim();
  const learnMoreUrl = (
    service.learnMoreLink ??
    service.learnMoreUrl ??
    ''
  ).trim();

  if (!ministryType || !dayOfWeek || !serviceTimes) {
    return null;
  }

  return {
    ministryType,
    dayOfWeek,
    serviceTimes,
    learnMoreUrl,
  };
}

export const DuringTheWeek = ({
  weeklyMinistryServices,
  isSpanish,
}: {
  weeklyMinistryServices: WeeklyMinistryService[];
  isSpanish?: boolean;
}) => {
  const displayServices = (weeklyMinistryServices ?? [])
    .map(normalizeWeeklyMinistryService)
    .filter((service): service is WeeklyMinistryServiceDisplay =>
      Boolean(service),
    );

  const byDay = displayServices.reduce(
    (acc, item) => {
      const day = item.dayOfWeek;
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    },
    {} as Record<string, WeeklyMinistryServiceDisplay[]>,
  );
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const orderedDays = dayOrder.filter((day) => byDay[day]?.length);

  return (
    <div className='flex w-full flex-col gap-3 rounded-2xl border border-neutral-lighter px-6 py-4 md:mx-auto md:max-w-xl md:px-8 lg:mx-0 lg:max-w-full'>
      <h3 className='text-lg font-semibold lg:text-[16px]'>
        {isSpanish ? 'Durante la semana' : 'During the Week'}
      </h3>
      <div className='flex flex-col gap-4 md:flex-row md:gap-1 md:justify-between lg:gap-2'>
        {orderedDays.map((day) => (
          <div key={day} className='flex flex-col gap-2'>
            <h4 className='font-semibold lg:text-xs'>
              {isSpanish ? weekdaySpanishTranslation(day) : day}
            </h4>
            <div className='flex flex-col md:gap-2'>
              {byDay[day].map((ministry, i) => (
                <p
                  key={i}
                  className='font-medium text-neutral-default md:max-w-[260px] lg:max-w-[180px] lg:text-xs'
                >
                  {ministry.serviceTimes} | {ministry.ministryType}{' '}
                  {ministry.learnMoreUrl ? (
                    <Link
                      to={ministry.learnMoreUrl}
                      className='inline align-middle'
                      aria-label={`${ministry.ministryType} Link`}
                    >
                      <Icon
                        name='linkExternal'
                        size={16}
                        className='mb-[3px] inline-block align-middle text-ocean'
                      />
                    </Link>
                  ) : null}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
