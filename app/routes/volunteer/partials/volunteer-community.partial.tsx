import { SectionTitle } from "~/components/section-title";
import {
  RegionCard,
  RegionCardWrapper,
} from "../components/cards/region-card.component";
import { CommunityCard } from "../components/cards/community-card.component";
import { useLoaderData } from "react-router-dom";
import { LoaderReturnType } from "../loader";
import { CardCarousel } from "~/components/resource-carousel";
import { Icon } from "~/primitives/icon/icon";

export function VolunteerCommunity() {
  const { mockCommunityData, mockRegionData } =
    useLoaderData<LoaderReturnType>();

  return (
    <section id="community" className="w-full bg-gray py-28">
      <div className="max-w-screen-content mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-8 content-padding 2xl:px-0">
            <SectionTitle sectionTitle="missions: local" />
            <h2 className="text-[40px] md:text-[52px] font-extrabold mt-6 leading-tight">
              Volunteer In Our Community
            </h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pl-5 md:pl-12 lg:pl-18 2xl:pl-0">
            {mockCommunityData.map((card, index) => (
              <CommunityCard key={index} {...card} />
            ))}
          </div>
        </div>

        {/* Meet The Needs In Our Region */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-neutral-darker content-padding 2xl:px-0">
            <h3 className="text-[28px] md:text-[32px] leading-tight md:leading-normal font-extrabold">
              Meet The Needs In Our Region
            </h3>
            <div className="relative w-full md:w-80">
              <select className="border border-neutral-light rounded-lg px-3 py-2 w-full appearance-none bg-white text-lg text-neutral-default focus:outline-none">
                <option value="">Filter by location</option>
                <option value="all">All Locations</option>
                <option value="north">North Region</option>
                <option value="south">South Region</option>
                <option value="east">East Region</option>
                <option value="west">West Region</option>
              </select>
              <Icon
                name="chevronDown"
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-navy"
                size={27}
              />
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden lg:flex gap-6 overflow-x-auto pl-5 md:pl-12 lg:pl-18 2xl:pl-0">
            {mockRegionData.map((card, index) => (
              <RegionCard key={index} {...card} />
            ))}
          </div>

          {/* Mobile */}
          <div className="w-full lg:hidden content-padding 2xl:px-0">
            <CardCarousel
              layout="arrowsLeft"
              CardComponent={RegionCardWrapper}
              resources={mockRegionData.map((card) => ({
                id: "",
                contentChannelId: "",
                contentType: "PAGE_BUILDER" as const,
                name: card.title,
                summary: card.description,
                image: card.image,
                pathname: card.href,
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
