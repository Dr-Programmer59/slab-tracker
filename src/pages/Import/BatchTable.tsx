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
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-white">Import Batches</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Created By</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Rows</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Actions</th>
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
                <td className="py-4 px-4">
                  <div className="font-medium text-white">{batch.name}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">
                      {batch.createdBy?.displayName || 'Unknown'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-white font-medium">
                    {batch.arrivedCount || 0}/{batch.totalRows}
                  </span>
                  <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                    <div 
                      className="bg-indigo-500 h-1 rounded-full transition-all"
                      style={{ width: `${batch.totalRows > 0 ? ((batch.arrivedCount || 0) / batch.totalRows) * 100 : 0}%` }}
                    />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <StatusChip status={batch.status} />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectBatch(batch)}
                    >
                      <Eye className="w-4 h-4" />
                      View Rows
                    </Button>
                    {batch.status === 'Open' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          onSelectBatch(batch);
                          onFinishBatch();
                        }}
                      >
                        <Lock className="w-4 h-4" />
                        Finish
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
  );
}