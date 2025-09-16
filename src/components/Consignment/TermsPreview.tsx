import React from 'react';
import { Percent, DollarSign, Clock, CreditCard } from 'lucide-react';
import type { ConsignmentTerms } from '../../types';

interface TermsPreviewProps {
  terms: ConsignmentTerms;
  className?: string;
}

export function TermsPreview({ terms, className = '' }: TermsPreviewProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-600/20 text-indigo-300 rounded-full text-xs">
        <Percent className="w-3 h-3" />
        <span>{terms.sharePercentage}% share</span>
      </div>
      
      {terms.floorPrice && terms.floorPrice > 0 && (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-300 rounded-full text-xs">
          <DollarSign className="w-3 h-3" />
          <span>${terms.floorPrice} floor</span>
        </div>
      )}
      
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-600/20 text-amber-300 rounded-full text-xs">
        <CreditCard className="w-3 h-3" />
        <span>{terms.deductFees ? 'Fees deducted' : 'No fee deduction'}</span>
      </div>
      
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-600/20 text-cyan-300 rounded-full text-xs">
        <Clock className="w-3 h-3" />
        <span>{terms.returnWindowDays}d return</span>
      </div>
    </div>
  );
}