import prisma from '../prisma';
import type { Event, Prisma } from '../../generated/prisma';

export type CreateEventInput = {
  code: string;
  nameKh: string;
  nameEn?: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  locationKh?: string;
  status?: string;
};

export type EventWithRelations = Event & {
  eventSports?: {
    sport: {
      id: string;
      code: string;
      nameKh: string;
      nameEn: string | null;
    };
  }[];
  _count?: {
    registrations: number;
  };
};

export const eventService = {
  /**
   * Get all events
   */
  async findAll(options?: {
    status?: string;
    includeSports?: boolean;
    includeCount?: boolean;
  }): Promise<EventWithRelations[]> {
    const where: Prisma.EventWhereInput = {};
    if (options?.status) {
      where.status = options.status;
    }

    return prisma.event.findMany({
      where,
      include: {
        eventSports: options?.includeSports
          ? {
              include: {
                sport: {
                  select: {
                    id: true,
                    code: true,
                    nameKh: true,
                    nameEn: true,
                  },
                },
              },
            }
          : false,
        _count: options?.includeCount
          ? {
              select: { registrations: true },
            }
          : false,
      },
      orderBy: { startDate: 'asc' },
    });
  },

  /**
   * Find event by ID
   */
  async findById(id: string, includeSports = false): Promise<EventWithRelations | null> {
    return prisma.event.findUnique({
      where: { id },
      include: {
        eventSports: includeSports
          ? {
              include: {
                sport: {
                  select: {
                    id: true,
                    code: true,
                    nameKh: true,
                    nameEn: true,
                  },
                },
              },
            }
          : false,
        _count: {
          select: { registrations: true },
        },
      },
    });
  },

  /**
   * Find event by code
   */
  async findByCode(code: string): Promise<Event | null> {
    return prisma.event.findUnique({
      where: { code },
    });
  },

  /**
   * Get upcoming events
   */
  async findUpcoming(limit?: number): Promise<EventWithRelations[]> {
    return prisma.event.findMany({
      where: {
        startDate: { gte: new Date() },
        status: 'upcoming',
      },
      include: {
        eventSports: {
          include: {
            sport: {
              select: {
                id: true,
                code: true,
                nameKh: true,
                nameEn: true,
              },
            },
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startDate: 'asc' },
      take: limit,
    });
  },

  /**
   * Get trending events (most registrations)
   */
  async findTrending(limit = 5): Promise<EventWithRelations[]> {
    return prisma.event.findMany({
      where: {
        status: { in: ['upcoming', 'ongoing'] },
      },
      include: {
        eventSports: {
          include: {
            sport: {
              select: {
                id: true,
                code: true,
                nameKh: true,
                nameEn: true,
              },
            },
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: {
        registrations: {
          _count: 'desc',
        },
      },
      take: limit,
    });
  },

  /**
   * Create a new event
   */
  async create(data: CreateEventInput): Promise<Event> {
    return prisma.event.create({
      data,
    });
  },

  /**
   * Create event with sports
   */
  async createWithSports(data: CreateEventInput, sportIds: string[]): Promise<Event> {
    return prisma.event.create({
      data: {
        ...data,
        eventSports: {
          create: sportIds.map((sportId) => ({
            sportId,
          })),
        },
      },
    });
  },

  /**
   * Update event
   */
  async update(id: string, data: Partial<CreateEventInput>): Promise<Event> {
    return prisma.event.update({
      where: { id },
      data,
    });
  },

  /**
   * Add sports to event
   */
  async addSports(eventId: string, sportIds: string[]): Promise<void> {
    await prisma.eventSport.createMany({
      data: sportIds.map((sportId) => ({
        eventId,
        sportId,
      })),
      skipDuplicates: true,
    });
  },

  /**
   * Remove sport from event
   */
  async removeSport(eventId: string, sportId: string): Promise<void> {
    await prisma.eventSport.delete({
      where: {
        eventId_sportId: {
          eventId,
          sportId,
        },
      },
    });
  },

  /**
   * Delete event
   */
  async delete(id: string): Promise<Event> {
    return prisma.event.delete({
      where: { id },
    });
  },

  /**
   * Get registration statistics for an event
   */
  async getRegistrationStats(eventId: string) {
    const [total, byStatus, bySport] = await Promise.all([
      prisma.registration.count({ where: { eventId } }),
      prisma.registration.groupBy({
        by: ['status'],
        where: { eventId },
        _count: true,
      }),
      prisma.registration.groupBy({
        by: ['sportId'],
        where: { eventId },
        _count: true,
      }),
    ]);

    return { total, byStatus, bySport };
  },
};
