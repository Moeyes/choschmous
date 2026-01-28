import prisma from '../prisma';
import type { Organization } from '../../generated/prisma';

export type CreateOrganizationInput = {
  type: 'province' | 'ministry';
  code: string;
  nameKh: string;
  nameEn?: string;
  provinceKh?: string;
  departmentKh?: string;
};

export const organizationService = {
  /**
   * Get all organizations
   */
  async findAll(): Promise<Organization[]> {
    return prisma.organization.findMany({
      orderBy: { nameKh: 'asc' },
    });
  },

  /**
   * Find organization by ID
   */
  async findById(id: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { id },
    });
  },

  /**
   * Find organization by code
   */
  async findByCode(code: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { code },
    });
  },

  /**
   * Find organizations by type
   */
  async findByType(type: 'province' | 'ministry'): Promise<Organization[]> {
    return prisma.organization.findMany({
      where: { type },
      orderBy: { nameKh: 'asc' },
    });
  },

  /**
   * Create a new organization
   */
  async create(data: CreateOrganizationInput): Promise<Organization> {
    return prisma.organization.create({
      data,
    });
  },

  /**
   * Upsert organization (create if not exists, update if exists)
   */
  async upsert(data: CreateOrganizationInput): Promise<Organization> {
    return prisma.organization.upsert({
      where: { code: data.code },
      create: data,
      update: {
        nameKh: data.nameKh,
        nameEn: data.nameEn,
        provinceKh: data.provinceKh,
        departmentKh: data.departmentKh,
      },
    });
  },

  /**
   * Update organization
   */
  async update(id: string, data: Partial<CreateOrganizationInput>): Promise<Organization> {
    return prisma.organization.update({
      where: { id },
      data,
    });
  },

  /**
   * Delete organization
   */
  async delete(id: string): Promise<Organization> {
    return prisma.organization.delete({
      where: { id },
    });
  },

  /**
   * Get organization with registration count
   */
  async findWithRegistrationCount(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });
  },
};
