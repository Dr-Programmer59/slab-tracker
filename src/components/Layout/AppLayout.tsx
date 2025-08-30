import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from './TopBar';
import { SideNav } from './SideNav';
import { useAuthStore } from '../../store/auth';

export function AppLayout() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-900">
      <TopBar />
      <div className="flex">
        <SideNav />
        <main className="flex-1 ml-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="p-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}