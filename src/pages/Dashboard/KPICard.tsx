import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  format: 'currency' | 'number' | 'percentage';
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color: 'indigo' | 'green' | 'cyan' | 'amber';
}

const colorVariants = {
  indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/25',
  green: 'from-green-500 to-green-600 shadow-green-500/25',
  cyan: 'from-cyan-500 to-cyan-600 shadow-cyan-500/25',
  amber: 'from-amber-500 to-amber-600 shadow-amber-500/25',
};

export function KPICard({ title, value, format, icon: Icon, trend, trendUp, color }: KPICardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-gradient-to-r ${colorVariants[color]} rounded-lg shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm">
            {trendUp !== undefined && (
              trendUp ? 
                <TrendingUp className="w-4 h-4 text-green-400" /> :
                <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={trendUp ? 'text-green-400' : trendUp === false ? 'text-red-400' : 'text-slate-400'}>
              {trend}
            </span>
          </div>
        )}
      </div>
      
      <div>
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold text-white mb-1"
        >
          {formatValue(value)}
        </motion.p>
        <p className="text-slate-400 text-sm">{title}</p>
      </div>
    </motion.div>
  );
}