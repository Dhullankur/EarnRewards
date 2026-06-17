import { useState, useCallback, useEffect } from 'react';
import { DASHBOARD_HEADER } from './util/constants.js';
import { normalizeTransactions } from './util/transactions.js';
import { fetchTransactions } from './api/api.js';
import './App.css'

function App() {

  const loadTransactions = useCallback(async () => {

    try {
      const rawTransactions = await fetchTransactions();
      const transactions = normalizeTransactions(rawTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);      
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
     <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          {DASHBOARD_HEADER.title}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{DASHBOARD_HEADER.description}</p>
      </header>
      </main>
  )
}

export default App
