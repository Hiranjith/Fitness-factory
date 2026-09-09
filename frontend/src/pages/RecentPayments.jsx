import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Download, Calendar, ChevronDown, ChevronLeft } from 'lucide-react';

const mockData = [
  { id: '001', name: 'Rahul Kumar', initials: 'R', avatarColor: 'bg-[#b45309]', plan: 'Monthly', amount: '₹1,000', date: '10 Aug 2026', time: '10:24 AM' },
  { id: '014', name: 'Arun Kumar', initials: 'A', avatarColor: 'bg-[#0284c7]', plan: '3 Months', amount: '₹2,500', date: '08 Aug 2026', time: '06:15 PM' },
  { id: '021', name: 'Sneha P', initials: 'S', avatarColor: 'bg-[#16a34a]', plan: 'Monthly', amount: '₹1,000', date: '07 Aug 2026', time: '04:20 PM' },
  { id: '027', name: 'Vishnu Raj', initials: 'V', avatarColor: 'bg-[#9333ea]', plan: '6 Months', amount: '₹5,000', date: '05 Aug 2026', time: '11:10 AM' },
  { id: '032', name: 'Manoj T', initials: 'M', avatarColor: 'bg-[#e11d48]', plan: 'Monthly', amount: '₹1,000', date: '03 Aug 2026', time: '03:45 PM' },
  { id: '036', name: 'Divya S', initials: 'D', avatarColor: 'bg-[#d97706]', plan: 'Quarterly', amount: '₹3,000', date: '01 Aug 2026', time: '09:30 AM' },
  { id: '041', name: 'Kiran Nair', initials: 'K', avatarColor: 'bg-[#65a30d]', plan: 'Monthly', amount: '₹1,000', date: '30 Jul 2026', time: '05:20 PM' },
  { id: '048', name: 'Pranav K', initials: 'P', avatarColor: 'bg-[#2563eb]', plan: 'Monthly', amount: '₹1,000', date: '28 Jul 2026', time: '01:15 PM' },
  { id: '053', name: 'Neha Raj', initials: 'N', avatarColor: 'bg-[#9333ea]', plan: '3 Months', amount: '₹2,500', date: '26 Jul 2026', time: '11:40 AM' },
  { id: '059', name: 'Sagar P', initials: 'S', avatarColor: 'bg-[#e11d48]', plan: 'Monthly', amount: '₹1,000', date: '24 Jul 2026', time: '06:05 PM' },
];

const RecentPayments = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtersDesktop = [
    { name: 'All' },
    { name: 'Today' },
    { name: 'This Week' },
    { name: 'This Month' },
  ];

  const filtersMobile = [
    { name: 'All', label: 'All (24)' },
    { name: 'Today', label: 'Today (5)' },
    { name: 'This Week', label: 'This Week (12)' },
    { name: 'This Month', label: 'This Month (24)' },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col min-h-screen pb-24 md:pb-8">
      
      {/* Header section */}
      <div className="flex justify-between items-start mb-5 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-white mb-1">Recent Payments</h1>
          <p className="text-[14px] md:text-[15px] text-[#98989f]">All payments received from members.</p>
        </div>
        <button className="hidden md:flex items-center gap-2 bg-[#1c1c1e] border border-[#38383a] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2c2c2e] transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>
        
      {/* Filters (Desktop) */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {filtersDesktop.map(filter => (
            <button 
              key={filter.name}
              onClick={() => setActiveFilter(filter.name)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeFilter === filter.name 
                  ? 'bg-[#f97316] text-black font-bold' 
                  : 'bg-transparent border border-[#38383a] text-[#98989f] hover:text-white'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 bg-transparent border border-[#38383a] text-[#98989f] hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Calendar className="w-4 h-4" /> Select Date Range <ChevronDown className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Filters (Mobile) */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
        {filtersMobile.map(filter => (
          <button 
            key={filter.name}
            onClick={() => setActiveFilter(filter.name)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-[13px] font-medium transition-colors ${
              activeFilter === filter.name 
                ? 'bg-[#f97316] text-black font-bold' 
                : 'bg-transparent border border-[#38383a] text-[#98989f] hover:text-white'
            }`}
          >
            {filter.label}
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
                <span className="text-[#98989f] text-[13px]">{member.date}</span>
                
                <div className="flex items-center text-white font-bold text-[17px] leading-tight mt-2 gap-1.5">
                  {member.amount} <ChevronRight className="w-4 h-4 text-[#98989f]" />
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
              <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Payment Date</th>
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
                  <div className="flex flex-col">
                    <span className="text-white">{member.date}</span>
                    <span className="text-[#98989f] text-[12px] mt-0.5">{member.time}</span>
                  </div>
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
        
        {/* Pagination Footer */}
        <div className="py-4 px-6 border-t border-[#38383a] flex items-center justify-between text-[13px] text-[#98989f]">
          <div>Showing 1 – 10 of 24 payments</div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f97316] text-black font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RecentPayments;
