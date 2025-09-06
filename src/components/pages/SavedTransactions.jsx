import React, { useEffect } from "react";
import { useTransactions } from "../../contexts/TransactionContext";

const SavedTransactions = () => {
  const { transactions } = useTransactions();

  // keep localStorage in sync whenever transactions change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="p-6 bg-slate-800/50 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Saved Transactions</h2>
        <p className="text-slate-400">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-800/50 rounded-2xl">
      <h2 className="text-xl font-bold text-white mb-4">Saved Transactions</h2>
      <ul className="space-y-4">
        {transactions.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all"
          >
            <div>
              <p className="text-white font-medium">{t.description}</p>
              <p className="text-slate-400 text-sm">{t.category}</p>
            </div>
            <div
              className={`font-bold ${
                t.type === "income" ? "text-green-400" : "text-red-400"
              }`}
            >
              {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedTransactions;
