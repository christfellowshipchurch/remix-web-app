import { useLocation } from 'react-router-dom';
import {
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import capitalize from 'lodash/capitalize';

import Dropdown, {
  type DropdownOption,
} from '~/primitives/inputs/dropdown/dropdown.primitive';
import { Icon } from '~/primitives/icon/icon';
import { RockCampuses } from '~/lib/rock-config';
import { cn } from '~/lib/utils';
import { MinistryService } from '../../page-builder/types';
import { ministryTypeRules } from '../utils';
import { ServiceCard } from './service-card.component';
import { MobileScrollLock } from './mobile-scroll-lock.component';

interface MinistryServiceTimesProps {
  services?: MinistryService[];
}

const DRAG_THRESHOLD_PX = 40;

export const MinistryServiceTimes = ({
  services = [],
}: MinistryServiceTimesProps) => {
  const { pathname } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const dragStartYRef = useRef<number | null>(null);

  const pathnameTitle = pathname
    .split('/')[2]
    .split('-')
    .map((word: string) => (word !== 'and' ? capitalize(word) : word))
    .join(' ');

  const relevantServices = useMemo(() => {
    const pathSegment = pathname.split('/')[2]?.toLowerCase() || '';
    const relatedMinistryTypes = ministryTypeRules[pathSegment];
    if (!relatedMinistryTypes) return [];
    return services.filter((service) =>
      relatedMinistryTypes.includes(service.ministryType),
    );
  }, [services, pathname]);

  const uniqueLocations = useMemo(() => {
    const locationSet = new Set<string>();
    relevantServices.forEach((service) => {
      locationSet.add(service?.location?.name ?? '');
    });
    return Array.from(locationSet).sort();
  }, [relevantServices]);

  const locationOptions: DropdownOption[] = useMemo(() => {
    const options: DropdownOption[] = [];
    RockCampuses.forEach((campus) => {
      if (uniqueLocations.includes(campus.name)) {
        options.push({ value: campus.name, label: campus.name });
      }
    });
    return options;
  }, [uniqueLocations]);

  const filteredServices = useMemo(() => {
    if (!selectedLocation) return [];
    return relevantServices.filter(
      (service) => service?.location?.name === selectedLocation,
    );
  }, [relevantServices, selectedLocation]);

  if (relevantServices.length === 0) return null;

  const barSubtitleDefault = 'Choose a location and see times';

  const handleGripPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragStartYRef.current = e.clientY;
  };

  const handleGripPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const startY = dragStartYRef.current;
    dragStartYRef.current = null;
    if (startY === null) return;
    const delta = e.clientY - startY;
    if (delta < -DRAG_THRESHOLD_PX) setIsExpanded(true);
    else if (delta > DRAG_THRESHOLD_PX) setIsExpanded(false);
  };

  const handleGripPointerCancel = () => {
    dragStartYRef.current = null;
  };

  return (
    <MobileScrollLock active={isExpanded}>
      <div
        className={cn(
          'bottom-0 bg-transparent',
          isExpanded
            ? 'fixed inset-x-0 z-50 md:sticky md:inset-x-auto md:z-10'
            : 'sticky z-10',
        )}
      >
        <div
          className={cn(
            'overflow-hidden rounded-t-2xl border-t-2 border-[#e1e6ec] bg-white',
            'shadow-[0_-12px_32px_-8px_rgba(0,80,120,0.18),0_-4px_12px_-4px_rgba(0,0,0,0.08)]',
            'md:shadow-[0_-20px_40px_-10px_rgba(0,80,120,0.25),0_-6px_16px_-6px_rgba(0,0,0,0.1)]',
          )}
        >
          <div
            className='flex touch-none cursor-grab select-none items-center justify-center py-2.5 active:cursor-grabbing md:hidden md:pointer-events-none'
            onPointerDown={handleGripPointerDown}
            onPointerUp={handleGripPointerUp}
            onPointerCancel={handleGripPointerCancel}
            aria-label={
              isExpanded
                ? 'Drag down to close service times'
                : 'Drag up to open service times'
            }
          >
            <span
              className='h-1 w-10 shrink-0 rounded-full bg-[#cfd4dc]'
              aria-hidden
            />
          </div>

          <button
            type='button'
            onClick={() => setIsExpanded((open) => !open)}
            className={cn(
              'flex w-full shrink-0 cursor-pointer items-center gap-4 px-5 transition-colors',
              'pt-2 pb-5 md:justify-between md:pt-5',
              'md:min-h-[72px] md:items-center md:justify-center',
              'hover:bg-neutral-50/80',
              isExpanded ? 'border-b border-[#E1E6EC]' : '',
            )}
            aria-expanded={isExpanded}
            aria-label='Toggle Service Times section'
          >
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6f4f9]'>
              <Icon name='calendarAlt' className='text-navy' size={18} />
            </div>
            <div className='min-w-0 flex-1 text-left md:flex-initial'>
              <p className='text-base font-extrabold leading-tight text-[#1a2733]'>
                {pathnameTitle} Service Times
              </p>
              {selectedLocation ? (
                <p className='mt-0.5 w-full min-w-0 truncate text-[13px] font-medium leading-snug text-[#6b7480]'>
                  <span>{selectedLocation}</span>
                  <span className='inline-flex items-center gap-1 align-middle ml-1'>
                    <span
                      className='size-[3px] shrink-0 rounded-full bg-[#6b7480]'
                      aria-hidden
                    />
                    Tap to view times
                  </span>
                </p>
              ) : (
                <p className='mt-0.5 text-[13px] font-medium leading-snug text-[#6b7480]'>
                  {barSubtitleDefault}
                </p>
              )}
            </div>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-ocean'>
              <Icon
                name='chevronUp'
                className={cn(
                  'text-white transition-transform duration-300',
                  isExpanded && 'rotate-180',
                )}
                size={20}
              />
            </div>
          </button>

          {isExpanded ? (
            <div
              className={cn(
                'animate-in fade-in flex flex-col gap-5 duration-300',
                'bg-[#f7f9fc]',
                'px-5 pt-4 pb-6 md:px-5 md:pt-6 md:pb-8',
                'max-md:max-h-[min(75dvh,calc(100dvh-11rem))] max-md:overflow-y-auto max-md:overscroll-contain',
              )}
            >
              <div className='mx-auto flex w-full flex-col items-stretch gap-3 md:max-w-[298px] md:flex-row md:items-center md:justify-center md:gap-4'>
                <span className='shrink-0 text-[13px] font-semibold text-[#1a2733]'>
                  Location
                </span>
                <div
                  className={cn(
                    'w-full min-w-0',
                    selectedLocation &&
                      'md:w-[231px] md:max-w-[231px] md:shrink-0',
                  )}
                >
                  <Dropdown
                    className='w-full'
                    options={locationOptions}
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    placeholder='Choose a location'
                    triggerIcon='mapFilled'
                    triggerIconClassName='text-ocean'
                    triggerClassName={cn(
                      'h-[43px] rounded-[10px] border-[#dfe4eb] py-[11px] pl-[13px] pr-[13px] shadow-none',
                      'text-sm hover:border-[#dfe4eb]',
                      selectedLocation
                        ? 'font-semibold text-[#1a2733]'
                        : 'font-normal text-[#9aa3ad]',
                    )}
                    chevronColor='text-neutral-500'
                    menuClassName='z-[10000]'
                  />
                </div>
              </div>

              {!selectedLocation ? (
                <div className='mx-auto w-full md:max-w-[298px]'>
                  <div className='mx-auto flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-[#cdd6df] bg-white px-6 pb-8 pt-7'>
                    <div className='flex size-12 items-center justify-center rounded-full bg-[#e6f4f9]'>
                      <Icon name='mapFilled' className='text-ocean' size={20} />
                    </div>
                    <p className='text-center text-[15px] font-semibold leading-snug text-[#1a2733]'>
                      Pick a location to get started
                    </p>
                    <p className='text-center text-[13px] font-normal leading-normal text-[#6b7480]'>
                      {`Service times, info, and signups vary by campus. Choose yours above to see what's coming up.`}
                    </p>
                  </div>
                </div>
              ) : filteredServices.length > 0 ? (
                <div className='mx-auto grid w-full max-w-[680px] grid-cols-1 items-stretch gap-5 md:grid-cols-2 md:justify-items-center md:gap-5'>
                  {filteredServices.map((service, i) => (
                    <div
                      key={service.id ?? i}
                      className='flex h-full min-h-0 w-full flex-col'
                    >
                      <ServiceCard
                        service={service}
                        onLinkClick={() => setIsExpanded(false)}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </MobileScrollLock>
  );
};
