'use client';

import { Bell, User } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useNotifications } from '@/hooks/useNotifications';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import NotificationPopover from './NotificationPopover';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const { profile } = useProfile();
  const { notifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  const hasUnread = notifications.some(n => !n.is_read);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <header className={cn("flex items-center justify-between px-8 py-4 bg-black border-b border-zinc-900", className)}>
      <div /> {/* Spacer for flex-between */}
      
      <div className="flex items-center gap-4">
        {/* Notification Bell & Popover */}
        <div className="relative" ref={popoverRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all relative",
              showNotifications && "bg-zinc-800 text-white"
            )}
            title="Notifications"
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
            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Free Plan
            </p>
          </div>
          <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700 group-hover:border-primary/50 transition-all">
            <User className="text-zinc-400 w-6 h-6 group-hover:text-primary" />
          </div>
        </Link>
      </div>
    </header>
  );
}
