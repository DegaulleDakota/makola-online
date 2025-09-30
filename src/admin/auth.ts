// src/admin/auth.ts

const ADMIN_EMAIL_KEY = "makola_admin_email";
const ADMIN_ROLE_KEY  = "makola_admin_role";
// Optional: if you still want an expiry window, set (ms). 0 = no expiry check.
const ADMIN_EXPIRY_KEY = "makola_admin_expires";

export function isAdminAuthed(): boolean {
  const email = localStorage.getItem(ADMIN_EMAIL_KEY);
  if (!email) return false;

  const expRaw = localStorage.getItem(ADMIN_EXPIRY_KEY);
  if (!expRaw) return true; // no expiry -> treat as valid
  const exp = Number(expRaw);
  return Number.isFinite(exp) ? Date.now() < exp : true;
}

export function currentAdminEmail(): string | null {
  const email = localStorage.getItem(ADMIN_EMAIL_KEY);
  if (!email) return null;

  const expRaw = localStorage.getItem(ADMIN_EXPIRY_KEY);
  if (!expRaw) return email;
  const exp = Number(expRaw);
  return Number.isFinite(exp) && Date.now() > exp ? null : email;
}

export function setAdminSession(email: string, role: string = "super_admin", hoursValid = 24) {
  localStorage.setItem(ADMIN_EMAIL_KEY, email);
  localStorage.setItem(ADMIN_ROLE_KEY, role);
  // store an expiry (optional). Set hoursValid=0 if you don’t want expiry.
  if (hoursValid > 0) {
    const expiresAt = Date.now() + hoursValid * 60 * 60 * 1000;
    localStorage.setItem(ADMIN_EXPIRY_KEY, String(expiresAt));
  } else {
    localStorage.removeItem(ADMIN_EXPIRY_KEY);
  }
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_EMAIL_KEY);
  localStorage.removeItem(ADMIN_ROLE_KEY);
  localStorage.removeItem(ADMIN_EXPIRY_KEY);
}

/**
 * Dev-only fallback login (kept for local testing).
 * Remove this in production.
 */
export function adminLogin(email: string, password: string): boolean {
  if (email === "admin@makola.com" && password === "admin123") {
    setAdminSession(email, "super_admin", 24);
    return true;
  }
  return false;
}