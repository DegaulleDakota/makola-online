import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServerError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            500 - Server Error
          </CardTitle>
          <CardDescription className="text-gray-600">
            Oops! Something went wrong on our end. Our team has been notified and is working to fix this issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded-lg">
            <p className="font-medium mb-1">What you can do:</p>
            <ul className="text-left space-y-1">
              <li>• Try refreshing the page</li>
              <li>• Check back in a few minutes</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleRefresh} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-400">
              Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Makola Online - Ghana's Premier Marketplace
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}