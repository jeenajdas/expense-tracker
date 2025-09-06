// src/pages/NewTransaction.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Plus, DollarSign, Calendar, Tag, FileText } from "lucide-react";
import { useTransactions } from "../../contexts/TransactionContext";

const categories = {
  income: [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Gift",
    "Other",
  ],
  expense: [
    "Food",
    "Transportation",
    "Healthcare",
    "Education",
    "Entertainment",
    "Shopping",
    "Utilities",
    "Other",
  ],
};

const NewTransaction = () => {
  const [activeTab, setActiveTab] = useState("expense");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTransaction } = useTransactions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const transactionData = {
        ...data,
        type: activeTab,
        amount: Number(data.amount),
      };

      addTransaction(transactionData);

      reset({
        type: activeTab,
        category: "",
        description: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
      });

      alert("✅ Transaction added successfully!");
    } catch (error) {
      alert("❌ Error adding transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">New Transaction</h1>
        <p className="text-slate-400">
          Add a new income or expense transaction
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
      >
        {/* Tabs */}
        <div className="flex bg-slate-700/50 rounded-xl p-1 mb-8">
          <button
            onClick={() => setActiveTab("expense")}
            type="button"
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "expense"
                ? "bg-red-500/20 text-red-400 shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Expense</span>
          </button>
          <button
            onClick={() => setActiveTab("income")}
            type="button"
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "income"
                ? "bg-green-500/20 text-green-400 shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Plus className="w-5 h-5" />
            <span>Income</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category */}
          <div>
            <label className="flex items-center space-x-2 text-slate-300 text-sm font-medium mb-3">
              <Tag className="w-4 h-4" />
              <span>Category</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories[activeTab].map((category) => (
                <label
                  key={category}
                  className="relative flex items-center justify-center p-4 rounded-lg border border-slate-600 hover:border-slate-500 transition-all duration-200 cursor-pointer group"
                >
                  <input
                    {...register("category", {
                      required: "Category is required",
                    })}
                    type="radio"
                    value={category}
                    className="sr-only"
                  />
                  <span className="text-slate-300 group-has-[:checked]:text-white font-medium">
                    {category}
                  </span>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-200"></div>
                </label>
              ))}
            </div>
            {errors.category && (
              <p className="text-red-400 text-sm mt-2">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center space-x-2 text-slate-300 text-sm font-medium mb-3">
              <FileText className="w-4 h-4" />
              <span>Description</span>
            </label>
            <input
              {...register("description", {
                required: "Description is required",
              })}
              type="text"
              placeholder="Enter transaction description"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-2">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="flex items-center space-x-2 text-slate-300 text-sm font-medium mb-3">
              <DollarSign className="w-4 h-4" />
              <span>Amount</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">
                $
              </span>
              <input
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 0.01, message: "Amount must be greater than 0" },
                })}
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {errors.amount && (
              <p className="text-red-400 text-sm mt-2">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center space-x-2 text-slate-300 text-sm font-medium mb-3">
              <Calendar className="w-4 h-4" />
              <span>Date</span>
            </label>
            <input
              {...register("date", { required: "Date is required" })}
              type="date"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {errors.date && (
              <p className="text-red-400 text-sm mt-2">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "expense"
                  ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting
                ? "Adding..."
                : `Add ${activeTab === "expense" ? "Expense" : "Income"}`}
            </motion.button>
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-3 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NewTransaction;
