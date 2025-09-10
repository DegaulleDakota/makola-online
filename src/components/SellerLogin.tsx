import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, ArrowRight } from "lucide-react";

export default function SellerLogin() {
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/seller";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp.trim()) return;

    setLoading(true);
    try {
      await login(whatsapp.trim());
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">Seller Login</CardTitle>
          <CardDescription>
            Enter your WhatsApp number to access your seller dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+1234567890"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include country code (e.g., +1 for US, +44 for UK)
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !whatsapp.trim()}
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Login to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/sell" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Start selling
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}