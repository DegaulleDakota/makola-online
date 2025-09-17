import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Zap, Shield } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sell = () => {
  const { trackEvent } = useAnalytics();
  const navigate = useNavigate();

  useEffect(() => {
    // Track seller landing page visit
    trackEvent("seller_landing_visit");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Start Selling on Everything Market Ghana</h1>
          <p className="text-xl mb-8">
            Join thousands of sellers and grow your business across Ghana
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-600 hover:bg-gray-100"
            onClick={async () => {
              // Track "Start Selling Now" clicks
              await trackEvent("start_selling_click");
              navigate("/seller/onboarding");
            }}
          >
            Start Selling Now
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Sell With Us?</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Large Customer Base</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Reach thousands of buyers daily across Ghana</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Easy Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">List your first product in minutes</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Secure Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Verified sellers, trusted transactions</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">We're here to help anytime</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our marketplace today and start growing your business
          </p>
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={async () => {
              // Track "Create Seller Account" clicks
              await trackEvent("start_selling_click");
              navigate("/seller/onboarding");
            }}
          >
            Create Seller Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sell;
