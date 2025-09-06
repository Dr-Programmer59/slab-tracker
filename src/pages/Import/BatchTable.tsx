import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Lock, Calendar, User, FileText } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { StatusChip } from '../../components/Common/StatusChip';
import type { Batch } from '../../types';

interface BatchTableProps {
  batches: Batch[];
  onSelectBatch: (batch: Batch) => void;
  onFinishBatch: () => void;
}

export function BatchTable({ batches, onSelectBatch, onFinishBatch }: BatchTableProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-slate-400" />
          <h3 className="text-base sm:text-lg font-semibold text-white">Import Batches</h3>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[600px] px-4 sm:px-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[150px]">Name</th>
              <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[120px] hidden sm:table-cell">Created By</th>
              <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[100px]">Date</th>
              <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[80px]">Rows</th>
              <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[100px]">Status</th>
              <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, index) => (
              <motion.tr
                key={batch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
              >
                <td className="py-3 md:py-4 px-3 md:px-4">
                  <div className="font-medium text-white text-sm md:text-base truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{batch.name}</div>
                </td>
                <td className="py-3 md:py-4 px-3 md:px-4 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-xs md:text-sm truncate max-w-[100px] md:max-w-none">
                      {batch.createdBy.displayName || 'Unknown'}
                    </span>
                  </div>
                </td>
                <td className="py-3 md:py-4 px-3 md:px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-xs md:text-sm">
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="py-3 md:py-4 px-3 md:px-4">
                  <span className="text-white font-medium text-sm md:text-base">
                    {batch.arrivedCount || 0}/{batch.totalRows}
                  </span>
                  <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                    <div 
                      className="bg-indigo-500 h-1 rounded-full transition-all"
                      style={{ width: `${batch.totalRows > 0 ? ((batch.arrivedCount || 0) / batch.totalRows) * 100 : 0}%` }}
                    />
                  </div>
                </td>
                <td className="py-3 md:py-4 px-3 md:px-4">
                  <StatusChip status={batch.status} />
                </td>
                <td className="py-3 md:py-4 px-3 md:px-4">
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-1 lg:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectBatch(batch)}
                      className="w-full lg:w-auto text-xs whitespace-nowrap"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden lg:inline">View Rows</span>
                      <span className="lg:hidden">View</span>
                    </Button>
                    {batch.status === 'Open' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full lg:w-auto text-xs whitespace-nowrap"
                        onClick={() => {
                          onSelectBatch(batch);
                          onFinishBatch();
                        }}
                      >
                        <Lock className="w-4 h-4" />
                        <span className="hidden lg:inline">Finish</span>
                        <span className="lg:hidden">Finish</span>
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}