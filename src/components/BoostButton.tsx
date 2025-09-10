import { useState } from "react";
import { useAuth } from "@/auth/session";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap } from "lucide-react";
import PaywallModal from "./PaywallModal";

interface BoostButtonProps {
  productId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

export default function BoostButton({ productId, variant = "outline", size = "sm" }: BoostButtonProps) {
  const { seller } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const [boosting, setBoosting] = useState(false);

  const handleBoost = async () => {
    if (!seller) return;

    // Check if seller is verified and has credits
    if (!seller.isVerified) {
      setShowPaywall(true);
      return;
    }

    if ((seller.credits || 0) < 1) {
      setShowPaywall(true);
      return;
    }

    // Proceed with boost
    setBoosting(true);
    try {
      // Simulate boost API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Boosting product ${productId}`);
      // TODO: Implement actual boost logic
    } catch (error) {
      console.error("Failed to boost product:", error);
    } finally {
      setBoosting(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleBoost}
        disabled={boosting}
        className="flex items-center gap-1"
      >
        {boosting ? (
          <>
            <Zap className="w-3 h-3 animate-pulse" />
            Boosting...
          </>
        ) : (
          <>
            <TrendingUp className="w-3 h-3" />
            Boost
          </>
        )}
      </Button>

      <PaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="boost"
        title="Boost Your Product"
        description="Boost your product to get more visibility and reach more customers."
        requiresVerification={!seller?.isVerified}
        requiresCredits={(seller?.credits || 0) < 1}
      />
    </>
  );
}