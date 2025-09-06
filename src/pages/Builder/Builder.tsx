import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Package, DollarSign, Zap, StopCircle, Camera } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { useInventoryStore } from '../../store/inventory';
import toast from 'react-hot-toast';

export function Builder() {
  const { cards, updateCardStatus } = useInventoryStore();
  const [sessionItems, setSessionItems] = useState<any[]>([]);
  const [lastScan, setLastScan] = useState<string>('');
  const [sessionActive, setSessionActive] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const scanInputRef = useRef<HTMLInputElement>(null);

  // Keep input focused for barcode scanner
  useEffect(() => {
    if (sessionActive && scanInputRef.current) {
      scanInputRef.current.focus();
    }
  }, [sessionActive, lastScan]);

  const handleScan = (scannedValue: string) => {
    if (!scannedValue.trim()) return;

    const card = cards.find(c => c.displayId === scannedValue || c.id === scannedValue);
    
    if (!card) {
      toast.error('Card not found');
      return;
    }

    if (card.status !== 'Available') {
      toast.error('Card is not available for stream allocation');
      return;
    }

    // Add to session
    setSessionItems(prev => [...prev, card]);
    updateCardStatus(card.id,  'AllocatedToStream' );
    setLastScan(card.displayId);
    
    // Success feedback
    toast.success(`Added ${card.player} - ${card.title}`);
    setScanInput('');
  };

  const startSession = () => {
    setSessionActive(true);
    setSessionItems([]);
    setLastScan('');
  };

  const stopSession = () => {
    setSessionActive(false);
    // In real app, this would create/update a stream
    toast.success(`Session completed with ${sessionItems.length} items`);
  };

  const totalCost = sessionItems.reduce((sum, item) => sum + item.purchasePrice, 0);

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-900 p-4">
      {/* Mobile-optimized header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Stream Builder</h1>
        <p className="text-slate-400">Scan cards to build your stream session</p>
      </motion.div>

      {!sessionActive ? (
        /* Start Session */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-sm md:max-w-md mx-auto"
        >
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-base md:text-lg font-semibold text-white mb-2">Ready to Build?</h3>
            <p className="text-slate-400 mb-6">
              Start scanning cards to build your stream session
            </p>
            <Button onClick={startSession} size="lg" className="w-full text-sm md:text-base">
              <Zap className="w-5 h-5" />
              Start New Session
            </Button>
          </div>
        </motion.div>
      ) : (
        /* Active Session */
        <div className="max-w-full md:max-w-2xl mx-auto space-y-4 md:space-y-6">
          {/* Scan Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border-2 border-dashed border-indigo-500 rounded-xl p-4 md:p-8"
          >
            <div className="text-center">
              <QrCode className="w-12 h-12 md:w-16 md:h-16 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">Scan Cards</h3>
              <p className="text-slate-400 mb-4">
                Use your scanner or type card ID manually
              </p>
              
              {/* Hidden input for scanner */}
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
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 md:px-4 py-2 md:py-3 text-white text-center text-base md:text-lg font-mono"
                placeholder="Scan or type card ID..."
                autoFocus
              />
            </div>
          </motion.div>

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

          {/* Session Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4 md:p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <h4 className="text-xs md:text-sm font-medium text-slate-300 mb-3">Session Summary</h4>
              <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <p className="text-xs md:text-sm text-slate-400">Items: {sessionItems.length}</p>
                  <p className="text-lg md:text-xl font-bold text-white">${totalCost.toFixed(2)}</p>
                </div>
                <Button variant="danger" onClick={stopSession} size="sm" className="flex-shrink-0">
                  <StopCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Stop Building</span>
                  <span className="sm:hidden">Stop</span>
                </Button>
              </div>
            </div>

            {sessionItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-sm md:text-base">No items scanned yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessionItems.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    initial={{ x: -20, opacity: 0, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 md:gap-4 p-3 md:p-4 bg-slate-700 rounded-lg"
                  >
                    <div className="w-6 h-8 md:w-8 md:h-10 bg-slate-600 rounded flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm md:text-base truncate">{item.title}</p>
                      <p className="text-xs md:text-sm text-slate-400">{item.player} • ${item.purchasePrice}</p>
                      <p className="text-xs text-slate-500 font-mono">{item.displayId}</p>
                    </div>
                    <div className="text-white font-medium text-sm md:text-base flex-shrink-0">${item.purchasePrice}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}