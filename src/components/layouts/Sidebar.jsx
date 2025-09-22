import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  History,
  Plus,
  Bookmark,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PropTypes from 'prop-types';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  
  { icon: Plus, label: ' Add New Transaction', path: '/dashboard/new-transaction' },
   { icon: History, label: 'Transaction History', path: '/dashboard/history' },
  { icon: Bookmark, label: 'Saved Transactions', path: '/dashboard/saved' },
  { icon: BarChart3, label: 'Statistics', path: '/dashboard/statistics' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isDesktop && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isDesktop ? { x: 0 } : { x: isOpen ? 0 : -260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          ${isDesktop ? 'min-h-screen h-full' : 'fixed top-0 left-0 h-screen'} 
          w-64 bg-slate-800/95 backdrop-blur-xl 
          ${isDesktop ? 'border-r' : 'border-r'} border-slate-700/50 
          flex flex-col ${isDesktop ? 'z-10' : 'z-50'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 h-20 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ExpenseTracker</h1>
              <p className="text-xs text-slate-400">Manage your finances</p>
            </div>
          </div>
          {!isDesktop && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Navigation - Takes available space */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={!isDesktop ? onClose : undefined}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout - Always at bottom */}
        <div className="p-4 border-t border-slate-700/50 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 
                       hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;