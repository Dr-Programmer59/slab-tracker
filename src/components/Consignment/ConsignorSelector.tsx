import React, { useState } from 'react';
import { Search, Plus, User } from 'lucide-react';
import { Button } from '../Common/Button';
import { Modal } from '../Common/Modal';
import type { Consignor } from '../../types';

interface ConsignorSelectorProps {
  selectedConsignor: Consignor | null;
  onSelect: (consignor: Consignor) => void;
  consignors: Consignor[];
  onCreateNew: (consignor: Omit<Consignor, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function ConsignorSelector({ selectedConsignor, onSelect, consignors, onCreateNew }: ConsignorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newConsignor, setNewConsignor] = useState({
    name: '',
    email: '',
    phone: '',
    payoutMethod: '',
    payoutDetails: '',
    defaultTerms: {
      sharePercentage: 70,
      floorPrice: 0,
      deductFees: true,
      returnWindowDays: 30,
    }
  });

  const filteredConsignors = consignors.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    onCreateNew(newConsignor);
    setShowCreateModal(false);
    setNewConsignor({
      name: '',
      email: '',
      phone: '',
      payoutMethod: '',
      payoutDetails: '',
      defaultTerms: {
        sharePercentage: 70,
        floorPrice: 0,
        deductFees: true,
        returnWindowDays: 30,
      }
    });
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-left text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {selectedConsignor ? (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>{selectedConsignor.name}</span>
              {selectedConsignor.email && (
                <span className="text-slate-400 text-sm">({selectedConsignor.email})</span>
              )}
            </div>
          ) : (
            <span className="text-slate-400">Select consignor...</span>
          )}
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="p-3 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search consignors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-indigo-400 hover:bg-slate-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Consignor</span>
              </button>

              {filteredConsignors.map((consignor) => (
                <button
                  key={consignor.id}
                  type="button"
                  onClick={() => {
                    onSelect(consignor);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-white hover:bg-slate-700 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-medium">{consignor.name}</div>
                    {consignor.email && (
                      <div className="text-sm text-slate-400">{consignor.email}</div>
                    )}
                  </div>
                </button>
              ))}

              {filteredConsignors.length === 0 && searchQuery && (
                <div className="px-3 py-2 text-slate-400 text-sm">No consignors found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create New Consignor Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Consignor"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={newConsignor.name}
              onChange={(e) => setNewConsignor({ ...newConsignor, name: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Consignor name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={newConsignor.email}
                onChange={(e) => setNewConsignor({ ...newConsignor, email: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                value={newConsignor.phone}
                onChange={(e) => setNewConsignor({ ...newConsignor, phone: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Default Terms</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Share %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newConsignor.defaultTerms.sharePercentage}
                  onChange={(e) => setNewConsignor({
                    ...newConsignor,
                    defaultTerms: {
                      ...newConsignor.defaultTerms,
                      sharePercentage: parseInt(e.target.value) || 0
                    }
                  })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Return Window (days)</label>
                <input
                  type="number"
                  min="0"
                  value={newConsignor.defaultTerms.returnWindowDays}
                  onChange={(e) => setNewConsignor({
                    ...newConsignor,
                    defaultTerms: {
                      ...newConsignor.defaultTerms,
                      returnWindowDays: parseInt(e.target.value) || 0
                    }
                  })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newConsignor.defaultTerms.deductFees}
                  onChange={(e) => setNewConsignor({
                    ...newConsignor,
                    defaultTerms: {
                      ...newConsignor.defaultTerms,
                      deductFees: e.target.checked
                    }
                  })}
                  className="rounded"
                />
                <span className="text-sm text-slate-300">Deduct platform fees from payout</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNew}
              disabled={!newConsignor.name.trim()}
              className="flex-1"
            >
              Create Consignor
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}