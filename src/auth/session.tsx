import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isAdminAuthed, currentAdminEmail } from "@/admin/auth";

type SellerSession = { sellerId: string; name: string; whatsapp: string } | null;

const SELLER_KEY = "mk_current_seller";
function loadSeller(): SellerSession {
  const raw = localStorage.getItem(SELLER_KEY);
  return raw ? (JSON.parse(raw) as SellerSession) : null;
}
export function setSellerSession(s: SellerSession) {
  if (s) localStorage.setItem(SELLER_KEY, JSON.stringify(s));
  else localStorage.removeItem(SELLER_KEY);
  window.dispatchEvent(new Event("storage"));
}

type AuthState = {
  seller: SellerSession;
  isAdmin: boolean;
  adminEmail: string | null;
  logoutSeller: () => void;
  refresh: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [seller, setSeller] = useState<SellerSession>(loadSeller());
  const [isAdm, setIsAdm] = useState<boolean>(isAdminAuthed());
  const [admEmail, setAdmEmail] = useState<string | null>(currentAdminEmail());

  function refresh() {
    setSeller(loadSeller());
    setIsAdm(isAdminAuthed());
    setAdmEmail(currentAdminEmail());
  }
  function logoutSeller() { setSellerSession(null); refresh(); }

  useEffect(() => {
    const cb = () => refresh();
    window.addEventListener("storage", cb);
    return () => window.removeEventListener("storage", cb);
  }, []);

  const value = useMemo(() => ({ seller, isAdmin: isAdm, adminEmail: admEmail, logoutSeller, refresh }), [seller, isAdm, admEmail]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}