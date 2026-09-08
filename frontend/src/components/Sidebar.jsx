import React from 'react';
import { Home, Users, CreditCard, Calendar, Bell, BarChart2, Settings, Dumbbell } from 'lucide-react';

const navItems = [
  { name: 'Home', icon: Home, active: true },
  { name: 'Clients', icon: Users, active: false },
  { name: 'Payments', icon: CreditCard, active: false },
  { name: 'Plans', icon: Calendar, active: false },
  { name: 'Reminders', icon: Bell, active: false },
  { name: 'Reports', icon: BarChart2, active: false },
  { name: 'Settings', icon: Settings, active: false },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-bg border-r border-border p-6 fixed top-0 left-0 z-10">
      {/* Logo */}
      <div className="mb-12">
        <img src="/home/app-name.png" alt="Fitness Factory" className="h-12 w-auto object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href="#"
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                item.active 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </a>
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
