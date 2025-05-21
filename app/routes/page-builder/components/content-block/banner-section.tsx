import { FC } from "react";
import { ContentBlockData } from "../../types";

// Banner Layout
export const BannerSection: FC<{ data: ContentBlockData }> = ({ data }) => (
  <section aria-label={data.name}>
    {data.coverImage && (
      <img
        src={data.coverImage}
        alt={data.name}
        className="w-full aspect-square sm:aspect-video lg:aspect-[16/7] xl:aspect-[16/6] object-cover"
      />
    )}
  </section>
);
