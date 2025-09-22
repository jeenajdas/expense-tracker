// src/pages/SavedTransactions.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

const SavedTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

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
          <li key={t.id} className="flex justify-between items-center p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all">
            <div>
              <p className="text-white font-medium">{t.description}</p>
              <p className="text-slate-400 text-sm">{t.category}</p>
            </div>
            <div
              className={`font-bold ${
                t.type === "income" ? "text-green-400" : "text-red-400"
              }`}
            >
              {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedTransactions;
