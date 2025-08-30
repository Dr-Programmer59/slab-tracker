import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, DollarSign, Calculator, Package } from 'lucide-react';
import { useStreamsStore } from '../../store/streams';
import { useAuthStore } from '../../store/auth';
import { Button } from '../../components/Common/Button';
import { Modal } from '../../components/Common/Modal';
import { StatusChip } from '../../components/Common/StatusChip';
import toast from 'react-hot-toast';

export function StreamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { streams, lockStream, finalizeStream } = useStreamsStore();
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [finalizeData, setFinalizeData] = useState({ grossSales: 0, fees: 0 });

  const stream = streams.find(s => s.id === id);

  if (!stream) {
    return <div className="text-white">Stream not found</div>;
  }

  const canEdit = user?.role === 'Admin' || user?.role === 'Manager';

  const handleLock = () => {
    if (window.confirm('Lock this stream? This will prevent further edits.')) {
      lockStream(stream.id);
      toast.success('Stream locked successfully!');
    }
  };

  const handleFinalize = () => {
    finalizeStream(stream.id, finalizeData.grossSales, finalizeData.fees);
    setShowFinalizeModal(false);
    toast.success('Stream finalized successfully!');
  };

  const calculatedProfit = finalizeData.grossSales - finalizeData.fees - stream.totalCost;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/streams')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Streams
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{stream.title}</h1>
            <p className="text-slate-400 mt-1">{stream.streamer} • {stream.date.toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusChip status={stream.status} />
          {canEdit && stream.status === 'Draft' && (
            <Button variant="secondary" onClick={handleLock}>
              <Lock className="w-4 h-4" />
              Lock Stream
            </Button>
          )}
          {canEdit && stream.status === 'Locked' && (
            <Button onClick={() => setShowFinalizeModal(true)}>
              <Calculator className="w-4 h-4" />
              Finalize
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stream Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <span className="text-slate-400 text-sm">Total Items</span>
          </div>
          <p className="text-2xl font-bold text-white">{stream.totalItems}</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-red-400" />
            <span className="text-slate-400 text-sm">Total Cost</span>
          </div>
          <p className="text-2xl font-bold text-white">${stream.totalCost}</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-slate-400 text-sm">Gross Sales</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stream.grossSales ? `$${stream.grossSales}` : '—'}
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <span className="text-slate-400 text-sm">Profit</span>
          </div>
          <p className={`text-2xl font-bold ${getProfitColor(stream.profit || 0)}`}>
            {stream.profit !== undefined ? `$${stream.profit}` : '—'}
          </p>
        </div>
      </motion.div>

      {/* Items Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Stream Items</h3>
        
        {stream.cards.length === 0 ? (
          <div className="text-center py-12">
            <Radio className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-400 mb-2">No items yet</h4>
            <p className="text-slate-500 mb-4">Use the Builder to add cards to this stream</p>
            <Button variant="secondary" onClick={() => navigate('/builder')}>
              Open Builder
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Items would be rendered here */}
          </div>
        )}
      </motion.div>

      {/* Finalize Modal */}
      <Modal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        title="Finalize Stream"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Enter the final sales data to calculate profit and lock the stream.
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Gross Sales
            </label>
            <input
              type="number"
              step="0.01"
              value={finalizeData.grossSales}
              onChange={(e) => setFinalizeData({ 
                ...finalizeData, 
                grossSales: parseFloat(e.target.value) || 0 
              })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Platform Fees
            </label>
            <input
              type="number"
              step="0.01"
              value={finalizeData.fees}
              onChange={(e) => setFinalizeData({ 
                ...finalizeData, 
                fees: parseFloat(e.target.value) || 0 
              })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              placeholder="0.00"
            />
          </div>

          {/* Calculation Preview */}
          <div className="bg-slate-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Gross Sales:</span>
              <span className="text-white">${finalizeData.grossSales}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Platform Fees:</span>
              <span className="text-white">-${finalizeData.fees}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total Cost:</span>
              <span className="text-white">-${stream.totalCost}</span>
            </div>
            <hr className="border-slate-600" />
            <div className="flex justify-between font-medium">
              <span className="text-slate-300">Profit:</span>
              <span className={getProfitColor(calculatedProfit)}>
                ${calculatedProfit.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowFinalizeModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleFinalize} className="flex-1">
              Finalize Stream
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}