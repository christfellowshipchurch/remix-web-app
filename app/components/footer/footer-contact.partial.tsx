import Icon from "~/primitives/icon";

const linkStyle = "text-white hover:text-ocean transition-colors heading-h5";

export const ContactInfo = () => {
  return (
    <div className="flex flex-col items-center lg:items-start lg:flex-row py-12">
      {/* Call */}
      <div className="flex justify-center items-center w-full pb-6 lg:pb-0 gap-4 lg:pr-6 lg:justify-start  xl:pr-16">
        <div className="min-w-12">
          <Icon name="call" size={50} color="white" />
        </div>
        <div className="flex flex-col h-full justify-center">
          <h2 className="text-lg text-[#D0D0CE]">Call Us</h2>
          <a className={linkStyle} href="tel:5617997600">
            (561) 799-7600
          </a>
        </div>
      </div>

      {/* Email */}
      <div className="flex justify-center items-center w-full gap-4 border-y py-6 lg:py-0 lg:px-6 lg:border-y-0 lg:border-x border-[#D9D9D9]lg:justify-start xl:px-16">
        <div className="min-w-12">
          <Icon name="envelope" size={50} color="white" />
        </div>
        <div className="flex flex-col h-full justify-center">
          <h2 className="text-lg text-[#D0D0CE]">Need Support</h2>
          <a
            href="mailto:hello@christfellowship.church"
            className={`${linkStyle} w-[324px]`}
          >
            hello@christfellowship.church
          </a>
        </div>
      </div>

      {/* Location */}
      <div className="flex justify-center items-center w-full gap-4 pt-6 lg:pt-0 lg:pl-6 lg:justify-start xl:pl-16">
        <div className="min-w-12">
          <Icon name="world" size={50} color="white" />
        </div>
        <div className="flex flex-col h-full justify-center">
          <h2 className="text-lg text-[#D0D0CE]">Main Campus Office</h2>
          <a
            target="_blank"
            href="https://goo.gl/maps/Uv6zB3aFzr8pkfzz9"
            className={`${linkStyle} max-w-xxs lg:max-w-full`}
          >
            5343 Northlake Blvd <br className="hidden xl:block" /> Palm Beach
            Gardens, FL 33418
          </a>
        </div>
      </div>
    </div>
  );
};
