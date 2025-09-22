import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const BudgetMeter = ({ budget, spent }) => {
  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;

  const getColor = () => {
    if (percentage <= 50) return "from-green-500 to-emerald-500";
    if (percentage <= 80) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-xl font-bold text-white mb-6">Budget Overview</h3>

      <div className="space-y-6">
        {/* Circular Progress */}
        <div className="relative flex items-center justify-center">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="rgb(51 65 85)"
              strokeWidth="8"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 60}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
              animate={{
                strokeDashoffset:
                  2 * Math.PI * 60 - (percentage / 100) * 2 * Math.PI * 60,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`stroke-gradient bg-gradient-to-r ${getColor()}`}
              style={{
                background: `linear-gradient(90deg, ${
                  percentage <= 50
                    ? "#10b981, #059669"
                    : percentage <= 80
                    ? "#f59e0b, #ea580c"
                    : "#ef4444, #f43f5e"
                })`,
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {Math.round(percentage)}%
            </span>
            <span className="text-slate-400 text-sm">of budget used</span>
          </div>
        </div>

        {/* Budget Details */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Budget:</span>
            <span className="text-white font-medium">
              ₹{budget.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Spent:</span>
            <span className="text-white font-medium">
              ₹{spent.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-700 pt-3">
            <span className="text-slate-400">Remaining:</span>
            <span
              className={`font-medium ${
                remaining >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
             ₹{Math.abs(remaining).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

BudgetMeter.propTypes = {
  budget: PropTypes.number.isRequired,
  spent: PropTypes.number.isRequired,
};

export default BudgetMeter;
