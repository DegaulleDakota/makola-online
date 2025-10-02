// src/components/AdminLogin.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ADMIN_SESSION_KEY = "mk_admin_session";
const BUILD_TAG = "rpc-login-01"; // visible marker so we know this build is live

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    // helps confirm which build is running
    console.log("BUILD:", BUILD_TAG);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      console.log("[ADMIN] submit", { normalizedEmail });

      // IMPORTANT: argument names MUST match the SQL function params
      const { data, error: rpcError } = await supabase.rpc("verify_admin_login", {
        p_email: normalizedEmail,
        p_password: password,
      });

      console.log("[ADMIN] RPC result", { data, rpcError });

      if (rpcError) throw rpcError;

      const rows: any[] = Array.isArray(data) ? data : data ? [data] : [];
      if (!rows.length) {
        throw new Error("Invalid credentials");
      }

      // Create admin session used by your guards
      const session = {
        email: normalizedEmail,
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));

      navigate("/admin");
    } catch (err: any) {
      console.error("[ADMIN] login error", err);
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">
            Everything Market Ghana Admin
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-8 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>

            <p className="text-center text-xs text-gray-400 mt-2">
              build: {BUILD_TAG}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
