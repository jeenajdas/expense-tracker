import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Moon, Sun, Shield, Trash2, Globe, CreditCard } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("darkMode")) ?? true
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || localStorage.getItem("name") || "",
    email: user?.email || localStorage.getItem("email") || "",
    avatar: user?.avatar || localStorage.getItem("avatar") || "",
  });

  // Save avatar and profile
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, avatar: reader.result });
      localStorage.setItem("avatar", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("name", formData.name);
    localStorage.setItem("email", formData.email);
    localStorage.setItem("avatar", formData.avatar);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-5xl w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Profile Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture */}
          <div className="md:col-span-2 flex items-center space-x-4">
            <img
              src={
                formData.avatar ||
                `https://ui-avatars.com/api/?name=${formData.name}`
              }
              alt="Profile"
              className="w-16 h-16 rounded-full ring-4 ring-slate-600 object-cover"
            />
            <div>
              <p className="text-white font-medium">{formData.name}</p>
              <p className="text-slate-400 text-sm">{formData.email}</p>
              {isEditing && (
                <label className="text-blue-400 hover:text-blue-300 text-sm mt-1 cursor-pointer transition-colors block">
                  Change Picture
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="flex items-center space-x-2 text-slate-300 text-sm font-medium mb-2">
              <User className="w-4 h-4" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center space-x-2 text-slate-300 text-sm font-medium mb-2">
              <Mail className="w-4 h-4" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-slate-700/50">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Save Changes
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <h3 className="text-xl font-bold text-white mb-6">Preferences</h3>

        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-slate-400" />
              ) : (
                <Sun className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-slate-400 text-sm">Toggle dark/light theme</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? "bg-blue-600" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Language Preference */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-white font-medium">Language</p>
                <p className="text-slate-400 text-sm">Choose app language</p>
              </div>
            </div>
            <select className="bg-slate-700/50 text-white px-3 py-2 rounded-lg border border-slate-600">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Billing Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <h3 className="text-xl font-bold text-white mb-6">Billing</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Subscription Plan</p>
            <p className="text-slate-400 text-sm">Free Tier</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
            <CreditCard className="w-4 h-4" />
            <span>Upgrade</span>
          </button>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <h3 className="text-xl font-bold text-white mb-6">
          Security & Privacy
        </h3>
        <div className="space-y-4">
          <button className="flex items-center space-x-3 w-full p-4 rounded-lg hover:bg-slate-700/30 transition-colors text-left">
            <Shield className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-slate-400 text-sm">Add extra security</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 w-full p-4 rounded-lg hover:bg-slate-700/30 transition-colors text-left">
            <Lock className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-white font-medium">Privacy Settings</p>
              <p className="text-slate-400 text-sm">Manage your privacy</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-red-400 mb-6">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Delete Account</p>
            <p className="text-slate-400 text-sm">
              Permanently delete your account and all data
            </p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
