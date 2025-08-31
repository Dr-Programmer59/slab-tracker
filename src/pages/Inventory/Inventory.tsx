import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Eye, Package } from 'lucide-react';
import { useInventoryStore } from '../../store/inventory';
import { useAuthStore } from '../../store/auth';
import { usePermissions } from '../../utils/permissions';
import { Button } from '../../components/Common/Button';
import { StatusChip } from '../../components/Common/StatusChip';
import { LoadingSpinner, TableSkeleton } from '../../components/Common/LoadingSpinner';
import { ErrorMessage } from '../../components/Common/ErrorBoundary';
import { CardDetail } from './CardDetail';
import { AddCardModal } from './AddCardModal';
import { FiltersPanel } from './FiltersPanel';

export function Inventory() {
  const { user } = useAuthStore();
  const { canView, canCreate, canEdit } = usePermissions(user?.role);
  
  const {
    cards,
    loading,
    error,
    filters,
    pagination,
    selectedCard,
    detailDrawerOpen,
    setFilters,
    fetchCards,
    setSelectedCard,
    setDetailDrawerOpen,
    setPage
  } = useInventoryStore();

  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters({ search: searchInput });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search, setFilters]);

  // Fetch cards on mount and filter changes
  React.useEffect(() => {
    if (canView) {
      fetchCards();
    }
  }, [canView, fetchCards, filters, pagination.page]);

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">You don't have permission to view inventory.</p>
      </div>
    );
  }

  const handleCardClick = (card: any) => {
    setSelectedCard(card);
    setDetailDrawerOpen(true);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">Manage your trading card inventory</p>
        </div>
        {canCreate && (
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <FiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {loading ? (
          <div className="space-y-4">
            <TableSkeleton rows={10} />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : cards.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Card
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Set
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Condition
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cards.map((card) => (
                    <motion.tr
                      key={card.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="cursor-pointer"
                      onClick={() => handleCardClick(card)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {card.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              #{card.number}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {card.set}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusChip status={card.condition} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {card.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${card.value?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusChip status={card.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cards found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.set || filters.condition || filters.status
                ? 'Try adjusting your filters'
                : 'Get started by adding your first card'}
            </p>
            {canCreate && (
              <div className="mt-6">
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Cards"
      >
        <FiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      </Modal>

      {/* Add Card Modal */}
      {showAddModal && (
        <AddCardModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Card Detail Drawer */}
      {selectedCard && (
        <CardDetail
          card={selectedCard}
          isOpen={detailDrawerOpen}
          onClose={() => setDetailDrawerOpen(false)}
        />
      )}
    </div>
  );
}