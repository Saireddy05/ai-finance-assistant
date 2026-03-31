'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { TrendingUp, Mail, Lock, Loader2, Eye, EyeOff, User, Check, X } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRequirements = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session) {
      router.push('/dashboard');
    } else {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (!data.session) {
      setSuccessMessage('Check your email and confirm your account before logging in.');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20">
            <TrendingUp className="text-black w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Finova AI</h1>
            <p className="text-zinc-500 mt-2">The next generation of AI-powered personal finance.</p>
          </div>
        </div>

        <div className="glass-card p-8 space-y-6">
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-12 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-primary transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {isSignUp && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                  <div className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${passwordRequirements.length ? 'text-emerald-500' : 'text-zinc-500'}`}>
                    {passwordRequirements.length ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 border border-zinc-700 rounded-full" />}
                    <span>Min. 6 chars</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${passwordRequirements.uppercase ? 'text-emerald-500' : 'text-zinc-500'}`}>
                    {passwordRequirements.uppercase ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 border border-zinc-700 rounded-full" />}
                    <span>1 Uppercase</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${passwordRequirements.number ? 'text-emerald-500' : 'text-zinc-500'}`}>
                    {passwordRequirements.number ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 border border-zinc-700 rounded-full" />}
                    <span>1 Number</span>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="text-xs text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 font-medium">
                {error}
              </p>
            )}

            {successMessage && (
              <p className="text-xs text-emerald-500 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 font-medium">
                {successMessage}
              </p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>

          {!isSignUp && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-all active:scale-95"
                >
                  Sign In with Provider
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-zinc-500 px-2">
          By continuing, you agree to Finova AI's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
