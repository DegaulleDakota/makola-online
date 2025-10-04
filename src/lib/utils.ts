import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Normalize Ghana phone numbers to +233XXXXXXXXX (E.164).
// Accepts "0538336700", "+233538336700", or "233538336700".
// Returns "+233538336700" or null if it can't be normalized.
export function normalizeGhPhone(input: string): string | null {
  if (!input) return null;

  // keep only digits and leading '+'
  let raw = input.trim().replace(/[^\d+]/g, "");

  // Already +233XXXXXXXXX
  if (/^\+233\d{9}$/.test(raw)) return raw;

  // 0XXXXXXXXX  -> +233XXXXXXXXX
  if (/^0\d{9}$/.test(raw)) return "+233" + raw.slice(1);

  // 233XXXXXXXXX -> +233XXXXXXXXX
  if (/^233\d{9}$/.test(raw)) return "+" + raw;

  return null; // reject anything else (e.g., 9-digit local w/o 0)
}