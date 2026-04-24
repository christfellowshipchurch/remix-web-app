import { useMemo, useEffect, useState, useCallback } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { Configure, Hits, InstantSearch, useHits } from "react-instantsearch";

import { createSearchClient } from "~/lib/create-search-client";
import { Button } from "~/primitives/button/button.primitive";

import type { LoaderReturnType } from "./loader";
import type { VolunteerHitType } from "../types";

import Icon from "~/primitives/icon";
import HTMLRenderer from "~/primitives/html-renderer";
import { cn } from "~/lib/utils";

/** Algolia index for volunteer / mission trips (GUID = `objectID`). */
export const DEV_MISSIONS_INDEX_NAME = "dev_Missions";

function escapeAlgoliaFilterValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export const MissionNotFound = () => (
  <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-6 px-4">
    <h2 className="text-center text-2xl font-bold">Mission not found</h2>
    <p className="max-w-md text-center text-neutral-500">
      We couldn&apos;t find a mission for this link. It may have been removed or
      the address may be incorrect.
    </p>
    <Button intent="primary" href="/volunteer">
      Back to Volunteer
    </Button>
  </div>
);

function MissionHits() {
  const { items } = useHits<VolunteerHitType>();

  if (!items.length) {
    return <MissionNotFound />;
  }

  return <Hits hitComponent={VolunteerSingle} />;
}

export function VolunteerSinglePage() {
  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, groupGuid } =
    useLoaderData<LoaderReturnType>();
  const [isVisible, setIsVisible] = useState(false);

  const searchClient = useMemo(
    () => createSearchClient(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY],
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const objectIdFilter = `groupGuid:"${escapeAlgoliaFilterValue(groupGuid)}"`;

  return (
    <div
      className={`min-h-screen ${
        isVisible ? "animate-fadeIn duration-400" : "opacity-0"
      }`}
    >
      <InstantSearch
        indexName={DEV_MISSIONS_INDEX_NAME}
        searchClient={searchClient}
        key={groupGuid}
      >
        <Configure filters={objectIdFilter} />
        <MissionHits />
      </InstantSearch>
    </div>
  );
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function useSharePage(title: string) {
  const [copied, setCopied] = useState(false);

  const share = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled share or clipboard denied */
    }
  }, [title]);

  return { share, copied };
}

