# Volunteer Country-to-Coordinates Lookup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace manual `latitude`/`longitude` CMS attributes with a static country → coordinates lookup so content managers only pick a country from a Rock dropdown.

**Architecture:** Add a static `Record<string, {lat, lng}>` lookup keyed by country name. Resolve coordinates in the volunteer loader using the existing `country` attribute. The `GlobalMap` component stays unchanged structurally but filters out trips whose country couldn't be resolved. The `latitude`/`longitude` Rock attributes are no longer read.

**Tech Stack:** TypeScript, Remix/React Router loader, Vitest.

---

## Country List for Rock Dropdown

Paste this comma-separated list into the Rock Defined Type / dropdown values. These are the exact strings that must match the keys in `country-coordinates.ts`:

```
Albania, Argentina, Armenia, Australia, Austria, Bahamas, Bangladesh, Belgium, Belize, Bolivia, Bosnia and Herzegovina, Brazil, Bulgaria, Cambodia, Cameroon, Canada, Chile, China, Colombia, Costa Rica, Croatia, Cuba, Czech Republic, Democratic Republic of the Congo, Denmark, Dominican Republic, Ecuador, Egypt, El Salvador, Ethiopia, Fiji, Finland, France, Georgia, Germany, Ghana, Greece, Guatemala, Haiti, Honduras, Hungary, Iceland, India, Indonesia, Iraq, Ireland, Israel, Italy, Ivory Coast, Jamaica, Japan, Jordan, Kazakhstan, Kenya, Kyrgyzstan, Laos, Lebanon, Liberia, Madagascar, Malawi, Malaysia, Mali, Mexico, Mongolia, Morocco, Mozambique, Myanmar, Nepal, Netherlands, New Zealand, Nicaragua, Nigeria, North Macedonia, Norway, Pakistan, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Poland, Portugal, Puerto Rico, Romania, Russia, Rwanda, Saudi Arabia, Senegal, Serbia, Sierra Leone, Singapore, Slovakia, Slovenia, South Africa, South Korea, South Sudan, Spain, Sri Lanka, Sudan, Sweden, Switzerland, Taiwan, Tajikistan, Tanzania, Thailand, Togo, Trinidad and Tobago, Tunisia, Turkey, Uganda, Ukraine, United Arab Emirates, United Kingdom, United States, Uruguay, Uzbekistan, Venezuela, Vietnam, Zambia, Zimbabwe
```

---

## File Structure

- **Create:** `app/routes/volunteer/country-coordinates.ts` — static lookup map + `getCoordinatesForCountry()` helper.
- **Create:** `app/routes/volunteer/__tests__/country-coordinates.test.ts` — unit tests for the helper.
- **Modify:** `app/routes/volunteer/loader.ts` — stop reading `latitude`/`longitude` attributes; resolve from country name.
- **Modify:** `app/routes/volunteer/components/global-map.component.tsx` — skip trips with unresolved coordinates (optional hardening).
- **Modify:** `app/routes/volunteer/types.ts` — make `coordinates` optional (since not all countries may resolve).

---

## Task 1: Create country-coordinates lookup with helper

**Files:**
- Create: `app/routes/volunteer/country-coordinates.ts`
- Test: `app/routes/volunteer/__tests__/country-coordinates.test.ts`

- [ ] **Step 1: Write the failing test**

Create `app/routes/volunteer/__tests__/country-coordinates.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  getCoordinatesForCountry,
  COUNTRY_COORDINATES,
} from "../country-coordinates";

describe("getCoordinatesForCountry", () => {
  it("returns coordinates for a known country", () => {
    const result = getCoordinatesForCountry("Guatemala");
    expect(result).toEqual({ lat: 15.7835, lng: -90.2308 });
  });

  it("returns null for an unknown country", () => {
    expect(getCoordinatesForCountry("Atlantis")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(getCoordinatesForCountry("")).toBeNull();
  });

  it("is case-sensitive on exact match (matches Rock dropdown values)", () => {
    expect(getCoordinatesForCountry("guatemala")).toBeNull();
    expect(getCoordinatesForCountry("Guatemala")).not.toBeNull();
  });

  it("includes all countries from the dropdown list", () => {
    expect(COUNTRY_COORDINATES["United States"]).toBeDefined();
    expect(COUNTRY_COORDINATES["Dominican Republic"]).toBeDefined();
    expect(COUNTRY_COORDINATES["Bosnia and Herzegovina"]).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn vitest run app/routes/volunteer/__tests__/country-coordinates.test.ts`
Expected: FAIL with module not found.

