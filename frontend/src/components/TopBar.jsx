import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Dumbbell, ChevronLeft, MoreVertical } from 'lucide-react';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMemberDetails = location.pathname.startsWith('/member/');
  const isPaymentsView = location.pathname.endsWith('/payments');
  const isUpcomingPayments = location.pathname === '/upcoming-payments';
  const isRecentPayments = location.pathname === '/recent-payments';
  
  const isMembers = location.pathname === '/members';
  
  const showMobileBack = isMemberDetails || isUpcomingPayments || isRecentPayments || isMembers;

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      // Fallback if accessed directly
      if (isMemberDetails && isPaymentsView) navigate(location.pathname.replace('/payments', ''));
      else if (isMemberDetails) navigate('/members');
      else navigate('/');
    }
  };


  return (
    <header 
      className="fixed top-0 left-0 w-full flex items-center justify-between h-[72px] px-4 md:px-6 border-b border-[#262626] z-40"
      style={{
        backgroundImage: `url('/home/header-background.png')`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
      }}
    >
      
      {/* Center Logo (All screens) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center pointer-events-none z-0">
        <Link to="/" className="pointer-events-auto flex items-center h-full">
          <img src="/home/ff.png" alt="FF Logo" className="h-[52px] md:h-[60px] w-auto object-contain" />
        </Link>
      </div>

      {/* Mobile Top Bar */}
      {showMobileBack ? (
        <div className="md:hidden flex items-center justify-between w-full">
          <div className="flex items-center">
            <button onClick={handleBack} className="text-text-primary p-2 -ml-2 relative z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <img src="/home/navbar-logo.png" alt="Navbar Logo" className="h-[52px] w-auto object-contain ml-1" />
          </div>
          
          {isPaymentsView || isUpcomingPayments || isRecentPayments ? (
            <div className="w-10"></div>
          ) : isMembers ? (
            <div className="relative">
              <button 
                className="text-text-primary p-2 -mr-2"
                onClick={() => {
                  const event = new CustomEvent('toggle-members-more-menu');
                  window.dispatchEvent(event);
                }}
              >
                <MoreVertical className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <button className="text-text-primary p-2 -mr-2">
              <MoreVertical className="w-6 h-6" />
            </button>
          )}
        </div>
      ) : (
        <Link to="/" className="md:hidden flex items-center">
          <img src="/home/navbar-logo.png" alt="Navbar Logo" className="h-[52px] w-auto object-contain" />
        </Link>
      )}

      {/* Desktop Logo */}
      <Link to="/" className="hidden md:flex items-center h-[72px]">
        <img src="/home/navbar-logo.png" alt="Navbar Logo" className="h-[60px] w-auto object-contain" />
      </Link>



      {/* Right Actions */}
      <div className={`flex items-center gap-5 ml-auto ${showMobileBack ? 'hidden md:flex' : ''}`}>
        {/* Notification */}
        <button className="relative w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
          <Bell className="w-[22px] h-[22px] text-text-secondary" />
          <span className="absolute top-[8px] right-[9px] w-[7px] h-[7px] bg-primary rounded-full"></span>
        </button>

        {/* Profile */}
        <button className="hidden md:flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#B45309] text-white flex items-center justify-center font-semibold text-sm">
            H
          </div>
          <span className="font-medium text-sm">Hari</span>
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
