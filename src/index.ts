/**
 * Main Source Index
 * Central export point for the application
 * 
 * New Structure:
 * - @/core - Core services (events, session, storage)
 * - @/features - Feature modules (dashboard, registration, events)
 * - @/shared - Shared components, hooks, and utilities
 * - @/lib - Library utilities
 * - @/types - Type definitions
 * - @/config - Configuration
 */

// Core Services
export * as Core from './core';

// Features
export * as Features from './features';

// Shared Resources
export * as Shared from './shared';

// Types
export * as Types from './types';

// Config
export * as Config from './config';

// Legacy exports (for backward compatibility)
export * from './services'; // @deprecated Use @/core instead
export * from './components'; // @deprecated Use @/features or @/shared instead
