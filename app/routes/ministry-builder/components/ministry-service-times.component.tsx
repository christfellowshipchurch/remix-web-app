import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import capitalize from 'lodash/capitalize';

import {
  DraggableMobileSheet,
  DraggableMobileSheetHandle,
} from '~/components/draggable-mobile-sheet';
import Dropdown, {
  type DropdownOption,
} from '~/primitives/inputs/dropdown/dropdown.primitive';
import { Icon } from '~/primitives/icon/icon';
import { RockCampuses } from '~/lib/rock-config';
import { cn } from '~/lib/utils';
import { MinistryService } from '../../page-builder/types';
import { ministryTypeRules } from '../utils';
import { ServiceCard } from './service-card.component';

interface MinistryServiceTimesProps {
  services?: MinistryService[];
}

/** Matches Tailwind `md` breakpoint — drag sheet only on narrow viewports. */
const MOBILE_DRAG_MEDIA = '(max-width: 767px)';

/**
 * Main Ministry Service Times Component
 */
export const MinistryServiceTimes = ({
  services = [],
}: MinistryServiceTimesProps) => {
  const { pathname } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [mobileNarrow, setMobileNarrow] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const pathnameTitle = pathname
    .split('/')[2]
    .split('-')
    .map((word: string) => (word !== 'and' ? capitalize(word) : word))
    .join(' ');

  const relevantServices = useMemo(() => {
    const pathSegment = pathname.split('/')[2]?.toLowerCase() || '';
    const relatedMinistryTypes = ministryTypeRules[pathSegment];
    if (!relatedMinistryTypes) {
      return [];
    }
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
        options.push({
          value: campus.name,
          label: campus.name,
        });
      }
    });
    return options;
  }, [uniqueLocations]);

  const filteredServices = useMemo(() => {
    if (!selectedLocation) {
      return [];
    }
    return relevantServices.filter(
      (service) => service?.location?.name === selectedLocation,
    );
  }, [relevantServices, selectedLocation]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(MOBILE_DRAG_MEDIA);
    const sync = () => setMobileNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isExpanded) return;

    const handleMouseDownOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDownOutside);
    return () =>
      document.removeEventListener('mousedown', handleMouseDownOutside);
  }, [isExpanded]);

  // Same pattern as `MobileFilterBottomSheet`: portal + `body { position: fixed }` locks scroll
  // without breaking UI (in-document `sticky` + overflow lock clips the bar).
  useEffect(() => {
    if (!mobileNarrow || !isExpanded) return;

    const scrollY = window.scrollY;
    const prevBody = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.position = prevBody.position;
      document.body.style.top = prevBody.top;
      document.body.style.left = prevBody.left;
      document.body.style.right = prevBody.right;
      document.body.style.width = prevBody.width;
      document.body.style.overflow = prevBody.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [mobileNarrow, isExpanded]);

  useEffect(() => {
    if (!mobileNarrow || !isExpanded) return;
    const onKey = (e: { key: string }) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileNarrow, isExpanded]);

  if (relevantServices.length === 0) {
    return null;
  }

  const barSubtitleDefault = 'Choose a location and see times';

  const portalOpen = mobileNarrow && isExpanded;

  const renderDraggableSheet = (sheetVariant: 'inline' | 'portal') => (
    <DraggableMobileSheet
      enabled={mobileNarrow && isExpanded}
      onDismiss={() => setIsExpanded(false)}
      className={cn(
        'overflow-hidden rounded-t-2xl border-t-2 border-[#e1e6ec] bg-white',
        'shadow-[0_-12px_32px_-8px_rgba(0,80,120,0.18),0_-4px_12px_-4px_rgba(0,0,0,0.08)]',
        'md:shadow-[0_-20px_40px_-10px_rgba(0,80,120,0.25),0_-6px_16px_-6px_rgba(0,0,0,0.1)]',
        sheetVariant === 'portal' &&
          'flex max-h-[min(88dvh,900px)] w-full max-w-full flex-col',
      )}
    >
      <DraggableMobileSheetHandle
        className={cn(
          'flex items-center justify-center py-2.5 md:hidden',
          mobileNarrow && isExpanded
            ? 'touch-none cursor-grab select-none active:cursor-grabbing'
            : 'pointer-events-none',
        )}
        aria-label='Drag down to close service times'
      >
        <span
          className='h-1 w-10 shrink-0 rounded-full bg-[#cfd4dc]'
          aria-hidden
        />
      </DraggableMobileSheetHandle>

      <button
        type='button'
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex w-full shrink-0 cursor-pointer items-center gap-4 px-5 transition-colors',
          'md:justify-between pt-2 md:pt-5 pb-5',
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
            sheetVariant === 'portal'
              ? 'min-h-0 flex-1 overflow-y-auto overscroll-contain'
              : 'max-md:min-h-0 max-md:max-h-[min(75dvh,calc(100dvh-11rem))] max-md:overflow-y-auto max-md:overscroll-contain',
          )}
        >
          <div
            className={cn(
              'mx-auto flex w-full md:max-w-[298px] flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-center md:gap-4',
            )}
          >
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
    </DraggableMobileSheet>
  );

  return (
    <>
      {portalOpen ? (
        <div
          aria-hidden
          className='sticky bottom-0 z-0 block min-h-[96px] md:hidden'
        />
      ) : null}
      {!portalOpen ? (
        <div ref={panelRef} className='sticky bottom-0 z-10 bg-transparent'>
          {renderDraggableSheet('inline')}
        </div>
      ) : null}
      {portalOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              className='pointer-events-none fixed inset-0 z-500 box-border flex max-h-[100dvh] flex-col justify-end overflow-x-hidden overscroll-contain'
              style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '100%',
                height: '100%',
                maxHeight: '100dvh',
                overscrollBehavior: 'contain',
              }}
              role='presentation'
              data-ministry-service-times-portal
            >
              <button
                type='button'
                className='pointer-events-auto absolute inset-0 z-0 cursor-default bg-black/30'
                onClick={() => setIsExpanded(false)}
                aria-label='Close service times'
              />
              <div className='relative z-10 flex w-full min-w-0 max-w-full justify-center pointer-events-none'>
                <div
                  ref={panelRef}
                  className='pointer-events-auto w-full min-w-0 max-w-full'
                  role='dialog'
                  aria-modal='true'
                  aria-label={`${pathnameTitle} service times`}
                >
                  {renderDraggableSheet('portal')}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};
