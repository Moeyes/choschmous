/**
 * Database Services Index
 * Re-exports all database-related services for cleaner imports
 */

// Event bus (now in services folder)
export {
  DASHBOARD_REFRESH_EVENT,
  emitDashboardRefresh,
  subscribeToDashboardRefresh,
  onDashboardRefresh,
} from '@/src/services/eventBus';

// Registration hooks (now in hooks folder)
export { useRegister } from '@/src/hooks/useRegister';
export { useRegistrationForm } from '@/src/hooks/useRegistrationForm';
