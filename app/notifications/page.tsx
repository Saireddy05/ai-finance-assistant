'use client';

import AppLayout from '@/components/AppLayout';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Info, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-zinc-500">Stay updated on your financial milestones.</p>
          </div>
          {notifications.some(n => !n.is_read) && (
            <button 
              onClick={markAllAsRead}
              className="text-sm font-bold text-primary hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center glass-card">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="glass-card divide-y divide-zinc-800">
            {notifications.map((n) => {
              const Icon = n.type === 'warning' ? AlertTriangle : 
                           n.type === 'success' ? CheckCircle : 
                           n.type === 'error' ? AlertTriangle : Info;

              return (
                <div 
                  key={n.id} 
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className={cn(
                    "p-6 flex gap-4 hover:bg-zinc-800/30 transition-all cursor-pointer group",
                    !n.is_read && "bg-primary/5"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                    n.type === 'warning' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                    n.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                    n.type === 'error' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                    "bg-blue-500/10 border-blue-500/20 text-blue-500"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={cn(
                        "font-bold text-sm transition-colors",
                        n.is_read ? "text-zinc-400 group-hover:text-white" : "text-white"
                      )}>
                        {n.title}
                      </h4>
                      <span className="text-xs text-zinc-500">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                  {!n.is_read && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  )}
                </div>
              );
            })}
            {notifications.length === 0 && (
              <div className="p-12 text-center text-zinc-500">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>All caught up! No new notifications.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
