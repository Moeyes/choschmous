import prisma from '../prisma';
import type { Registration, Prisma } from '../../generated/prisma';

export type CreateRegistrationInput = {
  // Personal Info
  firstName: string;
  lastName: string;
  firstNameKh?: string;
  lastNameKh?: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';

  // Identification
  nationalityType: 'IDCard' | 'Passport';
  nationalId: string;
  phone?: string;
  photoUrl?: string;

  // Position
  role: 'Athlete' | 'Leader' | 'Technical';
  coachType?: string;
  assistantType?: string;
  leaderRole?: string;
  athleteCategory?: string;

  // References
  organizationId: string;
  eventId: string;
  sportId: string;
  sportCategoryId?: string;
};

export type RegistrationWithRelations = Registration & {
  organization: {
    id: string;
    code: string;
    type: string;
    nameKh: string;
    provinceKh: string | null;
    departmentKh: string | null;
  };
  event: {
    id: string;
    code: string;
    nameKh: string;
  };
  sport: {
    id: string;
    code: string;
    nameKh: string;
  };
  sportCategory: {
    id: string;
    nameKh: string;
  } | null;
};

export type RegistrationFilters = {
  eventId?: string;
  organizationId?: string;
  sportId?: string;
  status?: string;
  role?: string;
  gender?: string;
  search?: string;
};

export const registrationService = {
  /**
   * Get all registrations with filters
   */
  async findAll(
    filters?: RegistrationFilters,
    pagination?: { page: number; limit: number }
  ): Promise<{ data: RegistrationWithRelations[]; total: number }> {
    const where: Prisma.RegistrationWhereInput = {};

    if (filters?.eventId) where.eventId = filters.eventId;
    if (filters?.organizationId) where.organizationId = filters.organizationId;
    if (filters?.sportId) where.sportId = filters.sportId;
    if (filters?.status) where.status = filters.status;
    if (filters?.role) where.role = filters.role;
    if (filters?.gender) where.gender = filters.gender;

    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { firstNameKh: { contains: filters.search } },
        { lastNameKh: { contains: filters.search } },
        { nationalId: { contains: filters.search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        include: {
          organization: {
            select: {
              id: true,
              code: true,
              type: true,
              nameKh: true,
              provinceKh: true,
              departmentKh: true,
            },
          },
          event: {
            select: {
              id: true,
              code: true,
              nameKh: true,
            },
          },
          sport: {
            select: {
              id: true,
              code: true,
              nameKh: true,
            },
          },
          sportCategory: {
            select: {
              id: true,
              nameKh: true,
            },
          },
        },
        orderBy: { registeredAt: 'desc' },
        skip: pagination ? (pagination.page - 1) * pagination.limit : undefined,
        take: pagination?.limit,
      }),
      prisma.registration.count({ where }),
    ]);

    return { data, total };
  },

  /**
   * Find registration by ID
   */
  async findById(id: string): Promise<RegistrationWithRelations | null> {
    return prisma.registration.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            code: true,
            type: true,
            nameKh: true,
            provinceKh: true,
            departmentKh: true,
          },
        },
        event: {
          select: {
            id: true,
            code: true,
            nameKh: true,
          },
        },
        sport: {
          select: {
            id: true,
            code: true,
            nameKh: true,
          },
        },
        sportCategory: {
          select: {
            id: true,
            nameKh: true,
          },
        },
      },
    });
  },

  /**
   * Find by national ID (check for duplicates)
   */
  async findByNationalId(nationalId: string, eventId?: string): Promise<Registration | null> {
    return prisma.registration.findFirst({
      where: {
        nationalId,
        ...(eventId ? { eventId } : {}),
      },
    });
  },

  /**
   * Create a new registration
   */
  async create(data: CreateRegistrationInput): Promise<Registration> {
    // Check for duplicate in same event
    const existing = await this.findByNationalId(data.nationalId, data.eventId);
    if (existing) {
      throw new Error('Participant already registered for this event');
    }

    return prisma.registration.create({
      data,
    });
  },

  /**
   * Update registration
   */
  async update(id: string, data: Partial<CreateRegistrationInput>): Promise<Registration> {
    return prisma.registration.update({
      where: { id },
      data,
    });
  },

  /**
   * Update registration status
   */
  async updateStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected' | 'cancelled',
    approvedBy?: string
  ): Promise<Registration> {
    return prisma.registration.update({
      where: { id },
      data: {
        status,
        approvedAt: status === 'approved' ? new Date() : null,
        approvedBy: status === 'approved' ? approvedBy : null,
      },
    });
  },

  /**
   * Bulk update status
   */
  async bulkUpdateStatus(
    ids: string[],
    status: 'pending' | 'approved' | 'rejected' | 'cancelled',
    approvedBy?: string
  ): Promise<number> {
    const result = await prisma.registration.updateMany({
      where: { id: { in: ids } },
      data: {
        status,
        approvedAt: status === 'approved' ? new Date() : null,
        approvedBy: status === 'approved' ? approvedBy : null,
      },
    });
    return result.count;
  },

  /**
   * Delete registration
   */
  async delete(id: string): Promise<Registration> {
    return prisma.registration.delete({
      where: { id },
    });
  },

  /**
   * Get statistics
   */
  async getStats(eventId?: string) {
    const where = eventId ? { eventId } : {};

    const [total, byStatus, byRole, bySport, byOrganization] = await Promise.all([
      prisma.registration.count({ where }),
      prisma.registration.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.registration.groupBy({
        by: ['role'],
        where,
        _count: true,
      }),
      prisma.registration.groupBy({
        by: ['sportId'],
        where,
        _count: true,
      }),
      prisma.registration.groupBy({
        by: ['organizationId'],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
      byRole: Object.fromEntries(byRole.map((r) => [r.role, r._count])),
      bySport,
      byOrganization,
    };
  },

  /**
   * Get recommendations for a user based on their history
   */
  async getRecommendations(userId: string, limit = 5) {
    // Find user's past registrations to understand preferences
    const userRegistrations = await prisma.registration.findMany({
      where: {
        OR: [{ nationalId: userId }, { id: userId }],
      },
      include: {
        sport: true,
        organization: true,
      },
    });

    if (userRegistrations.length === 0) {
      // Return popular events for new users
      return prisma.event.findMany({
        where: { status: 'upcoming' },
        include: {
          _count: { select: { registrations: true } },
        },
        orderBy: { registrations: { _count: 'desc' } },
        take: limit,
      });
    }

    // Get user's preferred sports
    const preferredSportIds = [...new Set(userRegistrations.map((r) => r.sportId))];

    // Find events with those sports
    return prisma.event.findMany({
      where: {
        status: 'upcoming',
        eventSports: {
          some: {
            sportId: { in: preferredSportIds },
          },
        },
      },
      include: {
        eventSports: {
          include: { sport: true },
        },
        _count: { select: { registrations: true } },
      },
      orderBy: { startDate: 'asc' },
      take: limit,
    });
  },
};
