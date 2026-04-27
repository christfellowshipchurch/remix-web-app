import { Link } from "react-router-dom";
import { useCallback, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import HTMLRenderer from "~/primitives/html-renderer";

import type { Volunteer } from "../../types";
import { volunteerCategoryPillClassName } from "../../volunteer-category-pill";
import {
  MissionDetailRows,
  str,
  WhatToKnowBody,
} from "../components/volunteer-single-details.component";

function getLocationPathForClipboard(): string {
  if (typeof window === "undefined") return "";
  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}`;
}

function useCopyPagePath() {
  const [copied, setCopied] = useState(false);

  const copyPath = useCallback(async () => {
    const text = getLocationPathForClipboard();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard denied */
    }
  }, []);

  return { copyPath, copied };
}

function VolunteerNav({
  copied,
  onCopyPath,
}: {
  copied: boolean;
  onCopyPath: () => void;
}) {
  return (
    <header className="hidden shrink-0 border-b border-neutral-lighter bg-white md:block">
      <div className="content-padding mx-auto flex max-w-screen-content items-center justify-end gap-4 py-4 sm:justify-between">
        <Link
          to="/volunteer"
          className="hidden items-center gap-2 text-sm font-semibold text-neutral-darker transition-all duration-300 hover:text-ocean sm:inline-flex"
        >
          <Icon name="chevronLeft" size={20} className="shrink-0" />
          Back to opportunities
        </Link>
        <button
          type="button"
          onClick={() => void onCopyPath()}
          className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-4 py-2 text-sm font-semibold text-neutral-darker shadow-sm transition-all duration-300 hover:border-ocean hover:text-ocean"
        >
          <Icon name="shareAlt" size={18} className="shrink-0" />
          <span className={cn(copied && "text-ocean")}>
            {copied ? "Path copied" : "Share"}
          </span>
        </button>
      </div>
    </header>
  );
}

function Hero({
  title,
  coverImage,
}: {
  title: string;
  coverImage: string | undefined;
}) {
  return (
    <div className="w-full shrink-0">
      <div className="relative overflow-hidden bg-neutral-lighter">
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

        <Link
          to="/volunteer"
          className="absolute left-4 top-4 flex size-11 items-center justify-center rounded-full bg-white text-text-primary shadow-md transition-colors hover:bg-soft-white md:hidden"
          aria-label="Back to opportunities"
        >
          <Icon name="chevronLeft" size={22} />
        </Link>
      </div>
    </div>
  );
}

function Intro({
  category,
  title,
  spotsLabel,
}: {
  category: string;
  title: string;
  spotsLabel: string | null;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-start">
        <span
          className={cn(
            volunteerCategoryPillClassName(category),
            "lg:text-[13px] font-semibold",
          )}
        >
          {category}
        </span>
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
  );
}

function About({ aboutBody }: { aboutBody: string }) {
  const trimmed = aboutBody.trim();
  if (!trimmed) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-extrabold text-text-primary">
        About this opportunity
      </h2>
      <div className="prose prose-neutral max-w-none text-base leading-relaxed text-text-secondary">
        <HTMLRenderer html={trimmed} />
      </div>
    </section>
  );
}

function WhatToKnow({ raw }: { raw: string }) {
  if (!raw.trim()) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-extrabold text-text-primary">What to know</h2>
      <WhatToKnowBody raw={raw} />
    </section>
  );
}

function Questions({
  summary,
  contactName,
  contactEmail,
}: {
  summary: string;
  contactName: string | undefined;
  contactEmail: string | undefined;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-extrabold text-text-primary">Questions?</h2>
      {summary ? (
        <div className="prose prose-neutral prose-a:text-ocean max-w-none text-base leading-relaxed text-text-secondary">
          <HTMLRenderer html={summary} />
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
  );
}

function Sidebar({
  hit,
  signupHref,
  copied,
  onCopyPath,
}: {
  hit: Volunteer;
  signupHref: string;
  copied: boolean;
  onCopyPath: () => void;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-6 rounded-2xl border border-neutral-lighter bg-white p-6 shadow-sm">
        <MissionDetailRows hit={hit} />
        <div className="h-px w-full bg-[#E5E7EB]" />
        <div className="flex flex-col gap-3">
          <Button
            intent="primary"
            href={signupHref}
            className="w-full rounded-full"
          >
            Sign Up
          </Button>
          <Button
            intent="secondary"
            className="w-full rounded-full border-black/12 hover:border-ocean! text-neutral-darker hover:text-white!"
            type="button"
            onClick={() => void onCopyPath()}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Icon name="shareAlt" size={18} />
              {copied ? "Link copied" : "Share Link"}
            </span>
          </Button>
        </div>
      </div>
    </aside>
  );
}

function MobileBottomBar({
  copied,
  onCopyPath,
  signupHref,
}: {
  copied: boolean;
  onCopyPath: () => void;
  signupHref: string;
}) {
  /** Portals to `body` so `position: fixed` is not trapped by InstantSearch / transform ancestors. */
  const [mountToBody, setMountToBody] = useState(false);

  useLayoutEffect(() => {
    setMountToBody(true);
  }, []);

  const bar = (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-200 flex items-stretch gap-3 border-t border-neutral-lighter bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]",
        "md:hidden",
        "pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
      )}
    >
      {copied ? (
        <p
          className="pointer-events-none fixed bottom-24 left-1/2 z-210 -translate-x-1/2 rounded-full bg-text-primary px-4 py-2 text-sm font-semibold text-white shadow-md"
          role="status"
          aria-live="polite"
        >
          Link copied
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void onCopyPath()}
        className="flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-ocean text-ocean transition-colors hover:bg-ocean/10"
        aria-label={copied ? "Link copied" : "Share Button"}
      >
        <Icon name="shareAlt" size={22} />
      </button>
      <Button
        intent="primary"
        href={signupHref}
        className="min-h-12 flex-1 rounded-xl text-base font-bold"
      >
        Sign Up
      </Button>
    </div>
  );

  if (typeof document === "undefined") {
    return bar;
  }

  return mountToBody ? createPortal(bar, document.body) : bar;
}

export function VolunteerSingle({ hit }: { hit: Volunteer }) {
  const title = str(hit.title) || "Volunteer opportunity";
  const category = str(hit.category) || "Volunteer opportunity";
  const coverImage = str(hit.coverImage?.sources[0]?.uri) || undefined;
  const aboutBody = str(hit.summary) || "";
  const signupHref = str(hit.missionsUrl) || "/volunteer-form/welcome";
  const contactName = str(hit.contactName);
  const contactEmail = str(hit.contactEmail);

  const spotsRaw = hit.spotsLeft;
  const spotsLabel =
    spotsRaw !== undefined && spotsRaw !== null && String(spotsRaw).length > 0
      ? `${String(spotsRaw)} spots left`
      : null;

  const { copyPath, copied } = useCopyPagePath();

  return (
    <article className="min-h-screen bg-white md:pb-24 flex flex-col">
      <VolunteerNav copied={copied} onCopyPath={copyPath} />
      <Hero title={title} coverImage={coverImage} />

      <div className="shrink-0 content-padding mx-auto w-full max-w-screen-content py-8 pb-0 md:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_min(380px,100%)] lg:items-start lg:gap-14">
          <div className="min-w-0 space-y-8">
            <Intro category={category} title={title} spotsLabel={spotsLabel} />

            {/* Mobile-only mission details */}
            <div className="md:hidden pb-4">
              <MissionDetailRows hit={hit} />
            </div>

            <div className="hidden lg:block">
              <About aboutBody={aboutBody} />
              <WhatToKnow raw={hit.summary} />
              <Questions
                summary={hit.summary}
                contactName={contactName}
                contactEmail={contactEmail}
              />
            </div>
          </div>

          <Sidebar
            hit={hit}
            signupHref={signupHref}
            copied={copied}
            onCopyPath={copyPath}
          />
        </div>
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col bg-gray py-8 content-padding md:hidden">
        <div className="mx-auto w-full max-w-screen-content">
          <About aboutBody={aboutBody} />
          <WhatToKnow raw={hit.summary} />
          <Questions
            summary={hit.summary}
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
  );
}
