import { Link } from "react-router-dom";
import { useCallback, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import HTMLRenderer from "~/primitives/html-renderer";

import type { VolunteerMissionDetail } from "../types";
import { volunteerCategoryPillClassName } from "../../volunteer-category-pill";
import {
  MissionDetailRows,
  WhatToKnowBody,
} from "../components/volunteer-single-details.component";

function getLocationPathForClipboard(): string {
  if (typeof window === "undefined") return "";
  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}`;
}

export function useCopyPagePath() {
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

export function VolunteerNav({
  copied,
  onCopyPath,
  onBackToOpportunities,
}: {
  copied: boolean;
  onCopyPath: () => void;
  onBackToOpportunities: () => void;
}) {
  return (
    <header className="hidden shrink-0 border-b border-neutral-lighter bg-white md:block">
      <div className="content-padding mx-auto flex max-w-screen-content items-center justify-end gap-4 py-4 sm:justify-between">
        <button
          type="button"
          onClick={onBackToOpportunities}
          className="hidden cursor-pointer items-center gap-2 text-sm font-semibold text-neutral-darker transition-all duration-300 hover:text-ocean sm:inline-flex"
        >
          <Icon name="chevronLeft" size={20} className="shrink-0" />
          Back to opportunities
        </button>
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

export function Hero({
  title,
  coverImage,
  onBackToOpportunities,
}: {
  title: string;
  coverImage: string | undefined;
  onBackToOpportunities: () => void;
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

        <button
          type="button"
          onClick={onBackToOpportunities}
          className="absolute left-4 top-4 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white text-text-primary shadow-md transition-colors hover:bg-soft-white md:hidden"
          aria-label="Back to opportunities"
        >
          <Icon name="chevronLeft" size={22} />
        </button>
      </div>
    </div>
  );
}

export function Intro({
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

export function About({ aboutBody }: { aboutBody: string }) {
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

export function WhatToKnow({ data }: { data: string }) {
  if (!data.trim()) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-extrabold text-text-primary">What to know</h2>
      <WhatToKnowBody data={data} />
    </section>
  );
}

export function Questions({
  summary,
  contactName,
  contactEmail,
}: {
  summary: string;
  contactName: string | undefined;
  contactEmail: string | undefined;
}) {
  const summaryHtml = summary.trim();
  const name = contactName?.trim();
  const email = contactEmail?.trim();
  const hasContact = Boolean(name || email);

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-extrabold text-text-primary">Questions?</h2>
      {summaryHtml ? (
        <div className="prose prose-neutral prose-a:text-ocean max-w-none text-base leading-relaxed text-text-secondary">
          <HTMLRenderer html={summaryHtml} />
        </div>
      ) : null}

      {hasContact ? (
        <p className="text-base leading-relaxed text-text-secondary">
          Reach out to{" "}
          {name ? (
            <span className="font-semibold text-text-primary">{name}</span>
          ) : (
            <span className="text-text-primary">us</span>
          )}
          {email ? (
            <>
              {" "}
              at{" "}
              <a
                href={`mailto:${email}`}
                className="font-semibold text-ocean underline-offset-2 hover:underline"
              >
                {email}
              </a>
            </>
          ) : null}
          .
        </p>
      ) : !summaryHtml ? (
        <p className="text-base text-text-secondary">
          For questions, visit{" "}
          <Link
            to="/volunteer#community"
            className="font-semibold text-ocean hover:underline"
          >
            Volunteer
          </Link>{" "}
          or contact your campus.
        </p>
      ) : null}
    </section>
  );
}

export function Sidebar({
  mission,
  signupHref,
  copied,
  onCopyPath,
}: {
  mission: VolunteerMissionDetail;
  signupHref: string;
  copied: boolean;
  onCopyPath: () => void;
}) {
  return (
    <aside className="hidden md:block">
      <div className="sticky top-24 space-y-6 rounded-2xl border border-black/6 bg-white p-6 shadow-xs">
        <MissionDetailRows mission={mission} />
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

export function MobileBottomBar({
  copied,
  onCopyPath,
  signupHref,
}: {
  copied: boolean;
  onCopyPath: () => void;
  signupHref: string;
}) {
  /** Portals to `body` so `position: fixed` is not trapped by transform ancestors. */
  const [mountToBody, setMountToBody] = useState(false);

  useLayoutEffect(() => {
    setMountToBody(true);
  }, []);

  /** Keep below site cookie banner (`CookieConsent` uses `z-50`). */
  const bar = (
    <div
      className={cn(
        "w-full fixed inset-x-0 bottom-0 z-30 flex items-stretch gap-3 border-t border-neutral-lighter bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]",
        "md:hidden",
        "pb-[max(1rem,env(safe-area-inset-bottom,0px))]",
      )}
    >
      {copied ? (
        <p
          className="pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-text-primary px-4 py-2 text-sm font-semibold text-white shadow-md"
          role="status"
          aria-live="polite"
        >
          Link copied
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void onCopyPath()}
        className="flex size-12 shrink-0 items-center justify-center rounded-full border-[0.5px] border-black/12 text-neutral-darker"
        aria-label={copied ? "Link copied" : "Share Button"}
      >
        <Icon name="shareAlt" size={22} />
      </button>
      <Button
        intent="primary"
        href={signupHref}
        linkClassName="flex-1 min-w-0"
        className="min-h-12 w-full rounded-full text-base font-bold"
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
