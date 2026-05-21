"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListTodo, CalendarDays, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { ModeToggle } from './ModeToggle';

export default function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();

  if (!isAuthenticated) return null;

  const routes = [
    { name: 'Board', path: '/board', icon: ListTodo },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Calendar', path: '/calendar', icon: CalendarDays },
  ];

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col hidden md:flex shrink-0">
      <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider mt-1">
            Welcome back
          </p>
        </div>
        <ModeToggle />
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-2">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.path || (pathname === '/' && route.path === '/board');
          
          return (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50"
              )}
            >
              <Icon className="w-5 h-5" />
              {route.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium text-sm text-neutral-400 hover:text-rose-400 hover:bg-rose-400/10"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
