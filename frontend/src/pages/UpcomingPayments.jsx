import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Download, CreditCard, Clock, Loader2 } from 'lucide-react';
import api from '../api/axios';

const Badge = ({ status }) => {
  if (status === 'Due Soon') return (
    <div className="px-3 py-1 rounded-full border border-primary text-primary text-xs font-bold flex items-center gap-1 bg-transparent">
      <Clock className="w-3.5 h-3.5" /> Due Soon
    </div>
  );
  if (status === 'Overdue') return (
    <div className="px-3 py-1 rounded-full border border-red-500 text-red-500 text-xs font-bold flex items-center gap-1 bg-transparent">
      <Clock className="w-3.5 h-3.5" /> Overdue
    </div>
  );
  return (
    <div className="px-3 py-1 rounded-full border border-green-500 text-green-500 text-xs font-bold flex items-center gap-1 bg-transparent">
      Active
    </div>
  );
};

const UpcomingPayments = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [payments, setPayments] = useState([]);
  const [counts, setCounts] = useState({ All: 0, Tomorrow: 0, 'Next 7 Days': 0, Overdue: 0 });
  
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const limit = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  const fetchUpcomingPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/payments/upcoming', {
        params: {
          page,
          limit,
          search: debouncedSearch,
          filter: activeFilter
        }
      });
      
      setPayments(res.data.data);
      if (res.data.counts) {
        setCounts(res.data.counts);
      }
      if (res.data.pagination) {
        setTotalPages(res.data.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch upcoming payments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, activeFilter]);

  useEffect(() => {
    fetchUpcomingPayments();
  }, [fetchUpcomingPayments]);

  const filters = [
    { name: 'All', count: counts.All || 0 },
    { name: 'Tomorrow', count: counts.Tomorrow || 0 },
    { name: 'Next 7 Days', count: counts['Next 7 Days'] || 0 },
    { name: 'Overdue', count: counts.Overdue || 0 },
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
                ? 'bg-primary text-black font-bold border border-primary' 
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search members..." 
          className="w-full bg-[#1c1c1e] border border-[#38383a] text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary/50 transition-colors text-[14px] placeholder:text-[#6a6a6e]"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : payments.length === 0 ? (
        <div className="flex justify-center py-10 text-[#98989f]">
          No upcoming payments found.
        </div>
      ) : (
        <>
          {/* Mobile View: Cards */}
          <div className="md:hidden flex flex-col gap-3">
            {payments.map((member) => {
              const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              
              return (
              <Link to={`/member/${member.id}`} key={member._id} className="block group">
                <div className="bg-[#1c1c1e] border border-[#38383a] rounded-[20px] p-4 flex justify-between group-hover:border-primary/50 transition-colors">
                  
                  {/* Left Side */}
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full border border-primary bg-transparent flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-white text-[17px] leading-tight">{member.name}</h3>
                      <div className="flex items-center gap-2 text-[#98989f] text-[13px]">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{member.plan}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex flex-col items-end gap-2 justify-center">
                    <span className={`${member.status === 'Overdue' ? 'text-red-500' : 'text-primary'} font-bold text-[14px]`}>
                      {member.dueDate}
                    </span>
                    <Badge status={member.status} />
                  </div>

                </div>
              </Link>
            )})}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block bg-[#1c1c1e] border border-[#38383a] rounded-2xl overflow-hidden mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#38383a]">
                  <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Member</th>
                  <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Plan</th>
                  <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Amount</th>
                  <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Due Date</th>
                  <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 text-[13px] font-semibold text-[#98989f] whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#38383a]">
                {payments.map((member) => {
                  const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  return (
                  <tr key={member._id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-primary bg-transparent flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                          {initials}
                        </div>
                        <span className="font-bold text-white text-[15px]">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[14px] text-[#98989f]">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        {member.plan}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[14px] font-bold text-white">₹{member.amount}</td>
                    <td className="py-4 px-6 text-[14px] font-bold text-[#98989f]">
                      <span className={member.status === 'Overdue' ? 'text-red-500' : 'text-primary'}>{member.dueDate}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={member.status} />
                    </td>
                    <td className="py-4 px-6">
                      <Link to={`/member/${member.id}`}>
                        <button className="flex items-center justify-center gap-1 border border-primary text-primary px-4 py-1.5 rounded-lg text-[13px] font-medium hover:bg-primary/10 transition-colors">
                          View <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-[#38383a] text-white disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-[#98989f] text-sm">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-[#38383a] text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default UpcomingPayments;
