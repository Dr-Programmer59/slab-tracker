import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Eye } from 'lucide-react';
import { useInventoryStore } from '../../store/inventory';
import { useAuthStore } from '../../store/auth';
import { usePermissions } from '../../utils/permissions';
import { Button } from '../../components/Common/Button';
import { StatusChip } from '../../components/Common/StatusChip';
import { Drawer } from '../../components/Common/Drawer';
import { Modal } from '../../components/Common/Modal';
import { LoadingSpinner, TableSkeleton } from '../../components/Common/LoadingSpinner';
import { ErrorMessage } from '../../components/Common/ErrorBoundary';
import { CardDetail } from './CardDetail';
import { AddCardModal } from './AddCardModal';
import { FiltersPanel } from './FiltersPanel';

export function Inventory() {
  const { user } = useAuthStore();
  const permissions = usePermissions(user);
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
    setDetailDrawerOpen,
    setPage
  } = useInventoryStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch cards on component mount
  React.useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Fetch cards on component mount
  React.useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleCardClick = (card: any) => {
    selectCard(card);
    setDetailDrawerOpen(true);
  };

  const handleSearch = (searchTerm: string) => {
    setFilters({ search: searchTerm });
  };

  // Debounced search
  const [searchInput, setSearchInput] = useState(filters.search);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        handleSearch(searchInput);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

  // Debounced search
  const [searchInput, setSearchInput] = useState(filters.search);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        handleSearch(searchInput);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);
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
          <Button
            variant="secondary"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          {permissions.canEditCards && (
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" />
              Add Card
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
          placeholder="Search cards, players, or use ⌘K for command palette..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </motion.div>

      {/* Error State */}
      {error && (
        <ErrorMessage error={error} onRetry={fetchCards} />
      )}

      {/* Error State */}
      {error && (
        <ErrorMessage error={error} onRetry={fetchCards} />
      )}

      {/* Cards Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
      >
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={10} />
          </div>
        ) : cards.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
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
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-slate-600 rounded flex items-center justify-center">
                            <Package className="w-5 h-5 text-slate-400" />
                          </div>
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
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-slate-700">
                <div className="text-sm text-slate-400">
                  Showing {((pagination.page - 1) * 25) + 1} to {Math.min(pagination.page * 25, pagination.total)} of {pagination.total} cards
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => setPage(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-slate-300 text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPage(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-400 mb-2">No cards found</h4>
            <p className="text-slate-500 mb-4">
              {filters.search ? 'Try adjusting your search or filters' : 'Import some cards to get started'}
            </p>
            {permissions.canImportBatches && (
              <Button variant="secondary" onClick={() => window.location.href = '/import'}>
                Import Cards
              </Button>
            )}
          </div>
        )}
          <div className="p-6">
            <TableSkeleton rows={10} />
          </div>
        ) : cards.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
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
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-slate-600 rounded flex items-center justify-center">
                            <Package className="w-5 h-5 text-slate-400" />
                          </div>
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
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-slate-700">
                <div className="text-sm text-slate-400">
                  Showing {((pagination.page - 1) * 25) + 1} to {Math.min(pagination.page * 25, pagination.total)} of {pagination.total} cards
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => setPage(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-slate-300 text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPage(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-400 mb-2">No cards found</h4>
            <p className="text-slate-500 mb-4">
              {filters.search ? 'Try adjusting your search or filters' : 'Import some cards to get started'}
            </p>
            {permissions.canImportBatches && (
              <Button variant="secondary" onClick={() => window.location.href = '/import'}>
                Import Cards
              </Button>
            )}
          </div>
        )}
      </motion.div>

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
      {permissions.canEditCards && (
        <AddCardModal 
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

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