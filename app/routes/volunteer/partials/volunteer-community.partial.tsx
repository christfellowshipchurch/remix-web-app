import { useState } from "react";
import { useLoaderData } from "react-router-dom";

import { SectionTitle } from "~/components/section-title";
import { cn } from "~/lib/utils";
import { VolunteerMissionsAlgolia } from "../components/volunteer-missions-algolia.component";
import { VolunteerMissionsSkeleton } from "../components/volunteer-missions-skeleton.component";
import { LoaderReturnType } from "../loader";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export function VolunteerCommunity() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();
  const [missionsUiReady, setMissionsUiReady] = useState(false);

  return (
    <section id="community" className="w-full bg-white md:bg-gray py-28">
      <div className="flex flex-col gap-4">
        <div className="content-padding">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
            <SectionTitle sectionTitle="Needs in our region" />
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"></div>
            <h2 className="text-[40px] font-extrabold leading-tight text-text-primary md:text-[52px]">
              Volunteer In Our Community
            </h2>
          </div>
        </div>

        <div
          className="relative min-h-[min(580px,85vh)] bg-gray"
          aria-busy={missionsUiReady ? undefined : true}
        >
          <div
            className={cn(
              !missionsUiReady && "pointer-events-none select-none opacity-0",
            )}
          >
            <VolunteerMissionsAlgolia
              appId={ALGOLIA_APP_ID}
              apiKey={ALGOLIA_SEARCH_API_KEY}
              onMissionsUiReady={() => setMissionsUiReady(true)}
            />
          </div>
          {!missionsUiReady ? <VolunteerMissionsSkeleton /> : null}
        </div>

        <div className="content-padding">
          <div className="max-w-[1280px] mx-auto mt-16 flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            <p className="md:text-lg font-semibold text-neutral-dark">
              Not finding an opportunity? Share your skills with us, and
              we&apos;ll get in touch.
            </p>
            <IconButton
              to="/volunteer-form"
              withRotatingArrow={true}
              iconName="arrowRight"
              iconSize={24}
              className="rounded-full border-neutral-darker px-6 text-neutral-darker hover:text-white! hover:bg-navy! hover:border-navy!"
              iconClasses="text-white -rotate-45! group-hover:rotate-0!"
            >
              <span className="flex items-center gap-3">Share Your Skills</span>
            </IconButton>
          </div>
        </div>
      </div>
    </section>
  );
}
