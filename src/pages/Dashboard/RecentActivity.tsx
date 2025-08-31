import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Upload, Package, Radio, Truck } from 'lucide-react';

interface RecentActivityProps {
  activities: any[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  // Transform API activities to display format
  const displayActivities = activities.map((activity: any) => {
    const getActivityIcon = (action: string) => {
      if (action.includes('card')) return Package;
      if (action.includes('stream')) return Radio;
      if (action.includes('batch') || action.includes('import')) return Upload;
      if (action.includes('ship')) return Truck;
      return Package;
    };

    const getActivityColor = (action: string) => {
      if (action.includes('card')) return 'text-green-400';
      if (action.includes('stream')) return 'text-cyan-400';
      if (action.includes('batch') || action.includes('import')) return 'text-indigo-400';
      if (action.includes('ship')) return 'text-amber-400';
      return 'text-slate-400';
    };

    const formatTimeAgo = (timestamp: string) => {
      const now = new Date();
      const activityTime = new Date(timestamp);
      const diffMs = now.getTime() - activityTime.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    };

    return {
      id: activity._id,
      action: activity.action.replace(/_/g, ' '),
      description: activity.details?.description || `${activity.entityType} ${activity.entityId}`,
      time: formatTimeAgo(activity.timestamp),
      icon: getActivityIcon(activity.action),
      color: getActivityColor(activity.action),
    };
  });

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      </div>

      {displayActivities.length > 0 ? (
        <div className="space-y-4">
          {displayActivities.map((activity, index) => (
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
      ) : (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No recent activity</p>
        </div>
      )}
    </div>
  );
}