import React from 'react';
import { Building, User } from 'lucide-react';

interface OwnershipBadgeProps {
  ownership: 'Owned' | 'Consigned';
  size?: 'sm' | 'md';
  className?: string;
}

export function OwnershipBadge({ ownership, size = 'md', className = '' }: OwnershipBadgeProps) {
  const isOwned = ownership === 'Owned';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };
  
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-medium
      ${isOwned 
        ? 'bg-blue-600/20 text-blue-300' 
        : 'bg-purple-600/20 text-purple-300'
      }
      ${sizeClasses[size]}
      ${className}
    `}>
      {isOwned ? (
        <Building className={iconSize} />
      ) : (
        <User className={iconSize} />
      )}
      <span>{ownership}</span>
    </span>
  );
}