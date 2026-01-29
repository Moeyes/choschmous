import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** String utilities */
export const slug = (s: string) => 
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const ensureArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

export const ensureStringArray = (value: unknown): string[] => 
  ensureArray(value).map(String)

/** Date utilities */
export const toISODate = (date?: Date | string | number) => {
  const d = date ? new Date(date) : new Date()
  return d.toISOString().split('T')[0]
}

export const toISODateTime = (date?: Date | string | number) => {
  const d = date ? new Date(date) : new Date()
  return d.toISOString()
}

/** Object utilities */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) result[key] = obj[key]
  })
  return result
}

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

/** Safe JSON operations */
export const safeJsonParse = <T = unknown>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export const safeJsonStringify = (value: unknown, fallback = '{}'): string => {
  try {
    return JSON.stringify(value)
  } catch {
    return fallback
  }
}