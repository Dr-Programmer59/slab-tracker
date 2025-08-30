import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Eye } from 'lucide-react';
import { useInventoryStore } from '../../store/inventory';
import { useCards } from '../../hooks/useApi';
import { Button } from '../../components/Common/Button';
import { StatusChip } from '../../components/Common/StatusChip';
import { Drawer } from '../../components/Common/Drawer';
import { Modal } from '../../components/Common/Modal';
import { CardDetail } from './CardDetail';
import { AddCardModal } from './AddCardModal';
import { FiltersPanel } from './FiltersPanel';

export function Inventory() {
  const { 
    filters, 
    loading,
    selectedCards,
    setFilters, 
    selectCards,
    selectedCard, 
    isDetailDrawerOpen, 
    selectCard, 
    setDetailDrawerOpen,
    fetchCards
  } = useInventoryStore();
  
  const { data: cardsData } = useCards(filters);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const cards = cardsData?.cards || [];
  const pagination = cardsData?.pagination || { page: 1, pages: 1, total: 0 };

  const handleCardClick = (card: any) => {
    selectCard(card);
    setDetailDrawerOpen(true);
  };

  const handleSelectCard = (cardId: string, selected: boolean) => {
    const newSelection = selected 
      ? [...selectedCards, cardId]
      : selectedCards.filter(id => id !== cardId);
    selectCards(newSelection);
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
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="text-slate-400 mt-1">
            {pagination.total} cards {filters.search && `matching "${filters.search}"`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedCards.length > 0 && (
            <Button variant="secondary">
              {selectedCards.length} selected
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Card
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search cards, players, or use ⌘K for command palette..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </motion.div>

      {/* Cards Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
      >
        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                  <div className="w-10 h-14 bg-slate-700 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/4"></div>
                  </div>
                  <div className="w-20 h-4 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={selectedCards.length === cards.length && cards.length > 0}
                    onChange={(e) => {
                      const allIds = cards.map(c => c.id);
                      selectCards(e.target.checked ? allIds : []);
                    }}
                    className="rounded"
                  />
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Card</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Player</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Details</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Purchase</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Current</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card, index) => (
                <motion.tr
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
                  className="border-b border-slate-700 cursor-pointer"
                  onClick={() => handleCardClick(card)}
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedCards.includes(card.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectCard(card.id, e.target.checked);
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {card.imageUrl && (
                        <img 
                          src={card.imageUrl} 
                          alt={card.title}
                          className="w-10 h-14 object-cover rounded bg-slate-600"
                        />
                      )}
                      <div>
                        <div className="font-medium text-white">{card.title}</div>
                        <div className="text-xs text-slate-400">{card.displayId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-300">{card.player}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div className="text-slate-300">{card.sport} • {card.year}</div>
                      {card.grade && <div className="text-slate-400">{card.grade}</div>}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white font-medium">${card.purchasePrice}</span>
                  </td>
                  <td className="py-4 px-6">
                    {card.currentValue ? (
                      <span className="text-green-400 font-medium">${card.currentValue}</span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <StatusChip status={card.status} />
                  </td>
                  <td className="py-4 px-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(card);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </motion.div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">
            Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} cards
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => {
                // Implement pagination
              }}
            >
              Previous
            </Button>
            <span className="text-slate-300 text-sm">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page === pagination.pages}
              onClick={() => {
                // Implement pagination
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {/* Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Cards"
        size="lg"
      >
        <FiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      </Modal>

      {/* Add Card Modal */}
      <AddCardModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Card Detail Drawer */}
      <Drawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        title="Card Details"
        size="lg"
      >
        {selectedCard && <CardDetail card={selectedCard} />}
      </Drawer>
    </div>
  );
}