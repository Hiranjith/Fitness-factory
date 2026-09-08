import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, Dumbbell, ChevronLeft, MoreVertical } from 'lucide-react';

const TopBar = () => {
  const location = useLocation();
  const isMemberDetails = location.pathname.startsWith('/member/');
  const isPaymentsView = location.pathname.endsWith('/payments');
  const backUrl = isPaymentsView ? location.pathname.replace('/payments', '') : '/';

  return (
    <header className="flex items-center justify-between py-4 px-4 md:py-6 md:px-8 bg-bg md:bg-transparent sticky top-0 z-40">
      
      {/* Mobile Top Bar */}
      {isMemberDetails ? (
        <div className="md:hidden flex items-center justify-between w-full">
          <Link to={backUrl} className="text-text-primary p-2 -ml-2">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <img src="/home/app-name.png" alt="Fitness Factory" className="h-8 w-auto object-contain" />
          {isPaymentsView ? (
            <div className="w-10"></div>
          ) : (
            <button className="text-text-primary p-2 -mr-2">
              <MoreVertical className="w-6 h-6" />
            </button>
          )}
        </div>
      ) : (
        <Link to="/" className="md:hidden flex items-center">
          <img src="/home/app-name.png" alt="Fitness Factory" className="h-12 w-auto object-contain" />
        </Link>
      )}

      {/* Search - Hidden on small mobile, visible on tablet+ */}
      <div className="hidden sm:flex items-center bg-surface rounded-full px-4 py-2 w-96 border border-border">
        <Search className="w-4 h-4 text-text-secondary mr-2" />
        <input 
          type="text" 
          placeholder="Search clients..." 
          className="bg-transparent border-none outline-none text-text-primary text-sm w-full placeholder-text-secondary"
        />
      </div>

      {/* Right Actions */}
      <div className={`flex items-center gap-6 ml-auto ${isMemberDetails ? 'hidden md:flex' : ''}`}>
        {/* Notification */}
        <button className="relative text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-bg"></span>
        </button>

        {/* Profile */}
        <button className="hidden md:flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#B45309] text-white flex items-center justify-center font-semibold text-sm">
            A
          </div>
          <span className="font-medium text-sm">Admin</span>
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
