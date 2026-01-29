# Choschmous Dashboard Module

A standalone, reusable dashboard module for sports management applications.

## 📁 Structure

```
micro/choschmous/dashboard/
├── index.ts                    # Main exports
├── types.ts                    # TypeScript types
├── DashboardContent.tsx        # Main dashboard content component
├── DashboardLayout.tsx         # Dashboard layout wrapper
├── components/                 # Reusable UI components
│   ├── index.ts
│   ├── AthletesSection.tsx
│   ├── Banner.tsx
│   ├── EventsSection.tsx
│   ├── ProvincesSection.tsx
│   ├── QuickActions.tsx
│   ├── SectionHeader.tsx
│   ├── SportsSection.tsx
│   ├── StatsGrid.tsx
│   └── Topbar.tsx
└── pages/                      # Page components
    ├── index.ts
    ├── AthletesPage.tsx
    ├── DashboardPage.tsx
    ├── EventDetailPage.tsx
    ├── EventsPage.tsx
    ├── MedalsPage.tsx
    ├── ProvincesPage.tsx
    ├── RegisterEnrollPage.tsx
    └── SportsPage.tsx
```

## 🚀 Usage

### Basic Import

```tsx
import {
  DashboardContent,
  DashboardLayout,
  DashboardPage,
  AthletesPage,
  EventsPage,
  // ... other pages
} from "@/micro/choschmous/dashboard"
```

### Using Individual Components

```tsx
import {
  DashboardBanner,
  StatsGrid,
  AthletesSection,
  EventsSection,
  SportsSection,
  ProvincesSection,
  QuickActions,
  SectionHeader,
} from "@/micro/choschmous/dashboard"
```

### Using with Next.js App Router

```tsx
// app/dashboard/page.tsx
import { DashboardPage } from "@/micro/choschmous/dashboard"

export default function Page() {
  return <DashboardPage />
}
```

```tsx
// app/dashboard/athletes/page.tsx
import { AthletesPage } from "@/micro/choschmous/dashboard"

export default function Page() {
  return <AthletesPage />
}
```

## 📊 Types

The module exports these TypeScript types:

```tsx
import type {
  DashboardAthlete,
  DashboardEvent,
  DashboardSport,
  DashboardProvince,
  DashboardMedal,
  DashboardStats,
} from "@/micro/choschmous/dashboard/types"
```

## 🎨 Components

### DashboardContent
Main dashboard content with events, stats, and quick actions.

```tsx
<DashboardContent 
  events={events}
  athletes={athletes}
  sports={sports}
  medals={medals}
  initialView="dashboard"
  onEventSelect={(id) => console.log(id)}
/>
```

### AthletesSection
Athlete management table with search, filtering, and CRUD actions.

```tsx
<AthletesSection 
  athletes={athletes}
  onViewAthlete={(athlete) => {}}
  onEditAthlete={(athlete) => {}}
  onDeleteAthlete={(id) => {}}
  onCreateAthlete={() => {}}
/>
```

### EventsSection
Event cards grid with create functionality.

```tsx
<EventsSection 
  events={events}
  onCreate={(event) => {}}
  onSelect={(id) => {}}
/>
```

### SportsSection
Sports management with stats and table.

```tsx
<SportsSection 
  sports={sports}
  onCreateSport={() => {}}
  onEditSport={(sport) => {}}
  onDeleteSport={(id) => {}}
/>
```

### ProvincesSection
Province statistics with rankings and medal counts.

```tsx
<ProvincesSection 
  provinces={provinces}
  onCreateProvince={() => {}}
/>
```

### StatsGrid
Reusable stats cards grid.

```tsx
<StatsGrid 
  items={[
    { label: "Athletes", value: 100, color: "bg-blue-100" },
    { label: "Events", value: 5, color: "bg-green-100" },
  ]}
/>
```

## 🔧 Dependencies

This module requires:
- React 18+
- Next.js 14+ (for routing)
- Tailwind CSS
- shadcn/ui components:
  - Card, Button, Input, Badge
  - Table components
  - Label
- lucide-react icons

## 📝 Notes

- All components are client-side ("use client")
- Sample data is included for testing
- Types are flexible to work with various data sources
- Styling uses Tailwind CSS with a blue (#1a4cd8) primary color
