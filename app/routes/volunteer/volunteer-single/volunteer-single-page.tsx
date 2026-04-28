import { useLoaderData, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import type { LoaderReturnType } from "./loader";
import {
  clearVolunteerFinderBackPayload,
  readVolunteerFinderBackPayload,
} from "./components/volunteer-finder-return-href";

import {
  About,
  Hero,
  Intro,
  MobileBottomBar,
  Questions,
  Sidebar,
  useCopyPagePath,
  VolunteerNav,
  WhatToKnow,
} from "./partials/volunteer-single-partials.partial";
import {
  MissionDetailRows,
  str,
} from "./components/volunteer-single-details.component";
import { VolunteerMissionSpotsAlgoliaProvider } from "./components/volunteer-spots-algolia.component";

export function VolunteerSinglePage() {
  const { mission, groupGuid, ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } =
    useLoaderData<LoaderReturnType>();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  /** Session payload from finder card click; `navigate(-1)` restores `/volunteer?…` when filters exist. */
  const onBackToOpportunities = useCallback(() => {
    const payload = readVolunteerFinderBackPayload(groupGuid);
    try {
      if (!payload) {
        navigate("/volunteer#community");
        return;
      }
      if (payload.volunteerListSearch.trim().length > 1) {
        navigate(-1);
        return;
      }
      navigate("/volunteer#community");
    } finally {
      clearVolunteerFinderBackPayload();
    }
  }, [navigate, groupGuid]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const title = str(mission.title) || "Volunteer opportunity";
  const category = str(mission.category) || "Volunteer opportunity";
  const coverImage = str(mission.coverImageUrl) || undefined;
  const aboutBody = str(mission.summary) || "";
  const signupHref = str(mission.missionsUrl) || "/volunteer-form/welcome";
  const contactName = str(mission.contactName);
  const contactEmail = str(mission.contactEmail);

  const spotsRaw = mission.spotsLeftDisplay;
  const spotsLabel =
    spotsRaw !== undefined && spotsRaw !== null && String(spotsRaw).length > 0
      ? `${String(spotsRaw)} spots left`
      : null;

  const { copyPath, copied } = useCopyPagePath();

  return (
    <div
      className={`min-h-screen ${
        isVisible ? "animate-fadeIn duration-400" : "opacity-0"
      }`}
    >
      <article className="min-h-screen bg-white md:pb-24 flex flex-col">
        <VolunteerNav
          copied={copied}
          onCopyPath={copyPath}
          onBackToOpportunities={onBackToOpportunities}
        />
        <Hero
          title={title}
          coverImage={coverImage}
          onBackToOpportunities={onBackToOpportunities}
        />

        <div className="shrink-0 content-padding mx-auto w-full max-w-screen-content py-8 pb-0 md:py-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_min(380px,100%)] md:items-start md:gap-14">
            <div className="min-w-0 space-y-8">
              <VolunteerMissionSpotsAlgoliaProvider
                appId={ALGOLIA_APP_ID}
                searchApiKey={ALGOLIA_SEARCH_API_KEY}
                groupGuid={groupGuid}
                rockFallback={spotsLabel}
              >
                {(resolvedSpots) => (
                  <Intro
                    category={category}
                    title={title}
                    spotsLabel={resolvedSpots}
                  />
                )}
              </VolunteerMissionSpotsAlgoliaProvider>

              {/* Mobile-only mission details */}
              <div className="md:hidden pb-4">
                <MissionDetailRows mission={mission} />
              </div>

              {/* Desktop-only content */}
              <div className="hidden flex-col gap-10 md:flex">
                <About aboutBody={aboutBody} />
                <WhatToKnow data={mission.whatToKnow} />
                <Questions
                  summary={mission.summary}
                  contactName={contactName}
                  contactEmail={contactEmail}
                />
              </div>
            </div>

            <Sidebar
              mission={mission}
              signupHref={signupHref}
              copied={copied}
              onCopyPath={copyPath}
            />
          </div>
        </div>

        {/* Mobile-only content */}
        <div className="flex min-h-0 w-full flex-1 flex-col bg-gray pt-12 pb-24 content-padding md:hidden">
          <div className="mx-auto flex w-full max-w-screen-content flex-col gap-10">
            <About aboutBody={aboutBody} />
            <WhatToKnow data={mission.whatToKnow} />
            <Questions
              summary={mission.summary}
              contactName={contactName}
              contactEmail={contactEmail}
            />
          </div>
        </div>

        <MobileBottomBar
          copied={copied}
          onCopyPath={copyPath}
          signupHref={signupHref}
        />
      </article>
    </div>
  );
}
