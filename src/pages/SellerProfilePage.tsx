import { useState, useEffect } from "react";
import { useAuth } from "@/auth/session";
import { localAdapter } from "@/lib/localAdapter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, MapPin, Phone, User } from "lucide-react";
import MoMoWalletSetup from "@/components/MoMoWalletSetup";
import PaywallModal from "@/components/PaywallModal";
import { toast } from "sonner";
import type { Seller } from "@/lib/marketplaceAdapter";

export default function SellerProfilePage() {
  const { seller, refresh } = useAuth();
  const [sellerData, setSellerData] = useState<Seller | null>(null);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [paywall, setPaywall] = useState<{ isOpen: boolean; type: "verification" | "pro" }>({
    isOpen: false,
    type: "verification"
  });

  useEffect(() => {
    if (seller) {
      loadSellerData();
    }
  }, [seller]);

  const loadSellerData = async () => {
    if (!seller) return;
    try {
      const sellers = await localAdapter.listSellers();
      const current = sellers.find(s => s.id === seller.sellerId);
      if (current) {
        setSellerData(current);
        setName(current.name);
        setWhatsapp(current.whatsapp);
        setLocation(current.location);
      }
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  const handleSave = async () => {
    if (!seller || !sellerData) return;
    
    setLoading(true);
    try {
      await localAdapter.updateSeller(seller.sellerId, {
        name,
        whatsapp,
        location
      });
      toast.success("Profile updated successfully");
      refresh();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (type: "verification" | "pro") => {
    if (!seller) return;
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (type === "verification") {
        await localAdapter.verifySeller(seller.sellerId, true);
        toast.success("Verification successful!");
      } else {
        // Pro upgrade logic would go here
        toast.success("Upgraded to Pro!");
      }
      
      loadSellerData();
      refresh();
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  if (!seller || !sellerData) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Shop Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Shop Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter shop name"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="233XXXXXXXXX"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Rawlings Park, Accra"
                className="pl-10"
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Verification Status</h3>
                <p className="text-sm text-gray-600">Get verified to build trust</p>
              </div>
              {sellerData.verified ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setPaywall({ isOpen: true, type: "verification" })}
                >
                  Get Verified
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Pro Status</h3>
                <p className="text-sm text-gray-600">Unlock premium features</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPaywall({ isOpen: true, type: "pro" })}
              >
                <Star className="w-4 h-4 mr-1" />
                Upgrade to Pro
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <PaywallModal
        isOpen={paywall.isOpen}
        onClose={() => setPaywall({ ...paywall, isOpen: false })}
        type={paywall.type}
        onPayment={handlePayment}
      />

      <MoMoWalletSetup userType="seller" />
    </div>
  );
}