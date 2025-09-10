import { useState, useEffect } from "react";
import { useAuth } from "@/auth/session";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CheckCircle, AlertCircle } from "lucide-react";

interface MoMoWallet {
  id: string;
  phone_number: string;
  network: string;
  account_name: string;
  is_verified: boolean;
}

interface MoMoWalletSetupProps {
  userType: 'seller' | 'rider';
}

export default function MoMoWalletSetup({ userType }: MoMoWalletSetupProps) {
  const { seller, rider } = useAuth();
  const user = userType === 'seller' ? seller : rider;
  const [wallet, setWallet] = useState<MoMoWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: '',
    network: '',
    account_name: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadWallet();
    }
  }, [user?.id]);

  const loadWallet = async () => {
    try {
      const { data, error } = await supabase
        .from('momo_wallets')
        .select('*')
        .eq('user_id', user?.id)
        .eq('user_type', userType)
        .single();

      if (data) {
        setWallet(data);
        setFormData({
          phone_number: data.phone_number,
          network: data.network,
          account_name: data.account_name
        });
      }
    } catch (error) {
      console.error('Failed to load wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWallet = async () => {
    if (!user?.id || !formData.phone_number || !formData.network) return;

    try {
      setSaving(true);
      
      const walletData = {
        user_id: user.id,
        user_type: userType,
        phone_number: formData.phone_number,
        network: formData.network,
        account_name: formData.account_name,
        updated_at: new Date().toISOString()
      };

      if (wallet) {
        // Update existing wallet
        const { error } = await supabase
          .from('momo_wallets')
          .update(walletData)
          .eq('id', wallet.id);
        
        if (error) throw error;
      } else {
        // Create new wallet
        const { data, error } = await supabase
          .from('momo_wallets')
          .insert(walletData)
          .select()
          .single();
        
        if (error) throw error;
        setWallet(data);
      }

      await loadWallet();
    } catch (error) {
      console.error('Failed to save wallet:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading wallet...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Mobile Money Wallet
        </CardTitle>
        <CardDescription>
          Set up your Mobile Money wallet to receive payments and payouts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {wallet && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {wallet.is_verified ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="font-medium">{wallet.phone_number}</span>
              <Badge variant="outline">{wallet.network}</Badge>
            </div>
            <Badge variant={wallet.is_verified ? "default" : "secondary"}>
              {wallet.is_verified ? "Verified" : "Pending"}
            </Badge>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Mobile Money Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0241234567"
              value={formData.phone_number}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="network">Network</Label>
            <Select value={formData.network} onValueChange={(value) => setFormData(prev => ({ ...prev, network: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MTN">MTN Mobile Money</SelectItem>
                <SelectItem value="Vodafone">Vodafone Cash</SelectItem>
                <SelectItem value="AirtelTigo">AirtelTigo Money</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Account Name (Optional)</Label>
            <Input
              id="name"
              placeholder="Account holder name"
              value={formData.account_name}
              onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
            />
          </div>

          <Button 
            onClick={saveWallet} 
            disabled={saving || !formData.phone_number || !formData.network}
            className="w-full"
          >
            {saving ? 'Saving...' : wallet ? 'Update Wallet' : 'Save Wallet'}
          </Button>
        </div>

        {!wallet?.is_verified && wallet && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Your wallet is pending verification. You'll receive a confirmation message once verified.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}