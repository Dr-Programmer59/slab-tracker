import React from 'react';
import { Clock, CheckCircle, DollarSign, XCircle, AlertCircle } from 'lucide-react';
import type { PayoutStatus } from '../../types';

interface PayoutStatusBadgeProps {
  status: PayoutStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function PayoutStatusBadge({ status, size = 'md', className = '' }: PayoutStatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };
  
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  const getStatusConfig = (status: PayoutStatus) => {
    switch (status) {
      case 'None':
        return {
          icon: XCircle,
          bg: 'bg-slate-600/20',
          text: 'text-slate-400',
          label: 'None'
        };
      case 'Pending':
        return {
          icon: Clock,
          bg: 'bg-amber-600/20',
          text: 'text-amber-300',
          label: 'Pending'
        };
      case 'Approved':
        return {
          icon: CheckCircle,
          bg: 'bg-green-600/20',
          text: 'text-green-300',
          label: 'Approved'
        };
      case 'Paid':
        return {
          icon: DollarSign,
          bg: 'bg-cyan-600/20',
          text: 'text-cyan-300',
          label: 'Paid'
        };
      case 'Returned':
        return {
          icon: AlertCircle,
          bg: 'bg-red-600/20',
          text: 'text-red-300',
          label: 'Returned'
        };
      default:
        return {
          icon: XCircle,
          bg: 'bg-slate-600/20',
          text: 'text-slate-400',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-medium
      ${config.bg} ${config.text}
      ${sizeClasses[size]}
      ${className}
    `}>
      <Icon className={iconSize} />
      <span>{config.label}</span>
    </span>
  );
}