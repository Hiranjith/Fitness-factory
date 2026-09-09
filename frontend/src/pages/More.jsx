import React from 'react';
import { Bell, BarChart2, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const moreOptions = [
  { 
    name: 'Reminders', 
    icon: Bell, 
    path: '/reminders',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/20'
  },
  { 
    name: 'Reports', 
    icon: BarChart2, 
    path: '/reports',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/20'
  },
  { 
    name: 'Settings', 
    icon: Settings, 
    path: '/settings',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/20'
  },
];

const More = () => {
  return (
    <div className="flex flex-col gap-4 mt-2">
      {moreOptions.map((option, index) => {
        const Icon = option.icon;
        return (
          <Link 
            key={index} 
            to={option.path}
            className="flex items-center justify-between p-4 bg-[#1e1e1e] border border-border rounded-xl transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${option.iconBg}`}>
                <Icon className={`w-6 h-6 ${option.iconColor}`} />
              </div>
              <span className="font-bold text-white text-lg">{option.name}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-text-secondary" />
          </Link>
        );
      })}

      <div className="h-px bg-border my-2"></div>

      <button 
        className="flex items-center justify-between p-4 bg-[#2a1313] border border-error/20 rounded-xl transition-colors hover:bg-error/20 w-full"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-error/20">
            <LogOut className="w-6 h-6 text-error" />
          </div>
          <span className="font-bold text-error text-lg">Logout</span>
        </div>
        <ChevronRight className="w-5 h-5 text-error" />
      </button>
    </div>
  );
};

export default More;
