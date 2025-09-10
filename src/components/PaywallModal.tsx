import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap } from "lucide-react";

type PaywallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "verification" | "pro";
  onPayment: (type: "verification" | "pro") => void;
};

export default function PaywallModal({ isOpen, onClose, type, onPayment }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await onPayment(type);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const verificationFeatures = [
    "Verified badge on your profile",
    "Higher search ranking",
    "Customer trust boost",
    "Priority customer support"
  ];

  const proFeatures = [
    "All verification benefits",
    "Unlimited product boosts",
    "Advanced analytics",
    "Featured shop placement",
    "Priority listing in search"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "verification" ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                Get Verified
              </>
            ) : (
              <>
                <Star className="w-5 h-5 text-yellow-600" />
                Upgrade to Pro
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">
              {type === "verification" ? "GHS 50" : "GHS 200"}
            </div>
            <div className="text-sm text-gray-600">
              {type === "verification" ? "One-time payment" : "Per month"}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">What you get:</h4>
            <ul className="space-y-1">
              {(type === "verification" ? verificationFeatures : proFeatures).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={loading} className="flex-1">
              {loading ? "Processing..." : `Pay GHS ${type === "verification" ? "50" : "200"}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}