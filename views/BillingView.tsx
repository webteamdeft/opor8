
import React, { useState, useEffect } from 'react';
import { User, Transaction, Product } from '../types';
import { DB } from '../services/db';
import { ReceiptView } from './payment/ReceiptView';

export const BillingView: React.FC<{ user: User, onUpgrade: () => void }> = ({ user, onUpgrade }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await DB.payments.getTransactionHistory({ limit: 10 });
        setTransactions(response.data.list || []);
      } catch (err: any) {
        console.error('[BillingView] Failed to fetch transactions:', err);
        setError(err.message || 'Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await DB.payments.getProducts();
        setProducts(response.data || []);
      } catch (err) {
        console.error('[BillingView] Failed to fetch products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchTransactions();
    fetchProducts();
  }, []);

  const handleUpgrade = async (productId: string) => {
    try {
      const p = products.find(prod => prod._id === productId || prod.stripeProductId === productId);
      const planId = p?.plan;

      if (!planId) {
        throw new Error('Plan identifier not found for this product');
      }

      const { url } = await DB.payments.createStripeSession(planId);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error initiating upgrade:', error);
      alert('Failed to initiate payment. Please try again later.');
    }
  };


  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12 font-sans">
      <div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">Billing</h1>
        <p className="text-lg text-slate-500 font-medium">Manage your subscription, invoices, and pack entitlements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden min-h-[300px]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Active Plan</p>
                <h3 className="text-4xl font-black text-slate-900 flex items-center gap-3">
                  {user.isPaid ? 'Professional Pack' : 'Free Preview'}
                  {user.isPaid && <span className="text-[10px] px-3 py-1 bg-indigo-600 text-white rounded-full uppercase tracking-widest font-black">Active</span>}
                </h3>
              </div>
              {user.isPaid && (
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all">Download All Invoices</button>
              )}
            </div>

            <p className="text-slate-500 text-lg font-medium mb-12 max-w-xl leading-relaxed">
              {user.isPaid
                ? "You have lifetime access to the Professional Pack. Future compliance updates are included free for 12 months."
                : "You are currently previewing documents. Unlock the full professional library to enable Word/PDF exports and brand customization."}
            </p>

            {!user.isPaid && products.length === 0 && !loadingProducts && (
              <button
                onClick={onUpgrade}
                className="w-full md:w-max px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Upgrade Pack ($49.00)
              </button>
            )}
          </div>

          {!user.isPaid && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loadingProducts ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 animate-pulse">
                    <div className="h-4 w-24 bg-slate-100 rounded mb-4"></div>
                    <div className="h-8 w-48 bg-slate-50 rounded mb-6"></div>
                    <div className="h-12 w-full bg-slate-50 rounded-xl"></div>
                  </div>
                ))
              ) : products.map((p) => (
                <div key={p._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-black text-xl text-slate-900">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.metadata?.type || 'Standard'}</p>
                    </div>
                    <span className="text-2xl font-black text-slate-900">
                      {p.amount ? `$${p.amount}` : (p.name.toLowerCase().includes('premium') ? '$99' : (p.name.toLowerCase().includes('pro') ? '$49' : '$19'))}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-8 line-clamp-2">{p.description}</p>
                  <button
                    onClick={() => handleUpgrade(p._id)}
                    className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-10">Pack Entitlements</h3>
          <div className="space-y-6 flex-1">
            {[
              { label: 'Full SOP Library', unlocked: user.isPaid || user.isPro },
              { label: 'Word Exports', unlocked: user.isPaid || user.isPro },
              { label: 'PDF Exports', unlocked: user.isPaid || user.isPro },
              { label: 'Custom Branding', unlocked: user.isPaid || user.isPro },
              { label: 'AI Compliance Check', unlocked: user.isPaid || user.isPro },
              { label: '24/7 Priority Support', unlocked: user.isPaid || user.isPro },
            ].map((e, i) => (
              <div key={i} className={`flex items-center justify-between font-bold text-sm ${e.unlocked ? 'text-slate-900' : 'text-slate-300'}`}>
                <span>{e.label}</span>
                {e.unlocked ? (
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-10">Transaction History</h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-12 h-12 bg-slate-100 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-slate-100 rounded mb-2"></div>
            <div className="h-3 w-24 bg-slate-50 rounded"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 px-6 bg-red-50 rounded-[2.5rem] border border-red-100 text-red-600">
            <p className="text-sm font-bold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-white text-red-600 rounded-xl text-xs font-black uppercase tracking-widest border border-red-200 hover:bg-red-50 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl border border-slate-200 shadow-sm">
                    💳
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">
                      {tx.productId === 'pro' ? 'Professional Pack' : 'Subscription'}
                    </p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                      {formatDate(tx.createdAt)} • {tx.purchaseDevice === 'web' ? 'Web Purchase' : 'Mobile Purchase'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 block">{formatCurrency(tx.amount, 'USD')}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                      Paid
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedReceipt(tx)}
                    className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:border-indigo-600 transition-all shadow-sm"
                  >
                    Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="text-6xl mb-6 grayscale opacity-20">💸</div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">No transaction history found</p>
          </div>
        )}
      </div>

      {selectedReceipt && (
        <ReceiptView
          transaction={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};

export default BillingView;
