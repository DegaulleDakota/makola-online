import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Rider {
  id: string;
  name: string;
  whatsapp: string;
  base_location: string;
  vehicle_type: string;
  service_zones: string[];
  verified: boolean;
  availability: boolean;
  rating_avg: number;
  completed_deliveries: number;
  wallet_balance: number;
  created_at: string;
}

interface DeliveryJob {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  quoted_fee: number;
  status: string;
  created_at: string;
  rider?: { name: string };
  seller?: { name: string };
}

interface Payout {
  id: string;
  amount: number;
  method: string;
  status: string;
  requested_at: string;
  rider?: { name: string; whatsapp: string };
}

export default function AdminRiders() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load riders
      const { data: ridersData } = await supabase
        .from('riders')
        .select('*')
        .order('created_at', { ascending: false });

      // Load delivery jobs
      const { data: jobsData } = await supabase
        .from('delivery_jobs')
        .select(`
          *,
          rider:riders(name),
          seller:sellers(name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      // Load payouts
      const { data: payoutsData } = await supabase
        .from('rider_payouts')
        .select(`
          *,
          rider:riders(name, whatsapp)
        `)
        .order('requested_at', { ascending: false });

      setRiders(ridersData || []);
      setJobs(jobsData || []);
      setPayouts(payoutsData || []);
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

  const verifyRider = async (riderId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from('riders')
        .update({ 
          verified,
          verification_expiry: verified ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null
        })
        .eq('id', riderId);

      if (error) throw error;

      toast({
        title: verified ? "Rider Verified ✅" : "Verification Removed",
        description: verified ? "Rider can now receive priority jobs" : "Rider verification has been removed"
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error updating verification",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const approvePayout = async (payoutId: string, approved: boolean) => {
    try {
      const updateData = approved 
        ? { status: 'approved', approved_at: new Date().toISOString() }
        : { status: 'rejected' };

      const { error } = await supabase
        .from('rider_payouts')
        .update(updateData)
        .eq('id', payoutId);

      if (error) throw error;

      toast({
        title: approved ? "Payout Approved ✅" : "Payout Rejected",
        description: approved ? "Rider will be notified" : "Payout request has been rejected"
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error updating payout",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredRiders = riders.filter(rider =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.whatsapp.includes(searchTerm) ||
    rider.base_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
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

  if (loading) {
    return <div className="flex justify-center p-8">Loading riders data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🚴 Riders Management</h1>
        <div className="flex space-x-2">
          <Input
            placeholder="Search riders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{riders.length}</div>
            <p className="text-sm text-muted-foreground">Total Riders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {riders.filter(r => r.verified).length}
            </div>
            <p className="text-sm text-muted-foreground">Verified Riders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {riders.filter(r => r.availability).length}
            </div>
            <p className="text-sm text-muted-foreground">Online Now</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {payouts.filter(p => p.status === 'requested').length}
            </div>
            <p className="text-sm text-muted-foreground">Pending Payouts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="riders" className="w-full">
        <TabsList>
          <TabsTrigger value="riders">Riders</TabsTrigger>
          <TabsTrigger value="jobs">Delivery Jobs</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="riders">
          <Card>
            <CardHeader>
              <CardTitle>All Riders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRiders.map((rider) => (
                    <TableRow key={rider.id}>
                      <TableCell className="font-medium">{rider.name}</TableCell>
                      <TableCell>{rider.whatsapp}</TableCell>
                      <TableCell>{rider.base_location}</TableCell>
                      <TableCell>{rider.vehicle_type}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {rider.verified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                          {rider.availability && <Badge className="bg-blue-100 text-blue-800">Online</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>{rider.rating_avg.toFixed(1)}</span>
                          <span className="text-yellow-500 ml-1">⭐</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({rider.completed_deliveries})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant={rider.verified ? "outline" : "default"}
                            onClick={() => verifyRider(rider.id, !rider.verified)}
                          >
                            {rider.verified ? "Unverify" : "Verify"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Delivery Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pickup</TableHead>
                    <TableHead>Dropoff</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rider</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.pickup_location}</TableCell>
                      <TableCell>{job.dropoff_location}</TableCell>
                      <TableCell>GHS {job.quoted_fee}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(job.status)}>
                          {job.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{job.rider?.name || 'Unassigned'}</TableCell>
                      <TableCell>{job.seller?.name || 'N/A'}</TableCell>
                      <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payout Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rider</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payout.rider?.name}</div>
                          <div className="text-sm text-muted-foreground">{payout.rider?.whatsapp}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">GHS {payout.amount}</TableCell>
                      <TableCell>{payout.method}</TableCell>
                      <TableCell>
                        <Badge className={
                          payout.status === 'approved' ? 'bg-green-100 text-green-800' :
                          payout.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {payout.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(payout.requested_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {payout.status === 'requested' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => approvePayout(payout.id, true)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => approvePayout(payout.id, false)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}