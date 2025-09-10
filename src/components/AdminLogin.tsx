import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import WhatsAppOTP from './WhatsAppOTP';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [adminPhone, setAdminPhone] = useState('0558271127');
  const navigate = useNavigate();

  useEffect(() => {
    // Load admin WhatsApp number from settings
    loadAdminPhone();
  }, []);

  const loadAdminPhone = async () => {
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('admin_whatsapp_otp')
        .single();
      
      if (data?.admin_whatsapp_otp) {
        setAdminPhone(data.admin_whatsapp_otp);
      }
    } catch (error) {
      // Use default if not found
      console.log('Using default admin phone');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First verify credentials
      const { data: authData, error: authError } = await supabase.functions.invoke('admin-auth', {
        body: { email: email.toLowerCase().trim(), password }
      });

      if (authError || !authData?.success) {
        throw new Error('Invalid credentials');
      }

      // Check if user is admin in database
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (adminError || !adminData) {
        throw new Error('Access denied - not an admin');
      }

      // Show WhatsApp OTP instead of logging in directly
      setShowOTP(true);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = async (success: boolean) => {
    if (success) {
      // Check if password reset is required
      const { data: adminData } = await supabase
        .from('admins')
        .select('password_reset_required')
        .eq('email', email.toLowerCase().trim())
        .single();

      // Store admin session
      localStorage.setItem('makola_admin_email', email.toLowerCase().trim());
      localStorage.setItem('makola_admin_role', 'super_admin');
      
      // Redirect to change password if required, otherwise to admin dashboard
      if (adminData?.password_reset_required) {
        navigate('/admin/change-password');
      } else {
        navigate('/admin');
      }
    } else {
      setError('OTP verification failed');
      setShowOTP(false);
    }
  };

  if (showOTP) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <WhatsAppOTP
          phoneNumber={adminPhone}
          onVerified={handleOTPVerified}
          purpose="login"
          adminEmail={email}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">
            Makola Online Admin
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Continue to WhatsApp OTP'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              After password verification, you'll receive a WhatsApp OTP
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;