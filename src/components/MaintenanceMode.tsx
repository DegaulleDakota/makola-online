import { AlertTriangle, Clock } from 'lucide-react';
import config from '@/config/environment';

export function MaintenanceMode() {
  if (!config.maintenanceMode) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Maintenance Mode
        </h1>
        <p className="text-gray-600 mb-6">
          Makola Online is currently undergoing scheduled maintenance. 
          We'll be back shortly with improvements!
        </p>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          Expected downtime: 15-30 minutes
        </div>
        <div className="mt-6 text-xs text-gray-400">
          Follow us on social media for updates
        </div>
      </div>
    </div>
  );
}