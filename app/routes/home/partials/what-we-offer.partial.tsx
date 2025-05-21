import { WhatWeOfferMobile } from "../components/we-offer-tabs/mobile.component";
import { WhatWeOfferDesktop } from "../components/we-offer-tabs/desktop.component";

export function WhatWeOfferSection() {
  return (
    <section
      className="md:px-12 lg:px-18 w-full py-24 md:pt-38 md:pb-23 bg-navy"
      style={{
        backgroundImage: `url('/assets/images/home/sfe-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-screen-content mx-auto flex flex-col items-center gap-12">
        <div className="md:hidden">
          <WhatWeOfferMobile />
        </div>
        <div className="hidden md:block">
          <WhatWeOfferDesktop />
        </div>
      </div>
    </section>
  );
}
