/**
 * Database Module Exports
 * 
 * Note: Database services (eventService, sportService, etc.) are prepared
 * for future integration but require a complete Prisma schema.
 * Currently the app uses JSON mock files for data storage.
 */

export { prisma, default } from './prisma';

// Export hooks that are currently used
export { useRegister } from '@/src/hooks/useRegister';
export { useRegistrationForm } from '@/src/hooks/useRegistrationForm';
export * from '@/src/services/eventBus';

// TODO: Enable these once Prisma schema is complete
// export * from './services/organizationService';
// export * from './services/eventService';
// export * from './services/sportService';
// export * from './services/registrationService';
