/**
 * API Client
 * Centralized API request utilities
 */

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

/**
 * Make an API request with standard error handling
 */
async function apiRequest<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `API request failed: ${method} ${url}`)
  }

  return response.json()
}

/**
 * API client for common operations
 */
export const api = {
  get: <T>(url: string) => apiRequest<T>(url, { method: 'GET' }),
  post: <T>(url: string, body: unknown) => apiRequest<T>(url, { method: 'POST', body }),
  put: <T>(url: string, body: unknown) => apiRequest<T>(url, { method: 'PUT', body }),
  delete: (url: string) => apiRequest<void>(url, { method: 'DELETE' }),
}

/**
 * Session storage utilities
 */
export const session = {
  get: <T>(key: string, fallback: T): T => {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch {
      return fallback
    }
  },

  set: (key: string, value: unknown): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn('Session storage error:', err)
    }
  },

  remove: (key: string): void => {
    try {
      sessionStorage.removeItem(key)
    } catch (err) {
      console.warn('Session storage error:', err)
    }
  },

  update: <T>(key: string, updater: (current: T[]) => T[], fallback: T[] = []): void => {
    const current = session.get<T[]>(key, fallback)
    const updated = updater(current)
    session.set(key, updated)
  },
}
