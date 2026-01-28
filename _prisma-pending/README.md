# Prisma-Pending Files

These files are prepared for future Prisma database integration but are currently incomplete because the Prisma schema has no models defined yet.

## Prerequisites

Before these files can be used:

1. Define models in `prisma/schema.prisma`
2. Run `prisma generate` to create the Prisma client
3. Move these files back to their intended locations:
   - `services/*.ts` → `lib/db/services/`
   - `normalizers/*.ts` → `lib/db/normalizers/`
   - `seed.ts` → `prisma/`
4. Remove the exclusions from `tsconfig.json`
5. Update imports as needed

## Files

### Services
- `eventService.ts` - CRUD operations for events
- `sportService.ts` - CRUD operations for sports
- `organizationService.ts` - CRUD operations for organizations
- `registrationService.ts` - CRUD operations for registrations

### Normalizers
- `registrationNormalizer.ts` - Data normalization for Prisma (older version)

### Seeds
- `seed.ts` - Database seeding script
