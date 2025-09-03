import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Check, AlertTriangle, Printer } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { StatusChip } from '../../components/Common/StatusChip';
import type { Batch, BatchRow } from '../../types';
import { batchService } from '../../services/batchService';
import toast from 'react-hot-toast';

interface RowsTableProps {
  batch: Batch;
  onBack: () => void;
}

export function RowsTable({ batch, onBack }: RowsTableProps) {
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch rows on component mount
  const fetchRows = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await batchService.getBatchRows(batch._id);
      if (result.success && result.data) {
        setRows(result.data.items || []);
      } else {
        toast.error(result.error || 'Failed to fetch rows');
      }
    } catch (error) {
      toast.error('Failed to fetch rows');
    } finally {
      setLoading(false);
    }
  }, [batch._id]);

  React.useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const markArrived = async (rowId: string) => {
    try {
      const idempotencyKey = `arrive-${rowId}-${Date.now()}`;
      const result = await batchService.markRowAsArrived(batch._id, rowId, idempotencyKey);
      
      if (result.success && result.data) {
        const { card, row, message } = result.data;
        toast.success(message || 'Card marked as arrived and label generated!');
        fetchRows(); // Refresh the rows
      } else {
        toast.error(result.error || 'Failed to mark as arrived');
      }
    } catch (error) {
      toast.error('Failed to mark as arrived');
    }
  };

  const filteredRows = rows.filter(row =>
    (row.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.player || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
            Back to Batches
          </Button>
          <div>
            <h3 className="text-lg font-semibold text-white">{batch.name}</h3>
            <p className="text-sm text-slate-400">
              {batch.arrivedCount} of {batch.totalRows} rows processed
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search rows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Rows Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading rows...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Row #</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Title</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Player</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Details</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Validation</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="text-slate-400 text-sm">#{row.rowNumber}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">{row.title || '—'}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-slate-300">{row.player || '—'}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="text-slate-300">
                        {row.sport && row.year ? `${row.sport} • ${row.year}` : (row.sport || row.year || '—')}
                      </div>
                      {row.grade && <div className="text-slate-400">{row.grade}</div>}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">${row.purchasePrice}</span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusChip status={row.status} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {row.validationErrors.length === 0 ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={`text-xs ${
                        row.validationErrors.length === 0 ? 'text-green-400' : 'text-amber-500'
                      }`}>
                        {row.validationErrors.length === 0 ? 'Valid' : `${row.validationErrors.length} errors`}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {row.status === 'Staged' && row.validationErrors.length === 0 && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => markArrived(row._id)}
                      >
                        <Printer className="w-4 h-4" />
                        Mark Arrived
                      </Button>
                    )}
                    {row.status === 'Arrived' && row.linkedCardId && (
                      <span className="text-green-400 text-sm">✓ Card Created</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}