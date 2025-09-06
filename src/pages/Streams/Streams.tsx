import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, DollarSign, Radio, FileText, Play, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStreamsStore } from '../../store/streams';
import { usePermissions } from '../../hooks/usePermissions';
import { Button } from '../../components/Common/Button';
import { StatusChip } from '../../components/Common/StatusChip';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import { Modal } from '../../components/Common/Modal';
import { CreateStreamModal } from './CreateStreamModal';

export function Streams() {
  const navigate = useNavigate();
  const { streams, loading, error, fetchStreams } = useStreamsStore();
  const { canFinalizeStreams } = usePermissions();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch streams on component mount
  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  const getProfit = (stream: any) => {
    if (stream.profit !== undefined) return stream.profit;
    return 0;
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-400';
    if (profit < 0) return 'text-red-400';
    return 'text-slate-400';
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
          <h1 className="text-xl sm:text-2xl font-bold text-white">Streams</h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Manage live selling sessions and track profit/loss
          </p>
        </div>
        {canFinalizeStreams() && (
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto shrink-0">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Stream</span>
            <span className="sm:hidden">Create</span>
          </Button>
        )}
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LoadingSpinner message="Loading streams..." />
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ErrorMessage error={error} onRetry={fetchStreams} />
        </motion.div>
      )}

      {/* Streams Table */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[700px] px-4 sm:px-0">
              <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[150px]">Stream</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[80px]">Date</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[60px]">Items</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[70px]">Cost</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[70px] hidden sm:table-cell">Sales</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[70px] hidden sm:table-cell">Profit</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[80px]">Status</th>
                <th className="text-left py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-slate-300 min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {streams.map((stream, index) => (
                <motion.tr
                  key={stream.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
                  className="border-b border-slate-700 cursor-pointer"
                  onClick={() => navigate(`/streams/${stream.id}`)}
                >
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <div>
                      <div className="font-medium text-white text-sm md:text-base truncate max-w-[120px]">{stream.title}</div>
                      <div className="text-xs md:text-sm text-slate-400 truncate max-w-[120px]">{stream.streamer}</div>
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-xs">{stream.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <span className="text-white font-medium text-sm">{stream.totalItems}</span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <span className="text-white font-medium text-sm">${stream.totalCost}</span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6 hidden sm:table-cell">
                    {stream.grossSales ? (
                      <span className="text-white font-medium text-sm">${stream.grossSales}</span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6 hidden sm:table-cell">
                    <span className={`font-medium text-sm ${getProfitColor(getProfit(stream))}`}>
                      {getProfit(stream) !== 0 ? `$${getProfit(stream)}` : '—'}
                    </span>
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <StatusChip status={stream.status} />
                  </td>
                  <td className="py-3 md:py-4 px-3 md:px-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/streams/${stream.id}`);
                        }}
                        className="hidden sm:flex"
                      >
                        <FileText className="w-4 h-4" />
                        View
                      </Button>
                      {stream.status === 'Draft' && canFinalizeStreams() && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/builder');
                          }}
                          className="hidden sm:flex"
                        >
                          <Play className="w-4 h-4" />
                          Build
                        </Button>
                      )}
                      {/* Mobile: Single action button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/streams/${stream.id}`);
                        }}
                        className="sm:hidden"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Create Stream Modal */}
      <CreateStreamModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}