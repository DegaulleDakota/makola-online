// src/admin/auth.ts

// Keep this exactly in sync with AdminLogin.tsx
const ADMIN_SESSION_KEY = "mk_admin_session";

type AdminSession = {
  email: string;
  // unix ms timestamp; if missing, treat as valid
  expires?: number;
};

function readSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as AdminSession | null;
    if (!obj || !obj.email) return null;

    // expire if set and in the past
    if (typeof obj.expires === "number" && Date.now() > obj.expires) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return obj;
  } catch {
    // bad JSON → clear it
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
}

export function isAdminAuthed(): boolean {
  return !!readSession();
}

export function currentAdminEmail(): string | null {
  return readSession()?.email ?? null;
}

export function setAdminSession(email: string, hoursValid = 24): void {
  const expires =
    hoursValid > 0 ? Date.now() + hoursValid * 60 * 60 * 1000 : undefined;
  const session: AdminSession = { email, expires };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

// (Optional) simple dev helper; safe to remove in production
export function adminLoginDev(email: string): void {
  setAdminSession(email, 24);
}
