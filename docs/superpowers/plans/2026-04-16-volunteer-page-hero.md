# Volunteer Page Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing `<DynamicHero>` on the Volunteer page with a new, custom two-column hero matching the Figma redesign (side-by-side on desktop, stacked on mobile).

**Architecture:** Add a new self-contained partial `VolunteerHero` at `app/routes/volunteer/partials/volunteer-hero.partial.tsx` that follows the same pattern as the other `volunteer-*.partial.tsx` files in this folder (no props, hardcoded copy/links). Replace the `DynamicHero` call site in `app/routes/volunteer/route.tsx`. The shared `DynamicHero` component is **not** modified; nine other routes still depend on it.

**Tech Stack:** React 18, React Router v7 (Remix), TypeScript, Tailwind CSS v4, existing primitives: `Button` (`~/primitives/button/button.primitive`), `Icon` (`~/primitives/icon`).

**Spec:** `docs/superpowers/specs/2026-04-16-volunteer-page-hero-design.md`

---

## File Structure

- **Create:** `app/routes/volunteer/partials/volunteer-hero.partial.tsx` — new hero partial (self-contained, no props)
- **Modify:** `app/routes/volunteer/route.tsx` — swap `<DynamicHero>` block for `<VolunteerHero />`, remove now-unused import

No other files touched.

---

## Task 1: Create the `VolunteerHero` partial

**Files:**
- Create: `app/routes/volunteer/partials/volunteer-hero.partial.tsx`

**Reference:** The existing sibling files `app/routes/volunteer/partials/volunteer-church.partial.tsx` and `app/routes/volunteer/partials/volunteer-community.partial.tsx` show the conventions used here: export a named component, no props, import utilities from `~/lib/utils` / primitives from `~/primitives/*`.

**Primitive contracts (already verified in-repo):**

- `Button` from `~/primitives/button/button.primitive` accepts `intent: "primary" | "secondary" | "white" | "secondaryWhite"`, `size: "sm" | "md" | "lg"` (default `lg`), `href?: string` (renders a `<Link>` wrapper), `className?: string`, and `children`.
- `Icon` from `~/primitives/icon` accepts `name: keyof typeof icons`, `size?: number` (default 24), `className?: string`. Available icons used below: `"arrowRight"`, `"heart"`.

- [ ] **Step 1: Create the file with the full implementation**

Create `app/routes/volunteer/partials/volunteer-hero.partial.tsx` with this exact content:

```tsx
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";

export const VolunteerHero = () => {
  return (
    <section
      aria-label="Volunteer Hero"
      className="bg-[#F1F4F5] w-full"
    >
      <div
        className={
          "max-w-screen-content mx-auto " +
          "px-5 md:px-12 lg:px-18 py-12 lg:py-24 " +
          "flex flex-col-reverse gap-10 " +
          "lg:grid lg:grid-cols-2 lg:items-center lg:gap-16"
        }
      >
        {/* TEXT COLUMN */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <h1 className="font-extrabold heading-h1 text-[3rem] md:text-[4rem] lg:text-[5.5rem] leading-[1.05] text-navy">
            Find Your Place
            <br />
            <span className="text-[#0092BC]">to Volunteer</span>
          </h1>

          <p className="text-navy/80 text-lg lg:text-xl max-w-[520px]">
            We want every volunteer&apos;s experience at Church to be a
            fulfilling journey where they feel welcomed and can share the love
            of Jesus. Our hope is that every volunteer understands the impact
            they have, knowing they are making a difference in the lives of
            others.
          </p>

          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <Button
              intent="primary"
              href="#TBD"
              className="w-full md:w-auto min-w-[240px] gap-2"
            >
              Find Your Fit
              <Icon name="arrowRight" size={18} className="text-white" />
            </Button>

            <Button
              intent="secondary"
              href="#volunteer-at-church"
              className="w-full md:w-auto min-w-[240px]"
            >
              <span className="lg:hidden">Browse All</span>
              <span className="hidden lg:inline">Browse All Opportunities</span>
            </Button>
          </div>
        </div>

        {/* IMAGE COLUMN */}
        <div className="relative">
          {/* Soft blue glow — desktop only */}
          <div
            aria-hidden
            className="hidden lg:block absolute -inset-6 -z-10 bg-[#0092BC]/15 blur-3xl rounded-full"
          />

          <img
            src="/assets/images/volunteer/hero.webp"
            alt="A volunteer smiling while serving food at a community event"
            fetchPriority="high"
            decoding="async"
            className="w-full h-auto rounded-xl object-cover lg:rotate-[-3deg] lg:shadow-2xl"
          />

          {/* Stat badge — desktop only */}
          <div className="hidden lg:flex absolute bottom-6 -left-6 items-center gap-3 bg-white rounded-xl shadow-lg px-5 py-3">
            <div className="size-10 rounded-full bg-[#0092BC]/10 flex items-center justify-center">
              <Icon name="heart" size={20} className="text-[#0092BC]" />
            </div>
            <div>
              <div className="font-bold text-navy text-xl leading-none">
                695k+
              </div>
              <div className="text-xs uppercase tracking-wider text-navy/60 mt-1">
                Lives Impacted
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exits with code 0, no errors mentioning `volunteer-hero.partial.tsx`.

- [ ] **Step 3: Lint the new file**

Run: `npx eslint app/routes/volunteer/partials/volunteer-hero.partial.tsx`
Expected: exits cleanly with no errors.

- [ ] **Step 4: Commit**

```bash
git add app/routes/volunteer/partials/volunteer-hero.partial.tsx
git commit -m "feat(volunteer): add VolunteerHero partial"
```

---

## Task 2: Wire the new partial into the volunteer route

**Files:**
- Modify: `app/routes/volunteer/route.tsx`

**Current contents of `app/routes/volunteer/route.tsx`** (for reference — lines 1–42):

```tsx
import { DynamicHero } from "~/components";

