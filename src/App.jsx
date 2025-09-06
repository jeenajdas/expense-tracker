import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";


import LoginPage from "./components/auth/Login";
import RegisterPage from "./components/auth/Register";
import Layout from "./components/layouts/layout";
import DashboardHome from "./components/pages/Dashboard";
import TransactionHistory from "./components/pages/TransactionHistory";
import NewTransaction from "./components/pages/NewTransactions";
import SavedTransactions from "./components/pages/SavedTransactions";
import Statistics from "./components/pages/Statistics";
import Settings from "./components/pages/Settings";
import { TransactionProvider } from "./contexts/TransactionContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <TransactionProvider>
      <Routes>
        {/* Default redirect */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Route (protected) */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<DashboardHome />} />
          <Route path="history" element={<TransactionHistory />} />
          <Route path="new-transaction" element={<NewTransaction />} />
          <Route path="saved" element={<SavedTransactions />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </TransactionProvider>
  );
}

export default App;
