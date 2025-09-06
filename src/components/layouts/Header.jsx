import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import PropTypes from "prop-types";

const Header = ({ onMenuClick }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, logout } = useAuth();

  // Sync avatar with localStorage (for Settings update)
  const [avatar, setAvatar] = useState(
    user?.avatar || localStorage.getItem("avatar") || ""
  );

  useEffect(() => {
    const storedAvatar = localStorage.getItem("avatar");
    if (storedAvatar) setAvatar(storedAvatar);
  }, [user]);

  // Dark mode sync
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("darkMode")) ?? true
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const avatarSrc =
    avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "U"
    )}&background=0D8ABC&color=fff`;

  return (
    <header className="bg-slate-800/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4 relative z-50">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg 
                  text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent transition-all duration-200 w-72"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Profile dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
            >
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-8 h-8 rounded-full ring-2 ring-slate-600 object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-white font-medium text-sm">{user?.name}</p>
                <p className="text-slate-400 text-xs">{user?.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-slate-800 dark:bg-slate-900 rounded-xl 
                    shadow-2xl border border-slate-700/50 py-2 z-[999]"
                >
                  <div className="px-4 py-3 border-b border-slate-700/50">
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-slate-400 text-sm">{user?.email}</p>
                  </div>

                  <div className="py-2">
                    <button className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700/50 transition-colors w-full text-left">
                      <User className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-300">Profile</span>
                    </button>
                    <button className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700/50 transition-colors w-full text-left">
                      <Settings className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-300">Settings</span>
                    </button>
                    <div className="border-t border-slate-700/50 mt-2 pt-2">
                      <button
                        onClick={logout}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-red-500/10 transition-colors w-full text-left text-red-400 hover:text-red-300"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};

export default Header;
