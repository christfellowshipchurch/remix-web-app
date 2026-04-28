<<<<<<< Updated upstream
import { Icon } from "~/primitives/icon/icon";
import { ClassHitType } from "../../types";
import { cn } from "~/lib/utils";

export const UpcomingSessionCard = ({ hit }: { hit: ClassHitType }) => {
  const campusLabel = hit.campus?.trim() ?? "";
  const campusIcon = campusLabel.toLowerCase().includes("online")
    ? "globe"
    : "map";
=======
import { forwardRef } from 'react';

import { Icon } from '~/primitives/icon/icon';
import { ClassHitType } from '../../types';
import { cn } from '~/lib/utils';
import { GroupConnectModal } from '~/components/modals/group-connect/group-connect-modal';
import { ButtonProps } from '~/primitives/button/button.primitive';

const cardShellClassName = cn(
  'mx-auto flex h-full min-h-0 w-full max-w-[360px] flex-1 flex-col rounded-lg',
  'md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px]',
  'transition-transform duration-300 ease-out',
  'hover:-translate-y-1',
);

const UpcomingSessionCardBody = ({ hit }: { hit: ClassHitType }) => {
  const campusLabel = hit.campus?.trim() ?? '';
  const campusIcon = campusLabel.toLowerCase().includes('online')
    ? 'globe'
    : 'map';
>>>>>>> Stashed changes
  const { schedule, startDate, endDate, format, language, classType } = hit;
  const isVirtualFormat = format === 'Virtual';

  const geoMeters = hit._rankingInfo?.geoDistance;
  /** Algolia can send `geoDistance: 0` when `aroundLatLng` is unset; only show miles when geo search is meaningful. */
  const milesFromSearchOrigin =
    geoMeters != null &&
    typeof geoMeters === 'number' &&
    !Number.isNaN(geoMeters) &&
    geoMeters > 0
      ? geoMeters / 1609.34
      : null;

  const footerLabel = isVirtualFormat
    ? 'Online'
    : milesFromSearchOrigin != null
      ? `${milesFromSearchOrigin.toFixed(1)} MILES`
      : format;

  const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
  const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  return (
<<<<<<< Updated upstream
    <div
      className={cn(
        "mx-auto flex h-full min-h-0 w-full max-w-[360px] flex-1 flex-col rounded-lg",
        "md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px]",
        "transition-transform duration-300 ease-out",
        "hover:-translate-y-1",
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white">
        <div className="flex min-h-0 flex-1 flex-col gap-6 px-6 pb-1 pt-5">
          <div className="flex min-h-0 flex-1 flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p className="bg-[#EBEBEB] w-fit flex rounded-sm text-xs font-semibold px-2 py-1">
                {language}
              </p>
              <h3 className="text-lg font-bold leading-6 line-clamp-2">
                {classType}
              </h3>
            </div>

            {/* Meeting Info */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                {/* Campus */}
                <div className="flex items-center gap-2">
                  <Icon name={campusIcon} size={20} color="black" />
                  <p className="text-sm font-semibold">{campusLabel}</p>
                </div>

                {/* Meeting Day - Update */}
                <div className="flex items-center gap-2">
                  <Icon name="calendarAlt" size={20} color="black" />
                  <p className="text-sm font-semibold">
                    {formattedStartDate} - {formattedEndDate}
                  </p>
                </div>

                {/* Meeting Time - Update */}
                <div className="flex items-center gap-2">
                  <Icon name="timeFive" size={20} color="black" />
                  <p className="text-sm font-semibold">{schedule} EST</p>
                </div>
=======
    <div className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white'>
      <div className='flex min-h-0 flex-1 flex-col gap-6 px-6 pb-1 pt-5'>
        <div className='flex min-h-0 flex-1 flex-col gap-5'>
          <div className='flex flex-col gap-2'>
            <p className='bg-[#EBEBEB] w-fit flex rounded-sm text-xs font-semibold px-2 py-1'>
              {language}
            </p>
            <h3 className='text-lg font-bold leading-6 line-clamp-2'>
              {classType}
            </h3>
          </div>

          <div className='flex flex-col gap-6 pb-3'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <Icon name={campusIcon} size={20} color='black' />
                <p className='text-sm font-semibold'>{campusLabel}</p>
              </div>

              <div className='flex items-center gap-2'>
                <Icon name='calendarAlt' size={20} color='black' />
                <p className='text-sm font-semibold'>
                  {formattedStartDate} - {formattedEndDate}
                </p>
              </div>

              <div className='flex items-center gap-2'>
                <Icon name='timeFive' size={20} color='black' />
                <p className='text-sm font-semibold'>{schedule} EST</p>
>>>>>>> Stashed changes
              </div>
            </div>
          </div>
        </div>

<<<<<<< Updated upstream
        <div className="mt-auto flex shrink-0 items-center justify-center gap-1.5 bg-navy py-4.5 text-white">
          <Icon
            name={isVirtualFormat ? "globe" : "locationArrow"}
            size={16}
            className="text-gray"
=======
      <div className='mt-auto flex shrink-0 items-center justify-center gap-1.5 rounded-b-lg bg-navy py-4.5 text-white'>
        <Icon
          name={isVirtualFormat ? 'globe' : 'locationArrow'}
          size={16}
          className='text-gray'
        />
        <p className='text-sm font-semibold text-gray'>{footerLabel}</p>
      </div>
    </div>
  );
};

const FullCardModalTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
  function FullCardModalTrigger({ className, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          cardShellClassName,
          'border-0 bg-transparent p-0 text-left shadow-none',
          'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2',
          className,
        )}
        {...props}
        type='button'
      />
    );
  },
);

export const UpcomingSessionCard = ({ hit }: { hit: ClassHitType }) => {
  const { classType } = hit;

  if (hit.groupId) {
    return (
      <GroupConnectModal
        groupId={String(hit.groupId)}
        campus={hit.campus}
        buttonText='Sign up for this class'
        triggerChildren={<UpcomingSessionCardBody hit={hit} />}
        ModalButton={(props) => (
          <FullCardModalTrigger
            aria-label={`Sign up — ${classType}`}
            {...props}
>>>>>>> Stashed changes
          />
          <p className="text-sm font-semibold text-gray">{footerLabel}</p>
        </div>
      </div>
    </div>
  );
};
