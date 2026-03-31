'use client';

import Sidebar from '@/components/Sidebar';
import { Bell, User } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import Link from 'next/link';
import { useState } from 'react';
import NotificationPopover from './NotificationPopover';
import { useNotifications } from '@/hooks/useNotifications';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useProfile();
  const { notifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const hasUnread = notifications.some(n => !n.is_read);

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="flex items-center justify-between mb-10">
          <div /> {/* Spacer for flex-between since search is removed */}
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all relative"
              >
                <Bell className="w-5 h-5" />
                {hasUnread && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-black" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 z-50">
                  <NotificationPopover onClose={() => setShowNotifications(false)} />
                </div>
              )}
            </div>
            
            <Link href="/profile" className="flex items-center gap-3 pl-4 border-l border-zinc-800 group cursor-pointer hover:opacity-80 transition-all">
              <div className="text-right">
                <p className="text-sm font-medium group-hover:text-primary transition-colors">{profile?.full_name || 'User'}</p>
                <p className="text-xs text-zinc-500">Free Plan</p>
              </div>
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700 group-hover:border-primary/50 transition-all">
                <User className="text-zinc-400 w-6 h-6 group-hover:text-primary" />
              </div>
            </Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
