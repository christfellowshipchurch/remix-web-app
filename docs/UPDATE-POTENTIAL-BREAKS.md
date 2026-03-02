# Potential Breaks from Package Update (React 19, Tailwind v4, Radix, etc.)

This document lists likely breaking changes from the recent major upgrades. **Navigation menu and home page animation issues** are most likely caused by the items in the “High impact” section.

---

## High impact (likely causing nav + home animations)

### 1. **Tailwind CSS v4 + `tailwind.config.ts` (legacy config)**

- **What changed:** Tailwind was updated to v4.x. v4 prefers a **CSS-first** config (`@theme` in CSS); the existing `tailwind.config.ts` is treated as legacy.
- **Impact:** Custom **keyframes and animations** defined in `theme.extend` (e.g. `navbarKeyframes`, `navbarAnimations`, `modalKeyframes`) may not be emitted or may get different class names. That would break:
  - Nav: `animate-enterFromRight`, `animate-enterFromLeft`, `animate-exitToRight`, `animate-exitToLeft` (from `navbar.styles.ts` → `navigationMenuContentStyle`).
  - Modals: `animate-dialogOverlayShow`, `animate-dialogContentHide`, etc.
  - Accordions: `animate-accordion-down`, `animate-accordion-up` (from `tailwindcss-animate` or theme).
- **Build warning:** The build logs show a CSS error involving `.container` and the `shorter` screen: **"Unexpected token ParenthesisBlock"**. That suggests Tailwind v4 is generating invalid CSS for the custom screen `shorter: { raw: "(min-width: 1024px) and (max-height: 900px)" }`, which can break layout/animations anywhere that uses `shorter:` (e.g. home location search: `shorter:-translate-y-70`).
- **Fix direction:** Either move custom keyframes/animations into CSS with `@theme` and `@keyframes`, or adjust the `shorter` screen definition for v4’s syntax. Fix the `.container` / `shorter` CSS so the build warning is gone.

### 2. **tailwindcss-animate with Tailwind v4**

- **What changed:** Project uses `tailwindcss-animate` (v1.0.7), which was built for Tailwind v3’s plugin system.
- **Impact:** Utilities like **`animate-in`**, **`slide-in-from-top-2`**, **`fade-in`**, **`zoom-in-95`**, **`duration-200`**, **`data-[state=open]:animate-*`** may not be generated or may behave differently under v4. These are used in:
  - **Navbar:** `animate-in slide-in-from-top-2 duration-200` (dropdown), `group-data-[state=open]:rotate-180`, and Radix nav menu content animations.
  - **Modals:** `data-[state=closed]:animate-dialogOverlayHide`, `data-[state=open]:animate-dialogContentShow`.
  - **Accordions:** `data-[state=closed]:animate-accordion-up`, `data-[state=open]:animate-accordion-down`.
  - **Home / other:** `animate-fadeIn`, `data-[state=active]:animate-in`, etc.
- **Fix direction:** Prefer a v4-friendly approach: e.g. **tw-animate-css** or defining the same animations in `@theme` in your CSS. Alternatively, confirm the current plugin is still supported in v4 and that no utility names changed.

### 3. **Radix UI Navigation Menu (`@radix-ui/react-navigation-menu`)**

- **What changed:** Radix packages were updated to latest (e.g. navigation-menu 1.2.x).
- **Impact:** Radix can change **data attributes** (e.g. `data-motion`, `data-state`) or **animation behavior** between versions. Your navbar uses:
  - `data-[motion=from-end]:animate-enterFromRight`, `data-[motion=from-start]:animate-enterFromLeft`, etc.
  If Radix renamed or removed these `data-motion` values, the dropdown/panel animations would stop matching and appear broken.
- **Fix direction:** Check Radix Navigation Menu changelog for any renames/removals of `data-motion` or animation-related attributes. Align your `navbar.styles.ts` classes with the current API.

---

## Medium impact

### 4. **React 18 → 19**

