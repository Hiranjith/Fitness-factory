import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Download } from 'lucide-react';

const mockData = [
  { id: '001', name: 'Rahul Kumar', initials: 'R', avatarColor: 'bg-[#b45309]', plan: 'Monthly', amount: '₹1,000', dueDateText: 'Tomorrow', dueDateSubText: '10 Aug 2026', badgeText: 'Due Tomorrow', badgeType: 'warning' },
  { id: '014', name: 'Arun Kumar', initials: 'A', avatarColor: 'bg-[#0284c7]', plan: '3 Months', amount: '₹2,500', dueDateText: '12 Aug 2026', dueDateSubText: '', badgeText: 'Due in 3 days', badgeType: 'warning' },
  { id: '021', name: 'Sneha P', initials: 'S', avatarColor: 'bg-[#16a34a]', plan: 'Monthly', amount: '₹1,000', dueDateText: '14 Aug 2026', dueDateSubText: '', badgeText: 'Due in 5 days', badgeType: 'warning' },
  { id: '027', name: 'Vishnu Raj', initials: 'V', avatarColor: 'bg-[#9333ea]', plan: '6 Months', amount: '₹5,000', dueDateText: '15 Aug 2026', dueDateSubText: '', badgeText: 'Due in 6 days', badgeType: 'warning' },
  { id: '032', name: 'Manoj T', initials: 'M', avatarColor: 'bg-[#e11d48]', plan: 'Monthly', amount: '₹1,000', dueDateText: '08 Aug 2026', dueDateSubText: '', badgeText: 'Overdue', badgeType: 'danger' },
  { id: '036', name: 'Divya S', initials: 'D', avatarColor: 'bg-[#d97706]', plan: 'Monthly', amount: '₹1,000', dueDateText: '16 Aug 2026', dueDateSubText: '', badgeText: 'Due in 7 days', badgeType: 'warning' },
  { id: '041', name: 'Kiran Nair', initials: 'K', avatarColor: 'bg-[#65a30d]', plan: 'Quarterly', amount: '₹3,000', dueDateText: '17 Aug 2026', dueDateSubText: '', badgeText: 'Due in 7 days', badgeType: 'warning' },
  { id: '048', name: 'Pranav K', initials: 'P', avatarColor: 'bg-[#2563eb]', plan: 'Monthly', amount: '₹1,000', dueDateText: '18 Aug 2026', dueDateSubText: '', badgeText: 'Due in 8 days', badgeType: 'warning' },
];

const Badge = ({ type, text }) => {
  if (type === 'warning') return (
    <div className="px-2.5 py-1 rounded-full bg-[#f97316]/10 text-[#f97316] text-[11px] font-medium border border-[#f97316]/20 inline-block whitespace-nowrap">
      {text}
    </div>
  );
  if (type === 'danger') return (
    <div className="px-2.5 py-1 rounded-full bg-[#e11d48] text-white text-[11px] font-medium inline-block whitespace-nowrap">
      {text}
    </div>
  );
  return null;
};

const UpcomingPayments = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    { name: 'All', count: 8 },
    { name: 'Tomorrow', count: 3 },
    { name: 'Next 7 Days', count: 5 },
    { name: 'Overdue', count: 1 },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col min-h-screen pb-24 md:pb-8">
      
      {/* Header section */}
      <div className="flex justify-between items-start mb-5 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-white mb-1">Upcoming Payments</h1>
          <p className="text-[14px] md:text-[15px] text-[#98989f]">Members with payments due soon.</p>
        </div>
        <button className="hidden md:flex items-center gap-2 bg-[#1c1c1e] border border-[#38383a] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2c2c2e] transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>
        
      {/* Filters */}
      <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 mb-4 hide-scrollbar">
        {filters.map(filter => (
          <button 
            key={filter.name}
            onClick={() => setActiveFilter(filter.name)}
            className={`whitespace-nowrap px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-[13px] md:text-sm font-medium transition-colors ${
              activeFilter === filter.name 
                ? 'bg-[#f97316] text-black font-bold' 
                : 'bg-transparent border border-[#38383a] text-[#98989f] hover:text-white'
            }`}
          >
            {filter.name} ({filter.count})
          </button>
        ))}
      </div>

      {/* Mobile Search Bar */}
      <div className="relative w-full mb-5 md:hidden">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[#98989f]" />
        </div>
        <input 
          type="text" 
          placeholder="Search members..." 
          className="w-full bg-[#1c1c1e] border border-[#38383a] text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#f97316]/50 transition-colors text-[14px] placeholder:text-[#6a6a6e]"
        />
      </div>

      {/* Mobile View: Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {mockData.map((member) => (
          <Link to={`/member/${member.id}`} key={member.id} className="block group">
            <div className="bg-[#1c1c1e] border border-[#38383a] rounded-[20px] p-4 flex justify-between group-hover:border-[#f97316]/50 transition-colors">
              
              {/* Left Side */}
              <div className="flex gap-3">
                <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center font-semibold text-white text-[17px] flex-shrink-0 ${member.avatarColor}`}>
                  {member.initials}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-white text-[15px] leading-tight">{member.name}</h3>
                  <span className="text-[#98989f] text-[13px] mt-0.5">#{member.id}</span>
                  <span className="text-[#98989f] text-[13px] mt-0.5">{member.plan} {member.plan.includes('Plan') ? '' : 'Plan'}</span>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col items-end justify-between">
                <Badge type={member.badgeType} text={member.badgeText} />
                
                <div className="flex flex-col items-end mt-2">
                  <span className="text-white font-bold text-[17px] leading-tight">{member.amount}</span>
                  <span className="text-[#98989f] text-[12px] mt-0.5">
                    {member.dueDateText === 'Tomorrow' ? member.dueDateSubText : member.dueDateText}
                  </span>
                </div>

                <div className="flex items-center text-[#f97316] text-[13px] font-bold mt-2 gap-0.5">
                  View <ChevronRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-[#1c1c1e] border border-[#38383a] rounded-2xl overflow-hidden mt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#38383a]">
              <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">#</th>
              <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Member</th>
              <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Plan</th>
              <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Amount</th>
              <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Due Date</th>
              <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Status</th>
              <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#38383a]">
            {mockData.map((member) => (
              <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-4 px-6 text-[14px] text-[#98989f]">{member.id}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-white text-xs ${member.avatarColor}`}>
                      {member.initials}
                    </div>
                    <span className="font-medium text-white text-[14px]">{member.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-[14px] text-[#98989f]">{member.plan}</td>
                <td className="py-4 px-6 text-[14px] font-medium text-white">{member.amount}</td>
                <td className="py-4 px-6 text-[14px] text-[#98989f]">
                  {member.dueDateText === 'Tomorrow' ? (
                    <div className="flex flex-col">
                      <span className="text-white">Tomorrow</span>
                      <span className="text-[#98989f] text-[12px]">({member.dueDateSubText})</span>
                    </div>
                  ) : (
                    <span>{member.dueDateText}</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <Badge type={member.badgeType} text={member.badgeText} />
                </td>
                <td className="py-4 px-6">
                  <Link to={`/member/${member.id}`}>
                    <button className="flex items-center justify-center gap-1 border border-[#f97316] text-[#f97316] px-4 py-1.5 rounded-lg text-[13px] font-medium hover:bg-[#f97316]/10 transition-colors">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="py-4 px-6 border-t border-[#38383a] text-[13px] text-[#98989f]">
          Showing 1 – {mockData.length} of {mockData.length} members
        </div>
      </div>

    </div>
  );
};

export default UpcomingPayments;
