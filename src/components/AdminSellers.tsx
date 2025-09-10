import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Check, X, Plus, Minus, Ban, Play } from 'lucide-react';
import { localAdapter } from '@/lib/localAdapter';
import { Seller, SellerStatus } from '@/lib/marketplaceAdapter';
import { useToast } from '@/hooks/use-toast';
const AdminSellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const adminEmail = localStorage.getItem('makola_admin_email');
    if (!adminEmail) {
      navigate('/admin/login');
      return;
    }
    loadSellers();
  }, [navigate]);

  const loadSellers = async () => {
    try {
      const data = await localAdapter.listSellers();
      setSellers(data);
    } catch (error) {
      console.error('Error loading sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSellerVerification = async (id: string, verified: boolean) => {
    try {
      await localAdapter.verifySeller(id, verified);
      await localAdapter.adminLogAction({
        admin_email: 'admin@makolaonline.com',
        action: verified ? 'verify_seller' : 'unverify_seller',
        subject: id
      });
      toast({ title: "Success", description: `Seller ${verified ? 'verified' : 'unverified'}` });
      loadSellers();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update seller", variant: "destructive" });
    }
  };

  const updateSellerStatus = async (id: string, status: SellerStatus) => {
    try {
      await localAdapter.adminSetSellerStatus(id, status);
      await localAdapter.adminLogAction({
        admin_email: 'admin@makolaonline.com',
        action: `${status}_seller`,
        subject: id
      });
      toast({ title: "Success", description: `Seller ${status}` });
      loadSellers();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update seller", variant: "destructive" });
    }
  };

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(search.toLowerCase()) ||
    seller.whatsapp.includes(search) ||
    seller.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-green-600">Manage Sellers</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Sellers ({sellers.length})</CardTitle>
            <Input
              placeholder="Search sellers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSellers.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell className="font-medium">{seller.name}</TableCell>
                    <TableCell>{seller.phone}</TableCell>
                    <TableCell>{seller.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge variant={seller.is_verified ? 'default' : 'secondary'}>
                          {seller.is_verified ? 'Verified' : 'Unverified'}
                        </Badge>
                        {seller.is_suspended && (
                          <Badge variant="destructive">Suspended</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{seller.credits}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={seller.is_verified ? 'destructive' : 'default'}
                          onClick={() => updateSeller(seller.id, { is_verified: !seller.is_verified })}
                        >
                          {seller.is_verified ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateSeller(seller.id, { credits: seller.credits + 1 })}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateSeller(seller.id, { credits: Math.max(0, seller.credits - 1) })}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSellers;