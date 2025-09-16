import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  DollarSign,
  Package,
  Radio,
  Truck,
  Clock,
  FileText,
  AlertCircle,
  Users,
  Receipt
} from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { KPICard } from '../Dashboard/KPICard';
import { reportService } from '../../services/reportService';
import { usePermissions } from '../../hooks/usePermissions';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import toast from 'react-hot-toast';

export function Reports() {
  const { hasPermission } = usePermissions();
  const [kpis, setKpis] = useState<any>(null);
  const [velocityMetrics, setVelocityMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  
  const [activeView, setActiveView] = useState<'standard' | 'consignment'>('standard');
  
  const [dateRange, setDateRange] = useState({
    range: 'month',
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const canExport = hasPermission('reports.export');

  // Fetch KPIs and velocity metrics
  const fetchReportsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch KPIs
      const kpiResult = dateRange.range === 'custom' 
        ? await reportService.getSummaryKPIs('month', dateRange.start, dateRange.end)
        : await reportService.getSummaryKPIs(dateRange.range);
      
      if (kpiResult.success && kpiResult.data) {
        setKpis(kpiResult.data.kpis);
      } else {
        throw new Error(kpiResult.error || 'Failed to fetch KPIs');
      }

      // Fetch velocity metrics (Admin/Manager only)
      if (canExport) {
        const velocityResult = await reportService.getVelocityMetrics(dateRange.start, dateRange.end);
        if (velocityResult.success && velocityResult.data) {
          setVelocityMetrics(velocityResult.data);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [dateRange.range, dateRange.start, dateRange.end, canExport]);

  const handleDateRangeChange = (newRange: string) => {
    setDateRange(prev => ({ ...prev, range: newRange }));
  };

  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    setDateRange(prev => ({ 
      ...prev, 
      range: 'custom',
      [field]: value 
    }));
  };

  const handleExport = async (type: string, label: string) => {
    if (!canExport) {
      toast.error('You do not have permission to export data');
      return;
    }

    setExporting(type);
    try {
      let result;
      
      switch (type) {
        case 'inventory':
          result = await reportService.exportInventory();
          break;
        case 'sold':
          result = await reportService.exportSoldCards(dateRange.start, dateRange.end);
          break;
        case 'streams':
          result = await reportService.exportStreams();
          break;
        case 'batches':
          result = await reportService.exportBatches();
          break;
        case 'shipments':
          result = await reportService.exportShipments(dateRange.start, dateRange.end);
          break;
        default:
          throw new Error('Unknown export type');
      }

      if (result.success) {
        toast.success(`${label} exported successfully! (${result.data.recordCount} records)`);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(`Failed to export ${label.toLowerCase()}: ${error.message}`);
    } finally {
      setExporting(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading reports..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchReportsData} />;
  }

  return (
    <div className="min-w-0 space-y-4 md:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Analytics and insights for your trading card business
          </p>
        </div>
        {canExport && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="secondary" 
              onClick={() => handleExport('inventory', 'Inventory')}
              loading={exporting === 'inventory'}
              className="w-full sm:w-auto shrink-0"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Inventory</span>
              <span className="sm:hidden">Inventory</span>
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleExport('sold', 'Sales Data')}
              loading={exporting === 'sold'}
              className="w-full sm:w-auto shrink-0"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Sales</span>
              <span className="sm:hidden">Sales</span>
            </Button>
          </div>
        )}
      </motion.div>

      {/* Date Range Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span className="text-slate-300 font-medium">Date Range</span>
          </div>
          
          {/* Predefined Ranges */}
          <div className="flex items-center gap-2 flex-wrap">
            {['day', 'week', 'month', 'quarter', 'year', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => handleDateRangeChange(range)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  dateRange.range === range
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
            <button
              onClick={() => handleDateRangeChange('custom')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                dateRange.range === 'custom'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Custom Date Inputs */}
          {dateRange.range === 'custom' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1"
      >
        <button
          onClick={() => setActiveView('standard')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeView === 'standard'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Standard Reports
        </button>
        <button
          onClick={() => setActiveView('consignment')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeView === 'consignment'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          Consignment Reports
        </button>
      </motion.div>

      {/* KPI Cards */}
      {kpis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <KPICard
            title="Inventory Value"
            value={kpis.inventoryValue || 0}
            format="currency"
            icon={Package}
            trend={`${kpis.inventoryCount || 0} cards`}
            color="indigo"
          />
          <KPICard
            title="Sold Revenue"
            value={kpis.soldRevenue || 0}
            format="currency"
            icon={DollarSign}
            trend={`${kpis.soldCount || 0} cards sold`}
            trendUp={true}
            color="green"
          />
          <KPICard
            title="Total Profit"
            value={kpis.soldProfit || 0}
            format="currency"
            icon={TrendingUp}
            trend={`${kpis.marginPercent?.toFixed(1) || 0}% margin`}
            trendUp={(kpis.soldProfit || 0) > 0}
            color="cyan"
          />
          {kpis.streamsCount !== undefined ? (
            <KPICard
              title="Stream Profit"
              value={kpis.streamsProfit || 0}
              format="currency"
              icon={Radio}
              trend={`${kpis.streamsCount} streams`}
              trendUp={(kpis.streamsProfit || 0) > 0}
              color="amber"
            />
          ) : (
            <KPICard
              title="My Streams"
              value={kpis.myStreamsProfit || 0}
              format="currency"
              icon={Radio}
              trend={`${kpis.myStreamsCount || 0} streams`}
              trendUp={(kpis.myStreamsProfit || 0) > 0}
              color="amber"
            />
          )}
        </motion.div>
      )}

      {/* Shipping Velocity (Admin/Manager only) */}
      {velocityMetrics && canExport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">Shipping Performance</h3>
          </div>

          {velocityMetrics.totalShipped > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{velocityMetrics.totalShipped}</p>
                <p className="text-sm text-slate-400">Items Shipped</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">
                  {velocityMetrics.averageDays?.toFixed(1) || 0} days
                </p>
                <p className="text-sm text-slate-400">Avg Processing Time</p>
              </div>
              {velocityMetrics.velocityMetrics && (
                <>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-400">
                      {(velocityMetrics.velocityMetrics.avgSoldToPackedHours || 0).toFixed(1)}h
                    </p>
                    <p className="text-sm text-slate-400">Sold → Packed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {(velocityMetrics.velocityMetrics.avgPackedToShippedHours || 0).toFixed(1)}h
                    </p>
                    <p className="text-sm text-slate-400">Packed → Shipped</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No shipping data available for selected period</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Export Options (Admin/Manager only) */}
      {activeView === 'standard' && (
      {canExport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">Data Export</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="secondary"
              onClick={() => handleExport('inventory', 'Current Inventory')}
              loading={exporting === 'inventory'}
              className="w-full justify-start"
            >
              <Package className="w-4 h-4" />
              Export Inventory
            </Button>

            <Button
              variant="secondary"
              onClick={() => handleExport('sold', 'Sold Cards')}
              loading={exporting === 'sold'}
              className="w-full justify-start"
            >
              <DollarSign className="w-4 h-4" />
              Export Sales
            </Button>

            <Button
              variant="secondary"
              onClick={() => handleExport('streams', 'Stream Performance')}
              loading={exporting === 'streams'}
              className="w-full justify-start"
            >
              <Radio className="w-4 h-4" />
              Export Streams
            </Button>

            <Button
              variant="secondary"
              onClick={() => handleExport('batches', 'Import Batches')}
              loading={exporting === 'batches'}
              className="w-full justify-start"
            >
              <FileText className="w-4 h-4" />
              Export Batches
            </Button>

            <Button
              variant="secondary"
              onClick={() => handleExport('shipments', 'Shipping History')}
              loading={exporting === 'shipments'}
              className="w-full justify-start"
            >
              <Truck className="w-4 h-4" />
              Export Shipments
            </Button>
          </div>

          <div className="mt-4 p-3 bg-slate-700 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-300">
                  <strong>Export Info:</strong> Files are generated in CSV format and downloaded automatically. 
                  Date range filters apply to sales and shipping exports.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      )}

      {/* Consignment Reports */}
      {activeView === 'consignment' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Consigned Inventory */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-white">Consigned Inventory</h3>
              </div>
              {canExport && (
                <Button
                  variant="secondary"
                  onClick={() => handleExport('consigned-inventory', 'Consigned Inventory')}
                  loading={exporting === 'consigned-inventory'}
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Display ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Consignor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Days on Hand</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Market Value</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mock data - replace with actual consigned inventory */}
                  <tr className="border-b border-slate-700">
                    <td className="py-3 px-4 text-white font-mono text-sm">ST-2024-000123</td>
                    <td className="py-3 px-4 text-white">2023 Topps Chrome Ronald Acuña Jr.</td>
                    <td className="py-3 px-4 text-slate-300">John Smith</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-600 text-green-100 rounded-full text-xs">Available</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">15</td>
                    <td className="py-3 px-4 text-white font-medium">$250.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Consigned Sales & Payouts */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-white">Consigned Sales & Payouts</h3>
              </div>
              {canExport && (
                <Button
                  variant="secondary"
                  onClick={() => handleExport('consigned-payouts', 'Consigned Payouts')}
                  loading={exporting === 'consigned-payouts'}
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {/* Consignor Group */}
              <div className="border border-slate-700 rounded-lg">
                <div className="bg-slate-700 px-4 py-3 flex items-center justify-between">
                  <h4 className="font-medium text-white">John Smith</h4>
                  <span className="text-slate-400 text-sm">3 items • $420.00 total payouts</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-600">
                      <tr>
                        <th className="text-left py-2 px-4 text-xs font-medium text-slate-300">Date</th>
                        <th className="text-left py-2 px-4 text-xs font-medium text-slate-300">Display ID</th>
                        <th className="text-left py-2 px-4 text-xs font-medium text-slate-300">Sale Price</th>
                        <th className="text-left py-2 px-4 text-xs font-medium text-slate-300">Payout Due</th>
                        <th className="text-left py-2 px-4 text-xs font-medium text-slate-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-700">
                        <td className="py-2 px-4 text-slate-300 text-sm">Jan 15, 2024</td>
                        <td className="py-2 px-4 text-white font-mono text-sm">ST-2024-000123</td>
                        <td className="py-2 px-4 text-white text-sm">$200.00</td>
                        <td className="py-2 px-4 text-green-400 font-medium text-sm">$140.00</td>
                        <td className="py-2 px-4">
                          <span className="px-2 py-1 bg-amber-600 text-amber-100 rounded-full text-xs">Pending</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts Placeholder */}
      {activeView === 'standard' && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Trends</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">Chart visualization coming soon</p>
              <p className="text-slate-600 text-sm">Revenue: ${kpis?.soldRevenue?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Profit Analysis</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">Chart visualization coming soon</p>
              <p className="text-slate-600 text-sm">Profit: ${kpis?.soldProfit?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      </motion.div>
      )}
    </div>
  );
}