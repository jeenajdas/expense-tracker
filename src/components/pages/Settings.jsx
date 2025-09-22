import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { doc, setDoc, getDoc,deleteDoc,collection } from "firebase/firestore";
import { deleteUser } from "firebase/auth";

const Settings = () => {
  const { user } = useAuth();
 
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  // Load profile from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setFormData(userDoc.data());
        } else {
          // fallback if no doc yet
          setFormData({
            name: user.displayName || "",
            email: user.email,
            avatar: user.photoURL || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchProfile();
  }, [user]);

  // ✅ Handle image upload via Cloudinary
  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || !user) return;

  // 🔹 Show instant local preview while uploading
  setFormData((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));

  try {
    const cloudName = "dacositq5"; 
    const uploadPreset = "profile_pics";

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", uploadPreset);
    formDataCloud.append("folder", "avatars");

    // Upload to Cloudinary
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dacositq5/image/upload`,
      {
        method: "POST",
        body: formDataCloud,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      // 🔹 Add transformations for faster optimized images
      const optimizedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/w_200,h_200,c_fill,q_auto,f_auto/"
      );

      // Save Cloudinary optimized image URL in state
      setFormData((prev) => ({ ...prev, avatar: optimizedUrl }));
    } else {
      throw new Error("Cloudinary upload failed");
    }
  } catch (err) {
    console.error("Error uploading image:", err);
    alert("Failed to upload image.");
  }
};

  // Save profile to Firestore
  const handleSave = async () => {
    if (!user) return;

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: formData.name,
          email: formData.email,
          avatar: formData.avatar || "",
        },
        { merge: true }
      );

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const handleDelete = async () => {
  if (!user) return;
  const confirmDelete = window.confirm(
    "Are you sure? This will permanently delete your account and all your data."
  );
  if (!confirmDelete) return;

  try {
    // 1️⃣ Delete user's profile doc
    await deleteDoc(doc(db, "users", user.uid));

    // 2️⃣ Delete all their transactions (if stored by uid)
    const txSnapshot = await getDocs(
      collection(db, "transactions")
    );
    txSnapshot.forEach(async (docSnap) => {
      if (docSnap.data().uid === user.uid) {
        await deleteDoc(docSnap.ref);
      }
    });

    // 3️⃣ Delete Auth account
    await deleteUser(user);

    alert("Your account and all data have been deleted.");
  } catch (err) {
    console.error("Error deleting account:", err);
    alert("Failed to delete account.");
  }
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
              <User className="w-4 h-4" /> <span>Full Name</span>
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
              disabled
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white opacity-60"
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
          <button
          onClick={handleDelete}
           className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
            <Trash2 className="w-4 h-4" />
            
            <span>Delete</span>
          </button>
        </div>
      </motion.div>
    </div>
          
  );
};

export default Settings;
