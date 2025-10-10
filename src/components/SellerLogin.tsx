// src/components/SellerLogin.tsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { normalizeGhPhone } from "@/lib/utils";
import { setSellerSession } from "@/auth/session";

type RpcRow = {
  id: string;
  business_name: string | null;
  whatsapp_number: string | null;
};

export default function SellerLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as any)?.from || "/seller";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    const normalized = normalizeGhPhone(phone.trim());
    if (!normalized) {
      setErr("Enter a valid Ghana phone number (e.g. 053… or +23353…).");
      return;
    }
    if (!password.trim()) {
      setErr("Password is required.");
      return;
    }

    setLoading(true);
    try {
      // ✅ EXACT match to your SQL: verify_seller_login(p_phone text, p_password text)
      const { data, error } = await supabase.rpc("verify_seller_login", {
        p_phone: normalized,
        p_password: password,
      });

      if (error) throw error;

      const rows: RpcRow[] = Array.isArray(data) ? data : [];
      if (!rows.length) throw new Error("Invalid phone or password.");

      const row = rows[0];
      const sellerId = row.id; // uuid from DB
      const name = row.business_name ?? "Seller";
      const whatsapp = row.whatsapp_number ?? normalized;

      setSellerSession({ sellerId, name, whatsapp });
      navigate(redirectTo, { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">Seller Login</CardTitle>
          <CardDescription>Use your Ghana phone number and password</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {err && (
              <Alert variant="destructive">
                <AlertDescription>{err}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Ghana)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0538336700 or +233538336700"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-8 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Button type="submit" className="w-[70%]" disabled={loading}>
                {loading ? "Logging in..." : "Login to Dashboard"}
              </Button>
              <Link to="/seller/reset-password" className="text-sm text-emerald-700 hover:text-emerald-800">
                Forgot password?
              </Link>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/sell" className="text-emerald-700 hover:text-emerald-800">
                Start selling
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}