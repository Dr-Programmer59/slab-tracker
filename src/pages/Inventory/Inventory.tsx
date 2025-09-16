import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Eye } from 'lucide-react';
import { useInventoryStore } from '../../store/inventory';
import { usePermissions } from '../../hooks/usePermissions';
import { Button } from '../../components/Common/Button';
import { StatusChip } from '../../components/Common/StatusChip';
import { OwnershipBadge } from '../../components/Consignment/OwnershipBadge';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import { Drawer } from '../../components/Common/Drawer';
import { Modal } from '../../components/Common/Modal';
import { CardDetail } from './CardDetail';
import { AddCardModal } from './AddCardModal';
import { FiltersPanel } from './FiltersPanel';

export function Inventory() {
  const { 
    cards,
    loading,
    error,
    pagination,
    filters, 
    setFilters, 
    fetchCards,
    selectedCard, 
    isDetailDrawerOpen, 
    selectCard, 
    setDetailDrawerOpen 
  } = useInventoryStore();
  
  const { hasPermission } = usePermissions();
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch cards on component mount
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleCardClick = (card: any) => {
    selectCard(card);
    setDetailDrawerOpen(true);
  };

  return (
    <div className="min-w-0 space-y-4 md:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Inventory</h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            {pagination.total} cards {filters.search && `matching "${filters.search}"`}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(true)}
            className="flex-1 sm:flex-none shrink-0"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          {hasPermission('cards.update') && (
            <Button onClick={() => setShowAddModal(true)} className="flex-1 sm:flex-none shrink-0">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Card</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
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
          placeholder="Search cards, players..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 sm:py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
        />
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LoadingSpinner message="Loading cards..." />
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ErrorMessage error={error} onRetry={fetchCards} />
        </motion.div>
      )}

      {/* Cards Table */}
      {!loading && !error && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden overflow-x-auto"
      >
        <div className="min-w-full">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[200px]">Card</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[120px]">Player</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[100px]">Details</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[80px]">Purchase</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[80px]">Current</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[100px]">Status</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[80px]">Actions</th>
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
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <div className="flex items-center gap-2 md:gap-3">
                      {card.imageUrl && (
                        <img 
                          src={card.imageUrl} 
                          alt={card.title}
                          className="w-8 h-10 md:w-10 md:h-14 object-cover rounded bg-slate-600"
                        />
                      )}
                      <div>
                        <div className="font-medium text-white text-sm md:text-base truncate max-w-[150px] md:max-w-none">{card.title}</div>
                        <div className="text-xs text-slate-400">{card.displayId}</div>
                        {card.ownership === 'Consigned' && (
                          <div className="mt-1">
                            <OwnershipBadge ownership="Consigned" size="sm" />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <span className="text-slate-300 text-sm md:text-base truncate block max-w-[100px] md:max-w-none">{card.player}</span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <div className="text-xs md:text-sm">
                      <div className="text-slate-300">{card.sport} • {card.year}</div>
                      {card.grade && <div className="text-slate-400">{card.grade}</div>}
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <span className="text-white font-medium text-sm md:text-base">${card.purchasePrice}</span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    {card.currentValue ? (
                      <span className="text-green-400 font-medium text-sm md:text-base">${card.currentValue}</span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <div className="flex flex-col gap-1">
                      <StatusChip status={card.status} />
                      {card.ownership === 'Consigned' && (
                        <div className="text-xs text-purple-400">
                          Consigned
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
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
      </motion.div>
      )}

      {/* Pagination */}
      {!loading && !error && pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl p-4"
        >
          <div className="text-slate-400 text-xs md:text-sm">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} cards
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => {
                // TODO: Implement pagination
              }}
            >
              Previous
            </Button>
            <span className="text-slate-300 text-xs md:text-sm px-2">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page >= pagination.pages}
              onClick={() => {
                // TODO: Implement pagination
              }}
            >
              Next
            </Button>
          </div>
        </motion.div>
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