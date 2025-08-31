import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Radio, 
  ArrowUpRight,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { reportsAPI } from '../../services/api';
import { useInventoryStore } from '../../store/inventory';
import { useStreamsStore } from '../../store/streams';
import { LoadingSpinner, LoadingSkeleton } from '../../components/Common/LoadingSpinner';
import { ErrorMessage } from '../../components/Common/ErrorBoundary';
import { StatusChip } from '../../components/Common/StatusChip';
import { KPICard } from './KPICard';
import { RecentActivity } from './RecentActivity';
import { InventoryChart } from './InventoryChart';

export function Dashboard() {
  const { fetchCards } = useInventoryStore();
  const { fetchStreams } = useStreamsStore();
  
  // Fetch dashboard data from API
  const { data: dashboardData, loading, error, refetch } = useApi(
    () => reportsAPI.getDashboard(),
    {
      immediate: true,
      onSuccess: () => {
        // Also fetch cards and streams for other components
        fetchCards();
        fetchStreams();
      }
    }
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <LoadingSkeleton className="h-4 w-64 mt-2" />
          </div>
          <LoadingSkeleton className="h-6 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-32" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton className="h-80" />
          <LoadingSkeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back! Here's what's happening with your inventory.</p>
        </div>
        <ErrorMessage error={error} onRetry={refetch} />
      </div>
    );
  }

  const kpis = dashboardData ? {
    inventoryValue: dashboardData.totalCards * 100, // Placeholder calculation
    soldRevenue: dashboardData.monthlyProfit * 3, // Placeholder calculation
    streamsCount: dashboardData.recentActivity?.filter((a: any) => a.action.includes('stream')).length || 0,
    shippingQueue: 5, // Placeholder
  } : {
    inventoryValue: 0,
    soldRevenue: 0,
    streamsCount: 0,
    shippingQueue: 0,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Welcome back! Here's what's happening with your inventory.
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Inventory Value"
          value={kpis.inventoryValue}
          format="currency"
          icon={Package}
          trend="+5.2%"
          trendUp={true}
          color="indigo"
        />
        <KPICard
          title="Sold Revenue"
          value={kpis.soldRevenue}
          format="currency"
          icon={DollarSign}
          trend="+12.8%"
          trendUp={true}
          color="green"
        />
        <KPICard
          title="Active Streams"
          value={kpis.streamsCount}
          format="number"
          icon={Radio}
          trend="2 this week"
          color="cyan"
        />
        <KPICard
          title="Shipping Queue"
          value={kpis.shippingQueue}
          format="number"
          icon={TrendingUp}
          trend={kpis.shippingQueue > 5 ? 'High volume' : 'Normal'}
          trendUp={kpis.shippingQueue <= 5}
          color="amber"
        />
      </motion.div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <InventoryChart />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <RecentActivity activities={dashboardData?.recentActivity || []} />
        </motion.div>
      </div>

      {/* Recent Cards */}
      <motion.div variants={itemVariants} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Arrivals</h3>
          <Button variant="ghost" size="sm">
            View All
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>

        {dashboardData?.topPerformers ? (
          <div className="space-y-3">
            {dashboardData.topPerformers.slice(0, 5).map((card: any, index: number) => (
              <motion.div
                key={card.displayId}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-16 bg-slate-600 rounded flex items-center justify-center">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{card.cardName || 'Card'}</h4>
                    <p className="text-sm text-slate-400">{card.playerName} • {card.sport} • {card.year}</p>
                    <p className="text-xs text-slate-500">{card.displayId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">${card.marketValue}</p>
                    <p className="text-xs text-green-400">
                      Current value
                    </p>
                  </div>
                  <StatusChip status="Available" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No recent arrivals</p>
          </div>
        )}
      </motion.div>

      {/* Alerts */}
      <motion.div variants={itemVariants} className="bg-amber-600/10 border border-amber-600/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-white mb-1">Action Required</h4>
            <p className="text-sm text-slate-300">
              You have {kpis.shippingQueue} items ready to ship and 2 streams pending finalization.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Button({ children, ...props }: any) {
  return (
    <button
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
      {...props}
    >
      {children}
    </button>
  );
}