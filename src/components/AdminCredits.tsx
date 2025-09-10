import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { localAdapter } from '../lib/localAdapter';
import { Seller } from '../lib/marketplaceAdapter';
import { Plus, Minus, Coins } from 'lucide-react';

const AdminCredits: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [creditAmounts, setCreditAmounts] = useState<Record<string, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      const data = await localAdapter.listSellers();
      setSellers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sellers",
        variant: "destructive"
      });
    }
  };

  const handleCreditChange = (sellerId: string, amount: number) => {
    setCreditAmounts(prev => ({ ...prev, [sellerId]: amount }));
  };

  const addCredits = async (sellerId: string) => {
    const amount = creditAmounts[sellerId] || 0;
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid credit amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await localAdapter.adminAddBoostCredits(sellerId, amount);
      await localAdapter.adminLogAction({
        admin_email: 'admin@makolaonline.com',
        action: 'add_credits',
        subject: sellerId,
        meta: { credits: amount }
      });

      toast({
        title: "Success",
        description: `Added ${amount} credits successfully`
      });

      setCreditAmounts(prev => ({ ...prev, [sellerId]: 0 }));
      loadSellers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add credits",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const subtractCredits = async (sellerId: string) => {
    const amount = creditAmounts[sellerId] || 0;
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid credit amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const success = await localAdapter.adminUseBoostCredits(sellerId, amount);
      if (!success) {
        toast({
          title: "Error",
          description: "Insufficient credits",
          variant: "destructive"
        });
        return;
      }

      await localAdapter.adminLogAction({
        admin_email: 'admin@makolaonline.com',
        action: 'subtract_credits',
        subject: sellerId,
        meta: { credits: amount }
      });

      toast({
        title: "Success",
        description: `Subtracted ${amount} credits successfully`
      });

      setCreditAmounts(prev => ({ ...prev, [sellerId]: 0 }));
      loadSellers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subtract credits",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Boost Credits Manager</h1>
        <p className="text-muted-foreground">Manage seller boost credits for product promotion</p>
      </div>

      <div className="grid gap-4">
        {sellers.map((seller) => (
          <Card key={seller.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{seller.name}</CardTitle>
                  <CardDescription>{seller.location}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <Badge variant="outline" className="text-lg font-semibold">
                    {seller.credits || 0} credits
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Amount"
                  value={creditAmounts[seller.id] || ''}
                  onChange={(e) => handleCreditChange(seller.id, parseInt(e.target.value) || 0)}
                  className="w-32"
                />
                <Button
                  onClick={() => addCredits(seller.id)}
                  disabled={loading}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
                <Button
                  onClick={() => subtractCredits(seller.id)}
                  disabled={loading}
                  size="sm"
                  variant="outline"
                >
                  <Minus className="h-4 w-4 mr-1" />
                  Subtract
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sellers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No sellers found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminCredits;