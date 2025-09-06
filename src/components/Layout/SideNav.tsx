import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { 
  Upload, 
  Package, 
  Radio, 
  Smartphone, 
  Truck, 
  BarChart3, 
  Users, 
  FileText,
  Home
} from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home, permission: 'cards.list' },
  { path: '/import', label: 'Import', icon: Upload, permission: 'batches.create' },
  { path: '/inventory', label: 'Inventory', icon: Package, permission: 'cards.list' },
  { path: '/streams', label: 'Streams', icon: Radio, permission: 'streams.list' },
  { path: '/builder', label: 'Builder', icon: Smartphone, permission: 'streams.addItems' },
  { path: '/shipping', label: 'Shipping', icon: Truck, permission: 'shipping.list' },
  { path: '/reports', label: 'Reports', icon: BarChart3, permission: 'reports.view' },
  { path: '/users', label: 'Users', icon: Users, permission: 'users.list' },
  { path: '/audit', label: 'Audit', icon: FileText, permission: 'audit.view' },
];

interface SideNavProps {
  isMobileMenuOpen: boolean;
  onClose: () => void;
}

export function SideNav({ isMobileMenuOpen, onClose }: SideNavProps) {
  const { hasPermission } = usePermissions();
  const location = useLocation();

  const filteredNavItems = navItems.filter(item => 
    hasPermission(item.permission)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
      <nav className="p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.li
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.path}
                  onClick={() => onClose()} // Close mobile menu on navigation
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all group
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 w-1 h-6 bg-cyan-500 rounded-l"
                    />
                  )}
                </NavLink>
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </aside>
    </>
  );
}