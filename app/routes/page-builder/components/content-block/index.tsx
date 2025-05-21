import { FC } from "react";
import { ContentBlockData } from "../../types";
import { FeatureSection } from "./feature-section";
import { BannerSection } from "./banner-section";
import { CtaCardSection } from "./cta-card-section";
import { CtaFullscreenSection } from "./cta-fullscreen-section";

// Main ContentBlock Component
export const ContentBlock: FC<{ data: ContentBlockData }> = ({ data }) => {
  switch (data.layoutType) {
    case "FEATURE":
      return <FeatureSection data={data} />;
    case "BANNER":
      return <BannerSection data={data} />;
    case "CARD":
      return <CtaCardSection data={data} />;
    case "FULLSCREEN":
      return <CtaFullscreenSection data={data} />;
    default:
      return null;
  }
};
