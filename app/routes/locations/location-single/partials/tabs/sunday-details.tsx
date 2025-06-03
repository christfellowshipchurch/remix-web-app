import { CampusAmenities } from "../../components/tabs-component/sunday-details/campus-ammenities";
import { GetInvolved } from "../../components/tabs-component/sunday-details/get-involved";
import { WhatToExpect } from "../../components/tabs-component/sunday-details/what-to-expect";

export const SundayDetails = ({
  setReminderVideo,
  isOnline,
}: {
  setReminderVideo: string;
  isOnline?: boolean;
}) => {
  return (
    <div className="flex flex-col w-full">
      <WhatToExpect setReminderVideo={setReminderVideo} isOnline={isOnline} />
      {!isOnline && <CampusAmenities />}
      <GetInvolved isOnline={isOnline} />
    </div>
  );
};
