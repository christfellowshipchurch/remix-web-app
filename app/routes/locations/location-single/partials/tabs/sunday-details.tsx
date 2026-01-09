import { CampusAmenities } from "../../components/tabs-component/sunday-details/campus-ammenities";
import { GetInvolved } from "../../components/tabs-component/sunday-details/get-involved";

export const SundayDetails = ({
  isOnline,
  isSpanish,
}: {
  isOnline?: boolean;
  isSpanish?: boolean;
}) => {
  return (
    <div className="flex flex-col w-full">
      {!isOnline && <CampusAmenities isSpanish={isSpanish} />}
      <GetInvolved isOnline={isOnline || false} isSpanish={isSpanish} />
    </div>
  );
};
