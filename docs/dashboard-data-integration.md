# Dashboard Data Integration - Updated

## ✅ What Changed

The dashboard now uses **existing data sources** instead of separate JSON files:

### Data Sources

1. **Athletes** 
   - Source: `registrations.json`
   - Filter: `position.role === "Athlete"`
   - All athlete registrations are automatically loaded

2. **Events**
   - Source: `events.json` (existing)
   - No changes needed - uses the main events data

3. **Sports**
   - Source: Extracted from `events.json`
   - Automatically extracts all sports from event definitions
   - Counts participants from athlete registrations

4. **Medals**
   - Status: **Not implemented** (removed from dashboard)
   - Will be added when medal management is prioritized

## 📊 Data Flow

```
registrations.json ──────┐
                         ├──> Dashboard Data Loader ──> useDashboardData Hook ──> Components
events.json ─────────────┘
```

## 🔧 Updated Files

### Modified
1. **[dashboardDataLoader.ts](../src/data/dashboard/dashboardDataLoader.ts)**
   - `loadDashboardAthletes()` - Filters registrations where role = "Athlete"
   - `loadDashboardEvents()` - Loads from events.json
   - `loadDashboardSports()` - Extracts from events.json
   - Removed all medal-related functions

2. **[useDashboardData.ts](../src/hooks/useDashboardData.ts)**
   - Removed medal state and loading
   - Updated return type to exclude medals

3. **[DashboardPage.tsx](../src/components/features/dashboard/pages/DashboardPage.tsx)**
   - Passes empty array for medals (backward compatibility)

### Removed
- `dashboard-athletes.json` ❌
- `dashboard-events.json` ❌
- `dashboard-sports.json` ❌
- `dashboard-medals.json` ❌

## 🎯 How It Works

### Loading Athletes
```typescript
// From dashboardDataLoader.ts
export function loadDashboardAthletes(): DashboardAthlete[] {
  const athletes: DashboardAthlete[] = []
  
  registrationsData.forEach((user) => {
    user.registrations.forEach((reg) => {
      // Only athletes, not coaches or leaders
      if (reg.position?.role === 'Athlete') {
        athletes.push({
          id: reg.id,
          name: `${reg.firstName} ${reg.lastName}`,
          province: reg.organization?.province || reg.organization?.name,
          sport: reg.sport,
          eventId: reg.eventId,
          status: reg.status,
          // ... more fields
        })
      }
    })
  })
  
  return athletes
}
```

### Loading Sports
```typescript
// Extracts unique sports from all events
export function loadDashboardSports(): DashboardSport[] {
  const sportsMap = new Map()
  
  eventsData.forEach((event) => {
    event.sports?.forEach((sport) => {
      // Count participants from registrations
      const participants = loadDashboardAthletes().filter(
        athlete => athlete.sportId === sport.id
      ).length
      
      sportsMap.set(sport.id, {
        id: sport.id,
        name: sport.name,
        category: sport.category,
        participants: participants,
        status: sport.status || event.status
      })
    })
  })
  
  return Array.from(sportsMap.values())
}
```

## 📈 Statistics Calculated

- **Athletes**: Count of registrations where `position.role === "Athlete"`
- **Events**: Total events from events.json
- **Sports**: Unique sports extracted from all events
- **Provinces**: Unique provinces from athlete organizations
- **Medals**: Currently 0 (not implemented yet)

## 🚀 Usage Example

```typescript
import { useDashboardData } from '@/hooks/useDashboardData'

function DashboardComponent() {
  const { athletes, events, sports, provinces, stats } = useDashboardData()
  
  // Athletes are automatically filtered from registrations
  console.log(athletes) // Only those with position.role = "Athlete"
  
  // Events come from the main events.json
  console.log(events) // All events
  
  // Sports extracted from events
  console.log(sports) // Unique sports with participant counts
  
  // Statistics
  console.log(stats.athletes) // Total athletes
  console.log(stats.events) // Total events
  console.log(stats.sports) // Total unique sports
}
```

## 🔍 Data Mapping

### Registration → Athlete
| Registration Field | Dashboard Athlete Field |
|-------------------|-------------------------|
| `id` | `id` |
| `firstName`, `lastName` | `name` |
| `organization.province` | `province` |
| `sport` | `sport` |
| `eventId` | `eventId` |
| `status` | `status` |
| `gender` | `gender` |
| `dateOfBirth` | `dateOfBirth` |
| `phone` | `phone` |
| `photoUrl` | `photoUrl` |

### Event Data (Direct Mapping)
Events are mapped directly from events.json with minimal transformation.

## ⚡ Benefits

1. **Single Source of Truth**: Data comes from existing sources
2. **Real-time Updates**: Changes to registrations immediately reflect in dashboard
3. **No Data Duplication**: Don't need to maintain separate dashboard data
4. **Consistency**: Uses the same data structure as the rest of the app
5. **Automatic Filtering**: Only athletes are shown (not coaches/leaders)

## 🎯 Current Focus

As requested, the dashboard now focuses on **registration management**:
- ✅ Athletes from registrations
- ✅ Events from existing data
- ✅ Sports from events
- ❌ Medals (not priority right now)

## 🔜 Future Enhancements

When medal management becomes a priority:
1. Create medal tracking system
2. Add medal awards to athlete profiles
3. Re-enable medal statistics
4. Add medal filtering and reporting

## 📚 Related Files

- Data Loader: [src/data/dashboard/dashboardDataLoader.ts](../src/data/dashboard/dashboardDataLoader.ts)
- Hook: [src/hooks/useDashboardData.ts](../src/hooks/useDashboardData.ts)
- Page: [src/components/features/dashboard/pages/DashboardPage.tsx](../src/components/features/dashboard/pages/DashboardPage.tsx)
- Source Data:
  - [src/data/mock/registrations.json](../src/data/mock/registrations.json)
  - [src/data/mock/events.json](../src/data/mock/events.json)
