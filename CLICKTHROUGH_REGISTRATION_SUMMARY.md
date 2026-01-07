# ClickThrough Registration Component - Implementation Summary

## Overview
Built a 4-step event registration wizard component that uses Algolia faceting to progressively filter event sessions by Campus, Date, and Time, then displays an embedded Rock form for the selected session.

## Component Location
- **Main Component**: `app/routes/events/event-single/components/clickthrough-registration.component.tsx`
- **Types**: `app/routes/events/event-single/types.ts`

## Key Features

### 4-Step Flow
1. **Step 1 - Choose Your Campus**: Search and select from available campuses
2. **Step 2 - Select the Date**: Choose from available dates for selected campus
3. **Step 3 - Pick Your Time**: Select time slot for selected campus and date
4. **Step 4 - Personal Information**: Embedded Rock form using `groupGuid`

### Algolia Integration
- **Index**: `dev_EventFinderItems`
- **Progressive Filtering**: Filters applied incrementally:
  - Step 1: `groupType:"${groupType}"`
  - Step 2: Adds `campus.name:"${selectedCampus}"`
  - Step 3: Adds `date:"${selectedDate}"`
- **GroupType**: Extracted from URL (e.g., `/events/kids` → "Kids") or passed as prop

### Data Structure
```typescript
interface EventFinderHit {
  objectID: string;
  campus: { name: string };
  groupType: string;
  rockItemId: number;
  groupGuid: string;  // Used for Rock embed URL
  summary: string;
  location: string;
  day: string;        // Day name (e.g., "Sunday")
  time: string;       // Time (e.g., "8:30 AM")
  date: string;       // Date in YYYY-MM-DD format
  subGroupType: string;
}
```

## Sub-Components

### SelectedBar
Displays previously selected values with icons (campus, date, time) above each step.

### ClickableCard
Reusable card component for selecting options:
- Icon at top (location/calendar/clock)
- Title (campus name / formatted date / time)
- Subtitle (address / day name / timezone)
- Hover states with border styling

### Step Components
- **CampusStep**: Search input + grid of campus cards
- **DateStep**: Grid of date cards with formatted display
- **TimeStep**: Grid of time cards
- **FormStep**: Rock embed using `RockProxyEmbed` component

## Rock Embed Integration
- **URL Format**: `https://rock.gocf.org/page/3253?Group=${groupGuid}`
- **Component**: Uses `RockProxyEmbed` from `~/components/rock-embed`
- **Height**: 800px with loading state

## Important Fixes Applied

### Date Parsing Issue
**Problem**: Dates were showing one day before due to timezone conversion when using `new Date(dateString)`.

**Solution**: Parse date string manually to avoid timezone issues:
```typescript
const formatDateDisplay = (dateString: string, dayName?: string): string => {
  // Parse date string manually to avoid timezone issues
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed
  
  const monthName = date.toLocaleDateString("en-US", { month: "short" });
  const dayNum = date.getDate();
  const suffix = getDaySuffix(dayNum);
  const weekday = dayName || date.toLocaleDateString("en-US", { weekday: "short" });
  
  return `${weekday} ${monthName} ${dayNum}${suffix}`;
};
```

### Blank Time Screen Issue
**Problem**: Time screen was blank after selecting a date.

**Solution**: 
- Added trimming to date/campus comparisons to handle whitespace
- Ensured exact string matching for date comparisons
- Added fallback message when no times are found

## Usage
```tsx
<ClickThroughRegistration 
  title="Event Name" 
  groupType="Kids" // Optional - extracted from URL if not provided
/>
```

## Technical Notes
- Uses `InstantSearch` from `react-instantsearch` with `Configure` for filtering
- Uses `useHits` hook to get filtered results
- Extracts unique values client-side using `useMemo` for performance
- Progress indicator shows 4 steps with visual dots
- Back navigation clears selections appropriately
- Component receives Algolia credentials from root loader via `useRouteLoaderData("root")`

## Styling
- Matches Figma designs with card layouts, hover states, and progress indicators
- Uses TailwindCSS classes consistent with project conventions
- Responsive grid layouts (1 column mobile, 2-3 columns desktop)

