import { CampusAmenities } from '../../components/tabs-component/sunday-details/campus-ammenities';
import { WhatToExpect } from '../../components/tabs-component/sunday-details/what-to-expect';
import { GetInvolved } from '../../components/tabs-component/sunday-details/get-involved';

export const SundayDetails = ({
  setReminderVideo,
  isOnline,
  isSpanish,
  campusUrl,
}: {
  setReminderVideo?: string;
  isOnline?: boolean;
  isSpanish?: boolean;
  campusUrl?: string;
}) => {
  return (
    <div className='flex flex-col w-full'>
      <WhatToExpect
        setReminderVideo={setReminderVideo}
        isOnline={isOnline}
        isSpanish={isSpanish}
        campusUrl={campusUrl}
      />

      {!isOnline && <CampusAmenities isSpanish={isSpanish} />}

      <GetInvolved isOnline={isOnline || false} isSpanish={isSpanish} />
    </div>
  );
};
