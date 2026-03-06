import { getImageUrl } from "~/lib/utils";

const InternshipsBanner = () => {
  return (
    <img
      className="w-full h-auto md:max-h-[600px] object-cover"
      src={getImageUrl("3141738")}
      alt="Internships Banner"
    />
  );
};

export default InternshipsBanner;
