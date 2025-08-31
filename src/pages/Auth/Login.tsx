import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CreditCard, LogIn } from 'lucide-react';
import { Button } from '../../components/Common/Button';
import { useAuthStore } from '../../store/auth';
import toast from 'react-hot-toast';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const demoAccounts = [
    { email: 'admin@slabtrack.com', password: 'admin123', role: 'Admin' },
    { email: 'manager@slabtrack.com', password: 'manager123', role: 'Manager' },
    { email: 'member@slabtrack.com', password: 'member123', role: 'Member' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      console.log('🔑 Attempting login with:', { email, password: '***' });
      await login(email, password);
      // Success toast is now handled in the auth store
    } catch (error) {
      console.error('❌ Login failed:', error);
      // Error toast is now handled in the auth store
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SlabTrack</h1>
          <p className="text-slate-400">Trading Card Inventory Management</p>
        </motion.div>

        {/* Demo Accounts */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6"
        >
          <h3 className="text-sm font-medium text-slate-300 mb-3">Demo Accounts</h3>
          <div className="space-y-2">
            {demoAccounts.map((account, index) => (
              <motion.button
                key={account.email}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => quickLogin(account.email, account.password)}
                className="w-full flex items-center justify-between p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
              >
                <div className="text-left">
                  <div className="text-sm font-medium text-white">{account.email}</div>
                  <div className="text-xs text-slate-400">{account.role} Access</div>
                </div>
                <div className="text-xs text-slate-400">Click to use</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter your email"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!email || !password}
              className="w-full"
              size="lg"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </Button>
          </form>
        </motion.div>

        {/* Environment Badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            Production Environment
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}