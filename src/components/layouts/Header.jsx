// src/components/Header.jsx  
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import PropTypes from "prop-types";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useTransactions } from "../../contexts/TransactionContext";
import { useNavigate } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useTransactions();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  // dropdown ref for outside-click detection
  const dropdownRef = useRef(null);

  // Fetch extra profile info from Firestore (real-time)
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (userDoc) => {
      if (userDoc.exists()) {
        setProfile({
          name: userDoc.data().name || user.displayName || "User",
          email: userDoc.data().email || user.email,
          avatar: userDoc.data().avatar || user.photoURL || "",
        });
      } else {
        setProfile({
          name: user.displayName || "User",
          email: user.email,
          avatar: user.photoURL || "",
        });
      }
    });

    return () => unsub(); // cleanup listener
  }, [user]);

  // close dropdown when clicking/touching outside
  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const avatarSrc =
    profile.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile.name || "U"
    )}&background=0D8ABC&color=fff`;

  return (
    <header className="bg-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4 h-20 flex items-center flex-shrink-0 z-50">
      <div className="flex items-center justify-between w-full">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg 
                  text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent transition-all duration-200 w-72"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Profile dropdown (wrapped with ref for outside click detection) */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileDropdown((s) => !s)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
            >
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-8 h-8 rounded-full ring-2 ring-slate-600 object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-white font-medium text-sm">{profile.name}</p>
                <p className="text-slate-400 text-xs">{profile.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-2xl border border-slate-700/50 py-2 z-[999]"
                >
                  <div className="px-4 py-3 border-b border-slate-700/50">
                    <p className="text-white font-medium">{profile.name}</p>
                    <p className="text-slate-400 text-sm">{profile.email}</p>
                  </div>

                  {/* ✅ Only Profile nav */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/dashboard/settings");
                        setShowProfileDropdown(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-700/50 transition-colors w-full text-left text-slate-300 hover:text-white"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-700/50 mt-2 pt-2">
                    <button
                      onClick={logout}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-red-500/10 transition-colors w-full text-left text-red-400 hover:text-red-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
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
