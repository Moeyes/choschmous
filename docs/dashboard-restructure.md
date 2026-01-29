# Dashboard Feature - Restructured

A complete restructuring of the dashboard feature with centralized data management using JSON files.

## 📋 Overview

The dashboard has been restructured to:
- ✅ Load data from JSON files instead of hardcoded sample data
- ✅ Use a centralized data loader for consistent data access
- ✅ Implement custom React hooks for data fetching
- ✅ Create a dedicated `/dashboard` route
- ✅ Improve component organization and reusability

## 📁 Structure

```
src/
├── components/features/dashboard/    # Dashboard components
│   ├── components/                   # Reusable UI components
│   ├── pages/                        # Page-level components
│   ├── DashboardContent.tsx          # Main content component
│   ├── DashboardLayout.tsx           # Layout wrapper
│   ├── types.ts                      # TypeScript types
│   └── index.ts                      # Exports
├── data/
│   ├── dashboard/                    # Dashboard data utilities
│   │   ├── dashboardDataLoader.ts    # Data loading functions
│   │   └── index.ts                  # Exports
│   └── mock/                         # Mock data (JSON files)
│       ├── dashboard-athletes.json   # Athletes data
│       ├── dashboard-events.json     # Events data
│       ├── dashboard-sports.json     # Sports data
│       └── dashboard-medals.json     # Medals data
├── hooks/
│   └── useDashboardData.ts           # Custom hook for dashboard data
└── app/
    └── dashboard/
        └── page.tsx                  # Dashboard route

```

## 🚀 Usage

### Accessing the Dashboard

Navigate to `/dashboard` to view the dashboard:
```
http://localhost:3000/dashboard
```

You can also access it with query parameters:
```
http://localhost:3000/dashboard?view=athletes
http://localhost:3000/dashboard?event=evt-1
```

### Using the Data Loader

```typescript
import { loadDashboardData, loadDashboardAthletes } from '@/data/dashboard'

// Load all dashboard data
const data = loadDashboardData()

// Load athletes only
const athletes = loadDashboardAthletes()

// Load data for specific event
const eventData = loadDashboardData('evt-1')
```

### Using the Hook

```typescript
import { useDashboardData } from '@/hooks'

function MyComponent() {
  const { athletes, events, sports, medals, provinces, stats, isLoading } = useDashboardData()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>Athletes: {stats.athletes}</h1>
      {/* ... */}
    </div>
  )
}
```

### Filtering by Event

```typescript
import { useDashboardData } from '@/hooks'

function EventDashboard({ eventId }: { eventId: string }) {
  const { athletes, medals } = useDashboardData({ eventId })
  
  // Athletes and medals are automatically filtered by eventId
  return <div>{/* ... */}</div>
}
```

## 📊 Data Structure

### Athletes (`dashboard-athletes.json`)
```json
{
  "id": "ath-001",
  "firstName": "Sokha",
  "lastName": "Mean",
  "name": "Sokha Mean",
  "province": "Phnom Penh",
  "sport": "Boxing",
  "status": "Approved",
  "medals": { "gold": 2, "silver": 1, "bronze": 0 }
}
```

### Events (`dashboard-events.json`)
```json
{
  "id": "evt-1",
  "name": "កីឡាជាតិ លើកទី៥​ ឆ្នាំ២០២៦",
  "startDate": "2026-07-10",
  "endDate": "2026-10-21",
  "status": "ongoing",
  "sports": ["Athletics", "Swimming", "Boxing"]
}
```

### Sports (`dashboard-sports.json`)
```json
{
  "id": "athletics",
  "name": "Athletics",
  "category": "Track & Field",
  "participants": 128,
  "status": "Ongoing"
}
```

### Medals (`dashboard-medals.json`)
```json
{
  "id": "med-001",
  "athleteId": "ath-001",
  "athleteName": "Sokha Mean",
  "eventId": "evt-1",
  "sportId": "boxing",
  "medalType": "Gold",
  "province": "Phnom Penh"
}
```

## 🔧 API Reference

### Data Loader Functions

#### `loadDashboardAthletes()`
Returns all athletes from the JSON file.

#### `loadDashboardAthletesByEvent(eventId: string)`
Returns athletes filtered by event ID.

#### `loadDashboardEvents()`
Returns all events.

#### `loadDashboardEventById(eventId: string)`
Returns a single event by ID.

#### `loadDashboardSports()`
Returns all sports.

#### `loadDashboardMedals()`
Returns all medals.

#### `loadDashboardMedalsByEvent(eventId: string)`
Returns medals filtered by event ID.

#### `loadDashboardMedalsByAthlete(athleteId: string)`
Returns medals filtered by athlete ID.

#### `loadDashboardProvinces(athletes?: DashboardAthlete[])`
Calculates province statistics from athletes data.

#### `loadDashboardData(eventId?: string)`
Loads complete dashboard data (athletes, events, sports, medals, provinces).

#### `getDashboardStats(eventId?: string)`
Returns aggregated statistics.

### Hook API

#### `useDashboardData(options?)`

**Options:**
- `eventId?: string | null` - Filter data by event ID
- `autoLoad?: boolean` - Auto-load data on mount (default: true)

**Returns:**
```typescript
{
  athletes: DashboardAthlete[]
  events: DashboardEvent[]
  sports: DashboardSport[]
  medals: DashboardMedal[]
  provinces: DashboardProvince[]
  stats: DashboardStats
  isLoading: boolean
  error: Error | null
  reload: () => void
}
```

## 🎨 Components

### DashboardPage
Main dashboard page component that uses the hook to load data.

```typescript
import { DashboardPage } from '@/components/features/dashboard'

export default function Page() {
  return <DashboardPage />
}
```

### DashboardContent
Main content component that accepts data as props.

```typescript
import { DashboardContent } from '@/components/features/dashboard'

<DashboardContent 
  events={events}
  athletes={athletes}
  sports={sports}
  medals={medals}
/>
```

## 📝 Adding New Data

To add new data, simply edit the JSON files in `src/data/mock/`:

1. **Athletes**: Edit `dashboard-athletes.json`
2. **Events**: Edit `dashboard-events.json`
3. **Sports**: Edit `dashboard-sports.json`
4. **Medals**: Edit `dashboard-medals.json`

The changes will be automatically picked up by the data loader.

## 🔄 Migration from Old Structure

The old structure had hardcoded sample data in `DashboardPage.tsx`. This has been replaced with:

1. **JSON data files** in `src/data/mock/`
2. **Data loader utility** in `src/data/dashboard/`
3. **Custom hook** in `src/hooks/useDashboardData.ts`
4. **Updated components** to use the hook

## 🚀 Next Steps

1. Connect to real database/API instead of JSON files
2. Add data mutation functions (create, update, delete)
3. Implement data caching with React Query or SWR
4. Add real-time updates with WebSockets
5. Implement pagination and filtering

## 📚 Related Files

- Dashboard Components: [src/components/features/dashboard](../src/components/features/dashboard)
- Data Loader: [src/data/dashboard](../src/data/dashboard)
- Mock Data: [src/data/mock](../src/data/mock)
- Hook: [src/hooks/useDashboardData.ts](../src/hooks/useDashboardData.ts)
- Route: [app/dashboard/page.tsx](../app/dashboard/page.tsx)
