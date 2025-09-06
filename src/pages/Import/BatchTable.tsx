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
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-slate-400" />
          <h3 className="text-base sm:text-lg font-semibold text-white">Import Batches</h3>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:-mx-6">
        <div className="min-w-[600px] px-4 sm:px-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-2 text-xs font-medium text-slate-300 min-w-[120px]">Name</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-slate-300 min-w-[100px] hidden sm:table-cell">Created By</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-slate-300 min-w-[80px]">Date</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-slate-300 min-w-[60px]">Rows</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-slate-300 min-w-[80px]">Status</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-slate-300 min-w-[100px]">Actions</th>
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
                <td className="py-3 px-2">
                  <div className="font-medium text-white text-sm truncate max-w-[100px]">{batch.name}</div>
                </td>
                <td className="py-3 px-2 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-xs truncate max-w-[80px]">
                      {batch.createdBy.displayName || 'Unknown'}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-xs">
                      {new Date(batch.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className="text-white font-medium text-xs">
                    {batch.arrivedCount || 0}/{batch.totalRows}
                  </span>
                  <div className="w-8 bg-slate-700 rounded-full h-1 mt-1">
                    <div 
                      className="bg-indigo-500 h-1 rounded-full transition-all"
                      style={{ width: `${batch.totalRows > 0 ? ((batch.arrivedCount || 0) / batch.totalRows) * 100 : 0}%` }}
                    />
                  </div>
                </td>
                <td className="py-3 px-2">
                  <StatusChip status={batch.status} />
                </td>
                <td className="py-3 px-2">
                  <div className="flex flex-col items-stretch gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectBatch(batch)}
                      className="w-full text-xs px-2 py-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    {batch.status === 'Open' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs px-2 py-1"
                        onClick={() => {
                          onSelectBatch(batch);
                          onFinishBatch();
                        }}
                      >
                        <Lock className="w-4 h-4" />
                        <span className="sr-only">Finish</span>
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