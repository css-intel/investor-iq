import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Building2, Calculator, Bell, Settings, Users, FileText,
  TrendingUp, Menu, X, Search, Plus, LogOut, User, ChevronDown,
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Deals', href: '/deals', icon: Building2 },
  { name: 'Underwriting', href: '/underwriting', icon: Calculator },
  { name: 'Market Data', href: '/market', icon: TrendingUp },
  { name: 'Lenders', href: '/lenders', icon: Users },
  { name: 'Reports', href: '/reports', icon: FileText },
];

const secondaryNav = [
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={cn('fixed left-0 top-0 z-50 h-full w-64 transform bg-card border-r transition-transform duration-300 lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">IQ</div>
              <span className="text-xl font-bold">Investor IQ</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            <Link to="/deals/new"><Button className="w-full" size="lg"><Plus className="mr-2 h-4 w-4" />New Deal</Button></Link>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            <div className="pb-2"><p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main Menu</p></div>
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className={cn('flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors', pathname === item.href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                <item.icon className="mr-3 h-5 w-5" />{item.name}
              </Link>
            ))}
            <div className="pt-6 pb-2"><p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p></div>
            {secondaryNav.map((item) => (
              <Link key={item.name} to={item.href} className={cn('flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors', pathname === item.href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                <item.icon className="mr-3 h-5 w-5" />{item.name}
              </Link>
            ))}
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">JD</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@investoriq.com</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground"><LogOut className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground"><Menu className="h-6 w-6" /></button>
          <div className="flex-1 flex items-center max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="search" placeholder="Search deals, addresses..." className="w-full h-10 pl-10 pr-4 rounded-lg border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"><Bell className="h-5 w-5" /><span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" /></button>
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">JD</div>
                <ChevronDown className="h-4 w-4" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 z-50 rounded-lg border bg-card shadow-lg">
                    <div className="p-2">
                      <div className="px-2 py-1.5 text-sm font-medium">John Doe</div>
                      <div className="px-2 py-1 text-xs text-muted-foreground">john@investoriq.com</div>
                    </div>
                    <div className="border-t">
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-muted" onClick={() => setUserMenuOpen(false)}><User className="mr-2 h-4 w-4" />Profile</Link>
                      <Link to="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-muted" onClick={() => setUserMenuOpen(false)}><Settings className="mr-2 h-4 w-4" />Settings</Link>
                    </div>
                    <div className="border-t">
                      <button className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-muted"><LogOut className="mr-2 h-4 w-4" />Sign out</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
