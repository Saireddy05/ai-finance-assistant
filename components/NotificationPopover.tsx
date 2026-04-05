'use client';

import { Bell, X, Info, AlertTriangle, CheckCircle, Shield, Award, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { format } from 'date-fns';

export default function NotificationPopover({ onClose }: { onClose: () => void }) {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const getIcon = (type: string, title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('milestone') || lowerTitle.includes('reward')) return <Award className="w-4 h-4 text-amber-500" />;
    if (lowerTitle.includes('ai') || lowerTitle.includes('recommendation')) return <Lightbulb className="w-4 h-4 text-primary" />;
    if (lowerTitle.includes('security') || lowerTitle.includes('account')) return <Shield className="w-4 h-4 text-blue-500" />;
    
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="glass-card shadow-2xl border border-zinc-800 animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[480px]">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-white">Notifications</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={markAllAsRead}
            className="text-[10px] font-bold text-zinc-500 hover:text-primary transition-colors uppercase tracking-wider"
          >
            Mark all read
          </button>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-md transition-all">
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={cn(
                "px-4 py-3 hover:bg-zinc-900/50 transition-all cursor-pointer border-l-2 relative group",
                n.is_read ? "border-transparent opacity-60" : "border-primary bg-primary/5"
              )}
            >
              <div className="flex gap-3">
                <div className="mt-1">{getIcon(n.type, n.title)}</div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs font-bold mb-0.5", !n.is_read ? "text-white" : "text-zinc-400")}>
                    {n.title}
                  </p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mb-1 line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-[9px] text-zinc-600 font-medium">
                    {format(new Date(n.created_at), 'MMM dd, hh:mm a')}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <Bell className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
            <p className="text-sm text-zinc-500 font-medium">No notifications yet</p>
            <p className="text-xs text-zinc-700 mt-1">We'll alert you when something happens.</p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/50 text-center">
          <button 
            onClick={clearAll}
            className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            Clear All Notifications
          </button>
        </div>
      )}
    </div>
  );
}