- **What changed:** React and React-DOM upgraded to 19.x; ref callback behavior was already fixed (no return value).
- **Impact:** Possible differences in **timing of re-renders** or **concurrent behavior** could make animations start/end at different times or not run in some cases. Less likely than Tailwind/Radix to be the main cause, but possible if animations are tied to mount/unmount or state updates.
- **Fix direction:** If Tailwind/Radix fixes don’t resolve it, check React 19 upgrade guide for any changes that affect layout or refs in animated components.

### 5. **Custom screen `shorter` and `.container` CSS**

- **What changed:** Tailwind v4 may handle `theme.screens` and `raw` media queries differently.
- **Impact:** The **build warning** points to invalid CSS around `.container` and the `shorter` breakpoint. That can cause:
  - Layout/positioning bugs wherever `shorter:` is used (e.g. home page).
  - Cascading style issues that make animations look wrong even if the animation keyframes themselves are fine.
- **Fix direction:** Resolve the Tailwind v4 “Unexpected token ParenthesisBlock” warning (adjust `shorter` and any `.container` usage so the generated CSS is valid).

### 6. **Removed Relume packages**

- **What changed:** `@relume_io/relume-ui` and `@relume_io/relume-tailwind` were removed; the Relume content path was removed from `tailwind.config.ts`.
- **Impact:** Any **components or class names** that came from Relume (or that were only scanned from Relume’s dist) are no longer in the build. If the nav or home page used Relume components or Relume-only utilities, those parts would break or lose styling.
- **Fix direction:** Replace with your own components/classes or another UI set. Grep for “relume” to see if anything still references it.

---

## Lower impact / general

### 7. **Express 4 → 5**

- **Impact:** Server-only; possible breaking changes in middleware or request/response APIs. Only relevant if you see server or API errors.

### 8. **ESLint 10 + plugin peer deps**

- **Impact:** Lint only; no runtime effect. Some plugins don’t yet declare support for ESLint 10 (peer dependency warnings). Safe to ignore for animations.

### 9. **Vite 5 → 7, Vitest 3 → 4, Jest 29 → 30**

- **Impact:** Build and test tooling. Unlikely to break nav/home animations unless a plugin or transform changed how CSS or assets are processed. If only animations broke, prioritize Tailwind/Radix.

### 10. **Home loader behavior change**

- **What changed:** During cleanup, the home loader was changed so that on error it **throws** instead of returning a fallback JSON response. That was reverted; the loader again returns fallback data on error.
- **Impact:** If you still see “home returns error instead of fallback” in production, ensure the reverted behavior (return fallback) is what’s deployed.

---

## Recommended order of fixes for nav + home animations

1. **Fix Tailwind v4 “Unexpected token” warning**  
   Adjust the `shorter` screen (and any `.container` usage) so the generated CSS is valid. That may restore layout and prevent cascading animation issues.

2. **Ensure custom nav/modal keyframes and animation names exist in the built CSS**  
   Either make Tailwind v4 emit them via your current config or move them to `@theme` / `@keyframes` in CSS. Verify in DevTools that classes like `animate-enterFromRight` exist and that keyframes are present.

3. **Confirm tailwindcss-animate (or replacement) works with Tailwind v4**  
   Check that `animate-in`, `slide-in-from-top-2`, `animate-accordion-down`, etc., are generated and applied. Consider switching to a v4-native animation set (e.g. tw-animate-css) if the current plugin is unreliable.

4. **Check Radix Navigation Menu docs/changelog**  
   Ensure `data-motion` (and any other attributes you use for animation) still match the current Radix version. Update `navbar.styles.ts` if the API changed.

5. **Re-test after each change**  
   Run `pnpm build`, clear cache if needed, and test nav dropdowns and home page animations in the browser.

---

## Quick checks in the browser

- **Nav:** Open the main nav menu; use DevTools to see which classes are on the dropdown (e.g. `animate-enterFromRight`) and whether the corresponding `@keyframes` exist in the stylesheet.
- **Home:** Check the same for any animated hero/tabs/cards; confirm the `shorter` breakpoint isn’t producing invalid rules (Inspect the element and look for broken or overridden styles).
- **Console:** Look for CSS parse errors or React warnings that might point to a specific component or style.
