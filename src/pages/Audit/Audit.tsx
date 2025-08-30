import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Filter, User, Clock, Search } from 'lucide-react';
import { Button } from '../../components/Common/Button';

const demoAuditEntries = [
  {
    id: '1',
    userId: '1',
    userName: 'Admin User',
    action: 'Updated card',
    entityType: 'Card',
    entityId: 'ST-2024-000001',
    timestamp: new Date('2024-01-20T10:30:00'),
    oldValues: { currentValue: 150 },
    newValues: { currentValue: 180 },
  },
  {
    id: '2',
    userId: '2',
    userName: 'Manager User',
    action: 'Finalized stream',
    entityType: 'Stream',
    entityId: 'Holiday Special Stream',
    timestamp: new Date('2024-01-19T15:45:00'),
    oldValues: { status: 'Locked' },
    newValues: { status: 'Finalized', grossSales: 920, fees: 45, profit: 195 },
  },
  {
    id: '3',
    userId: '1',
    userName: 'Admin User',
    action: 'Changed user role',
    entityType: 'User',
    entityId: 'member@slabtrack.com',
    timestamp: new Date('2024-01-18T09:15:00'),
    oldValues: { role: 'Member' },
    newValues: { role: 'Manager' },
  },
];

export function Audit() {
  const [entries, setEntries] = useState(demoAuditEntries);
  const [filters, setFilters] = useState({
    search: '',
    entityType: '',
    userId: '',
  });

  const filteredEntries = entries.filter(entry => {
    if (filters.search && !entry.action.toLowerCase().includes(filters.search.toLowerCase()) &&
        !entry.entityId.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.entityType && entry.entityType !== filters.entityType) {
      return false;
    }
    if (filters.userId && entry.userId !== filters.userId) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Log</h1>
          <p className="text-slate-400 mt-1">
            Track all system changes and user actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search audit entries..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </motion.div>

      {/* Audit Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Time</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">User</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Action</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Entity</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-slate-300">Changes</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="text-white text-sm">
                          {entry.timestamp.toLocaleDateString()}
                        </div>
                        <div className="text-slate-400 text-xs">
                          {entry.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{entry.userName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white font-medium">{entry.action}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-slate-300">{entry.entityType}</div>
                      <div className="text-slate-400 text-sm">{entry.entityId}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {entry.oldValues && Object.entries(entry.oldValues).map(([key, value]) => (
                        <div key={key} className="text-xs">
                          <span className="text-slate-400">{key}:</span>
                          <span className="text-red-400 ml-1">{String(value)}</span>
                          <span className="text-slate-500 mx-1">→</span>
                          <span className="text-green-400">
                            {String((entry.newValues as any)?.[key] || 'N/A')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}