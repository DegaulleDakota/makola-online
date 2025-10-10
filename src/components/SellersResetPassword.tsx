import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { normalizeGhPhone } from "@/lib/utils";

import GlobalHeader from "./GlobalHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Step = "request" | "verify";

export default function SellersResetPassword() {
  const [step, setStep] = useState<Step>("request");

  // step 1
  const [phone, setPhone] = useState("");
  // step 2
  const [token, setToken] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const nav = useNavigate();

  async function onRequest(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");

    const normalized = normalizeGhPhone(phone.trim());
    if (!normalized) {
      setErr("Enter a valid Ghana phone number.");
      return;
    }

    setLoading(true);
    try {
      // RPC created in SQL: start_seller_password_reset(p_phone text)
      const { error } = await supabase.rpc("start_seller_password_reset", {
        p_phone: normalized,
      });
      if (error) throw error;

      setMsg(
        "If this number exists, a reset code has been sent via WhatsApp/SMS. Enter it below with your new password."
      );
      setStep("verify");
    } catch (e: any) {
      setErr(e?.message || "Could not start password reset.");
    } finally {
      setLoading(false);
    }
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!token.trim()) {
      setErr("Enter the reset code you received.");
      return;
    }
    if (!newPwd || newPwd.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      // RPC created in SQL: complete_seller_password_reset(p_token text, p_new_password text)
      const { error } = await supabase.rpc("complete_seller_password_reset", {
        p_token: token.trim(),
        p_new_password: newPwd,
      });
      if (error) throw error;

      setMsg("Password updated. You can now sign in.");
      // small delay so the user sees the success message
      setTimeout(() => nav("/seller/login"), 800);
    } catch (e: any) {
      setErr(e?.message || "Reset failed. Check your code and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <GlobalHeader />
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              Reset Seller Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            {err && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{err}</AlertDescription>
              </Alert>
            )}
            {msg && (
              <Alert className="mb-4">
                <AlertDescription>{msg}</AlertDescription>
              </Alert>
            )}

            {step === "request" ? (
              <form onSubmit={onRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Ghana)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0538336700 or +233538336700"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    We’ll send a reset code to this number.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Sending code..." : "Send Reset Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={onVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Reset Code</Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Enter the code you received"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPwd">New Password</Label>
                  <Input
                    id="newPwd"
                    type={showPwd ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="text-sm text-gray-600 underline"
                    onClick={() => setShowPwd((v) => !v)}
                  >
                    {showPwd ? "Hide password" : "Show password"}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep("request")}
                >
                  Back
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}