
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { authService } from '../services/auth';
import { DB } from '../services/db';
import { Button, Input } from '../components/UI';

interface AuthViewProps {
  onLogin: (u: User) => void;
  onBack: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const user = await authService.signIn(email, password);
        onLogin(user);
        const profile = await DB.profiles.getByUser(user.id);
        if (profile && profile.name && profile.industry) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } else {
        if (!name) {
          setError('Please provide your name');
          setLoading(false);
          return;
        }
        await authService.signUp(email, password, name);
        const user = await authService.signIn(email, password);
        onLogin(user);
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl p-6 sm:p-12 border border-slate-200/50 relative overflow-hidden">
        <button onClick={onBack} className="absolute top-10 left-10 text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-[1.25rem] mx-auto flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl shadow-indigo-200">O</div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">{isLogin ? 'Welcome back' : 'Create Account'}</h2>
          <p className="text-slate-500 font-medium">{isLogin ? 'Enter your email for access' : 'Start your SOP journey for free'}</p>
        </div>

        <div className="space-y-6">
          {!isLogin && (
            <Input
              label="Full Name"
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <Input
            label="Work Email"
            type="email"
            placeholder="alex@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <Button size="lg" className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up Free')}
          </Button>

          <p className="text-center text-sm text-slate-500 font-medium pt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-indigo-600 font-black ml-2 hover:underline">
              {isLogin ? 'Join OPOR8' : 'Log in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
