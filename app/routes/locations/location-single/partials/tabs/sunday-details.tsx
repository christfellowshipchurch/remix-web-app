import { CampusAmenities } from "../../components/tabs-component/sunday-details/campus-ammenities";
import { GetInvolved } from "../../components/tabs-component/sunday-details/get-involved";

export const SundayDetails = ({ isOnline }: { isOnline?: boolean }) => {
  return (
    <div className="flex flex-col w-full">
      {!isOnline && <CampusAmenities />}
      <GetInvolved isOnline={isOnline || false} />
    </div>
  );
};
