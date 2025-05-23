import { VirtualTour } from "../components/virtual-tour.component";

interface CampusInfoProps {
  campusName: string;
  campusImage: string;
  digitalTourVideo: string;
  campusLocation: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    postalCode: string;
  };
  campusInstagram: string;
  campusPastor: {
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
}
export const CampusInfo = ({
  campusName,
  campusImage,
  digitalTourVideo,
  campusPastor,
  campusLocation,
  campusInstagram,
}: CampusInfoProps) => {
  return (
    <div className="w-full content-padding">
      <div className="w-full mx-auto max-w-screen-content flex flex-col lg:flex-row gap-8 lg:gap-0 lg:justify-between pt-16 pb-32">
        {/* Location Info */}
        <div className="flex-1"></div>

        {/* Tour */}
        <div className="flex-1 pt-16">
          {/* TODO: Get address and wistiaId from Algolia */}
          <VirtualTour
            wistiaId={digitalTourVideo}
            address={`${campusLocation.street1} ${campusLocation.street2}, ${campusLocation.city}, ${campusLocation.state} ${campusLocation.postalCode}`}
          />
        </div>
      </div>
    </div>
  );
};