import { VolunteerAtChurch } from "./partials/volunteer-church.partial";
import { VolunteerWhere } from "./partials/volunteer-where.partial";
import { VolunteerCommunity } from "./partials/volunteer-community.partial";
import { VolunteerGlobe } from "./partials/volunteer-globe.partial";
import { OnboardingProcess } from "./partials/volunteer-onboarding.partial";
import { VolunteerStats } from "./partials/volunteer-stats.partial";
import { VolunteerFeaturedEvent } from "./partials/volunteer-feature-event.partial";
// import { VolunteerTestimonials } from "./partials/volunteer-testimonials.partial";
import { useLoaderData } from "react-router";
import { LoaderReturnType } from "./loader";

export { loader } from "./loader";
export { meta } from "./meta";

function VolunteerPage() {
  const { featuredEvent } = useLoaderData<LoaderReturnType>();

  return (
    <div>
      <DynamicHero
        imagePath="/assets/images/volunteer/hero.webp"
        customTitle={`<span style='color:#0092BC'>Volunteer</span> Locally<br />& Globally`}
        ctas={[{ href: "#opportunities", title: "Discover how to serve" }]}
      />

      <VolunteerWhere />
      <VolunteerAtChurch />
      <VolunteerCommunity />
      <VolunteerGlobe />
      <OnboardingProcess />
      <VolunteerStats />

      {featuredEvent && <VolunteerFeaturedEvent />}
      {/* <VolunteerTestimonials /> */}
    </div>
  );
}

export default VolunteerPage;
```

- [ ] **Step 1: Remove the `DynamicHero` import**

Edit line 1 of `app/routes/volunteer/route.tsx`: delete the line

```tsx
import { DynamicHero } from "~/components";
```

- [ ] **Step 2: Add the `VolunteerHero` import**

Insert a new import immediately after the now-removed line 1 (so it becomes the first import). The file should begin:

```tsx
import { VolunteerHero } from "./partials/volunteer-hero.partial";

import { VolunteerAtChurch } from "./partials/volunteer-church.partial";
// …rest of imports unchanged
```

- [ ] **Step 3: Replace the `<DynamicHero>` JSX block with `<VolunteerHero />`**

Inside `VolunteerPage`, replace this 5-line block:

```tsx
      <DynamicHero
        imagePath="/assets/images/volunteer/hero.webp"
        customTitle={`<span style='color:#0092BC'>Volunteer</span> Locally<br />& Globally`}
        ctas={[{ href: "#opportunities", title: "Discover how to serve" }]}
      />
