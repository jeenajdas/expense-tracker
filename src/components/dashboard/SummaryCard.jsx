import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const SummaryCard = ({ title, value, change, changeType, icon: Icon, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden"
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 opacity-10 ${gradient} rounded-full -translate-y-1/2 translate-x-1/2`}
      ></div>

      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${gradient} bg-opacity-20`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div
          className={`text-sm font-medium ${
            changeType === "positive"
              ? "text-green-400"
              : changeType === "negative"
              ? "text-red-400"
              : "text-slate-400"
          }`}
        >
          {change}
        </div>
      </div>

      <div>
        <p className="text-slate-400 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.string.isRequired,
  changeType: PropTypes.oneOf(["positive", "negative", "neutral"]).isRequired,
  icon: PropTypes.elementType.isRequired,
  gradient: PropTypes.string.isRequired,
};

export default SummaryCard;
