import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Bell, Send, MessageSquare, Settings, History } from 'lucide-react';

interface NotificationTemplate {
  id: string;
  event_type: string;
  title: string;
  message: string;
  is_active: boolean;
}

interface NotificationLog {
  id: string;
  seller_id: string;
  event_type: string;
  message_text: string;
  whatsapp_link: string;
  status: string;
  created_at: string;
}

const AdminNotifications: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [manualPhone, setManualPhone] = useState('');
  const [manualMessage, setManualMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
    fetchLogs();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('notification_templates')
      .select('*')
      .order('event_type');
    
    if (!error && data) {
      setTemplates(data);
    }
  };

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('notifications_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (!error && data) {
      setLogs(data);
    }
  };

  const updateTemplate = async (template: NotificationTemplate) => {
    const { error } = await supabase
      .from('notification_templates')
      .update({
        title: template.title,
        message: template.message,
        is_active: template.is_active
      })
      .eq('id', template.id);

    if (!error) {
      fetchTemplates();
      setEditingTemplate(null);
    }
  };

  const sendManualNotification = async () => {
    if (!manualPhone || !manualMessage) return;
    
    setLoading(true);
    const whatsappLink = `https://wa.me/${manualPhone}?text=${encodeURIComponent(manualMessage)}`;
    window.open(whatsappLink, '_blank');
    
    // Log the manual notification
    await supabase.from('notifications_log').insert({
      seller_id: null,
      event_type: 'manual',
      message_text: manualMessage,
      whatsapp_link: whatsappLink,
      status: 'sent'
    });
    
    setManualPhone('');
    setManualMessage('');
    setLoading(false);
    fetchLogs();
  };

  const generateWhatsAppLink = (message: string, phone: string = '233XXXXXXXXX') => {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const eventTypeLabels: Record<string, string> = {
    welcome: 'Welcome Message',
    first_product: 'First Product Added',
    boost_active: 'Boost Activated',
    boost_expiry_reminder: 'Boost Expiry Reminder',
    inactivity_reminder: 'Add Products Reminder',
    verification_expiry: 'Verification Expiring'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-emerald-800">WhatsApp Notifications</h1>
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
          <MessageSquare className="w-4 h-4 mr-1" />
          WhatsApp Integration
        </Badge>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send Manual
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      {eventTypeLabels[template.event_type] || template.event_type}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={template.is_active}
                        onCheckedChange={(checked) => 
                          updateTemplate({ ...template, is_active: checked })
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTemplate(template)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingTemplate?.id === template.id ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={editingTemplate.title}
                          onChange={(e) => setEditingTemplate({
                            ...editingTemplate,
                            title: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label>Message</Label>
                        <Textarea
                          value={editingTemplate.message}
                          onChange={(e) => setEditingTemplate({
                            ...editingTemplate,
                            message: e.target.value
                          })}
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateTemplate(editingTemplate)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingTemplate(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.open(generateWhatsAppLink(editingTemplate.message), '_blank')}
                        >
                          Test WhatsApp
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-medium text-sm text-gray-600">{template.title}</p>
                      <p className="text-sm">{template.message}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(generateWhatsAppLink(template.message), '_blank')}
                      >
                        Preview WhatsApp
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Manual WhatsApp Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number (with country code)</Label>
                <Input
                  id="phone"
                  placeholder="233XXXXXXXXX"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Hello from Makola Online! 🟢"
                  value={manualMessage}
                  onChange={(e) => setManualMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                onClick={sendManualNotification}
                disabled={loading || !manualPhone || !manualMessage}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Sending...' : 'Send WhatsApp'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">
                        {eventTypeLabels[log.event_type] || log.event_type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">{log.message_text?.substring(0, 100)}...</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(log.whatsapp_link, '_blank')}
                    >
                      Open WhatsApp
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;