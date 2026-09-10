import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, CreditCard, Calendar, Bell, BarChart2, Settings, Dumbbell } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Members', path: '/members', icon: Users },
  { name: 'Payments', path: '/payments', icon: CreditCard },
  { name: 'Plans', path: '/plans', icon: Calendar },
  { name: 'Reminders', path: '/reminders', icon: Bell },
  { name: 'Reports', path: '/reports', icon: BarChart2 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="hidden md:flex flex-col w-[240px] h-[calc(100vh-72px)] bg-bg border-r border-border p-6 fixed top-[72px] left-0 z-10">

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/payments' && location.pathname.includes('/payments'));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
