/**
 * Dashboard Data Module
 * 
 * NOTE: The dashboardDataLoader uses Node.js 'fs' module and can only be used server-side.
 * For client-side dashboard data, use the useDashboardData hook which fetches from /api/dashboard.
 */

// Server-side only exports - do not import in client components
export * from './dashboardDataLoader'

