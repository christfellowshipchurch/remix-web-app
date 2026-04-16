# Volunteer Page Hero Redesign

**Date:** 2026-04-16
**Branch:** `volunteer-page-hero`
**Figma:** `Web 3.0 Pages Libray` → `Volunteer Page Design` → `Desktop` / `Mobile` → `Section - Hero Header Variant`

## Goal

Replace the existing `<DynamicHero>` usage on the Volunteer page with a new, custom two-column hero that matches the Figma redesign. The hero keeps the same image asset (`/assets/images/volunteer/hero.webp`) but presents it in a fundamentally different layout (side-by-side on desktop, stacked on mobile) with different copy and CTAs.

This change affects only the Volunteer page. The shared `DynamicHero` component and the nine other routes that use it are **not** touched.

## Current state

`app/routes/volunteer/route.tsx` (lines 22–26) renders:

```tsx
<DynamicHero
  imagePath="/assets/images/volunteer/hero.webp"
  customTitle={`<span style='color:#0092BC'>Volunteer</span> Locally<br />& Globally`}
  ctas={[{ href: "#opportunities", title: "Discover how to serve" }]}
/>
```

This produces a full-bleed background-image hero with overlaid white heading and a single CTA.

## New design

### Desktop (≥1024px)

- Two-column layout (text left, image right)
- Background: `#F1F4F5` (light gray)
- Heading: "Find Your Place" / "to Volunteer" (second line in `#0092BC`)
- Body paragraph of supportive copy
- Two CTAs side-by-side: `Find Your Fit` (primary) and `Browse All Opportunities` (secondary)
- Image: `hero.webp` rendered in a counter-clockwise tilted frame (`-3deg`) with a drop shadow and a soft blue glow behind it
- Stat badge overlay on the image: "695k+ / Lives Impacted" with a heart icon, positioned bottom-left of the image

### Mobile (<1024px)

- Single column, stacked: image on top, text + CTAs below
- Same background (`#F1F4F5`)
- Same heading, body copy, same CTAs (but labels shorten: "Browse All" instead of "Browse All Opportunities")
- Image straight (no rotation), no blue glow, no stat badge
- CTAs stack full-width

## Component

**New file:** `app/routes/volunteer/partials/volunteer-hero.partial.tsx`

- Self-contained partial (no props) — matches convention of other `volunteer-*.partial.tsx` files
- Copy, image path, links, and stat value are hardcoded inside the component

**Structure:**

```
<section bg-[#F1F4F5]>
  <container max-w-screen-content mx-auto px-5/12/18 py-12 lg:py-24>
    <flex flex-col-reverse lg:grid lg:grid-cols-2 lg:items-center gap-8 lg:gap-12>
      <TextColumn>
        <h1>Find Your Place <br/> <span blue>to Volunteer</span></h1>
        <p>body copy…</p>
        <ButtonRow>
          <Button primary href="#TBD">Find Your Fit →</Button>
          <Button secondary href="#volunteer-at-church">Browse All Opportunities / All</Button>
        </ButtonRow>
      </TextColumn>
      <ImageColumn relative>
        <img hero.webp rounded lg:rotate-[-3deg] lg:shadow-2xl />
        <StatBadge hidden lg:flex absolute bottom-6 -left-6> 695k+ / Lives Impacted </StatBadge>
        <BlueGlow hidden lg:block absolute -inset-6 -z-10 blur-3xl />
      </ImageColumn>
    </flex>
  </container>
</section>
```

**Primitives used:**
- `Button` from `~/primitives/button/button.primitive` (same primitive used by `DynamicHero`)
- `cn` from `~/lib/utils` if needed
- Tailwind `max-w-screen-content`, CFC color tokens where available (`navy`, etc.)

## Copy

- **Heading line 1:** `Find Your Place`
- **Heading line 2 (blue `#0092BC`):** `to Volunteer`
- **Body:** `We want every volunteer's experience at Church to be a fulfilling journey where they feel welcomed and can share the love of Jesus. Our hope is that every volunteer understands the impact they have, knowing they are making a difference in the lives of others.`
- **Primary CTA:** `Find Your Fit` → `#TBD`
- **Secondary CTA desktop:** `Browse All Opportunities` → `#volunteer-at-church`
- **Secondary CTA mobile:** `Browse All` → `#volunteer-at-church`
- **Stat badge:** `695k+` / `Lives Impacted` (hardcoded — matches Figma exactly)

## Integration

**Edit:** `app/routes/volunteer/route.tsx`

- Remove `import { DynamicHero } from "~/components";` (no longer used on this page)
- Add `import { VolunteerHero } from "./partials/volunteer-hero.partial";`
- Replace the `<DynamicHero ... />` block with `<VolunteerHero />`
- Everything else in the file stays identical

## Non-goals

- Do **not** modify `app/components/dynamic-hero/index.tsx` — other routes still depend on it
- Do **not** change any other partial on the volunteer page
- Do **not** add a loader-sourced stat count — value is hardcoded
- Do **not** add unit tests — matches existing conventions for this folder

## Testing

- Manual visual check at mobile (<768px), tablet (768–1024px), desktop (≥1024px)
- Confirm both CTAs navigate to the expected anchors
- Run existing unit-test suite to confirm nothing broke (`dynamic-hero` tests still pass because the component is untouched)
- Lint + typecheck

## Open items

- **`#TBD` destination for "Find Your Fit"** — user will provide the real URL later; the anchor `#TBD` is a placeholder and can be left as-is for this PR
