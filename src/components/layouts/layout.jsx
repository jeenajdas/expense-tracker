// src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Desktop Layout */}
      {isDesktop ? (
        <div className="flex h-full">
          
          <div className="w-64 flex-shrink-0">
            <Sidebar isOpen={true} onClose={() => {}} />
          </div>
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <Header onMenuClick={() => setSidebarOpen(true)} />
            
            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        /* Mobile Layout */
        <div className="flex flex-col min-h-screen">
          {/* Mobile Sidebar Overlay */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      )}
    </div>
  );
}