- [ ] **Step 3: Create the lookup file**

Create `app/routes/volunteer/country-coordinates.ts`:

```ts
export type Coordinates = { lat: number; lng: number };

export const COUNTRY_COORDINATES: Record<string, Coordinates> = {
  Albania: { lat: 41.1533, lng: 20.1683 },
  Argentina: { lat: -38.4161, lng: -63.6167 },
  Armenia: { lat: 40.0691, lng: 45.0382 },
  Australia: { lat: -25.2744, lng: 133.7751 },
  Austria: { lat: 47.5162, lng: 14.5501 },
  Bahamas: { lat: 25.0343, lng: -77.3963 },
  Bangladesh: { lat: 23.685, lng: 90.3563 },
  Belgium: { lat: 50.5039, lng: 4.4699 },
  Belize: { lat: 17.1899, lng: -88.4976 },
  Bolivia: { lat: -16.2902, lng: -63.5887 },
  "Bosnia and Herzegovina": { lat: 43.9159, lng: 17.6791 },
  Brazil: { lat: -14.235, lng: -51.9253 },
  Bulgaria: { lat: 42.7339, lng: 25.4858 },
  Cambodia: { lat: 12.5657, lng: 104.991 },
  Cameroon: { lat: 7.3697, lng: 12.3547 },
  Canada: { lat: 56.1304, lng: -106.3468 },
  Chile: { lat: -35.6751, lng: -71.543 },
  China: { lat: 35.8617, lng: 104.1954 },
  Colombia: { lat: 4.5709, lng: -74.2973 },
  "Costa Rica": { lat: 9.7489, lng: -83.7534 },
  Croatia: { lat: 45.1, lng: 15.2 },
  Cuba: { lat: 21.5218, lng: -77.7812 },
  "Czech Republic": { lat: 49.8175, lng: 15.473 },
  "Democratic Republic of the Congo": { lat: -4.0383, lng: 21.7587 },
  Denmark: { lat: 56.2639, lng: 9.5018 },
  "Dominican Republic": { lat: 18.7357, lng: -70.1627 },
  Ecuador: { lat: -1.8312, lng: -78.1834 },
  Egypt: { lat: 26.8206, lng: 30.8025 },
  "El Salvador": { lat: 13.7942, lng: -88.8965 },
  Ethiopia: { lat: 9.145, lng: 40.4897 },
  Fiji: { lat: -17.7134, lng: 178.065 },
  Finland: { lat: 61.9241, lng: 25.7482 },
  France: { lat: 46.2276, lng: 2.2137 },
  Georgia: { lat: 42.3154, lng: 43.3569 },
  Germany: { lat: 51.1657, lng: 10.4515 },
  Ghana: { lat: 7.9465, lng: -1.0232 },
  Greece: { lat: 39.0742, lng: 21.8243 },
  Guatemala: { lat: 15.7835, lng: -90.2308 },
  Haiti: { lat: 18.9712, lng: -72.2852 },
  Honduras: { lat: 15.2, lng: -86.2419 },
  Hungary: { lat: 47.1625, lng: 19.5033 },
  Iceland: { lat: 64.9631, lng: -19.0208 },
  India: { lat: 20.5937, lng: 78.9629 },
  Indonesia: { lat: -0.7893, lng: 113.9213 },
  Iraq: { lat: 33.2232, lng: 43.6793 },
  Ireland: { lat: 53.1424, lng: -7.6921 },
  Israel: { lat: 31.0461, lng: 34.8516 },
  Italy: { lat: 41.8719, lng: 12.5674 },
  "Ivory Coast": { lat: 7.54, lng: -5.5471 },
  Jamaica: { lat: 18.1096, lng: -77.2975 },
  Japan: { lat: 36.2048, lng: 138.2529 },
  Jordan: { lat: 30.5852, lng: 36.2384 },
  Kazakhstan: { lat: 48.0196, lng: 66.9237 },
  Kenya: { lat: -0.0236, lng: 37.9062 },
  Kyrgyzstan: { lat: 41.2044, lng: 74.7661 },
  Laos: { lat: 19.8563, lng: 102.4955 },
  Lebanon: { lat: 33.8547, lng: 35.8623 },
  Liberia: { lat: 6.4281, lng: -9.4295 },
  Madagascar: { lat: -18.7669, lng: 46.8691 },
  Malawi: { lat: -13.2543, lng: 34.3015 },
  Malaysia: { lat: 4.2105, lng: 101.9758 },
  Mali: { lat: 17.5707, lng: -3.9962 },
  Mexico: { lat: 23.6345, lng: -102.5528 },
  Mongolia: { lat: 46.8625, lng: 103.8467 },
  Morocco: { lat: 31.7917, lng: -7.0926 },
  Mozambique: { lat: -18.6657, lng: 35.5296 },
  Myanmar: { lat: 21.9162, lng: 95.956 },
  Nepal: { lat: 28.3949, lng: 84.124 },
  Netherlands: { lat: 52.1326, lng: 5.2913 },
  "New Zealand": { lat: -40.9006, lng: 174.886 },
  Nicaragua: { lat: 12.8654, lng: -85.2072 },
  Nigeria: { lat: 9.082, lng: 8.6753 },
  "North Macedonia": { lat: 41.6086, lng: 21.7453 },
  Norway: { lat: 60.472, lng: 8.4689 },
  Pakistan: { lat: 30.3753, lng: 69.3451 },
  Panama: { lat: 8.538, lng: -80.7821 },
  "Papua New Guinea": { lat: -6.315, lng: 143.9555 },
  Paraguay: { lat: -23.4425, lng: -58.4438 },
  Peru: { lat: -9.19, lng: -75.0152 },
  Philippines: { lat: 12.8797, lng: 121.774 },
  Poland: { lat: 51.9194, lng: 19.1451 },
  Portugal: { lat: 39.3999, lng: -8.2245 },
  "Puerto Rico": { lat: 18.2208, lng: -66.5901 },
  Romania: { lat: 45.9432, lng: 24.9668 },
  Russia: { lat: 61.524, lng: 105.3188 },
  Rwanda: { lat: -1.9403, lng: 29.8739 },
  "Saudi Arabia": { lat: 23.8859, lng: 45.0792 },
  Senegal: { lat: 14.4974, lng: -14.4524 },
  Serbia: { lat: 44.0165, lng: 21.0059 },
  "Sierra Leone": { lat: 8.4606, lng: -11.7799 },
  Singapore: { lat: 1.3521, lng: 103.8198 },
  Slovakia: { lat: 48.669, lng: 19.699 },
  Slovenia: { lat: 46.1512, lng: 14.9955 },
  "South Africa": { lat: -30.5595, lng: 22.9375 },
  "South Korea": { lat: 35.9078, lng: 127.7669 },
  "South Sudan": { lat: 6.877, lng: 31.307 },
  Spain: { lat: 40.4637, lng: -3.7492 },
  "Sri Lanka": { lat: 7.8731, lng: 80.7718 },
  Sudan: { lat: 12.8628, lng: 30.2176 },
  Sweden: { lat: 60.1282, lng: 18.6435 },
  Switzerland: { lat: 46.8182, lng: 8.2275 },
  Taiwan: { lat: 23.6978, lng: 120.9605 },
  Tajikistan: { lat: 38.861, lng: 71.2761 },
  Tanzania: { lat: -6.369, lng: 34.8888 },
  Thailand: { lat: 15.87, lng: 100.9925 },
  Togo: { lat: 8.6195, lng: 0.8248 },
  "Trinidad and Tobago": { lat: 10.6918, lng: -61.2225 },
  Tunisia: { lat: 33.8869, lng: 9.5375 },
  Turkey: { lat: 38.9637, lng: 35.2433 },
  Uganda: { lat: 1.3733, lng: 32.2903 },
  Ukraine: { lat: 48.3794, lng: 31.1656 },
  "United Arab Emirates": { lat: 23.4241, lng: 53.8478 },
  "United Kingdom": { lat: 55.3781, lng: -3.436 },
  "United States": { lat: 37.0902, lng: -95.7129 },
  Uruguay: { lat: -32.5228, lng: -55.7658 },
  Uzbekistan: { lat: 41.3775, lng: 64.5853 },
  Venezuela: { lat: 6.4238, lng: -66.5897 },
  Vietnam: { lat: 14.0583, lng: 108.2772 },
  Zambia: { lat: -13.1339, lng: 27.8493 },
  Zimbabwe: { lat: -19.0154, lng: 29.1549 },
};

export function getCoordinatesForCountry(
  country: string,
): Coordinates | null {
  if (!country) return null;
  return COUNTRY_COORDINATES[country] ?? null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn vitest run app/routes/volunteer/__tests__/country-coordinates.test.ts`
Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add app/routes/volunteer/country-coordinates.ts app/routes/volunteer/__tests__/country-coordinates.test.ts
git commit -m "feat(volunteer): add country-to-coordinates lookup"
```

---

## Task 2: Make Trip.coordinates optional in types

**Files:**
- Modify: `app/routes/volunteer/types.ts:13-16`

- [ ] **Step 1: Update the Trip type**

In `app/routes/volunteer/types.ts`, change the `coordinates` field from required to optional:

```ts
export type Trip = {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  applyUrl?: string;
  donateUrl: string;
  groupType: string;
  city: string;
  country: string;
  dateOfTrip: string;
  cost: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
};
```

- [ ] **Step 2: Run typecheck**

Run: `yarn typecheck` (or `yarn tsc --noEmit`)
Expected: no new errors specific to this change. If `global-map.component.tsx` complains about `trip.coordinates.lat`, that's expected and fixed in Task 4.

- [ ] **Step 3: Don't commit yet**

Continue to Task 3 — types, loader, and component change together.

---

## Task 3: Resolve coordinates from country in loader

**Files:**
- Modify: `app/routes/volunteer/loader.ts:36-66`

- [ ] **Step 1: Update the loader to use the lookup**

In `app/routes/volunteer/loader.ts`:

1. Add the import at the top with the other imports:

```ts
import { getCoordinatesForCountry } from "./country-coordinates";
```

2. Remove the `latitude` and `longitude` fields from the `attributeValues` type annotation (lines 45-46).

3. Replace the mapping block that builds each trip. Change the `coordinates: { ... }` block so it resolves from the country name instead of reading the lat/lng attributes. The new trip-building block should look like this (replace lines 48-66):

```ts
    }) => {
      const country = item.attributeValues?.country?.value || "";
      const resolvedCoordinates = getCoordinatesForCountry(country);
      return {
        id: Number(item.id) || 0,
        title: item.title,
        description: item.content,
        coverImage: item.attributeValues?.coverImage?.value
          ? createImageUrlFromGuid(item.attributeValues.coverImage.value)
          : "",
        applyUrl: item.attributeValues?.applyUrl?.value,
        donateUrl: item.attributeValues?.donateUrl?.value || "",
        groupType: item.attributeValues?.groupType?.value || "",
        city: item.attributeValues?.city?.value || "",
        country,
        dateOfTrip: item.attributeValues?.dateOfTrip?.value || "",
        cost: Number(item.attributeValues?.cost?.value) || 0,
        coordinates: resolvedCoordinates ?? undefined,
      };
    },
