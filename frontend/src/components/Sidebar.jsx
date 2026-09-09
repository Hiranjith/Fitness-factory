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
    <aside className="hidden md:flex flex-col w-64 h-screen bg-bg border-r border-border p-6 fixed top-0 left-0 z-10">
      {/* Logo */}
      <Link to="/" className="mb-12 block">
        <img src="/home/app-name.png" alt="Fitness Factory" className="h-12 w-auto object-contain" />
      </Link>

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

      {/* Bottom Text */}
      <div className="mt-auto pt-8">
        <p className="text-text-secondary font-bold text-sm tracking-widest leading-relaxed">
          STRONG<br />PEOPLE<br />HAPPIER LIVES
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
