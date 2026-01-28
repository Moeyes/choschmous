/**
 * User Session Service
 * Manages user sessions for registration tracking
 * Uses localStorage to persist user ID across browser sessions
 */

const USER_ID_KEY = "choschmous_user_id";
const ACCESS_TIME_KEY = "choschmous_access_time";

export interface UserSession {
  userId: number;
  accessTime: string;
}

/**
 * Generate a unique user ID based on timestamp
 */
function generateUserId(): number {
  return Date.now();
}

/**
 * Get or create a user session
 * Returns existing session if available, otherwise creates new one
 */
export function getUserSession(): UserSession {
  if (typeof window === "undefined") {
    // Server-side: return a temporary session
    return {
      userId: generateUserId(),
      accessTime: new Date().toISOString(),
    };
  }

  const storedUserId = localStorage.getItem(USER_ID_KEY);
  const storedAccessTime = localStorage.getItem(ACCESS_TIME_KEY);

  if (storedUserId && storedAccessTime) {
    return {
      userId: parseInt(storedUserId, 10),
      accessTime: storedAccessTime,
    };
  }

  // Create new session
  const newSession: UserSession = {
    userId: generateUserId(),
    accessTime: new Date().toISOString(),
  };

  localStorage.setItem(USER_ID_KEY, String(newSession.userId));
  localStorage.setItem(ACCESS_TIME_KEY, newSession.accessTime);

  return newSession;
}

/**
 * Update the access time for current session
 */
export function updateAccessTime(): void {
  if (typeof window === "undefined") return;
  
  const newAccessTime = new Date().toISOString();
  localStorage.setItem(ACCESS_TIME_KEY, newAccessTime);
}

/**
 * Clear the user session (for logout or reset)
 */
export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(ACCESS_TIME_KEY);
}

/**
 * Check if user has an existing session
 */
export function hasExistingSession(): boolean {
  if (typeof window === "undefined") return false;
  
  return localStorage.getItem(USER_ID_KEY) !== null;
}
