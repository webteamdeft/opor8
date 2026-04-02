import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '../../components/UI';

export const CancelView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 p-12 text-center animate-fadeIn">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <XCircle className="w-12 h-12 text-red-600" />
                </div>

                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Payment Cancelled</h1>
                <p className="text-slate-500 font-medium mb-12 leading-relaxed">
                    The payment process was cancelled. No charges were made to your account.
                </p>

                <div className="space-y-4 mb-12">
                    <div className="bg-slate-50 rounded-2xl p-6 flex items-center gap-4 text-left border border-slate-100">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                            <MessageCircle className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900">Need help?</p>
                            <p className="text-xs text-slate-400 font-bold">Contact our support team if you had issues paying.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Button
                        onClick={() => navigate('/billing')}
                        className="w-full py-6 rounded-2xl flex items-center justify-center gap-2 group"
                    >
                        Try Again
                    </Button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelView;
