import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Wallet, 
  MessageSquare, 
  Bell, 
  User,
  LogOut,
  TrendingUp,
  Gamepad2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Transactions', icon: ArrowLeftRight, href: '/transactions' },
  { name: 'Budgets', icon: Wallet, href: '/budgets' },
  { name: 'Analytics', icon: PieChart, href: '/analytics' },
  { name: 'AI Assistant', icon: MessageSquare, href: '/ai' },
  { name: 'Learning', icon: Gamepad2, href: '/learning' },
  { name: 'Profile', icon: User, href: '/profile' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Unexpected error signing out:', err);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-zinc-800 bg-black p-4 flex flex-col z-50">
      <div className="flex items-center gap-2 px-4 mb-8">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <TrendingUp className="text-black w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">Finova AI</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "nav-item",
                isActive && "nav-item-active"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-zinc-800 pt-4 px-2">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 w-full text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
