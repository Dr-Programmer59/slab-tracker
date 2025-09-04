import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, Filter, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { KPICard } from '../Dashboard/KPICard';
import { useInventoryStore } from '../../store/inventory';
import { useStreamsStore } from '../../store/streams';
import toast from 'react-hot-toast';

export function Reports() {
  const { cards, initializeCards } = useInventoryStore();
  const { streams } = useStreamsStore();
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // Ensure cards are loaded for reports calculations
  React.useEffect(() => {
    initializeCards();
  }, [initializeCards]);

  const kpis = {
    totalRevenue: cards.filter(c => c.status === 'Sold').reduce((sum, card) => sum + (card.currentValue || card.purchasePrice), 0),
    totalCost: cards.filter(c => c.status === 'Sold').reduce((sum, card) => sum + card.purchasePrice, 0),
    totalProfit: 0,
    avgMargin: 0,
  };

  kpis.totalProfit = kpis.totalRevenue - kpis.totalCost;
  kpis.avgMargin = kpis.totalRevenue > 0 ? (kpis.totalProfit / kpis.totalRevenue) * 100 : 0;

  const exportReport = (format: 'csv' | 'pdf') => {
    toast.success(`Exporting ${format.toUpperCase()} report...`);
    // In real app, would generate and download report
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
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400 mt-1">
            Analytics and insights for your trading card business
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => exportReport('csv')}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="secondary" onClick={() => exportReport('pdf')}>
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </motion.div>

      {/* Date Range Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span className="text-slate-300 font-medium">Date Range</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <KPICard
          title="Total Revenue"
          value={kpis.totalRevenue}
          format="currency"
          icon={DollarSign}
          trend="+18.2%"
          trendUp={true}
          color="green"
        />
        <KPICard
          title="Total Cost"
          value={kpis.totalCost}
          format="currency"
          icon={DollarSign}
          trend="+12.1%"
          trendUp={false}
          color="amber"
        />
        <KPICard
          title="Net Profit"
          value={kpis.totalProfit}
          format="currency"
          icon={TrendingUp}
          trend="+24.8%"
          trendUp={true}
          color="cyan"
        />
        <KPICard
          title="Avg Margin"
          value={kpis.avgMargin}
          format="percentage"
          icon={BarChart3}
          trend="↑ 2.3%"
          trendUp={true}
          color="indigo"
        />
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue by Month</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500">Chart placeholder - would show revenue trends</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Inventory by Sport</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500">Chart placeholder - would show sport breakdown</p>
          </div>
        </div>
      </motion.div>

      {/* Detailed Tables */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Detailed transaction history would appear here</p>
        </div>
      </motion.div>
    </div>
  );
}