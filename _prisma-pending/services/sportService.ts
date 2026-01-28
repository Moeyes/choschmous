import prisma from '../prisma';
import type { Sport, SportCategory } from '../../generated/prisma';

export type CreateSportInput = {
  code: string;
  nameKh: string;
  nameEn?: string;
  icon?: string;
};

export type CreateSportCategoryInput = {
  sportId: string;
  nameKh: string;
  nameEn?: string;
  gender?: 'Male' | 'Female' | 'Mixed';
};

export type SportWithCategories = Sport & {
  categories: SportCategory[];
};

export const sportService = {
  /**
   * Get all sports
   */
  async findAll(includeCategories = false): Promise<Sport[] | SportWithCategories[]> {
    return prisma.sport.findMany({
      include: {
        categories: includeCategories,
      },
      orderBy: { nameKh: 'asc' },
    });
  },

  /**
   * Find sport by ID
   */
  async findById(id: string, includeCategories = false): Promise<Sport | SportWithCategories | null> {
    return prisma.sport.findUnique({
      where: { id },
      include: {
        categories: includeCategories,
      },
    });
  },

  /**
   * Find sport by code
   */
  async findByCode(code: string): Promise<Sport | null> {
    return prisma.sport.findUnique({
      where: { code },
    });
  },

  /**
   * Get sports for an event
   */
  async findByEventId(eventId: string): Promise<Sport[]> {
    const eventSports = await prisma.eventSport.findMany({
      where: { eventId },
      include: {
        sport: {
          include: {
            categories: true,
          },
        },
      },
    });

    return eventSports.map((es) => es.sport);
  },

  /**
   * Create a new sport
   */
  async create(data: CreateSportInput): Promise<Sport> {
    return prisma.sport.create({
      data,
    });
  },

  /**
   * Upsert sport
   */
  async upsert(data: CreateSportInput): Promise<Sport> {
    return prisma.sport.upsert({
      where: { code: data.code },
      create: data,
      update: {
        nameKh: data.nameKh,
        nameEn: data.nameEn,
        icon: data.icon,
      },
    });
  },

  /**
   * Update sport
   */
  async update(id: string, data: Partial<CreateSportInput>): Promise<Sport> {
    return prisma.sport.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete sport
   */
  async delete(id: string): Promise<Sport> {
    return prisma.sport.delete({
      where: { id },
    });
  },

  // Sport Categories

  /**
   * Get categories for a sport
   */
  async findCategories(sportId: string): Promise<SportCategory[]> {
    return prisma.sportCategory.findMany({
      where: { sportId },
      orderBy: { nameKh: 'asc' },
    });
  },

  /**
   * Create sport category
   */
  async createCategory(data: CreateSportCategoryInput): Promise<SportCategory> {
    return prisma.sportCategory.create({
      data,
    });
  },

  /**
   * Update sport category
   */
  async updateCategory(id: string, data: Partial<CreateSportCategoryInput>): Promise<SportCategory> {
    return prisma.sportCategory.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete sport category
   */
  async deleteCategory(id: string): Promise<SportCategory> {
    return prisma.sportCategory.delete({
      where: { id },
    });
  },

  /**
   * Get popular sports (most registrations)
   */
  async findPopular(limit = 10) {
    return prisma.sport.findMany({
      include: {
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
};
