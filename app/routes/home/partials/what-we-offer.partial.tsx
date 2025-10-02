import { useState } from "react";
import { WhatWeOfferMobile } from "../components/we-offer-tabs/mobile.component";
import { WhatWeOfferDesktop } from "../components/we-offer-tabs/desktop.component";

const backgroundImages = {
  family: "/assets/images/home/sfe-bg.jpg",
  "young-adults": "/assets/images/home/young-adults-bg.jpg",
  everyone: "/assets/images/home/everyone-bg.jpg",
};

export function WhatWeOfferSection() {
  const [activeTab, setActiveTab] =
    useState<keyof typeof backgroundImages>("family");

  const handleTabChange = (tabValue: string) => {
    if (tabValue in backgroundImages) {
      setActiveTab(tabValue as keyof typeof backgroundImages);
    }
  };

  return (
    <section
      className="md:px-12 lg:px-18 w-full py-24 md:pt-38 md:pb-23 bg-navy"
      style={{
        backgroundImage: `url('${backgroundImages[activeTab]}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-image 0.3s ease-in-out",
      }}
    >
      <div className="max-w-screen-content mx-auto flex flex-col items-center gap-12">
        <div className="md:hidden">
          <WhatWeOfferMobile onTabChange={handleTabChange} />
        </div>
        <div className="hidden md:block">
          <WhatWeOfferDesktop onTabChange={handleTabChange} />
        </div>
      </div>
    </section>
  );
}
