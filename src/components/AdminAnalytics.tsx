import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Users, MousePointer, UserCheck, Download, Calendar, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  totalVisits: number;
  startSellingClicks: number;
  completedRegistrations: number;
  conversionRate: number;
  firstProductAdded: number;
  activationRate: number;
}

interface ChartData {
  date: string;
  visits: number;
  clicks: number;
  registrations: number;
  products: number;
}

interface RetentionData {
  cohort: string;
  d1: number;
  d7: number;
  d30: number;
}

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    startSellingClicks: 0,
    completedRegistrations: 0,
    conversionRate: 0,
    firstProductAdded: 0,
    activationRate: 0
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [retentionData, setRetentionData] = useState<RetentionData[]>([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
    fetchChartData();
    fetchRetentionData();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('event_type, created_at')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end + 'T23:59:59');

      if (!error && events) {
        const visits = events.filter(e => e.event_type === 'page_view').length;
        const clicks = events.filter(e => e.event_type === 'start_selling_click').length;
        
        const { data: sellers } = await supabase
          .from('sellers')
          .select('created_at')
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end + 'T23:59:59');

        const registrations = sellers?.length || 0;
        
        const { data: products } = await supabase
          .from('products')
          .select('seller_id, created_at')
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end + 'T23:59:59');

        const uniqueSellersWithProducts = new Set(products?.map(p => p.seller_id)).size;

        setAnalytics({
          totalVisits: visits,
          startSellingClicks: clicks,
          completedRegistrations: registrations,
          conversionRate: clicks > 0 ? (registrations / clicks) * 100 : 0,
          firstProductAdded: uniqueSellersWithProducts,
          activationRate: registrations > 0 ? (uniqueSellersWithProducts / registrations) * 100 : 0
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  const fetchChartData = async () => {
    try {
      const { data: events } = await supabase
        .from('analytics_events')
        .select('event_type, created_at')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end + 'T23:59:59')
        .order('created_at');

      if (events) {
        const dailyData = events.reduce((acc: any, event) => {
          const date = event.created_at.split('T')[0];
          if (!acc[date]) {
            acc[date] = { date, visits: 0, clicks: 0, registrations: 0, products: 0 };
          }
          if (event.event_type === 'page_view') acc[date].visits++;
          if (event.event_type === 'start_selling_click') acc[date].clicks++;
          if (event.event_type === 'seller_registration') acc[date].registrations++;
          if (event.event_type === 'first_product_added') acc[date].products++;
          return acc;
        }, {});

        setChartData(Object.values(dailyData));
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const fetchRetentionData = async () => {
    try {
      // Simulate retention data for now
      const mockRetention: RetentionData[] = [
        { cohort: 'Week 1', d1: 45, d7: 25, d30: 15 },
        { cohort: 'Week 2', d1: 52, d7: 28, d30: 18 },
        { cohort: 'Week 3', d1: 48, d7: 22, d30: 12 },
        { cohort: 'Week 4', d1: 55, d7: 30, d30: 20 }
      ];
      setRetentionData(mockRetention);
    } catch (error) {
      console.error('Error fetching retention data:', error);
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['Date', 'Visits', 'Clicks', 'Registrations', 'Products'],
      ...chartData.map(row => [row.date, row.visits, row.clicks, row.registrations, row.products])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `makola-analytics-${dateRange.start}-${dateRange.end}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-emerald-800">Analytics Dashboard</h1>
        <div className="flex gap-4 items-center">
          <div>
            <Label htmlFor="startDate">From</Label>
            <Input
              id="startDate"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="endDate">To</Label>
            <Input
              id="endDate"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
          <Button onClick={exportCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Total Visits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{analytics.totalVisits}</div>
                <p className="text-xs text-gray-500">Seller landing page visits</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <MousePointer className="w-4 h-4 mr-2" />
                  Start Selling Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{analytics.startSellingClicks}</div>
                <p className="text-xs text-gray-500">CTA button clicks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Registrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{analytics.completedRegistrations}</div>
                <p className="text-xs text-gray-500">Completed seller registrations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{analytics.conversionRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-500">Clicks to registrations</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">First Product Added</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{analytics.firstProductAdded}</div>
                <p className="text-xs text-gray-500">Sellers who added their first product</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Activation Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">{analytics.activationRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-500">Registrations to first product</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Daily Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Chart visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seller Retention Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {retentionData.map((retention, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{retention.cohort}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Day 1</p>
                      <p className="font-bold text-green-600">{retention.d1}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Day 7</p>
                      <p className="font-bold text-blue-600">{retention.d7}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Day 30</p>
                      <p className="font-bold text-purple-600">{retention.d30}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Cohort analysis chart would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;