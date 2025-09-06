import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";
import { useTransactions } from "../../contexts/TransactionContext";

const Statistics = () => {
  const { transactions } = useTransactions();

  // Process monthly trends
  const monthlyData = {};
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });

    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0 };
    }

    if (transaction.type === "income") {
      monthlyData[month].income += transaction.amount;
    } else {
      monthlyData[month].expense += transaction.amount;
    }
  });

  const chartData = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    }))
    .sort(
      (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
    );

  // Spending by category
  const categoryData = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
    });

  const categoryChartData = Object.entries(categoryData)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Current month stats
  const currentMonth = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
  const currentMonthData = monthlyData[currentMonth] || {
    income: 0,
    expense: 0,
  };
  const savings = currentMonthData.income - currentMonthData.expense;
  const savingsRate =
    currentMonthData.income > 0
      ? (savings / currentMonthData.income) * 100
      : 0;

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className={`text-sm ${
                entry.dataKey === "income"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {entry.dataKey === "income" ? "Income" : "Expense"}: $
              {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Statistics</h1>
        <p className="text-slate-400">
          Analyze your financial trends and patterns
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Savings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">
              This Month
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Monthly Savings</p>
          <p className="text-2xl font-bold text-white">
            ${savings.toLocaleString()}
          </p>
        </motion.div>

        {/* Savings Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-blue-400 text-sm font-medium">Rate</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Savings Rate</p>
          <p className="text-2xl font-bold text-white">
            {savingsRate.toFixed(1)}%
          </p>
        </motion.div>

        {/* Avg Transaction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-purple-400 text-sm font-medium">Average</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Avg Transaction</p>
          <p className="text-2xl font-bold text-white">
            $
            {transactions.length > 0
              ? (
                  transactions.reduce((sum, t) => sum + t.amount, 0) /
                  transactions.length
                ).toFixed(0)
              : "0"}
          </p>
        </motion.div>
      </div>

      {/* Income vs Expense Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <h3 className="text-xl font-bold text-white mb-6">
          Income vs Expense Trends
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(51 65 85)" />
            <XAxis dataKey="month" stroke="rgb(148 163 184)" fontSize={12} />
            <YAxis
              stroke="rgb(148 163 184)"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: "#ef4444", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Spending by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <h3 className="text-xl font-bold text-white mb-6">
          Spending by Category
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={categoryChartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(51 65 85)" />
            <XAxis
              type="number"
              stroke="rgb(148 163 184)"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="rgb(148 163 184)"
              fontSize={12}
              width={100}
            />
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]}
              contentStyle={{
                backgroundColor: "rgb(30 41 59)",
                border: "1px solid rgb(51 65 85)",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Bar dataKey="amount" fill="url(#colorGradient)" radius={[0, 4, 4, 0]} />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Statistics;
