import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import TopBar from './TopBar';
import AddMemberModal from './AddMemberModal';

const Layout = ({ children }) => {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg text-text-primary font-sans">
      <TopBar />
      <Sidebar />
      <div className="flex-1 md:ml-[240px] pt-[72px] flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>
      <MobileNav onOpenAddMember={() => setIsAddMemberModalOpen(true)} />
      
      <AddMemberModal 
        isOpen={isAddMemberModalOpen} 
        onClose={() => setIsAddMemberModalOpen(false)} 
      />
    </div>
  );
};

export default Layout;
