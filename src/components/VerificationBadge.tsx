import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified: boolean;
  badgeType?: string;
  size?: 'sm' | 'md' | 'lg';
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  isVerified, 
  badgeType = 'standard',
  size = 'sm' 
}) => {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <Badge 
      variant="secondary" 
      className={`bg-green-100 text-green-800 border-green-200 ${sizeClasses[size]} flex items-center gap-1`}
    >
      <CheckCircle size={iconSizes[size]} />
      <span>Verified</span>
      {badgeType === 'premium' && <span className="text-yellow-600">★</span>}
    </Badge>
  );
};

export default VerificationBadge;