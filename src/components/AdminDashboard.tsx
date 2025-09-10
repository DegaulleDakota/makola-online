import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  MessageSquare, 
  Truck,
  Smartphone,
  BarChart3,
  Bell,
  Settings,
  CreditCard,
  UserCheck
} from "lucide-react";

interface DashboardStats {
  totalSellers: number;
  totalProducts: number;
  totalRiders: number;
  totalRevenue: number;
  pendingPayouts: number;
  activeDeliveries: number;
  whatsappUploads: number;
  momoTransactions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSellers: 0,
    totalProducts: 0,
    totalRiders: 0,
    totalRevenue: 0,
    pendingPayouts: 0,
    activeDeliveries: 0,
    whatsappUploads: 0,
    momoTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [passwordResetRequired, setPasswordResetRequired] = useState(false);

  useEffect(() => {
    checkPasswordResetRequired();
    loadDashboardStats();
  }, []);

  const checkPasswordResetRequired = async () => {
    const adminEmail = localStorage.getItem('makola_admin_email');
    if (!adminEmail) return;

    try {
      const { data } = await supabase
        .from('admins')
        .select('password_reset_required')
        .eq('email', adminEmail)
        .single();

      if (data?.password_reset_required) {
        setPasswordResetRequired(true);
      }
    } catch (error) {
      console.error('Error checking password reset status:', error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      // Load all stats in parallel
      const [
        sellersResult,
        productsResult,
        ridersResult,
        uploadsResult,
        deliveriesResult,
        payoutsResult,
        transactionsResult
      ] = await Promise.all([
        supabase.from('sellers').select('id', { count: 'exact' }),
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('riders').select('id', { count: 'exact' }),
        supabase.from('whatsapp_uploads').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('delivery_jobs').select('id', { count: 'exact' }).in('status', ['accepted', 'picked_up']),
        supabase.from('rider_payouts').select('amount', { count: 'exact' }).eq('status', 'requested'),
        supabase.from('momo_transactions').select('net_amount', { count: 'exact' }).eq('status', 'completed')
      ]);
      setStats({
        totalSellers: sellersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalRiders: ridersResult.count || 0,
        totalRevenue: transactionsResult.data?.reduce((sum, t) => sum + (t.net_amount || 0), 0) || 0,
        pendingPayouts: payoutsResult.count || 0,
        activeDeliveries: deliveriesResult.count || 0,
        whatsappUploads: uploadsResult.count || 0,
        momoTransactions: transactionsResult.count || 0
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (passwordResetRequired) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-orange-600">Password Reset Required</CardTitle>
            <CardDescription>
              You must change your password before accessing the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.href = '/admin/change-password'}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Change Password Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }
  return (
    <div className="space-y-6">
      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSellers}</div>
            <p className="text-xs text-muted-foreground">Registered sellers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Listed products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Riders</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRiders}</div>
            <p className="text-xs text-muted-foreground">{stats.activeDeliveries} active deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{stats.momoTransactions} MoMo transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Analytics & Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">View conversion rates, retention metrics, and cohort analysis</p>
            <Button size="sm" variant="outline" className="w-full">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              WhatsApp Management
              {stats.whatsappUploads > 0 && (
                <Badge variant="destructive" className="ml-2">{stats.whatsappUploads}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">Manage product uploads and notification templates</p>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/admin/whatsapp'}
            >
              Manage WhatsApp
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-600" />
              Riders & Deliveries
              {stats.pendingPayouts > 0 && (
                <Badge variant="destructive" className="ml-2">{stats.pendingPayouts}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">Manage riders, deliveries, and payout requests</p>
            <Button size="sm" variant="outline" className="w-full">
              Manage Riders
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-orange-600" />
              Mobile Money
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">View MoMo transactions, payouts, and wallet management</p>
            <Button size="sm" variant="outline" className="w-full">
              View Transactions
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">Configure automated WhatsApp notifications and templates</p>
            <Button size="sm" variant="outline" className="w-full">
              Manage Notifications
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              Platform Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">Configure commission rates, fees, and platform settings</p>
            <Button size="sm" variant="outline" className="w-full">
              Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}