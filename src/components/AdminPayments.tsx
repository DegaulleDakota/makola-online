import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { localAdapter } from '../lib/localAdapter';
import { Payment, Seller } from '../lib/marketplaceAdapter';
import { Plus, CreditCard } from 'lucide-react';

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPayment, setNewPayment] = useState({
    seller_id: '',
    type: 'boost' as 'boost' | 'verification',
    credits: 0,
    amount: 0,
    reference: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentsData, sellersData] = await Promise.all([
        localAdapter.adminListPayments(),
        localAdapter.listSellers()
      ]);
      setPayments(paymentsData);
      setSellers(sellersData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    }
  };

  const handleAddPayment = async () => {
    if (!newPayment.seller_id || newPayment.amount <= 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await localAdapter.adminAddPayment({
        seller_id: newPayment.seller_id,
        type: newPayment.type,
        credits: newPayment.type === 'boost' ? newPayment.credits : null,
        amount: newPayment.amount,
        currency: 'GHS',
        reference: newPayment.reference || null
      });

      await localAdapter.adminLogAction({
        admin_email: 'admin@makolaonline.com',
        action: 'add_payment',
        subject: newPayment.seller_id,
        meta: { type: newPayment.type, amount: newPayment.amount }
      });

      toast({
        title: "Success",
        description: "Payment recorded successfully"
      });

      setNewPayment({
        seller_id: '',
        type: 'boost',
        credits: 0,
        amount: 0,
        reference: ''
      });
      setShowAddForm(false);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSellerName = (sellerId: string | null) => {
    if (!sellerId) return 'System';
    const seller = sellers.find(s => s.id === sellerId);
    return seller?.name || 'Unknown Seller';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Logs</h1>
          <p className="text-muted-foreground">Track boost and verification payments</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Manual Payment</CardTitle>
            <CardDescription>Record a payment manually</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Seller</Label>
                <Select value={newPayment.seller_id} onValueChange={(value) => 
                  setNewPayment(prev => ({ ...prev, seller_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select seller" />
                  </SelectTrigger>
                  <SelectContent>
                    {sellers.map(seller => (
                      <SelectItem key={seller.id} value={seller.id}>
                        {seller.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newPayment.type} onValueChange={(value: 'boost' | 'verification') => 
                  setNewPayment(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boost">Boost Credits</SelectItem>
                    <SelectItem value="verification">Verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newPayment.type === 'boost' && (
                <div className="space-y-2">
                  <Label>Credits</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newPayment.credits}
                    onChange={(e) => setNewPayment(prev => ({ 
                      ...prev, credits: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Amount (GHS)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment(prev => ({ 
                    ...prev, amount: parseFloat(e.target.value) || 0 
                  }))}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Reference (Optional)</Label>
                <Input
                  placeholder="Payment reference or notes"
                  value={newPayment.reference}
                  onChange={(e) => setNewPayment(prev => ({ 
                    ...prev, reference: e.target.value 
                  }))}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddPayment} disabled={loading}>
                {loading ? 'Adding...' : 'Add Payment'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{getSellerName(payment.seller_id)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(payment.created_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Badge variant={payment.type === 'boost' ? 'default' : 'secondary'}>
                      {payment.type}
                    </Badge>
                    <span className="font-semibold">GHS {payment.amount}</span>
                  </div>
                  {payment.credits && (
                    <p className="text-sm text-muted-foreground">
                      {payment.credits} credits
                    </p>
                  )}
                  {payment.reference && (
                    <p className="text-xs text-muted-foreground">
                      Ref: {payment.reference}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {payments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No payments recorded yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminPayments;