import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import config from '@/config/environment';

export function SoftLaunchBanner() {
  if (!config.softLaunchMode) return null;

  return (
    <Alert className="bg-orange-50 border-orange-200 mb-4">
      <Info className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        🚀 <strong>Limited Pilot Launch</strong> - We're in beta! Bear with us as we perfect your experience. 
        <a href="/feedback" className="underline ml-1">Share feedback</a>
      </AlertDescription>
    </Alert>
  );
}