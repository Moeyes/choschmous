/**
 * Components Index
 * Re-exports all components for cleaner imports
 * @deprecated Import from feature modules or shared instead
 */

// Component Utilities & Patterns (moved to shared)
export * from '../shared/utils/componentUtils'
export * from '../shared/utils/patterns'

// UI Components
export * from './ui/badge'
export * from './ui/button'
export * from './ui/card'
export * from './ui/checkbox'
export * from './ui/collapsible'
export * from './ui/dialog'
export * from './ui/input'
export * from './ui/label'
export * from './ui/native-select'
export * from './ui/popover'
export * from './ui/select'
export * from './ui/selectTableCard'
export * from './ui/separator'
export * from './ui/sheet'
export * from './ui/skeleton'
export * from './ui/sonner'
export * from './ui/table'
export * from './ui/tooltip'

// Shared Components (moved to shared module)
export * from '../shared/components'

// Form Components
export * from './forms/FormControls'

// Feature Components (moved to feature modules)
export * from '../features/events/components/EventCard'
export * from '../features/registration/components'
