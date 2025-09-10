import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface DeliveryJob {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  buyer_contact: string;
  quoted_fee: number;
  status: string;
  delivery_note?: string;
  created_at: string;
  seller?: { name: string; whatsapp: string };
}

export default function RiderJobs({ riderId }: { riderId: string }) {
  const [newJobs, setNewJobs] = useState<DeliveryJob[]>([]);
  const [assignedJobs, setAssignedJobs] = useState<DeliveryJob[]>([]);
  const [historyJobs, setHistoryJobs] = useState<DeliveryJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [proofData, setProofData] = useState<{ [key: string]: { photo?: string; otp?: string } }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, [riderId]);

  const loadJobs = async () => {
    try {
      // New jobs (available to accept)
      const { data: newJobsData } = await supabase
        .from('delivery_jobs')
        .select(`
          *,
          seller:sellers(name, whatsapp)
        `)
        .eq('status', 'requested')
        .is('rider_id', null)
        .order('created_at', { ascending: false });

      // Assigned jobs (in progress)
      const { data: assignedJobsData } = await supabase
        .from('delivery_jobs')
        .select(`
          *,
          seller:sellers(name, whatsapp)
        `)
        .eq('rider_id', riderId)
        .in('status', ['accepted', 'picked_up'])
        .order('created_at', { ascending: false });

      // History (completed/cancelled)
      const { data: historyJobsData } = await supabase
        .from('delivery_jobs')
        .select(`
          *,
          seller:sellers(name, whatsapp)
        `)
        .eq('rider_id', riderId)
        .in('status', ['completed', 'cancelled'])
        .order('completed_at', { ascending: false })
        .limit(20);

      setNewJobs(newJobsData || []);
      setAssignedJobs(assignedJobsData || []);
      setHistoryJobs(historyJobsData || []);
    } catch (error: any) {
      toast({
        title: "Error loading jobs",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('delivery_jobs')
        .update({
          rider_id: riderId,
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Job Accepted! 🎉",
        description: "Contact the seller to coordinate pickup"
      });

      loadJobs();
    } catch (error: any) {
      toast({
        title: "Failed to accept job",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    try {
      const updateData: any = { status };
      
      if (status === 'picked_up') {
        updateData.picked_up_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
        updateData.proof_data = proofData[jobId] || {};
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('delivery_jobs')
        .update(updateData)
        .eq('id', jobId);

      if (error) throw error;

      const statusMessages = {
        picked_up: "Package picked up! 📦",
        delivered: "Package delivered! 🎯",
        completed: "Job completed! 💰"
      };

      toast({
        title: statusMessages[status as keyof typeof statusMessages],
        description: status === 'completed' ? "Payment will be processed shortly" : "Status updated successfully"
      });

      loadJobs();
    } catch (error: any) {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      requested: 'bg-blue-100 text-blue-800',
      accepted: 'bg-yellow-100 text-yellow-800',
      picked_up: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const JobCard = ({ job, showActions = false }: { job: DeliveryJob; showActions?: boolean }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getStatusColor(job.status)}>{job.status.toUpperCase()}</Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">📍</span>
                <span className="font-medium">Pickup:</span>
                <span>{job.pickup_location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-600">📍</span>
                <span className="font-medium">Dropoff:</span>
                <span>{job.dropoff_location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">💰</span>
                <span className="font-medium">Fee:</span>
                <span className="text-green-600 font-bold">GHS {job.quoted_fee}</span>
              </div>
            </div>
          </div>
        </div>

        {job.delivery_note && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-sm"><strong>Note:</strong> {job.delivery_note}</p>
          </div>
        )}

        {showActions && (
          <div className="space-y-3">
            {job.status === 'requested' && (
              <Button onClick={() => acceptJob(job.id)} className="w-full">
                Accept Job 🚴
              </Button>
            )}

            {job.status === 'accepted' && (
              <div className="space-y-2">
                <Button 
                  onClick={() => updateJobStatus(job.id, 'picked_up')} 
                  className="w-full"
                >
                  Mark as Picked Up 📦
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Chat Seller
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Chat Buyer
                  </Button>
                </div>
              </div>
            )}

            {job.status === 'picked_up' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`photo-${job.id}`}>Delivery Photo</Label>
                    <Input
                      id={`photo-${job.id}`}
                      placeholder="Photo URL"
                      value={proofData[job.id]?.photo || ''}
                      onChange={(e) => setProofData(prev => ({
                        ...prev,
                        [job.id]: { ...prev[job.id], photo: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`otp-${job.id}`}>OTP Code</Label>
                    <Input
                      id={`otp-${job.id}`}
                      placeholder="OTP from buyer"
                      value={proofData[job.id]?.otp || ''}
                      onChange={(e) => setProofData(prev => ({
                        ...prev,
                        [job.id]: { ...prev[job.id], otp: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => updateJobStatus(job.id, 'delivered')} 
                  className="w-full"
                  disabled={!proofData[job.id]?.photo && !proofData[job.id]?.otp}
                >
                  Mark as Delivered 🎯
                </Button>
              </div>
            )}

            {job.status === 'delivered' && (
              <Button 
                onClick={() => updateJobStatus(job.id, 'completed')} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Complete Job 💰
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="flex justify-center p-8">Loading jobs...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">📦 My Jobs</h1>

      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new">New Jobs ({newJobs.length})</TabsTrigger>
          <TabsTrigger value="assigned">Assigned ({assignedJobs.length})</TabsTrigger>
          <TabsTrigger value="history">History ({historyJobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          {newJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No new jobs available</p>
                <p className="text-sm text-muted-foreground mt-2">Check back later or make sure you're online</p>
              </CardContent>
            </Card>
          ) : (
            newJobs.map(job => (
              <JobCard key={job.id} job={job} showActions={true} />
            ))
          )}
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          {assignedJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No assigned jobs</p>
              </CardContent>
            </Card>
          ) : (
            assignedJobs.map(job => (
              <JobCard key={job.id} job={job} showActions={true} />
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {historyJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No completed jobs yet</p>
              </CardContent>
            </Card>
          ) : (
            historyJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}