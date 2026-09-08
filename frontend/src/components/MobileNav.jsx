import React from 'react';
import { Home, Users, CreditCard, Calendar, Menu } from 'lucide-react';

const mobileNavItems = [
  { name: 'Home', icon: Home, active: true },
  { name: 'Clients', icon: Users, active: false },
  { name: 'Payments', icon: CreditCard, active: false },
  { name: 'Plans', icon: Calendar, active: false },
  { name: 'More', icon: Menu, active: false },
];

const MobileNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-6 py-3 z-50 flex justify-between items-center pb-safe">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href="#"
            className={`flex flex-col items-center gap-1 ${
              item.active ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </a>
        );
      })}
    </div>
  );
};

export default MobileNav;
