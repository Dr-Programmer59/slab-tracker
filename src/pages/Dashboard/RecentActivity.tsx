import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Upload, Package, Radio, Truck } from 'lucide-react';

interface RecentActivityProps {
  activities: any[];
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'card_arrived': return Package;
      case 'stream_finalized': return Radio;
      case 'batch_imported': return Upload;
      case 'item_shipped': return Truck;
      default: return Package;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'card_arrived': return 'text-green-400';
      case 'stream_finalized': return 'text-cyan-400';
      case 'batch_imported': return 'text-indigo-400';
      case 'item_shipped': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className={`p-2 rounded-lg bg-slate-700 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white text-sm">{activity.action}</p>
                  <p className="text-slate-400 text-sm">{activity.description}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}