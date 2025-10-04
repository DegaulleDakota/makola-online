// src/auth/session.ts
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isAdminAuthed, currentAdminEmail } from "@/admin/auth";
import { normalizeGhPhone } from "@/lib/utils";

/** -------- Seller session (stored in localStorage) -------- */
type SellerSession = { sellerId: string; name: string; whatsapp: string } | null;

const SELLER_KEY = "mk_current_seller";

function loadSeller(): SellerSession {
  const raw = localStorage.getItem(SELLER_KEY);
  return raw ? (JSON.parse(raw) as SellerSession) : null;
}

export function setSellerSession(s: SellerSession) {
  if (s) localStorage.setItem(SELLER_KEY, JSON.stringify(s));
  else localStorage.removeItem(SELLER_KEY);
  // notify listeners (guards, header badges, etc.)
  window.dispatchEvent(new Event("storage"));
}

/** -------- Context shape -------- */
type AuthState = {
  seller: SellerSession;
  isAdmin: boolean;
  adminEmail: string | null;

  /** Clears only seller session */
  logoutSeller: () => void;

  /** Forces context to re-read from storage */
  refresh: () => void;

  /** NEW: simple seller “login” by phone (or email if you add later) */
  login: (identifier: string) => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

/** -------- Provider -------- */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [seller, setSeller] = useState<SellerSession>(loadSeller());
  const [isAdm, setIsAdm] = useState<boolean>(isAdminAuthed());
  const [admEmail, setAdmEmail] = useState<string | null>(currentAdminEmail());

  function refresh() {
    setSeller(loadSeller());
    setIsAdm(isAdminAuthed());
    setAdmEmail(currentAdminEmail());
  }

  function logoutSeller() {
    setSellerSession(null);
    refresh();
  }

  /** Minimal seller login:
   *  - Normalizes GH phone numbers to +233XXXXXXXXX
   *  - Saves a lightweight session used by RequireSeller()
   *  - Later we can verify against DB if needed
   */
  async function login(identifier: string) {
    const raw = (identifier || "").trim();

    // for now we treat everything as phone and normalize
    const phone = normalizeGhPhone(raw);
    if (!phone) throw new Error("Enter a valid Ghana phone number");

    const session: SellerSession = {
      sellerId: `local-${phone}`, // placeholder id for guard usage
      name: "",
      whatsapp: phone,
    };

    setSellerSession(session);
    refresh();

    // small trace so we can confirm in console
    console.log("[Auth] seller login ok:", session);
  }

  useEffect(() => {
    const cb = () => refresh();
    window.addEventListener("storage", cb);
    return () => window.removeEventListener("storage", cb);
  }, []);

  const value = useMemo(
    () => ({
      seller,
      isAdmin: isAdm,
      adminEmail: admEmail,
      logoutSeller,
      refresh,
      login,
    }),
    [seller, isAdm, admEmail]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

/** -------- Hook -------- */
export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}