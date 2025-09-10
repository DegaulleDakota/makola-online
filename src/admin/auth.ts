// src/admin/auth.ts

const ADMIN_KEY = "mk_admin_session";

export function isAdminAuthed(): boolean {
  const session = localStorage.getItem(ADMIN_KEY);
  if (!session) return false;
  
  try {
    const { email, expires } = JSON.parse(session);
    return Date.now() < expires;
  } catch {
    return false;
  }
}

export function currentAdminEmail(): string | null {
  const session = localStorage.getItem(ADMIN_KEY);
  if (!session) return null;
  
  try {
    const { email, expires } = JSON.parse(session);
    return Date.now() < expires ? email : null;
  } catch {
    return null;
  }
}

export function adminLogin(email: string, password: string): boolean {
  // Simple hardcoded admin credentials for demo
  if (email === "admin@makola.com" && password === "admin123") {
    const session = {
      email,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    localStorage.setItem(ADMIN_KEY, JSON.stringify(session));
    return true;
  }
  return false;
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_KEY);
}