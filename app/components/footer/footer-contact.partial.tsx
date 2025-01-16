import Icon from "~/primitives/icon";

const linkStyle = "text-white hover:text-ocean transition-colors heading-h5";
const SideDivider = () => (
  <div className="hidden lg:block w-[1px] h-18 bg-[#D9D9D9]/30" />
);

export const ContactInfo = () => {
  return (
    <div className="flex flex-col items-center lg:flex-row py-12 lg:gap-6 xl:gap-10">
      {/* Call */}
      <div className="flex items-center w-full pb-6 lg:pb-0 gap-4 lg:justify-start">
        <div className="min-w-12">
          <Icon name="call" size={50} color="#D0D0CE" />
        </div>
        <div className="flex flex-col h-full justify-center">
          <h2 className="text-lg font-medium text-[#D0D0CE]">Call Us</h2>
          <a className={linkStyle} href="tel:5617997600">
            (561) 799-7600
          </a>
        </div>
      </div>
      <SideDivider />
      {/* Email */}
      <div className="flex items-center w-full gap-4 border-y py-6 lg:py-0 lg:border-y-0 border-[#D9D9D9]/30 lg:justify-start">
        <div className="min-w-12">
          <Icon name="envelope" size={50} color="#D0D0CE" />
        </div>
        <div className="flex flex-col h-full justify-center">
          <h2 className="text-lg font-medium text-[#D0D0CE]">Email Us</h2>
          <a
            href="mailto:hello@christfellowship.church"
            className={`${linkStyle} w-full max-w-[324px]`}
          >
            hello@christfellowship.church
          </a>
        </div>
      </div>
      <SideDivider />
      {/* Location */}
      <div className="flex items-center w-full gap-4 pt-6 lg:pt-0 lg:justify-start lg:w-full lg:min-w-[408px]">
        <div className="min-w-12">
          <Icon name="map" size={50} color="#D0D0CE" />
        </div>
        <div className="flex flex-col h-full justify-center">
          <h2 className="text-lg font-medium  text-[#D0D0CE]">Visit Us</h2>
          <a
            target="_blank"
            href="https://goo.gl/maps/Uv6zB3aFzr8pkfzz9"
            className={linkStyle}
          >
            5343 Northlake Blvd <br className="hidden xl:block" /> Palm Beach
            Gardens, FL 33418
          </a>
        </div>
      </div>
    </div>
  );
};
