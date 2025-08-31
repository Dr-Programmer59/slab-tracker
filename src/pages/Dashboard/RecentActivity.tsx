import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Upload, Package, Radio, Truck } from 'lucide-react';

const activities = [
  {
    id: '1',
    action: 'Card arrived',
    description: '2023 Topps Chrome Ronald Acuña Jr. PSA 10',
    time: '5 minutes ago',
    icon: Package,
    color: 'text-green-400',
  },
  {
    id: '2',
    action: 'Stream finalized',
    description: 'Holiday Special Stream - $195 profit',
    time: '2 hours ago',
    icon: Radio,
    color: 'text-cyan-400',
  },
  {
    id: '3',
    action: 'Batch imported',
    description: '25 cards from January 2024 Import',
    time: '6 hours ago',
    icon: Upload,
    color: 'text-indigo-400',
  },
  {
    id: '4',
    action: 'Item shipped',
    description: '2022 Panini Prizm Ja Morant BGS 9.5',
    time: '1 day ago',
    icon: Truck,
    color: 'text-amber-400',
  },
];

export function RecentActivity() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <div className={`p-2 rounded-lg bg-slate-700 ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-white text-sm">{activity.action}</p>
              <p className="text-slate-400 text-sm">{activity.description}</p>
              <p className="text-slate-500 text-xs mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}