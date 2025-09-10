import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { localAdapter } from '../lib/localAdapter';
import { AdminSettings as AdminSettingsType } from '../lib/marketplaceAdapter';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettingsType & { admin_whatsapp_otp?: string }>({
    public_whatsapp: '',
    support_email: '',
    livestream_url: '',
    homepage_banner: '',
    admin_whatsapp_otp: '0558271127'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await localAdapter.adminGetSettings();
      setSettings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await localAdapter.adminSetSettings(settings);
      await localAdapter.adminLogAction({
        admin_email: 'admin@makolaonline.com',
        action: 'update_settings',
        meta: { settings }
      });
      
      toast({
        title: "Success",
        description: "Settings updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AdminSettingsType, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage public contact information and system settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Public Contact Information</CardTitle>
          <CardDescription>
            These details are shown publicly on the website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">Public WhatsApp Number</Label>
            <Input
              id="whatsapp"
              placeholder="233XXXXXXXXX"
              value={settings.public_whatsapp}
              onChange={(e) => handleInputChange('public_whatsapp', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Support Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="support@makolaonline.com"
              value={settings.support_email}
              onChange={(e) => handleInputChange('support_email', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Admin authentication and security configuration (Super Admin only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin_whatsapp">Admin WhatsApp OTP Number</Label>
            <Input
              id="admin_whatsapp"
              placeholder="0558271127"
              value={settings.admin_whatsapp_otp || '0558271127'}
              onChange={(e) => setSettings(prev => ({ ...prev, admin_whatsapp_otp: e.target.value }))}
            />
            <p className="text-xs text-gray-500">
              This number will receive OTP codes for admin login and password reset
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>
            Configure system-wide settings and messaging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="livestream">Makola Live URL</Label>
            <Input
              id="livestream"
              placeholder="https://youtube.com/live/..."
              value={settings.livestream_url}
              onChange={(e) => handleInputChange('livestream_url', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner">Homepage Banner Message</Label>
            <Textarea
              id="banner"
              placeholder="Welcome message or system announcement..."
              value={settings.homepage_banner}
              onChange={(e) => handleInputChange('homepage_banner', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;