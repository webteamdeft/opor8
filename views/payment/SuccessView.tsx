import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/UI';
import { authService } from '../../services/auth';

export const SuccessView: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Payment Successful - OPOR8';
        // Trigger a profile refresh to reflect the isPaid status
        authService.getCurrentUser();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 p-12 text-center animate-fadeIn">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>

                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Payment Successful!</h1>
                <p className="text-slate-500 font-medium mb-12 leading-relaxed">
                    Your account has been upgraded to the Professional Pack. You now have full access to all features and documents.
                </p>

                <div className="bg-slate-50 rounded-2xl p-6 mb-12 flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                        <ShieldCheck className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-900">Lifetime Access Activated</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Transaction ID: TX_</p>
                    </div>
                </div>

                <Button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-6 rounded-2xl flex items-center justify-center gap-2 group"
                >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
};

export default SuccessView;
