import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { useAuthStore } from '../../store/auth';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['Admin', 'Manager', 'Member'] },
  { path: '/import', label: 'Import', icon: Upload, roles: ['Admin', 'Manager'] },
  { path: '/inventory', label: 'Inventory', icon: Package, roles: ['Admin', 'Manager', 'Member'] },
  { path: '/streams', label: 'Streams', icon: Radio, roles: ['Admin', 'Manager', 'Member'] },
  { path: '/builder', label: 'Builder', icon: Smartphone, roles: ['Admin', 'Manager', 'Member'] },
  { path: '/shipping', label: 'Shipping', icon: Truck, roles: ['Admin', 'Manager', 'Member'] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['Admin', 'Manager'] },
  { path: '/users', label: 'Users', icon: Users, roles: ['Admin'] },
  { path: '/audit', label: 'Audit', icon: FileText, roles: ['Admin'] },
];

export function SideNav() {
  const { user } = useAuthStore();
  const location = useLocation();

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto">
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
  );
}