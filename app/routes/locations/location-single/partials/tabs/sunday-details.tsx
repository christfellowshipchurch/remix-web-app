import { CampusAmenities } from '../../components/tabs-component/sunday-details/campus-ammenities';
import { WhatToExpect } from '../../components/tabs-component/sunday-details/what-to-expect';
import { GetInvolved } from '../../components/tabs-component/sunday-details/get-involved';

export const SundayDetails = ({
  setReminderVideo,
  isOnline,
  isSpanish,
}: {
  setReminderVideo?: string;
  isOnline?: boolean;
  isSpanish?: boolean;
}) => {
  return (
    <div className='flex flex-col w-full'>
      <WhatToExpect
        setReminderVideo={setReminderVideo}
        isOnline={isOnline}
        isSpanish={isSpanish}
      />

      {!isOnline && <CampusAmenities isSpanish={isSpanish} />}

      <GetInvolved isOnline={isOnline || false} isSpanish={isSpanish} />
    </div>
  );
};
