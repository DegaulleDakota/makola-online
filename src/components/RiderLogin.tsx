import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bike, Phone } from "lucide-react";
import WhatsAppOTP from "./WhatsAppOTP";

interface RiderLoginProps {
  onSuccess: () => void;
}

export default function RiderLogin({ onSuccess }: RiderLoginProps) {
  const [phone, setPhone] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    
    try {
      // Send OTP via WhatsApp
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowOTP(true);
    } catch (error) {
      console.error("Failed to send OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = () => {
    // Set rider session and redirect
    localStorage.setItem('makola_rider_phone', phone);
    onSuccess();
  };

  if (showOTP) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <WhatsAppOTP
          phoneNumber={phone}
          onVerified={handleOTPVerified}
          onBack={() => setShowOTP(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Bike className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Rider Login</CardTitle>
          <CardDescription>
            Enter your phone number to access your rider dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="phone"
                type="tel"
                placeholder="0551234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleSendOTP}
            disabled={!phone.trim() || loading}
            className="w-full"
          >
            {loading ? "Sending..." : "Send WhatsApp OTP"}
          </Button>
          
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/rider/register" className="text-blue-600 hover:underline">
              Become a Rider
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}