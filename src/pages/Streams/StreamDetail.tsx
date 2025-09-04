import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Lock, 
  DollarSign, 
  Calculator, 
  Package, 
  Radio,
  QrCode,
  Camera,
  Zap,
  StopCircle,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useStreamsStore } from '../../store/streams';
import { useAuthStore } from '../../store/auth';
import { usePermissions } from '../../hooks/usePermissions';
import { Button } from '../../components/Common/Button';
import { Modal } from '../../components/Common/Modal';
import { StatusChip } from '../../components/Common/StatusChip';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

type TabType = 'overview' | 'builder';

export function StreamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { hasPermission, canAccessOwnResource } = usePermissions();
  const { 
    currentStream, 
    streamItems, 
    loading, 
    itemsLoading,
    fetchStreamDetails, 
    fetchStreamItems,
    addCardToStream,
    removeCardFromStream,
    lockStream, 
    finalizeStream 
  } = useStreamsStore();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [finalizeData, setFinalizeData] = useState({ grossSales: 0, fees: 0, bulkSale: false });
  
  // Builder state
  const [builderActive, setBuilderActive] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);
  const [lastScan, setLastScan] = useState<string>('');
  const scanInputRef = useRef<HTMLInputElement>(null);

  // Fetch stream details on mount
  useEffect(() => {
    if (id) {
      fetchStreamDetails(id);
      fetchStreamItems(id);
    }
  }, [id, fetchStreamDetails, fetchStreamItems]);

  // Keep input focused for barcode scanner when builder is active
  useEffect(() => {
    if (builderActive && activeTab === 'builder' && scanInputRef.current) {
      scanInputRef.current.focus();
    }
  }, [builderActive, activeTab, lastScan]);

  if (loading) {
    return <LoadingSpinner message="Loading stream..." />;
  }

  if (!currentStream) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Stream not found</p>
        <Button variant="secondary" onClick={() => navigate('/streams')} className="mt-4">
          Back to Streams
        </Button>
      </div>
    );
  }

  const canEdit = hasPermission('streams.addItems') && 
    (user?.role === 'admin' || user?.role === 'manager' || 
     canAccessOwnResource('streams.addItems', currentStream.streamerUserId || '', user?.id || ''));
  
  const canLock = hasPermission('streams.lock') && 
    (user?.role === 'admin' || user?.role === 'manager' || 
     canAccessOwnResource('streams.lock', currentStream.streamerUserId || '', user?.id || ''));
  
  const canFinalize = hasPermission('streams.finalize');

  const handleScan = async (scannedValue: string) => {
    if (!scannedValue.trim() || !id) return;

    const success = await addCardToStream(id, scannedValue.trim());
    
    if (success) {
      setRecentlyAdded(prev => [scannedValue.trim(), ...prev.slice(0, 4)]);
      setLastScan(scannedValue.trim());
      setScanInput('');
      
      // Refresh stream items to get updated list
      fetchStreamItems(id);
    }
  };

  const startBuilding = () => {
    setBuilderActive(true);
    setActiveTab('builder');
    setRecentlyAdded([]);
    setLastScan('');
  };

  const stopBuilding = async () => {
    setBuilderActive(false);
    setActiveTab('overview');
    
    // If user can lock and there are items, optionally lock
    if (canLock && currentStream.totalItems > 0) {
      // For now, just close builder. Could add auto-lock setting here
      toast.success(`Building session completed with ${currentStream.totalItems} items`);
    } else {
      toast.success(`Building session completed`);
    }
  };

  const handleLock = async () => {
    if (id && window.confirm('Lock this stream? This will prevent further edits.')) {
      await lockStream(id);
    }
  };

  const handleFinalize = async () => {
    if (id) {
      await finalizeStream(id, finalizeData.grossSales, finalizeData.fees, finalizeData.bulkSale);
      setShowFinalizeModal(false);
    }
  };

  const handleRemoveItem = async (cardId: string) => {
    if (id && window.confirm('Remove this item from the stream?')) {
      await removeCardFromStream(id, cardId);
      fetchStreamItems(id); // Refresh items
    }
  };

  const calculatedProfit = finalizeData.grossSales - finalizeData.fees - currentStream.totalCost;

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-400';
    if (profit < 0) return 'text-red-400';
    return 'text-slate-400';
  };

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
            <h1 className="text-2xl font-bold text-white">{currentStream.title}</h1>
            <p className="text-slate-400 mt-1">
              {currentStream.streamer} • {currentStream.date.toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusChip status={currentStream.status} />
          {canLock && currentStream.status === 'Draft' && (
            <Button variant="secondary" onClick={handleLock}>
              <Lock className="w-4 h-4" />
              Lock Stream
            </Button>
          )}
          {canFinalize && currentStream.status === 'Locked' && (
            <Button onClick={() => setShowFinalizeModal(true)}>
              <Calculator className="w-4 h-4" />
              Finalize
            </Button>
          )}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1"
      >
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Package className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          disabled={currentStream.status !== 'Draft'}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'builder' && currentStream.status === 'Draft'
              ? 'bg-indigo-600 text-white shadow-lg'
              : currentStream.status !== 'Draft'
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          title={currentStream.status !== 'Draft' ? 'Builder disabled for locked/finalized streams' : ''}
        >
          <QrCode className="w-4 h-4" />
          Builder
          {currentStream.status !== 'Draft' && (
            <Lock className="w-3 h-3 text-slate-600" />
          )}
        </button>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Stream Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-indigo-400" />
                  <span className="text-slate-400 text-sm">Total Items</span>
                </div>
                <p className="text-2xl font-bold text-white">{currentStream.totalItems}</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-red-400" />
                  <span className="text-slate-400 text-sm">Total Cost</span>
                </div>
                <p className="text-2xl font-bold text-white">${currentStream.totalCost}</p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-slate-400 text-sm">Gross Sales</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {currentStream.grossSales ? `$${currentStream.grossSales}` : '—'}
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calculator className="w-5 h-5 text-cyan-400" />
                  <span className="text-slate-400 text-sm">Profit</span>
                </div>
                <p className={`text-2xl font-bold ${getProfitColor(currentStream.profit || 0)}`}>
                  {currentStream.profit !== undefined ? `$${currentStream.profit}` : '—'}
                </p>
              </div>
            </div>

            {/* Additional Financial Details for Finalized Streams */}
            {currentStream.status === 'Finalized' && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Financial Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-400 mb-1">Revenue</p>
                    <p className="text-xl font-bold text-green-400">
                      ${currentStream.grossSales?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 mb-1">Fees</p>
                    <p className="text-xl font-bold text-red-400">
                      -${currentStream.fees?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400 mb-1">Net Profit</p>
                    <p className={`text-xl font-bold ${getProfitColor(currentStream.profit || 0)}`}>
                      ${currentStream.profit?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
                {currentStream.bulkSale && (
                  <div className="mt-4 p-3 bg-amber-600/10 border border-amber-600/20 rounded-lg">
                    <p className="text-amber-400 text-sm font-medium">📦 Bulk Sale</p>
                  </div>
                )}
              </div>
            )}
            {/* Items Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Stream Items</h3>
                {currentStream.status === 'Draft' && canEdit && (
                  <Button onClick={startBuilding}>
                    <Zap className="w-4 h-4" />
                    Start Building
                  </Button>
                )}
              </div>
              
              {itemsLoading ? (
                <LoadingSpinner message="Loading items..." />
              ) : currentStream.totalItems === 0 ? (
                <div className="text-center py-12">
                  <Radio className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-slate-400 mb-2">No items yet</h4>
                  <p className="text-slate-500 mb-4">Add cards to this stream to get started</p>
                  {currentStream.status === 'Draft' && canEdit && (
                    <Button onClick={startBuilding}>
                      <Zap className="w-4 h-4" />
                      Start Building
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Card</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Title</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Purchase Price</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Added</th>
                        {currentStream.status === 'Draft' && canEdit && (
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(currentStream.items || []).map((item, index) => (
                        <motion.tr
                          key={item.cardId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-slate-700"
                        >
                          <td className="py-3 px-4">
                            <span className="text-white font-mono">{item.displayId}</span>
                            {recentlyAdded.includes(item.cardId) && (
                              <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                                Recently added
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-white">{item.title}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-white font-medium">${item.purchasePrice}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-300 text-sm">
                              {new Date(item.addedAt).toLocaleString()}
                            </span>
                          </td>
                          {currentStream.status === 'Draft' && canEdit && (
                            <td className="py-3 px-4">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleRemoveItem(item.cardId)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          )}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="builder"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {!builderActive ? (
              /* Start Building */
              <div className="max-w-md mx-auto">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                  <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Ready to Build?</h3>
                  <p className="text-slate-400 mb-6">
                    Start scanning cards to add them to this stream
                  </p>
                  <Button onClick={() => setBuilderActive(true)} size="lg" className="w-full">
                    <Zap className="w-5 h-5" />
                    Start Building
                  </Button>
                </div>
              </div>
            ) : (
              /* Active Builder */
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Scan Area */}
                <div className="bg-slate-800 border-2 border-dashed border-indigo-500 rounded-xl p-8">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Scan Cards</h3>
                    <p className="text-slate-400 mb-4">
                      Use your scanner or type card ID manually
                    </p>
                    
                    <input
                      ref={scanInputRef}
                      type="text"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleScan(scanInput);
                        }
                      }}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-center text-lg font-mono"
                      placeholder="Scan or type card ID..."
                      autoFocus
                    />
                  </div>
                </div>

                {/* Last Scan Feedback */}
                {lastScan && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-green-600/10 border border-green-600/20 rounded-lg p-4 text-center"
                  >
                    <p className="text-green-400 font-medium">✓ Last scan: {lastScan}</p>
                  </motion.div>
                )}

                {/* Live Totals */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Building Session</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Items: {currentStream.totalItems}</p>
                        <p className="text-xl font-bold text-white">${currentStream.totalCost}</p>
                      </div>
                      <Button variant="danger" onClick={stopBuilding}>
                        <StopCircle className="w-4 h-4" />
                        Stop Building
                      </Button>
                    </div>
                  </div>

                  {/* Recently Added */}
                  {recentlyAdded.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Recently Added</h4>
                      <div className="space-y-2">
                        {recentlyAdded.map((displayId, index) => (
                          <motion.div
                            key={`${displayId}-${index}`}
                            initial={{ x: -20, opacity: 0, scale: 0.95 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg"
                          >
                            <div className="w-6 h-8 bg-slate-600 rounded flex items-center justify-center">
                              <Package className="w-3 h-3 text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-mono text-sm">{displayId}</p>
                              <p className="text-xs text-green-400">✓ Added successfully</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finalize Modal */}
      <Modal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        title="Finalize Stream"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Enter the final sales data to calculate profit and complete the stream.
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

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={finalizeData.bulkSale}
                onChange={(e) => setFinalizeData({ 
                  ...finalizeData, 
                  bulkSale: e.target.checked 
                })}
                className="rounded"
              />
              <span className="text-slate-300 text-sm">Bulk Sale</span>
            </label>
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
              <span className="text-white">-${currentStream.totalCost}</span>
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