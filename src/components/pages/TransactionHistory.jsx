import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, DollarSign, Trash2, Calendar } from "lucide-react";
import { useTransactions } from "../../contexts/TransactionContext";

const TransactionHistory = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Unique categories (from dynamic transactions in localStorage)
  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  // Filter logic
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || transaction.category === filterCategory;

    const matchesType =
      filterType === "all" || transaction.type === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id); // Updates context + localStorage
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">
          Transaction History
        </h1>
        <p className="text-slate-400">View and manage all your transactions</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="lg:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Transactions</h3>
            <span className="text-slate-400 text-sm">
              {filteredTransactions.length} transaction(s) found
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left p-4 text-slate-400 font-medium">
                  Date
                </th>
                <th className="text-left p-4 text-slate-400 font-medium">
                  Description
                </th>
                <th className="text-left p-4 text-slate-400 font-medium">
                  Category
                </th>
                <th className="text-left p-4 text-slate-400 font-medium">
                  Type
                </th>
                <th className="text-right p-4 text-slate-400 font-medium">
                  Amount
                </th>
                <th className="text-right p-4 text-slate-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-200"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">
                        {transaction.description}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === "income"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span
                          className={`font-bold ${
                            transaction.type === "income"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {transaction.amount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="text-slate-400">
                      <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No transactions found</p>
                      <p className="text-sm">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionHistory;
