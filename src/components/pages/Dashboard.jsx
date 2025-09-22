// src/pages/Dashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  
} from "lucide-react";
import { useTransactions } from "../../contexts/TransactionContext";
import SummaryCard from "../dashboard/SummaryCard";
import ExpensePieChart from "../dashboard/ExpensePieChart";
import BudgetMeter from "../dashboard/BudgetMeter";

const Dashboard = () => {
  const { transactions } = useTransactions();

  // 🔹 Summary calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const cashInHand = totalIncome - totalExpense;
  const transactionCount = transactions.length;

  // 🔹 Today’s stats
  const today = new Date().toLocaleDateString();
  const todayTransactions = transactions.filter((t) => t.date === today);

  const todayIncome = todayTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const todayExpense = todayTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // 🔹 Pie chart data
  const expenseCategories = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      expenseCategories[t.category] =
        (expenseCategories[t.category] || 0) + t.amount;
    });

  const pieData = Object.entries(expenseCategories).map(
    ([name, value], index) => ({
      name,
      value,
      color: [
        "#3B82F6",
        "#8B5CF6",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#EC4899",
        "#6366F1",
        "#14B8A6",
      ][index % 8],
    })
  );

  const budget = 5000; // configurable
  const spent = totalExpense;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Income"
          value={`₹${totalIncome.toLocaleString()}`}
          subtitle={`₹${todayIncome.toLocaleString()} today`}
          icon={TrendingUp}
          gradient="bg-gradient-to-r from-green-500 to-emerald-500"
        />
        <SummaryCard
          title="Total Expense"
          value={`₹${totalExpense.toLocaleString()}`}
          subtitle={`₹${todayExpense.toLocaleString()} today`}
          icon={TrendingDown}
          gradient="bg-gradient-to-r from-red-500 to-rose-500"
        />
        <SummaryCard
          title="Cash in Hand"
          value={`₹${cashInHand.toLocaleString()}`}
          subtitle={`Net Balance`}
          icon={Wallet}
          gradient="bg-gradient-to-r from-blue-500 to-purple-500"
        />
        <SummaryCard
          title="Transactions"
          value={transactionCount.toString()}
          subtitle={`All-time records`}
          icon={CreditCard}
          gradient="bg-gradient-to-r from-orange-500 to-yellow-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart data={pieData} />
        <BudgetMeter budget={budget} spent={spent} />
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Recent Transactions
          </h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4">
  {transactions.slice(0, 5).map((transaction) => (
    <div
      key={transaction.id}
      className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-200"
    >
      <div className="flex items-center space-x-4">
        {/* Single colored box with ₹ */}
        <div
          className={`p-2 rounded-lg ${
            transaction.type === "income"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          <span className="w-5 h-5 flex items-center justify-center text-base font-bold">
            ₹
          </span>
        </div>

                <div>
                  <p className="text-white font-medium">
                    {transaction.description}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${
                    transaction.type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}₹
                  {transaction.amount.toLocaleString()}
                </p>
                <p className="text-slate-400 text-sm">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
