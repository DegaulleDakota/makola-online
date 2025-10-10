import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isAdminAuthed, currentAdminEmail } from "@/admin/auth";
import { normalizeGhPhone } from "@/lib/utils";

/** ---- Types ---- */
export type SellerSession =
  | {
      sellerId: string; // e.g. "Local:+2335xxxxx" or "Email:user@example.com"
      whatsapp?: string; // normalized +233...
      email?: string;
      name?: string;
    }
  | null;

/** ---- LocalStorage helpers ---- */
const SELLER_KEY = "mk_current_seller";

function loadSeller(): SellerSession {
  const raw = localStorage.getItem(SELLER_KEY);
  return raw ? (JSON.parse(raw) as SellerSession) : null;
}

export function setSellerSession(s: SellerSession) {
  if (s) {
    localStorage.setItem(SELLER_KEY, JSON.stringify(s));
  } else {
    localStorage.removeItem(SELLER_KEY);
  }
  // notify other tabs/components
  window.dispatchEvent(new Event("storage"));
}

/** ---- Context shape ---- */
type AuthState = {
  seller: SellerSession;
  isAdmin: boolean;
  adminEmail: string | null;

  /** Set a seller session using phone or email */
  login: (identifier: string, opts?: { name?: string }) => Promise<void>;

  logoutSeller: () => void;
  refresh: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

/** ---- Provider ---- */
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

  async function login(identifier: string, opts?: { name?: string }) {
    const raw = (identifier || "").trim();
    if (!raw) throw new Error("Enter your phone or email");

    let sess: SellerSession = null;
    if (raw.includes("@")) {
      // Email path
      const email = raw.toLowerCase();
      sess = {
        sellerId: `Email:${email}`,
        email,
        name: opts?.name,
      };
    } else {
      // Phone path (Ghana)
      const norm = normalizeGhPhone(raw);
      if (!norm) throw new Error("Enter a valid Ghana phone number");
      sess = {
        sellerId: `Local:${norm}`,
        whatsapp: norm,
        name: opts?.name,
      };
    }

    setSellerSession(sess);
    setSeller(sess);
  }

  // keep context in sync across tabs/windows
  useEffect(() => {
    const cb = () => refresh();
    window.addEventListener("storage", cb);
    return () => window.removeEventListener("storage", cb);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      seller,
      isAdmin: isAdm,
      adminEmail: admEmail,
      login,
      logoutSeller,
      refresh,
    }),
    [seller, isAdm, admEmail]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

/** ---- Hook ---- */
export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}