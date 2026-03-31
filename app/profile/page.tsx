'use client';

import AppLayout from '@/components/AppLayout';
import { useProfile } from '@/hooks/useProfile';
import { User, Shield, CreditCard, Bell, Globe, Moon, Loader2, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { profile, loading, updateProfile } = useProfile();
  const [fullName, setFullName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setCurrency(profile.currency || 'USD');
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      await updateProfile({
        full_name: fullName,
        currency: currency
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
          <p className="text-zinc-500">Manage your account preferences and security.</p>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center glass-card">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Form Content */}
            <div className="space-y-8">
              <div className="glass-card p-6 space-y-6">
                <h3 className="font-bold text-lg border-b border-zinc-800 pb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      value={profile?.email || ''} 
                      disabled 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm opacity-50 cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 space-y-6">
                <h3 className="font-bold text-lg border-b border-zinc-800 pb-4">App Preferences</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 rounded-lg border border-zinc-700">
                      <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Default Currency</p>
                      <p className="text-xs text-zinc-500">Used for all calculations</p>
                    </div>
                  </div>
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1.5 text-xs font-bold focus:ring-1 focus:ring-primary outline-none cursor-pointer hover:bg-zinc-700 transition-colors"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-lg text-rose-500 text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-4">
                {success && (
                  <span className="text-emerald-500 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                    <CheckCircle className="w-4 h-4" />
                    Changes saved successfully!
                  </span>
                )}
                <button 
                  onClick={handleSave}
                  disabled={saving || !profile}
                  className="px-8 py-2.5 bg-primary text-black rounded-lg text-sm font-extrabold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
