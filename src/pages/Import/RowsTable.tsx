import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Check, AlertTriangle, Printer, Settings } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { StatusChip } from '../../components/Common/StatusChip';
import { Modal } from '../../components/Common/Modal';
import { ConsignorSelector } from '../../components/Consignment/ConsignorSelector';
import { TermsPreview } from '../../components/Consignment/TermsPreview';
import type { Batch, BatchRow } from '../../types';
import { batchService } from '../../services/batchService';
import { config } from '../../utils/config';
import toast from 'react-hot-toast';

// Mock consignors data - replace with actual API call
const mockConsignors = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    defaultTerms: {
      sharePercentage: 70,
      floorPrice: 50,
      deductFees: true,
      returnWindowDays: 30,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    defaultTerms: {
      sharePercentage: 75,
      floorPrice: 0,
      deductFees: false,
      returnWindowDays: 45,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface RowsTableProps {
  batch: Batch;
  onBack: () => void;
}

export function RowsTable({ batch, onBack }: RowsTableProps) {
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArriveModal, setShowArriveModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<BatchRow | null>(null);
  const [consignmentData, setConsignmentData] = useState({
    isConsignment: false,
    consignor: null as any,
    overrideTerms: false,
    customTerms: null as any,
  });
  const [consignors, setConsignors] = useState(mockConsignors);

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

  const openArriveModal = (row: BatchRow) => {
    setSelectedRow(row);
    setShowArriveModal(true);
  };

  const markArrived = async () => {
    try {
      const idempotencyKey = `arrive-${rowId}-${Date.now()}`;
      const result = await batchService.markRowAsArrived(batch._id, rowId, idempotencyKey);
      
      if (result.success && result.data) {
        const { card, row, message } = result.data;
        
        if (consignmentData.isConsignment && consignmentData.consignor) {
          toast.success(`Consigned to ${consignmentData.consignor.name} - ${message || 'Card marked as arrived and label generated!'}`);
        } else {
          toast.success(message || 'Card marked as arrived and label generated!');
        }
        
        fetchRows(); // Refresh the rows
        setShowArriveModal(false);
        setConsignmentData({ isConsignment: false, consignor: null, overrideTerms: false, customTerms: null });
      } else {
        toast.error(result.error || 'Failed to mark as arrived');
      }
    } catch (error) {
      toast.error('Failed to mark as arrived');
    }
  };

  const handleCreateConsignor = (newConsignor: any) => {
    const consignor = {
      ...newConsignor,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConsignors([...consignors, consignor]);
    setConsignmentData({ ...consignmentData, consignor });
    toast.success(`Consignor "${consignor.name}" created successfully!`);
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
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[60px]">Row #</th>
                <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[150px]">Title</th>
                <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[120px] hidden sm:table-cell">Player</th>
                <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[100px] hidden md:table-cell">Details</th>
                <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[80px]">Price</th>
                <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[100px]">Status</th>
                <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[100px] hidden lg:table-cell">Validation</th>
                <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-slate-300 min-w-[120px]">Actions</th>
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
                  <td className="py-3 md:py-4 px-3 md:px-4">
                    <span className="text-slate-400 text-xs md:text-sm">#{row.rowNumber}</span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-4">
                    <span className="text-white font-medium text-sm md:text-base truncate block max-w-[120px] md:max-w-none">{row.title || '—'}</span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-4 hidden sm:table-cell">
                    <span className="text-slate-300 text-sm md:text-base truncate block max-w-[100px] md:max-w-none">{row.player || '—'}</span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-4 hidden md:table-cell">
                    <div className="text-xs md:text-sm">
                      <div className="text-slate-300">
                        {row.sport && row.year ? `${row.sport} • ${row.year}` : (row.sport || row.year || '—')}
                      </div>
                      {row.grade && <div className="text-slate-400">{row.grade}</div>}
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-4">
                    <span className="text-white font-medium text-sm md:text-base">${row.purchasePrice}</span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-4">
                    <StatusChip status={row.status} />
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-4 hidden lg:table-cell">
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
                  <td className="py-3 md:py-4 px-3 md:px-4">
                    {row.status === 'Staged' && row.validationErrors.length === 0 && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openArriveModal(row)}
                        className="w-full sm:w-auto text-xs"
                      >
                        <Printer className="w-4 h-4" />
                        <span className="hidden sm:inline">Mark Arrived</span>
                        <span className="sm:hidden">Arrive</span>
                      </Button>
                    )}
                    {row.status === 'Arrived' && row.linkedCardId && (
                      <span className="text-green-400 text-xs md:text-sm">✓ Created</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Arrive Modal */}
      <Modal
        isOpen={showArriveModal}
        onClose={() => {
          setShowArriveModal(false);
          setConsignmentData({ isConsignment: false, consignor: null, overrideTerms: false, customTerms: null });
        }}
        title="Mark Card as Arrived"
        size="lg"
      >
        {selectedRow && (
          <div className="space-y-4">
            {/* Card Info */}
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">{selectedRow.title}</h4>
              <div className="text-sm text-slate-400">
                <p>Player: {selectedRow.player}</p>
                <p>Row #{selectedRow.rowNumber}</p>
                <p>Purchase Price: ${selectedRow.purchasePrice}</p>
              </div>
            </div>

            {/* Consignment Checkbox */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={consignmentData.isConsignment}
                  onChange={(e) => setConsignmentData({
                    ...consignmentData,
                    isConsignment: e.target.checked,
                    consignor: e.target.checked ? consignmentData.consignor : null,
                  })}
                  className="rounded"
                />
                <span className="text-white font-medium">Received on Consignment</span>
              </label>
            </div>

            {/* Consignment Details */}
            {consignmentData.isConsignment && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Consignor Selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Consignor <span className="text-red-400">*</span>
                  </label>
                  <ConsignorSelector
                    selectedConsignor={consignmentData.consignor}
                    onSelect={(consignor) => setConsignmentData({ ...consignmentData, consignor })}
                    consignors={consignors}
                    onCreateNew={handleCreateConsignor}
                  />
                </div>

                {/* Terms Preview */}
                {consignmentData.consignor && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Terms</label>
                    <TermsPreview terms={consignmentData.consignor.defaultTerms} />
                  </div>
                )}

                {/* Override Toggle */}
                {consignmentData.consignor && (
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={consignmentData.overrideTerms}
                        onChange={(e) => setConsignmentData({
                          ...consignmentData,
                          overrideTerms: e.target.checked,
                          customTerms: e.target.checked ? { ...consignmentData.consignor.defaultTerms } : null,
                        })}
                        className="rounded"
                      />
                      <span className="text-sm text-slate-300">Override terms for this card</span>
                      <Settings className="w-4 h-4 text-slate-400" />
                    </label>
                  </div>
                )}

                {/* Custom Terms */}
                {consignmentData.overrideTerms && consignmentData.customTerms && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-2 gap-4 p-4 bg-slate-700 rounded-lg"
                  >
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Share %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={consignmentData.customTerms.sharePercentage}
                        onChange={(e) => setConsignmentData({
                          ...consignmentData,
                          customTerms: {
                            ...consignmentData.customTerms,
                            sharePercentage: parseInt(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Floor Price</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={consignmentData.customTerms.floorPrice || ''}
                        onChange={(e) => setConsignmentData({
                          ...consignmentData,
                          customTerms: {
                            ...consignmentData.customTerms,
                            floorPrice: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowArriveModal(false);
                  setConsignmentData({ isConsignment: false, consignor: null, overrideTerms: false, customTerms: null });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={markArrived}
                disabled={consignmentData.isConsignment && !consignmentData.consignor}
                className="flex-1"
              >
                <Printer className="w-4 h-4" />
                Confirm Arrived
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}