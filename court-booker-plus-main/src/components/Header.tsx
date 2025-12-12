import { Link, useLocation } from 'react-router-dom';
import { Calendar, History, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();
  
  const navItems = [
    { href: '/', label: 'Book Court', icon: Home },
    { href: '/bookings', label: 'My Bookings', icon: History },
    { href: '/admin', label: 'Admin', icon: Settings },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">🏸</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">CourtBook</span>
        </Link>
        
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
