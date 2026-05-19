
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
  type ViewMode = 'login' | 'signup' | 'forgot' | 'otp' | 'reset';
  const [viewMode, setViewMode] = useState<ViewMode>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [otpError, setOtpError] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePassword = (pass: string) => {
    // 8+ chars, upper, lower, number, special, no spaces
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?!.*\s).{8,}$/;
    return re.test(pass);
  };

  const validateName = (val: string) => {
    if (val.length < 3) return 'Full Name must be at least 3 characters long.';
    if (val.length > 50) return 'Full Name cannot exceed 50 characters.';
    if (!/^[a-zA-Z]/.test(val)) return 'Full Name must start with a letter.';
    if (!/^[a-zA-Z0-9_\-\s]+$/.test(val)) return 'Full Name can only contain letters, numbers, underscores, hyphens, or spaces.';
    return '';
  };

  const handleSubmit = async () => {
    let hasError = false;
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    setOtpError('');
    setError('');

    if (!navigator.onLine) {
      setError('Please check your internet connection.');
      return;
    }

    if (viewMode === 'login' || viewMode === 'forgot' || viewMode === 'signup' || viewMode === 'otp') {
      if (!email) {
        setEmailError('Please enter email address.');
        hasError = true;
      } else if (!validateEmail(email)) {
        setEmailError('Please enter valid email address.');
        hasError = true;
      }
    }

    if (viewMode === 'login' || viewMode === 'signup' || viewMode === 'reset') {
      if (!password) {
        setPasswordError(viewMode === 'reset' ? 'Please enter new password.' : 'Please enter password.');
        hasError = true;
      } else if (viewMode !== 'login' && !validatePassword(password)) {
        setPasswordError(viewMode === 'reset' ? 'New password must be at least 8 characters long with uppercase, lowercase, number, special character, and no spaces.' : 'Password must be at least 8 characters long with uppercase, lowercase, number, special character, and no spaces.');
        hasError = true;
      }
    }

    if (viewMode === 'signup') {
      if (!name) {
        setUsernameError('Please enter full name.');
        hasError = true;
      } else {
        const uErr = validateName(name);
        if (uErr) {
          setUsernameError(uErr);
          hasError = true;
        }
      }
    }

    if (viewMode === 'otp') {
      if (!otp) {
        setOtpError('Please enter OTP.');
        hasError = true;
      } else if (!/^\d{4,8}$/.test(otp)) {
        setOtpError('Please enter valid OTP.');
        hasError = true;
      }
    }

    if (hasError) return;

    setLoading(true);

    try {
      if (viewMode === 'login') {
        const user = await authService.signIn(email, password);
        onLogin(user);
        const profile = await DB.profiles.getByUser(user.id);

        // Check for pending plan redirection
        const pendingPlanId = localStorage.getItem('pending_plan_id');
        if (pendingPlanId) {
          try {
            const { url } = await DB.payments.createStripeSession(pendingPlanId);
            localStorage.removeItem('pending_plan_id'); // Clear after use
            if (url) {
              window.location.href = url;
              return;
            }
          } catch (error) {
            console.error('Failed to initiate pending plan checkout:', error);
          }
        }

        if (profile && profile.name && profile.industry) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } else if (viewMode === 'signup') {
        await authService.signUp(email, password, name);
        const user = await authService.signIn(email, password);
        onLogin(user);

        // Check for pending plan redirection
        const pendingPlanId = localStorage.getItem('pending_plan_id');
        if (pendingPlanId) {
          try {
            const { url } = await DB.payments.createStripeSession(pendingPlanId);
            localStorage.removeItem('pending_plan_id'); // Clear after use
            if (url) {
              window.location.href = url;
              return;
            }
          } catch (error) {
            console.error('Failed to initiate pending plan checkout after signup:', error);
          }
        }

        setError('You have been registered successfully! Redirecting...');
        navigate('/onboarding');
      } else if (viewMode === 'forgot') {
        await authService.forgotPassword(email);
        setError('Forgot password otp has been sent to your registered email address.');
        setViewMode('otp');
      } else if (viewMode === 'otp') {
        const token = await authService.verifyOtp(email, otp);
        if (token) {
          setResetToken(token);
          setViewMode('reset');
          setError('OTP verified successfully.');
        } else {
          setOtpError('The OTP you entered is incorrect.');
        }
      } else if (viewMode === 'reset') {
        await authService.resetPassword(resetToken, password);
        setError('Password reset successfully.');
        setViewMode('login');
        setPassword('');
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('block')) {
        setError('Your account has been blocked by admin.');
      } else if (viewMode === 'forgot' && (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('not registered') || msg.toLowerCase().includes('not exist'))) {
        setEmailError('The email address is not registered with us.');
      } else if (viewMode === 'otp') {
        setOtpError('The OTP you entered is incorrect.');
      } else {
        setError(msg || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!navigator.onLine) {
      setError('Please check your internet connection.');
      return;
    }
    setResendLoading(true);
    setError('');
    setOtpError('');
    try {
      await authService.forgotPassword(email);
      setError('OTP has been resent successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  const getTitle = () => {
    switch (viewMode) {
      case 'login': return 'Welcome back';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Forgot Password';
      case 'otp': return 'Verify Code';
      case 'reset': return 'Reset Password';
    }
  };

  const getSubTitle = () => {
    switch (viewMode) {
      case 'login': return 'Enter your email for access';
      case 'signup': return 'Start your SOP journey for free';
      case 'forgot': return 'Enter your email to receive an OTP';
      case 'otp': return `Enter the code sent to ${email}`;
      case 'reset': return 'Create a strong new password';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl p-6 sm:p-12 border border-slate-200/50 relative overflow-hidden">
        <button
          onClick={() => {
            if (viewMode === 'login' || viewMode === 'signup') onBack();
            else if (viewMode === 'forgot') setViewMode('login');
            else if (viewMode === 'otp') setViewMode('forgot');
            else if (viewMode === 'reset') setViewMode('login');
          }}
          className="absolute top-10 left-10 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-[1.25rem] mx-auto flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl shadow-indigo-200">O</div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">{getTitle()}</h2>
          <p className="text-slate-500 font-medium">{getSubTitle()}</p>
        </div>

        <div className="space-y-6">
          {viewMode === 'signup' && (
            <Input
              label="Full Name"
              placeholder="Alex Rivera"
              value={name}
              error={usernameError}
              minLength={3}
              maxLength={50}
              onChange={(e) => {
                const val = e.target.value;
                setName(val);
                if (val) {
                  setUsernameError(validateName(val));
                } else {
                  setUsernameError('Please enter full name.');
                }
              }}
            />
          )}

          {(viewMode === 'login' || viewMode === 'signup' || viewMode === 'forgot') && (
            <Input
              label="Work Email"
              type="email"
              placeholder="alex@company.com"
              value={email}
              error={emailError}
              onChange={(e) => {
                const val = e.target.value;
                setEmail(val);
                if (val) {
                  if (validateEmail(val)) {
                    setEmailError('');
                  } else {
                    setEmailError('Please enter valid email address.');
                  }
                } else {
                  setEmailError('Please enter email address.');
                }
              }}
            />
          )}

          {viewMode === 'otp' && (
            <>
              <Input
                label="OTP"
                placeholder="123456"
                value={otp}
                error={otpError}
                onChange={(e) => {
                  const val = e.target.value;
                  setOtp(val);
                  if (val) {
                    if (!/^\d+$/.test(val)) setOtpError('Please enter valid OTP.');
                    else setOtpError('');
                  } else {
                    setOtpError('Please enter OTP.');
                  }
                }}
              />
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="w-full text-right text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed -mt-3"
              >
                {resendLoading ? 'Resending...' : 'Resend OTP'}
              </button>
            </>
          )}

          {(viewMode === 'login' || viewMode === 'signup' || viewMode === 'reset') && (
            <div className="relative">
              <Input
                label={viewMode === 'reset' ? "New Password" : "Password"}
                type="password"
                placeholder="••••••••"
                value={password}
                error={passwordError}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  if (val) {
                    if (viewMode !== 'login' && !validatePassword(val)) {
                      setPasswordError(viewMode === 'reset' ? 'New password must be at least 8 characters long with uppercase, lowercase, number, special character, and no spaces.' : 'Password must be at least 8 characters long with uppercase, lowercase, number, special character, and no spaces.');
                    } else {
                      setPasswordError('');
                    }
                  } else {
                    setPasswordError(viewMode === 'reset' ? 'Please enter new password.' : 'Please enter password.');
                  }
                }}
              />
              {viewMode === 'login' && (
                <button
                  onClick={() => setViewMode('forgot')}
                  className="absolute right-2 top-0 text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-wider"
                >
                  Forgot?
                </button>
              )}
            </div>
          )}

          {error && (
            <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${error.includes('successfully') || error.includes('sent') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
              {error}
            </div>
          )}

          <Button size="lg" className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : (
              viewMode === 'login' ? 'Sign In' :
                viewMode === 'signup' ? 'Sign Up Free' :
                  viewMode === 'forgot' ? 'Send Code' :
                    viewMode === 'otp' ? 'Verify Code' : 'Reset Password'
            )}
          </Button>

          {viewMode === 'login' && (
            <p className="text-center text-sm text-slate-500 font-medium pt-4">
              Don't have an account?
              <button
                onClick={() => {
                  setViewMode('signup');
                  setError('');
                  setEmailError('');
                  setPasswordError('');
                  setUsernameError('');
                }}
                className="text-indigo-600 font-black ml-2 hover:underline"
              >
                Join OPOR8
              </button>
            </p>
          )}

          {viewMode === 'signup' && (
            <p className="text-center text-sm text-slate-500 font-medium pt-4">
              Already have an account?
              <button
                onClick={() => {
                  setViewMode('login');
                  setError('');
                  setEmailError('');
                  setPasswordError('');
                }}
                className="text-indigo-600 font-black ml-2 hover:underline"
              >
                Log in here
              </button>
            </p>
          )}

          {(viewMode === 'forgot' || viewMode === 'otp' || viewMode === 'reset') && (
            <button
              onClick={() => {
                setViewMode('login');
                setError('');
                setEmailError('');
                setPasswordError('');
                setOtp('');
              }}
              className="w-full text-center text-sm font-black text-slate-400 hover:text-indigo-600 transition-colors pt-2"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthView;
