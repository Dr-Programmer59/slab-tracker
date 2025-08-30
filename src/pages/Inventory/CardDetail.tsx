import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Printer, QrCode, Calendar, DollarSign } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { StatusChip } from '../../components/Common/StatusChip';
import { useInventoryStore } from '../../store/inventory';
import { useAuthStore } from '../../store/auth';
import type { Card } from '../../types';
import toast from 'react-hot-toast';

interface CardDetailProps {
  card: Card;
}

export function CardDetail({ card }: CardDetailProps) {
  const { user } = useAuthStore();
  const { updateCard, deleteCard, generateLabel } = useInventoryStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: card.title,
    player: card.player,
    currentValue: card.currentValue || 0,
    notes: card.notes || '',
  });

  const canEdit = user?.role === 'Admin' || user?.role === 'Manager';

  const handleSave = () => {
    updateCard(card.id, formData);
    setEditing(false);
    toast.success('Card updated successfully!');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCard(card.id);
      toast.success('Card deleted successfully!');
    }
  };

  const handlePrintLabel = () => {
    generateLabel(card.id);
    toast.success('Label sent to printer!');
  };

  return (
    <div className="space-y-6">
      {/* Card Image */}
      {card.imageUrl && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="aspect-[3/4] max-w-48 mx-auto rounded-lg overflow-hidden bg-slate-700"
        >
          <img 
            src={card.imageUrl} 
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Card Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <StatusChip status={card.status} />
          {canEdit && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(!editing)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrintLabel}
              >
                <Printer className="w-4 h-4" />
              </Button>
              {user?.role === 'Admin' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Player</label>
              <input
                type="text"
                value={formData.player}
                onChange={(e) => setFormData({ ...formData, player: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Current Value</label>
              <input
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">Save</Button>
              <Button 
                variant="secondary" 
                onClick={() => setEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">{card.title}</h3>
              <p className="text-lg text-slate-300 mt-1">{card.player}</p>
              <p className="text-sm text-slate-400">{card.sport} • {card.year} {card.grade && `• ${card.grade}`}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Purchase Price</span>
                </div>
                <p className="text-xl font-bold text-white">${card.purchasePrice}</p>
              </div>
              
              {card.currentValue && (
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Current Value</span>
                  </div>
                  <p className="text-xl font-bold text-green-400">${card.currentValue}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Display ID</span>
                <span className="text-white font-mono">{card.displayId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Created</span>
                <span className="text-white">{card.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Last Updated</span>
                <span className="text-white">{card.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>

            {card.notes && (
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Notes</h4>
                <p className="text-slate-400 bg-slate-700 rounded-lg p-3">{card.notes}</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-700">
              <Button
                variant="secondary"
                onClick={handlePrintLabel}
                className="w-full"
              >
                <QrCode className="w-4 h-4" />
                Generate Label
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}