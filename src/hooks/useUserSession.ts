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
  // =====================
  // AUTH DISABLED
  // The following session logic is commented out for maintenance or disabling auth.
  // const [session, setSession] = useState<UserSession | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   const storedUserId = localStorage.getItem(USER_ID_KEY);
  //   const storedAccessTime = localStorage.getItem(ACCESS_TIME_KEY);
  //   if (storedUserId && storedAccessTime) {
  //     setSession({
  //       userId: parseInt(storedUserId, 10),
  //       accessTime: storedAccessTime,
  //     });
  //   }
  //   setIsLoading(false);
  // }, []);
  // const initializeSession = useCallback((): UserSession => {
  //   if (typeof window === "undefined") {
  //     throw new Error("Cannot initialize session on server");
  //   }
  //   const storedUserId = localStorage.getItem(USER_ID_KEY);
  //   const storedAccessTime = localStorage.getItem(ACCESS_TIME_KEY);
  //   if (storedUserId && storedAccessTime) {
  //     const existingSession: UserSession = {
  //       userId: parseInt(storedUserId, 10),
  //       accessTime: storedAccessTime,
  //     };
  //     setSession(existingSession);
  //     return existingSession;
  //   }
  //   // Create new session
  //   const newSession: UserSession = {
  //     userId: Date.now(),
  //     accessTime: new Date().toISOString(),
  //   };
  //   localStorage.setItem(USER_ID_KEY, String(newSession.userId));
  //   localStorage.setItem(ACCESS_TIME_KEY, newSession.accessTime);
  //   setSession(newSession);
  //   return newSession;
  // }, []);
  // Initialize session state and helpers using localStorage
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUserId = localStorage.getItem(USER_ID_KEY);
    const storedAccessTime = localStorage.getItem(ACCESS_TIME_KEY);
    if (storedUserId && storedAccessTime) {
      const restored = {
        userId: parseInt(storedUserId, 10),
        accessTime: storedAccessTime,
      };
      setSession(restored);
    }
    setIsLoading(false);
  }, []);

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

    const newSession: UserSession = {
      userId: Date.now(),
      accessTime: new Date().toISOString(),
    };
    localStorage.setItem(USER_ID_KEY, String(newSession.userId));
    localStorage.setItem(ACCESS_TIME_KEY, newSession.accessTime);
    setSession(newSession);
    return newSession;
  }, []);

  const updateAccessTime = useCallback(() => {
    if (!session) return;
    const updated = { ...session, accessTime: new Date().toISOString() };
    localStorage.setItem(ACCESS_TIME_KEY, updated.accessTime);
    setSession(updated);
  }, [session]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(ACCESS_TIME_KEY);
    setSession(null);
  }, []);

  const hasExistingSession = Boolean(session);

  return {
    session,
    isLoading,
    initializeSession,
    updateAccessTime,
    clearSession,
    hasExistingSession,
  };
}
