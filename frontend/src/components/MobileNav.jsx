import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, UserPlus, Calendar, Menu } from 'lucide-react';

const MobileNav = ({ onOpenAddMember }) => {
  const location = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 bg-[#18181b] rounded-full px-6 py-2.5 z-50 flex justify-between items-center shadow-2xl border border-white/5">
      <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-primary' : 'text-text-secondary'}`}>
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      <Link to="/members" className={`flex flex-col items-center gap-1 ${location.pathname === '/members' ? 'text-primary' : 'text-text-secondary'}`}>
        <Users className="w-6 h-6" />
        <span className="text-[10px] font-medium">Members</span>
      </Link>

      <button 
        onClick={onOpenAddMember}
        className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95 flex-shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
      >
        <UserPlus className="w-6 h-6 ml-1" />
      </button>

      <Link to="/plans" className={`flex flex-col items-center gap-1 ${location.pathname === '/plans' ? 'text-primary' : 'text-text-secondary'}`}>
        <Calendar className="w-6 h-6" />
        <span className="text-[10px] font-medium">Plans</span>
      </Link>

      <Link to="/more" className={`flex flex-col items-center gap-1 ${location.pathname === '/more' ? 'text-primary' : 'text-text-secondary'}`}>
        <Menu className="w-6 h-6" />
        <span className="text-[10px] font-medium">More</span>
      </Link>
    </div>
  );
};

export default MobileNav;