```

- [ ] **Step 2: Run typecheck**

Run: `yarn typecheck`
Expected: `loader.ts` passes. `global-map.component.tsx` may still show errors — fixed in Task 4.

---

## Task 4: Filter map dots to trips with resolved coordinates

**Files:**
- Modify: `app/routes/volunteer/components/global-map.component.tsx:32-54`

- [ ] **Step 1: Update the component to skip trips without coordinates**

In `app/routes/volunteer/components/global-map.component.tsx`, replace the `trips.map(...)` block with:

```tsx
      {trips.map((trip) => {
        if (!trip.coordinates) return null;
        const { x, y } = projectToMap(
          trip.coordinates.lat,
          trip.coordinates.lng,
        );
        return (
          <div
            key={trip.id}
            className="absolute"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(-50%, -50%)",
            }}
            title={trip.title}
          >
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ocean opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-ocean"></span>
            </span>
          </div>
        );
      })}
```

- [ ] **Step 2: Run typecheck**

Run: `yarn typecheck`
Expected: clean.

- [ ] **Step 3: Run full test suite**

Run: `yarn test` (or `yarn vitest run`)
Expected: all tests pass.

- [ ] **Step 4: Manual smoke test**

Run: `yarn dev`
Visit the volunteer page. Verify:
- Dots appear on the map for trips whose `country` attribute matches a lookup entry.
- Trips whose country doesn't match (or is empty) simply don't render a dot — nothing crashes, no dots at `{0,0}`.

- [ ] **Step 5: Commit**

```bash
git add app/routes/volunteer/types.ts app/routes/volunteer/loader.ts app/routes/volunteer/components/global-map.component.tsx
git commit -m "feat(volunteer): resolve map coordinates from country attribute"
```

---

## Post-Implementation Notes for Rock CMS

After merging:

1. In Rock, update the `country` attribute on the Mission Trips content channel to be a Single-Select (or Defined Value) using the comma-separated list at the top of this plan.
2. The `latitude` and `longitude` attributes on the content channel can be removed or left unused — the loader no longer reads them.
3. Any country string **must** match the dropdown values exactly (case-sensitive). If a new country is needed, add it to `country-coordinates.ts` **and** to the Rock dropdown together.