function MissionDetailRows({ hit }: { hit: VolunteerHitType }) {
  const locationLabel =
    str(hit.city) && str(hit.country)
      ? `${hit.city}, ${hit.country}`
      : str(hit.city) || str(hit.country) || "—";
  const dateLabel = str(hit.dateOfTrip) || "—";
  const timeLabel = str(hit.eventTime) || str(hit.timeRange) || "—";

  const rows = [
    { icon: "map" as const, label: locationLabel },
    { icon: "calendar" as const, label: dateLabel },
    { icon: "time" as const, label: timeLabel },
  ];

  return (
    <ul className="flex flex-col gap-4">
      {rows.map((row) => (
        <li key={row.icon} className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 text-ocean">
            <Icon name={row.icon} size={22} className="text-ocean" />
          </span>
          <span className="text-base font-medium leading-snug text-text-primary">
            {row.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

function WhatToKnowSection({ raw }: { raw: string }) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("<")) {
    return (
      <div className="prose prose-neutral prose-ul:my-2 max-w-none text-text-secondary">
        <HTMLRenderer html={trimmed} />
      </div>
    );
  }

  const lines = trimmed
    .split(/\n+/)
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

  if (!lines.length) return null;

  return (
    <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-text-secondary">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

export function VolunteerSingle({ hit }: { hit: VolunteerHitType }) {
  const title = str(hit.title) || str(hit.name) || "Volunteer opportunity";
  const category =
    str(hit.category) || str(hit.groupType) || "Volunteer opportunity";
  const coverImage = str(hit.coverImage) || str(hit.coverImageUrl) || undefined;
  const aboutBody =
    str(hit.about) || str(hit.description) || str(hit.content) || "";
  const whatToKnowRaw = str(hit.whatToKnow) || "";
  const contactName = str(hit.contactName);
  const contactEmail = str(hit.contactEmail);
  const questionsHtml = str(hit.questionsHtml);
  const signupHref =
    str(hit.applyUrl) || str(hit.signupUrl) || "/volunteer-form/welcome";

  const spotsRaw = hit.spotsLeft;
  const spotsLabel =
    spotsRaw !== undefined && spotsRaw !== null && String(spotsRaw).length > 0
      ? `${String(spotsRaw)} spots left`
      : null;

  const { share, copied } = useSharePage(title);

  return (
    <article className="min-h-screen bg-white pb-28 lg:pb-0">
      {/* Top bar — desktop & mobile (no overlay on nav) */}
      <header className="border-b border-neutral-lighter bg-white">
        <div className="content-padding mx-auto flex max-w-screen-content items-center justify-end gap-4 py-4 sm:justify-between">
          <Link
            to="/volunteer"
            className="hidden items-center gap-2 text-sm font-semibold text-text-primary transition-colors hover:text-ocean sm:inline-flex"
          >
            <Icon name="chevronLeft" size={20} className="shrink-0" />
            Back to opportunities
          </Link>
          <button
            type="button"
            onClick={() => void share()}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-lighter bg-white px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-ocean hover:text-ocean"
          >
            <Icon name="share" size={18} className="shrink-0" />
            Share
            {copied ? (
              <span className="text-xs font-normal text-ocean">Copied</span>
            ) : null}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="content-padding mx-auto w-full max-w-screen-content pt-6 lg:pt-8">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-lighter">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="aspect-21/9 max-h-[min(52vh,520px)] w-full object-cover sm:aspect-video lg:aspect-21/9"
            />
          ) : (
            <div className="flex aspect-video min-h-[200px] w-full items-center justify-center bg-neutral-lighter text-text-secondary">
              No image
            </div>
          )}
          {/* Mobile-only back affordance on hero */}
          <Link
            to="/volunteer"
            className="absolute left-4 top-4 flex size-11 items-center justify-center rounded-full bg-white text-text-primary shadow-md transition-colors hover:bg-soft-white lg:hidden"
            aria-label="Back to opportunities"
          >
            <Icon name="chevronLeft" size={22} />
          </Link>
        </div>
      </div>

      <div className="content-padding mx-auto w-full max-w-screen-content py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_min(380px,100%)] lg:items-start lg:gap-14">
          <div className="min-w-0 space-y-8">
            <div className="space-y-3">
              <div className="flex items-baseline justify-between gap-4 lg:justify-start">
                <p className="text-sm font-bold uppercase tracking-wide text-ocean">
                  {category}
                </p>
                {spotsLabel ? (
                  <p className="text-sm font-semibold text-ocean lg:hidden">
                    {spotsLabel}
                  </p>
                ) : null}
              </div>
              <h1 className="text-[28px] font-extrabold leading-tight text-text-primary sm:text-4xl lg:text-[2.5rem]">
                {title}
              </h1>
              {spotsLabel ? (
                <p className="hidden text-sm font-semibold text-ocean lg:block">
                  {spotsLabel}
                </p>
              ) : null}
            </div>

            {/* Mobile: location / date / time in flow */}
            <div className="rounded-xl border border-neutral-lighter bg-soft-white p-5 lg:hidden">
              <MissionDetailRows hit={hit} />
            </div>

            {aboutBody ? (
              <section className="space-y-3">
                <h2 className="text-xl font-extrabold text-text-primary">
                  About this opportunity
                </h2>
                <div className="prose prose-neutral max-w-none text-base leading-relaxed text-text-secondary">
                  <HTMLRenderer html={aboutBody} />
                </div>
              </section>
            ) : null}

            {whatToKnowRaw ? (
              <section className="space-y-3">
                <h2 className="text-xl font-extrabold text-text-primary">
                  What to know
                </h2>
                <WhatToKnowSection raw={whatToKnowRaw} />
              </section>
            ) : null}

            <section className="space-y-3">
              <h2 className="text-xl font-extrabold text-text-primary">
                Questions?
              </h2>
              {questionsHtml ? (
                <div className="prose prose-neutral prose-a:text-ocean max-w-none text-base leading-relaxed text-text-secondary">
                  <HTMLRenderer html={questionsHtml} />
                </div>
              ) : contactName || contactEmail ? (
                <p className="text-base leading-relaxed text-text-secondary">
                  {contactName ? (
                    <>
                      Reach out to{" "}
                      <span className="font-semibold text-text-primary">
                        {contactName}
                      </span>
                    </>
                  ) : (
                    <>Reach out to us</>
                  )}
                  {contactEmail ? (
                    <>
                      {" "}
                      at{" "}
                      <a
                        href={`mailto:${contactEmail}`}
                        className="font-semibold text-ocean underline-offset-2 hover:underline"
                      >
                        {contactEmail}
                      </a>
                    </>
                  ) : null}
                  .
                </p>
              ) : (
                <p className="text-base text-text-secondary">
                  For questions, visit{" "}
                  <Link
                    to="/volunteer"
                    className="font-semibold text-ocean hover:underline"
                  >
                    Volunteer
                  </Link>{" "}
                  or contact your campus.
                </p>
              )}
            </section>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6 rounded-2xl border border-neutral-lighter bg-white p-6 shadow-sm">
              <MissionDetailRows hit={hit} />
              <div className="flex flex-col gap-3">
                <Button intent="primary" href={signupHref} className="w-full">
                  Sign Up
                </Button>
                <Button
                  intent="secondary"
                  className="w-full"
                  type="button"
                  onClick={() => void share()}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Icon name="share" size={18} />
                    Share Link
                  </span>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile-only bottom bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex items-stretch gap-3 border-t border-neutral-lighter bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]",
          "lg:hidden",
          "pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
        )}
      >
        <button
          type="button"
          onClick={() => void share()}
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-ocean text-ocean transition-colors hover:bg-ocean/10"
          aria-label="Share"
        >
          <Icon name="share" size={22} />
        </button>
        <Button
          intent="primary"
          href={signupHref}
          className="min-h-12 flex-1 rounded-xl text-base font-bold"
        >
          Sign Up
        </Button>
      </div>
    </article>
  );
}
