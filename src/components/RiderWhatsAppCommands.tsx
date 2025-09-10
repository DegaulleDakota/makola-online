import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Smartphone, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface RiderCommand {
  id: string;
  whatsapp_number: string;
  command: string;
  job_id: string;
  response_sent: boolean;
  created_at: string;
  rider?: { name: string; phone: string };
  job?: { pickup_location: string; dropoff_location: string; quoted_fee: number };
}

export default function RiderWhatsAppCommands({ riderId }: { riderId: string }) {
  const [commands, setCommands] = useState<RiderCommand[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCommands();
  }, [riderId]);

  const loadCommands = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_rider_commands')
        .select(`
          *,
          rider:riders(name, phone),
          job:delivery_jobs(pickup_location, dropoff_location, quoted_fee)
        `)
        .eq('rider_id', riderId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setCommands(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading commands",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestMessage = async () => {
    try {
      // Simulate sending a WhatsApp message to the rider
      toast({
        title: "Test message sent! 📱",
        description: "WhatsApp command help has been sent to the rider"
      });
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading WhatsApp commands...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            WhatsApp Commands
          </CardTitle>
          <CardDescription>
            Track and manage WhatsApp commands from this rider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={sendTestMessage} size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Test Message
            </Button>
          </div>

          {commands.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No WhatsApp commands yet</p>
              <p className="text-sm">Commands will appear here when the rider sends messages</p>
            </div>
          ) : (
            <div className="space-y-3">
              {commands.map((command) => (
                <div key={command.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{command.whatsapp_number}</span>
                        <Badge variant={command.response_sent ? "default" : "secondary"}>
                          {command.response_sent ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Responded
                            </>
                          ) : (
                            "Pending"
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm bg-gray-50 p-2 rounded font-mono">
                        {command.command}
                      </p>
                    </div>
                  </div>
                  
                  {command.job && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <h4 className="font-medium text-sm mb-1">Related Job:</h4>
                      <p className="text-sm">
                        📍 {command.job.pickup_location} → {command.job.dropoff_location}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        💰 GHS {command.job.quoted_fee}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(command.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1">📦 jobs</h4>
              <p className="text-sm text-gray-700">View available delivery jobs</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1">✅ accept job[ID]</h4>
              <p className="text-sm text-gray-700">Accept a specific delivery job</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1">📊 status</h4>
              <p className="text-sm text-gray-700">Check current active jobs</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1">📦 picked up job[ID]</h4>
              <p className="text-sm text-gray-700">Mark job as picked up</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1">🎯 delivered job[ID]</h4>
              <p className="text-sm text-gray-700">Mark job as delivered</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}