import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, Scan, Plus, FileText } from 'lucide-react';
import { useInventoryStore } from '../../store/inventory';
import { Button } from '../../components/Common/Button';
import { StatusChip } from '../../components/Common/StatusChip';
import { Modal } from '../../components/Common/Modal';
import { AddTrackingModal } from './AddTrackingModal';

export function Shipping() {
  const { cards, updateCard } = useInventoryStore();
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const shippingItems = {
    toShip: cards.filter(c => c.status === 'ToShip'),
    packed: cards.filter(c => c.status === 'Packed'),
    shipped: cards.filter(c => c.status === 'Shipped'),
  };

  const markPacked = (cardId: string) => {
    updateCard(cardId, { status: 'Packed' });
    toast.success('Item marked as packed!');
  };

  const markShipped = (card: any) => {
    setSelectedItem(card);
    setShowTrackingModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Shipping</h1>
          <p className="text-slate-400 mt-1">
            Process sold items through packing and shipping
          </p>
        </div>
        <Button variant="secondary">
          <FileText className="w-4 h-4" />
          Export Queue
        </Button>
      </motion.div>

      {/* Shipping Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* To Ship */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">To Ship</h3>
              <p className="text-sm text-slate-400">{shippingItems.toShip.length} items</p>
            </div>
          </div>

          <div className="space-y-3">
            {shippingItems.toShip.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white text-sm">{item.title}</p>
                  <StatusChip status={item.status} animate={false} />
                </div>
                <p className="text-slate-400 text-xs mb-3">{item.player} • {item.displayId}</p>
                <Button
                  size="sm"
                  onClick={() => markPacked(item.id)}
                  className="w-full"
                >
                  <Scan className="w-4 h-4" />
                  Pack Item
                </Button>
              </motion.div>
            ))}
            
            {shippingItems.toShip.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No items to ship</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Packed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Packed</h3>
              <p className="text-sm text-slate-400">{shippingItems.packed.length} items</p>
            </div>
          </div>

          <div className="space-y-3">
            {shippingItems.packed.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white text-sm">{item.title}</p>
                  <StatusChip status={item.status} animate={false} />
                </div>
                <p className="text-slate-400 text-xs mb-3">{item.player} • {item.displayId}</p>
                <Button
                  size="sm"
                  onClick={() => markShipped(item)}
                  className="w-full"
                >
                  <Truck className="w-4 h-4" />
                  Add Tracking
                </Button>
              </motion.div>
            ))}
            
            {shippingItems.packed.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No packed items</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Shipped */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Shipped</h3>
              <p className="text-sm text-slate-400">{shippingItems.shipped.length} items</p>
            </div>
          </div>

          <div className="space-y-3">
            {shippingItems.shipped.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white text-sm">{item.title}</p>
                  <StatusChip status={item.status} animate={false} />
                </div>
                <p className="text-slate-400 text-xs">{item.player} • {item.displayId}</p>
              </motion.div>
            ))}
            
            {shippingItems.shipped.length === 0 && (
              <div className="text-center py-8">
                <Truck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No shipped items</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Session Controls */}
      {sessionActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">Current Session</h4>
              <p className="text-slate-400 text-sm">
                {sessionItems.length} items • ${totalCost.toFixed(2)} total cost
              </p>
            </div>
            <Button variant="danger" onClick={stopSession}>
              <StopCircle className="w-4 h-4" />
              Stop Session
            </Button>
          </div>

          {/* Hidden input always focused for scanner */}
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
            className="sr-only"
            autoFocus
          />
        </motion.div>
      )}

      {/* Add Tracking Modal */}
      <AddTrackingModal
        isOpen={showTrackingModal}
        onClose={() => {
          setShowTrackingModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />
    </div>
  );
}