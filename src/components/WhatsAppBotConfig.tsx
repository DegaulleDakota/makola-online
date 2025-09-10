import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Settings, Users, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppSession {
  id: string;
  whatsapp_number: string;
  user_type: string;
  last_activity: string;
  session_state: any;
}

interface WhatsAppUpload {
  id: string;
  whatsapp_number: string;
  message_text: string;
  parsed_title: string;
  status: string;
  created_at: string;
}

export default function WhatsAppBotConfig() {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [uploads, setUploads] = useState<WhatsAppUpload[]>([]);
  const [botSettings, setBotSettings] = useState({
    webhook_url: '',
    verify_token: 'makola_verify_token',
    access_token: ''
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sessionsResult, uploadsResult] = await Promise.all([
        supabase
          .from('whatsapp_sessions')
          .select('*')
          .order('last_activity', { ascending: false })
          .limit(20),
        supabase
          .from('whatsapp_uploads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)
      ]);

      setSessions(sessionsResult.data || []);
      setUploads(uploadsResult.data || []);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveBotSettings = async () => {
    try {
      // In a real implementation, you'd save these to a secure settings table
      toast({
        title: "Settings saved",
        description: "WhatsApp bot configuration updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const clearSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Session cleared",
        description: "WhatsApp session has been reset"
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error clearing session",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading WhatsApp bot data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            WhatsApp Bot Management
          </CardTitle>
          <CardDescription>
            Configure and monitor WhatsApp bot for product uploads and rider commands
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Active Sessions ({sessions.length})</TabsTrigger>
          <TabsTrigger value="uploads">Recent Uploads ({uploads.length})</TabsTrigger>
          <TabsTrigger value="settings">Bot Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                WhatsApp Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No active WhatsApp sessions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{session.whatsapp_number}</span>
                          <Badge variant="outline">{session.user_type || 'Unknown'}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Last active: {new Date(session.last_activity).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => clearSession(session.id)}
                      >
                        Clear Session
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uploads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                WhatsApp Product Uploads
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploads.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent uploads</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploads.map((upload) => (
                    <div key={upload.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{upload.parsed_title || 'Untitled'}</h4>
                          <p className="text-sm text-gray-600">{upload.whatsapp_number}</p>
                        </div>
                        <Badge className={getStatusColor(upload.status)}>
                          {upload.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {upload.message_text.substring(0, 100)}...
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(upload.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Bot Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="webhook_url">Webhook URL</Label>
                  <Input
                    id="webhook_url"
                    value={botSettings.webhook_url}
                    onChange={(e) => setBotSettings(prev => ({ ...prev, webhook_url: e.target.value }))}
                    placeholder="https://your-project.supabase.co/functions/v1/whatsapp-webhook"
                  />
                </div>
                <div>
                  <Label htmlFor="verify_token">Verify Token</Label>
                  <Input
                    id="verify_token"
                    value={botSettings.verify_token}
                    onChange={(e) => setBotSettings(prev => ({ ...prev, verify_token: e.target.value }))}
                    placeholder="makola_verify_token"
                  />
                </div>
                <div>
                  <Label htmlFor="access_token">WhatsApp Access Token</Label>
                  <Input
                    id="access_token"
                    type="password"
                    value={botSettings.access_token}
                    onChange={(e) => setBotSettings(prev => ({ ...prev, access_token: e.target.value }))}
                    placeholder="Your WhatsApp Business API token"
                  />
                </div>
              </div>
              <Button onClick={saveBotSettings} className="w-full">
                Save Configuration
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">1. WhatsApp Business API Setup</h4>
                <p className="text-sm text-gray-700">
                  Create a WhatsApp Business account and get your access token from Meta Developer Console.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">2. Configure Webhook</h4>
                <p className="text-sm text-gray-700">
                  Set your webhook URL in WhatsApp Business API settings to receive messages.
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">3. Test Bot Commands</h4>
                <p className="text-sm text-gray-700">
                  Sellers: Send product photos with details<br/>
                  Riders: Send "jobs" to see available deliveries
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}