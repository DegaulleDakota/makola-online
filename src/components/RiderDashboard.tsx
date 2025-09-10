import { useState, useEffect } from "react";
import { useAuth } from "@/auth/session";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Truck, DollarSign, Star, CheckCircle, Clock, Wallet } from "lucide-react";
import MoMoWalletSetup from "./MoMoWalletSetup";

interface RiderStats {
  activeJobs: number;
  todayEarnings: number;
  rating: number;
  completedDeliveries: number;
  isVerified: boolean;
  walletBalance: number;
}

export default function RiderDashboard() {
  const { rider } = useAuth();
  const [stats, setStats] = useState<RiderStats>({
    activeJobs: 0,
    todayEarnings: 0,
    rating: 0,
    completedDeliveries: 0,
    isVerified: false,
    walletBalance: 0
  });
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showWalletSetup, setShowWalletSetup] = useState(false);

  useEffect(() => {
    if (rider?.id) {
      loadRiderStats();
    }
  }, [rider?.id]);

  const loadRiderStats = async () => {
    if (!rider?.id) return;
    
    try {
      // Load rider stats
      const [jobsResult, earningsResult, riderResult] = await Promise.all([
        supabase.from('delivery_jobs').select('*').eq('assigned_rider_id', rider.id).in('status', ['accepted', 'picked_up']),
        supabase.from('delivery_jobs').select('rider_earnings').eq('assigned_rider_id', rider.id).eq('status', 'completed').gte('created_at', new Date().toISOString().split('T')[0]),
        supabase.from('riders').select('*').eq('id', rider.id).single()
      ]);

      const todayEarnings = earningsResult.data?.reduce((sum, job) => sum + (job.rider_earnings || 0), 0) || 0;

      setStats({
        activeJobs: jobsResult.data?.length || 0,
        todayEarnings,
        rating: riderResult.data?.rating_avg || 0,
        completedDeliveries: riderResult.data?.completed_deliveries || 0,
        isVerified: riderResult.data?.verified || false,
        walletBalance: riderResult.data?.wallet_balance || 0
      });

      setIsOnline(riderResult.data?.availability || false);
    } catch (error) {
      console.error('Failed to load rider stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (available: boolean) => {
    try {
      const { error } = await supabase
        .from('riders')
        .update({ availability: available, updated_at: new Date().toISOString() })
        .eq('id', rider?.id);

      if (error) throw error;
      setIsOnline(available);
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🚴 Rider Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className={isOnline ? "text-green-600" : "text-gray-500"}>
            {isOnline ? "Online" : "Offline"}
          </span>
          <Switch
            checked={isOnline}
            onCheckedChange={toggleAvailability}
          />
        </div>
      </div>

      {!stats.isVerified && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">Complete Verification</h3>
                <p className="text-sm text-yellow-700">Get verified to receive more delivery requests</p>
              </div>
              <Button variant="outline" className="border-yellow-300">
                Get Verified
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">GHS {stats.todayEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-1">
              <div className="text-2xl font-bold">{stats.rating.toFixed(1)}</div>
              <span className="text-yellow-500">⭐</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {stats.walletBalance.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">View Jobs</h3>
                <p className="text-sm text-muted-foreground">Accept new deliveries</p>
              </div>
              <div className="text-2xl">📦</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowWalletSetup(true)}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Setup MoMo Wallet</h3>
                <p className="text-sm text-muted-foreground">Configure payout method</p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">My Profile</h3>
                <p className="text-sm text-muted-foreground">Update details & documents</p>
              </div>
              <div className="text-2xl">👤</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showWalletSetup && (
        <MoMoWalletSetup userType="rider" />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Delivery completed</p>
                <p className="text-sm text-muted-foreground">Tema to Accra Central</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+GHS 15.00</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">New job accepted</p>
                <p className="text-sm text-muted-foreground">Kumasi pickup</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary">In Progress</Badge>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}