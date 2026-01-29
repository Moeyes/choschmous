/**
 * Database Module Exports
 * @deprecated Use feature-specific exports instead
 * 
 * Note: This module is kept for backward compatibility
 * New code should import from feature modules directly
 */

export { prisma, default } from './prisma';

// Re-export from new structure
export * from '@/src/features/registration/hooks';
export * from '@/src/core/events';
