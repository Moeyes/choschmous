"use client";

import { useState, useEffect, useCallback } from "react";

const USER_ID_KEY = "registration_user_id";
const ACCESS_TIME_KEY = "registration_access_time";

interface UserSession {
  userId: number;
  accessTime: string;
}

interface UseUserSessionReturn {
  session: UserSession | null;
  isLoading: boolean;
  initializeSession: () => UserSession;
  updateAccessTime: () => void;
  clearSession: () => void;
  hasExistingSession: boolean;
}

/**
 * Hook to manage user session for registration tracking.
 * Uses localStorage to persist session data across browser sessions.
 */
export function useUserSession(): UseUserSessionReturn {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUserId = localStorage.getItem(USER_ID_KEY);
    const storedAccessTime = localStorage.getItem(ACCESS_TIME_KEY);

    if (storedUserId && storedAccessTime) {
      setSession({
        userId: parseInt(storedUserId, 10),
        accessTime: storedAccessTime,
      });
    }

    setIsLoading(false);
  }, []);

  /**
   * Initialize a new session or return existing one.
   * Creates a new userId if none exists.
   */
  const initializeSession = useCallback((): UserSession => {
    if (typeof window === "undefined") {
      throw new Error("Cannot initialize session on server");
    }

    const storedUserId = localStorage.getItem(USER_ID_KEY);
    const storedAccessTime = localStorage.getItem(ACCESS_TIME_KEY);

    if (storedUserId && storedAccessTime) {
      const existingSession: UserSession = {
        userId: parseInt(storedUserId, 10),
        accessTime: storedAccessTime,
      };
      setSession(existingSession);
      return existingSession;
    }

    // Create new session
    const newSession: UserSession = {
      userId: Date.now(),
      accessTime: new Date().toISOString(),
    };

    localStorage.setItem(USER_ID_KEY, String(newSession.userId));
    localStorage.setItem(ACCESS_TIME_KEY, newSession.accessTime);
    setSession(newSession);

    return newSession;
  }, []);

  /**
   * Update the access time for the current session.
   */
  const updateAccessTime = useCallback(() => {
    if (typeof window === "undefined" || !session) return;

    const newAccessTime = new Date().toISOString();
    localStorage.setItem(ACCESS_TIME_KEY, newAccessTime);
    
    setSession(prev => prev ? { ...prev, accessTime: newAccessTime } : null);
  }, [session]);

  /**
   * Clear the current session.
   */
  const clearSession = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(ACCESS_TIME_KEY);
    setSession(null);
  }, []);

  const hasExistingSession = session !== null;

  return {
    session,
    isLoading,
    initializeSession,
    updateAccessTime,
    clearSession,
    hasExistingSession,
  };
}
