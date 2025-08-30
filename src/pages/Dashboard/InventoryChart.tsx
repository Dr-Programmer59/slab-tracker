import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const chartData = [
  { month: 'Jul', value: 12500, sold: 8200 },
  { month: 'Aug', value: 14200, sold: 9800 },
  { month: 'Sep', value: 13800, sold: 11200 },
  { month: 'Oct', value: 16500, sold: 12800 },
  { month: 'Nov', value: 18200, sold: 14500 },
  { month: 'Dec', value: 15800, sold: 13200 },
  { month: 'Jan', value: 19500, sold: 16800 },
];

export function InventoryChart() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-slate-400" />
        <div>
          <h3 className="text-lg font-semibold text-white">Inventory & Sales</h3>
          <p className="text-sm text-slate-400">Monthly value tracking</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#94a3b8"
              fontSize={12}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Bar dataKey="value" fill="#4f46e5" radius={[2, 2, 0, 0]} />
            <Bar dataKey="sold" fill="#06b6d4" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}