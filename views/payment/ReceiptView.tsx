import React from 'react';
import { Transaction } from '../../types';

interface ReceiptViewProps {
    transaction: Transaction;
    onClose: () => void;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({ transaction, onClose }) => {
    const formatCurrency = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn" id="receipt-modal-overlay">
            <style>
                {`
          @media print {
            body * {
              visibility: hidden !important;
              background: none !important;
            }
            #receipt-modal-overlay {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              padding: 0 !important;
              margin: 0 !important;
              background: white !important;
              visibility: visible !important;
              display: block !important;
            }
            #receipt-modal-content {
              position: static !important;
              visibility: visible !important;
              display: block !important;
              width: 100% !important;
              height: auto !important;
              max-height: none !important;
              box-shadow: none !important;
              border: none !important;
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            #receipt-modal-content * {
              visibility: visible !important;
              display: block !important;
              position: static !important;
              float: none !important;
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
              opacity: 1 !important;
            }
            /* Preserve grid for details if needed, but block is safer */
            .grid {
              display: grid !important;
            }
            .grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
            .print-overflow-visible {
              overflow: visible !important;
              display: block !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
            </style>

            <div
                id="receipt-modal-content"
                className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <div className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mb-2">
                            <span className="text-3xl">OPOR8</span>
                        </div>
                        <p className="text-slate-500 font-medium text-sm">Receipt for payment</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Receipt ID</p>
                        <p className="font-mono text-slate-900 font-bold">{transaction.transactionId || transaction._id}</p>
                    </div>
                </div>

                {/* Amount */}
                <div className="p-12 text-center border-b border-slate-100 bg-white">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Amount Paid</p>
                    <h2 className="text-6xl font-black text-slate-900 tracking-tighter">
                        {formatCurrency(transaction.amount, 'USD')}
                    </h2>
                    <p className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Paid Successfully
                    </p>
                </div>

                {/* Details */}
                <div className="p-10 space-y-6 flex-1 overflow-y-auto print-overflow-visible">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Date</p>
                            <p className="font-bold text-slate-900 text-lg">{formatDate(transaction.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Payment Method</p>
                            <p className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                <span className="w-8 h-5 bg-slate-100 rounded border border-slate-200 block"></span>
                                Card Payment
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Product</p>
                            <p className="font-bold text-slate-900 text-lg">
                                {transaction.productId === 'pro' ? 'Professional Pack - Lifetime Access' : 'Subscription Plan'}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Customer</p>
                            {/* Note: In a real receipt we'd want the user's name/email here, but we might only have the ID in the transaction object unless we pass the User object too. 
                   For now, we'll omit PII if not strictly available or just show "Billed to Account". */}
                            <p className="font-bold text-slate-900 text-lg">Billed to User Account</p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};
