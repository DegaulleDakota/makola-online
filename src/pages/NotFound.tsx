import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            404 - Page Not Found
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg">
            <p className="font-medium mb-1">Popular sections:</p>
            <ul className="text-left space-y-1">
              <li>• <Link to="/" className="text-green-600 hover:underline">Browse Products</Link></li>
              <li>• <Link to="/sell" className="text-green-600 hover:underline">Sell Your Items</Link></li>
              <li>• <Link to="/about" className="text-green-600 hover:underline">About Makola</Link></li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleGoBack} variant="outline" className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button asChild className="flex-1">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-400">
              Makola Online - Ghana's Premier Marketplace
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}