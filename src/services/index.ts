/**
 * Services Index
 * Re-exports all services for cleaner imports
 */

// Recommendation services
export {
  recommendEvents,
  getTrendingEvents,
  type RecommendationScore,
  type EventRecommendation,
  type SportRecommendation,
} from './recommendation/recommendationEngine';

// Event bus for real-time updates
export {
  DASHBOARD_REFRESH_EVENT,
  emitDashboardRefresh,
  subscribeToDashboardRefresh,
  onDashboardRefresh,
} from './eventBus';
