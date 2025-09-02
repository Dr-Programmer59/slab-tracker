import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { useAuthStore } from '../../store/auth';

export function TopBar() {
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-600';
      case 'manager': return 'bg-amber-600';
      case 'member': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 h-16 flex items-center justify-between px-6 relative z-50">
      {/* Logo and Environment */}
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ST</span>
          </div>
          <h1 className="text-xl font-bold text-white">SlabTrack</h1>
        </motion.div>
        
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium"
        >
          PROD
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search cards, players, or use ⌘K for command palette"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Role Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${getRoleBadgeColor(user?.role || '')} text-white px-3 py-1 rounded-full text-sm font-medium`}
        >
          {user?.role}
        </motion.div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-slate-400 hover:text-white transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
        </motion.button>

        {/* User Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700 transition-colors">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm font-medium hidden sm:block">
              {user?.displayName || 'User'}
            </span>
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-50">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${
                    active ? 'bg-slate-700 text-white' : 'text-slate-300'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${
                    active ? 'bg-slate-700 text-white' : 'text-slate-300'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </header>
  );
}