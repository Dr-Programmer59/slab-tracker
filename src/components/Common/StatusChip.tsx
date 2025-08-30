import React from 'react';
import { motion } from 'framer-motion';
import type { CardStatus, StreamStatus, BatchStatus } from '../../types';

interface StatusChipProps {
  status: CardStatus | StreamStatus | BatchStatus;
  animate?: boolean;
}

export function StatusChip({ status, animate = true }: StatusChipProps) {
  const getStatusConfig = (status: string) => {
    const configs = {
      // Card statuses
      Staged: { bg: 'bg-slate-600', text: 'text-slate-200', label: 'Staged' },
      Arrived: { bg: 'bg-blue-600', text: 'text-blue-100', label: 'Arrived' },
      Available: { bg: 'bg-green-600', text: 'text-green-100', label: 'Available' },
      AllocatedToStream: { bg: 'bg-amber-600', text: 'text-amber-100', label: 'In Stream' },
      Sold: { bg: 'bg-purple-600', text: 'text-purple-100', label: 'Sold' },
      ToShip: { bg: 'bg-orange-600', text: 'text-orange-100', label: 'To Ship' },
      Packed: { bg: 'bg-indigo-600', text: 'text-indigo-100', label: 'Packed' },
      Shipped: { bg: 'bg-cyan-600', text: 'text-cyan-100', label: 'Shipped' },
      
      // Stream statuses
      Draft: { bg: 'bg-slate-600', text: 'text-slate-200', label: 'Draft' },
      Locked: { bg: 'bg-amber-600', text: 'text-amber-100', label: 'Locked' },
      Finalized: { bg: 'bg-green-600', text: 'text-green-100', label: 'Finalized' },
      
      // Batch statuses
      Open: { bg: 'bg-green-600', text: 'text-green-100', label: 'Open' },
      Closed: { bg: 'bg-slate-600', text: 'text-slate-200', label: 'Closed' },
    };

    return configs[status as keyof typeof configs] || configs.Staged;
  };

  const config = getStatusConfig(status);

  const ChipContent = () => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );

  if (!animate) {
    return <ChipContent />;
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <ChipContent />
    </motion.div>
  );
}