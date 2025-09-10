import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

interface WhatsAppOTPProps {
  phoneNumber: string;
  onVerified: (success: boolean) => void;
  purpose: 'login' | 'password_reset';
  adminEmail?: string;
}

const WhatsAppOTP = ({ phoneNumber, onVerified, purpose, adminEmail }: WhatsAppOTPProps) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (otpSent && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, otpSent]);

  const sendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-otp', {
        body: {
          phone: phoneNumber,
          purpose,
          admin_email: adminEmail
        }
      });

      if (error) throw error;

      setOtpSent(true);
      setTimeLeft(600);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (attempts >= 5) {
      setError('Too many attempts. Please try again later.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('verify-whatsapp-otp', {
        body: {
          phone: phoneNumber,
          otp: otp.trim(),
          purpose,
          admin_email: adminEmail
        }
      });

      if (error || !data?.success) {
        setAttempts(prev => prev + 1);
        throw new Error(data?.message || 'Invalid OTP');
      }

      onVerified(true);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
      if (attempts + 1 >= 5) {
        setError('Maximum attempts reached. Account locked for security.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!otpSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold text-green-600">
            WhatsApp Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            We'll send a 6-digit code to your WhatsApp number:
          </p>
          <p className="font-mono text-lg">{phoneNumber}</p>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={sendOTP} 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-green-600">
          Enter Verification Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 text-center">
          Enter the 6-digit code sent to {phoneNumber}
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="123456"
            className="text-center text-lg font-mono"
            disabled={attempts >= 5}
          />
        </div>

        <div className="text-center text-sm text-gray-500">
          Time remaining: {formatTime(timeLeft)}
          <br />
          Attempts: {attempts}/5
        </div>

        <div className="space-y-2">
          <Button 
            onClick={verifyOTP}
            disabled={loading || otp.length !== 6 || attempts >= 5 || timeLeft === 0}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>

          {timeLeft === 0 && (
            <Button 
              onClick={sendOTP}
              variant="outline"
              disabled={loading}
              className="w-full"
            >
              Resend Code
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppOTP;