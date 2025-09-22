// src/contexts/TransactionContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
   const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let unsubscribeSnapshot; // keep ref for cleanup

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // If user logged in, attach Firestore listener
      if (currentUser) {
        const q = query(
          collection(db, "transactions"),
          where("uid", "==", currentUser.uid)
        );

        unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          const transactionData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTransactions(transactionData);
        });
      } else {
        setTransactions([]);
        if (unsubscribeSnapshot) unsubscribeSnapshot(); // cleanup old snapshot
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // Add transaction
  const addTransaction = async (transaction) => {
  if (!user) return;
  await addDoc(collection(db, "transactions"), {
    ...transaction,
    uid: user.uid,
    createdAt: serverTimestamp(),
    amount: Number(transaction.amount), // ensure amount is a number
  });
};

  // Update transaction
  const updateTransaction = async (updatedTransaction) => {
    if (!user) return;
    const transactionRef = doc(db, "transactions", updatedTransaction.id);
    await updateDoc(transactionRef, updatedTransaction);
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, "transactions", id));
  };

  return (
   <TransactionContext.Provider
  value={{
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    searchQuery,
    setSearchQuery,
    
  
  }}
>
  {children}
</TransactionContext.Provider>
  );
};
