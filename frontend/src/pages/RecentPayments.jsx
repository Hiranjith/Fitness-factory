import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Download, Calendar, ChevronDown, ChevronLeft } from 'lucide-react';
import api from '../api/axios';

const avatarColors = [
  'bg-[#b45309]', 'bg-[#0284c7]', 'bg-[#16a34a]', 'bg-[#9333ea]',
  'bg-[#e11d48]', 'bg-[#d97706]', 'bg-[#65a30d]', 'bg-[#2563eb]',
];
const getAvatarColor = (id) => avatarColors[id.charCodeAt(0) % avatarColors.length];
const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const RecentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [counts, setCounts] = useState({ All: 0, Today: 0, 'This Week': 0, 'This Month': 0 });
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/payments', {
          params: {
            page: currentPage,
            limit: pagination.limit,
            search: debouncedSearch,
            filter: activeFilter
          }
        });
        
        if (res.data.success) {
          const formatted = res.data.data.map(p => ({
            id: p.member.id,
            realPaymentId: p._id,
            name: p.member.name,
            initials: getInitials(p.member.name),
            avatarColor: getAvatarColor(p.member.id),
            plan: p.plan.name,
            amount: `₹${p.amount}`,
            date: formatDate(p.payment_date),
            time: formatTime(p.payment_date)
          }));
          setPayments(formatted);
          setCounts(res.data.counts || { All: 0, Today: 0, 'This Week': 0, 'This Month': 0 });
          setPagination(res.data.pagination || { total: 0, totalPages: 1, limit: 10 });
        }
      } catch (err) {
        console.error('Failed to fetch payments', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [currentPage, debouncedSearch, activeFilter, pagination.limit]);

  const filters = [
    { name: 'All', key: 'All' },
    { name: 'Today', key: 'Today' },
    { name: 'This Week', key: 'This Week' },
    { name: 'This Month', key: 'This Month' },
  ];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(pagination.totalPages, currentPage + 1);
    
    if (currentPage === 1) {
      endPage = Math.min(pagination.totalPages, 3);
    }
    if (currentPage === pagination.totalPages) {
      startPage = Math.max(1, pagination.totalPages - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button 
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
            currentPage === i ? 'bg-[#f97316] text-black font-bold' : 'hover:bg-white/5'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

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
          {filters.map(filter => (
            <button 
              key={filter.name}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeFilter === filter.key 
                  ? 'bg-[#f97316] text-black font-bold' 
                  : 'bg-transparent border border-[#38383a] text-[#98989f] hover:text-white'
              }`}
            >
              {filter.name} ({counts[filter.key] || 0})
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 bg-transparent border border-[#38383a] text-[#98989f] hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Calendar className="w-4 h-4" /> Select Date Range <ChevronDown className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Filters (Mobile) */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
        {filters.map(filter => (
          <button 
            key={filter.name}
            onClick={() => setActiveFilter(filter.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-[13px] font-medium transition-colors ${
              activeFilter === filter.key 
                ? 'bg-[#f97316] text-black font-bold' 
                : 'bg-transparent border border-[#38383a] text-[#98989f] hover:text-white'
            }`}
          >
            {filter.name} ({counts[filter.key] || 0})
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search members..." 
          className="w-full bg-[#1c1c1e] border border-[#38383a] text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#f97316]/50 transition-colors text-[14px] placeholder:text-[#6a6a6e]"
        />
      </div>

      {/* Mobile View: Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {isLoading ? (
          <div className="text-center py-10 text-[#98989f]">Loading...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-10 text-[#98989f]">No payments found</div>
        ) : (
          payments.map((member) => (
            <Link to={`/member/${member.id}`} key={member.realPaymentId} className="block group">
              <div className="bg-[#1c1c1e] border border-[#38383a] rounded-[20px] p-4 flex items-center justify-between group-hover:border-[#f97316]/50 transition-colors">
                
                {/* Left Side */}
                <div className="flex items-center gap-4">
                  <div className="w-[46px] h-[46px] rounded-full border border-[#f97316]/30 bg-[#f97316]/10 flex items-center justify-center font-bold text-white text-[18px] flex-shrink-0">
                    {member.initials}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-white text-[16px] leading-tight">{member.name}</p>
                    <div className="flex items-center gap-1.5 text-[#98989f] text-[13px]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{member.plan} &bull; {member.date}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center">
                  <div className="bg-[#16a34a]/10 border border-[#16a34a]/30 px-3 py-1.5 rounded-xl">
                    <span className="text-[#22c55e] font-bold text-[14px] tracking-wide">
                      {member.amount}
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          ))
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-[#1c1c1e] border border-[#38383a] rounded-2xl overflow-hidden mt-2">
        {/* Desktop Search Bar */}
        <div className="p-4 border-b border-[#38383a]">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#98989f]" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..." 
              className="w-full bg-black/20 border border-[#38383a] text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#f97316]/50 transition-colors text-[14px] placeholder:text-[#6a6a6e]"
            />
          </div>
        </div>

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
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-[#98989f]">Loading...</td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-[#98989f]">No payments found</td>
              </tr>
            ) : (
              payments.map((member) => (
                <tr key={member.realPaymentId} className="hover:bg-white/5 transition-colors group">
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
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        {!isLoading && payments.length > 0 && (
          <div className="py-4 px-6 border-t border-[#38383a] flex items-center justify-between text-[13px] text-[#98989f]">
            <div>
              Showing {(currentPage - 1) * pagination.limit + 1} – {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} payments
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {renderPaginationButtons()}
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default RecentPayments;
