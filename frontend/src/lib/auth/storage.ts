import type { Role, User } from "@/types";

const ACTIVE_TOKEN_KEY = "concert_auth_token";
const ACTIVE_USER_KEY = "concert_auth_user";
const SESSION_USER_KEY = "concert_auth_session_user";
const SESSION_ADMIN_KEY = "concert_auth_session_admin";

export type PortalRole = "user" | "admin";

interface StoredSession {
  token: string;
  user: User;
}

function sessionStorageKey(portal: PortalRole): string {
  return portal === "admin" ? SESSION_ADMIN_KEY : SESSION_USER_KEY;
}

export function toPortalRole(role: Role): PortalRole {
  return role === "ADMIN" ? "admin" : "user";
}

function readSession(portal: PortalRole): StoredSession | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(sessionStorageKey(portal));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

function writeSession(portal: PortalRole, session: StoredSession): void {
  localStorage.setItem(sessionStorageKey(portal), JSON.stringify(session));
}

function setActiveSession(session: StoredSession): void {
  localStorage.setItem(ACTIVE_TOKEN_KEY, session.token);
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(session.user));
}

function migrateLegacySession(): void {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem(ACTIVE_TOKEN_KEY);
  const rawUser = localStorage.getItem(ACTIVE_USER_KEY);
  if (!token || !rawUser) return;

  try {
    const user = JSON.parse(rawUser) as User;
    const portal = toPortalRole(user.role);
    if (!readSession(portal)) {
      writeSession(portal, { token, user });
    }
  } catch {
    // ignore invalid legacy data
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  migrateLegacySession();
  return localStorage.getItem(ACTIVE_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  migrateLegacySession();

  const raw = localStorage.getItem(ACTIVE_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: User): void {
  const session = { token, user };
  writeSession(toPortalRole(user.role), session);
  setActiveSession(session);
}

export function getSessionForPortal(portal: PortalRole): StoredSession | null {
  migrateLegacySession();
  return readSession(portal);
}

export function switchActiveSession(portal: PortalRole): User | null {
  migrateLegacySession();

  const session = readSession(portal);
  if (!session) return null;

  setActiveSession(session);
  return session.user;
}

export function clearAuth(): void {
  localStorage.removeItem(ACTIVE_TOKEN_KEY);
  localStorage.removeItem(ACTIVE_USER_KEY);
  localStorage.removeItem(SESSION_USER_KEY);
  localStorage.removeItem(SESSION_ADMIN_KEY);
}

export function clearSessionForPortal(portal: PortalRole): void {
  localStorage.removeItem(sessionStorageKey(portal));

  const activeUser = getStoredUser();
  if (activeUser && toPortalRole(activeUser.role) === portal) {
    localStorage.removeItem(ACTIVE_TOKEN_KEY);
    localStorage.removeItem(ACTIVE_USER_KEY);
  }
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "ADMIN";
}