```

with exactly:

```tsx
      <VolunteerHero />
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: exits with code 0, no errors.

- [ ] **Step 5: Lint the modified file**

Run: `npx eslint app/routes/volunteer/route.tsx`
Expected: exits cleanly with no errors.

- [ ] **Step 6: Run the existing test suite**

Run: `npm test -- --run`
Expected: all existing tests pass, including the `dynamic-hero` tests (component is untouched).

- [ ] **Step 7: Commit**

```bash
git add app/routes/volunteer/route.tsx
git commit -m "feat(volunteer): use VolunteerHero on volunteer page"
```

---

## Task 3: Visual verification across breakpoints

No automated visual test exists in this repo for this page. Manual verification is required.

- [ ] **Step 1: Start the dev server**

Run (in one terminal): `npm run dev`
Expected: dev server starts, prints a local URL (typically `http://localhost:5173`).

- [ ] **Step 2: Load the volunteer page in a browser at desktop width**

Open `http://localhost:5173/volunteer` at a viewport ≥1280px wide.

Expected behaviour:
- Background is light gray (`#F1F4F5`)
- Heading "Find Your Place / to Volunteer" renders with second line in blue
- Body paragraph renders to the left of the image
- Two CTAs appear side-by-side: "Find Your Fit" (solid blue) + "Browse All Opportunities" (blue outlined)
- Volunteer photo appears on the right, tilted counter-clockwise, with soft shadow and blue glow behind it
- White "695k+ / Lives Impacted" stat badge overlays the bottom-left of the image with a heart icon

- [ ] **Step 3: Resize to tablet (~900px)**

Expected: at ~900px the layout is still stacked (image-on-top, text-below) because the grid trigger is `lg:` (≥1024px). CTAs are inline (`md:flex-row`).

- [ ] **Step 4: Resize to mobile (~375px)**

Expected:
- Single column, image on top, text and buttons below (`flex-col-reverse`)
- Image is straight (no rotation), no blue glow, no stat badge visible
- Secondary button label reads "Browse All" (not "Browse All Opportunities")
- Both buttons are full-width and stacked vertically

- [ ] **Step 5: Click each CTA to confirm routing**

- "Find Your Fit" → URL becomes `/volunteer#TBD` (placeholder anchor — confirmed acceptable in spec)
- "Browse All Opportunities" / "Browse All" → URL becomes `/volunteer#volunteer-at-church`

- [ ] **Step 6: Stop dev server**

Stop with `Ctrl+C`.

- [ ] **Step 7: No commit needed**

Nothing changed in this task.

---

## Final Check

- [ ] **Step 1: Confirm `DynamicHero` is untouched**

Run: `git log --oneline main..HEAD -- app/components/dynamic-hero/`
Expected: no commits on this branch touch `app/components/dynamic-hero/`.

- [ ] **Step 2: Confirm only intended files changed**

Run: `git diff --name-only main..HEAD`
Expected output:

```
app/routes/volunteer/partials/volunteer-hero.partial.tsx
app/routes/volunteer/route.tsx
docs/superpowers/plans/2026-04-16-volunteer-page-hero.md
docs/superpowers/specs/2026-04-16-volunteer-page-hero-design.md
```

(The two docs files may already be present on the branch from the brainstorming step — that is expected.)

- [ ] **Step 3: Run the full build to confirm no regressions**

Run: `npm run build`
Expected: build completes successfully with no errors.

---

## Notes for the Implementer

- **Do not** edit `app/components/dynamic-hero/index.tsx`. Nine other routes still import it.
- **Do not** add unit tests for `VolunteerHero` — no sibling partial in this folder has tests, and the spec explicitly says "no unit tests — matches the rest of the `volunteer/partials/*` files."
- **`#TBD` anchor is intentional** for "Find Your Fit" — the real URL is not yet known. Leave it as `#TBD`.
- If Tailwind class `max-w-screen-content` is not recognized in your environment, check `tailwind.config` or `app/styles` — it is used elsewhere in this codebase (e.g. in the existing `DynamicHero`) and should already be defined.
- The `heading-h1` class is also used elsewhere (see `DynamicHero` line 131) and should resolve via the global styles.
