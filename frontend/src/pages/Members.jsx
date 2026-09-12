import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Download, RefreshCw, X, ChevronLeft, ChevronRight, Calendar, Eye, Edit, Trash2, UserPlus } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AddMemberModal from '../components/AddMemberModal';

const membersData = [
  { id: '001', name: 'Rahul Kumar', phone: '+91 98765 43210', plan: 'Monthly', amount: '₹1,000', nextDueDate: '5 Sep 2026', status: 'Active' },
  { id: '014', name: 'Arun Kumar', phone: '+91 87654 32109', plan: '3 Months', amount: '₹2,500', nextDueDate: '12 Sep 2026', status: 'Due Soon' },
  { id: '021', name: 'Sneha P', phone: '+91 76543 21098', plan: 'Monthly', amount: '₹1,000', nextDueDate: '1 Sep 2026', status: 'Overdue' },
  { id: '027', name: 'Vishnu Raj', phone: '+91 65432 10987', plan: '6 Months', amount: '₹5,000', nextDueDate: '15 Sep 2026', status: 'Active' },
  { id: '032', name: 'Manoj T', phone: '+91 98701 23456', plan: 'Monthly', amount: '₹1,000', nextDueDate: '10 Sep 2026', status: 'Due Soon' },
  { id: '036', name: 'Divya S', phone: '+91 89876 54321', plan: 'Quarterly', amount: '₹3,000', nextDueDate: '20 Sep 2026', status: 'Active' },
  { id: '041', name: 'Kiran Nair', phone: '+91 87650 12345', plan: 'Monthly', amount: '₹1,000', nextDueDate: '22 Sep 2026', status: 'Active' },
  { id: '048', name: 'Pranav K', phone: '+91 76501 23456', plan: '1 Year', amount: '₹8,000', nextDueDate: '4 Sep 2026', status: 'Overdue' },
  { id: '053', name: 'Neha Raj', phone: '+91 65401 23456', plan: '3 Months', amount: '₹2,500', nextDueDate: '25 Sep 2026', status: 'Active' },
  { id: '058', name: 'Sagar P', phone: '+91 91234 56789', plan: 'Monthly', amount: '₹1,000', nextDueDate: '28 Sep 2026', status: 'Due Soon' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'bg-success/20 text-success';
    case 'Due Soon': return 'bg-warning/20 text-warning';
    case 'Overdue': return 'bg-danger/20 text-danger';
    default: return 'bg-gray-500/20 text-gray-500';
  }
};

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const Members = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'All';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const filteredMembers = membersData.filter(member => {
    if (activeTab === 'All') return true;
    return member.status === activeTab;
  });

  const counts = {
    'All': membersData.length,
    'Active': membersData.filter(m => m.status === 'Active').length,
    'Due Soon': membersData.filter(m => m.status === 'Due Soon').length,
    'Overdue': membersData.filter(m => m.status === 'Overdue').length,
  };
  const [isMobileMoreMenuOpen, setIsMobileMoreMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [exportOption, setExportOption] = useState('All Members');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPlan, setFilterPlan] = useState('All Plans');
  const [filterDate, setFilterDate] = useState('All');

  useEffect(() => {
    const handleMoreMenuToggle = () => {
      setIsMobileMoreMenuOpen(prev => !prev);
    };
    window.addEventListener('toggle-members-more-menu', handleMoreMenuToggle);
    return () => {
      window.removeEventListener('toggle-members-more-menu', handleMoreMenuToggle);
    };
  }, []);

  // Prevent background scroll when modals are open
  useEffect(() => {
    if (isExportModalOpen || isFilterModalOpen || isMobileMoreMenuOpen || isAddMemberModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isExportModalOpen, isFilterModalOpen, isMobileMoreMenuOpen, isAddMemberModalOpen]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header section */}
      <div className="hidden md:flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Members</h1>
        </div>
        <div className="flex gap-4">
          <button 
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center transition-colors"
            onClick={() => setIsAddMemberModalOpen(true)}
          >
            + Register New Member
          </button>
          <div className="relative">
            <button 
              onClick={() => setIsExportModalOpen(!isExportModalOpen)}
              className="border border-border bg-surface hover:bg-surface/80 text-text-primary font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            {/* Desktop Export Dropdown */}
            {isExportModalOpen && (
              <>
                <div className="hidden md:block fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all" onClick={() => setIsExportModalOpen(false)}></div>
                <div className="hidden md:block absolute top-12 right-0 z-50 w-64 bg-[#1e1e1e] border border-border rounded-xl shadow-xl p-4">
                  <p className="text-text-secondary text-xs mb-3 font-medium uppercase tracking-wider">Export Members</p>
                  <div className="flex flex-col gap-2 mb-4">
                    {[
                      { id: 'All Members', label: 'All Members' },
                      { id: 'Active Members', label: 'Active Members' },
                      { id: 'Due Soon', label: 'Due Soon' },
                      { id: 'Overdue', label: 'Overdue' }
                    ].map((option) => (
                      <label key={option.id} className="flex items-center gap-3 cursor-pointer p-1">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${exportOption === option.id ? 'border-primary' : 'border-border'}`}>
                          {exportOption === option.id && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                        <input 
                          type="radio" 
                          name="desktopExportOption" 
                          value={option.id} 
                          checked={exportOption === option.id}
                          onChange={(e) => setExportOption(e.target.value)}
                          className="hidden"
                        />
                        <span className="text-text-primary text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  <button 
                    onClick={() => setIsExportModalOpen(false)}
                    className="w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Export
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Title */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Members</h1>
        <button 
          onClick={() => setIsAddMemberModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors"
        >
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Search and Filters - Mobile order vs Desktop order */}
      {/* Mobile search bar */}
      <div className="md:hidden flex items-center bg-surface rounded-lg px-4 py-3 w-full border border-border mb-4">
        <Search className="w-5 h-5 text-text-secondary mr-2" />
        <input 
          type="text" 
          placeholder="Search members..." 
          className="bg-transparent border-none outline-none text-text-primary w-full placeholder-text-secondary"
        />
        <button className="text-text-secondary ml-2 p-1" onClick={() => setIsFilterModalOpen(true)}>
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Search and Filters row */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            onClick={() => { setActiveTab('All'); navigate('/members?tab=All', { replace: true }); }}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'All' ? 'bg-primary text-white' : 'bg-surface text-text-secondary border border-border'}`}
          >
            All ({counts['All']})
          </button>
          <button 
            onClick={() => { setActiveTab('Active'); navigate('/members?tab=Active', { replace: true }); }}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'Active' ? 'bg-primary text-white' : 'bg-surface text-text-secondary border border-border'}`}
          >
            Active ({counts['Active']})
          </button>
          <button 
            onClick={() => { setActiveTab('Due Soon'); navigate('/members?tab=Due Soon', { replace: true }); }}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'Due Soon' ? 'bg-primary text-white' : 'bg-surface text-text-secondary border border-border'}`}
          >
            Due Soon ({counts['Due Soon']})
          </button>
          <button 
            onClick={() => { setActiveTab('Overdue'); navigate('/members?tab=Overdue', { replace: true }); }}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'Overdue' ? 'bg-primary text-white' : 'bg-surface text-text-secondary border border-border'}`}
          >
            Overdue ({counts['Overdue']})
          </button>
        </div>

        {/* Desktop search bar */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center bg-surface rounded-lg px-4 py-2 w-64 border border-border">
            <Search className="w-4 h-4 text-text-secondary mr-2" />
            <input 
              type="text" 
              placeholder="Search members..." 
              className="bg-transparent border-none outline-none text-text-primary text-sm w-full placeholder-text-secondary"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
              className="border border-border bg-surface hover:bg-surface/80 text-text-primary font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Filter className="w-4 h-4" /> Filter
            </button>
            {/* Desktop Filter Dropdown */}
            {isFilterModalOpen && (
              <>
                <div className="hidden md:block fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all" onClick={() => setIsFilterModalOpen(false)}></div>
                <div className="hidden md:block absolute top-12 right-0 z-50 w-[360px] bg-[#1e1e1e] border border-border rounded-xl shadow-xl p-5">
                   <div className="flex justify-between items-center mb-5">
                     <h2 className="text-lg font-bold text-white">Filter Members</h2>
                     <button onClick={() => setIsFilterModalOpen(false)} className="text-text-secondary hover:text-white">
                       <X className="w-5 h-5" />
                     </button>
                   </div>
                   
                   {/* Membership Plan */}
                   <div className="mb-5">
                     <p className="text-white font-medium mb-3 text-sm">Membership Plan</p>
                     <div className="flex flex-wrap gap-2">
                       {['All Plans', 'Monthly', '3 Months', '6 Months', '1 Year'].map(plan => (
                         <button 
                           key={plan}
                           onClick={() => setFilterPlan(plan)}
                           className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${filterPlan === plan ? 'bg-primary border-primary text-white font-medium' : 'bg-transparent border-border text-text-secondary hover:text-text-primary'}`}
                         >
                           {plan}
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Due Date */}
                   <div className="mb-6">
                     <p className="text-white font-medium mb-3 text-sm">Due Date</p>
                     <div className="flex flex-wrap gap-2">
                       {['All', 'Next 7 Days', 'Next 30 Days'].map(date => (
                         <button 
                           key={date}
                           onClick={() => setFilterDate(date)}
                           className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${filterDate === date ? 'bg-primary border-primary text-white font-medium' : 'bg-transparent border-border text-text-secondary hover:text-text-primary'}`}
                         >
                           {date}
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Actions */}
                   <div className="flex gap-3">
                     <button 
                       onClick={() => {
                         setFilterStatus('All');
                         setFilterPlan('All Plans');
                         setFilterDate('All');
                       }}
                       className="flex-1 py-2.5 px-4 border border-border rounded-xl text-text-primary font-medium hover:bg-white/5 transition-colors text-sm"
                     >
                       Clear Filters
                     </button>
                     <button 
                       onClick={() => setIsFilterModalOpen(false)}
                       className="flex-1 py-2.5 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors text-sm"
                     >
                       Apply Filters
                     </button>
                   </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-surface border border-border rounded-xl mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-text-secondary text-sm">
              <th className="py-4 px-6 font-medium whitespace-nowrap">Serial Number</th>
              <th className="py-4 px-4 font-medium">Name</th>
              <th className="py-4 px-4 font-medium">Phone</th>
              <th className="py-4 px-4 font-medium">Plan</th>
              <th className="py-4 px-4 font-medium">Amount</th>
              <th className="py-4 px-4 font-medium">Next Due Date</th>
              <th className="py-4 px-4 font-medium">Status</th>
              <th className="py-4 px-4 font-medium w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member, index) => (
              <tr 
                key={member.id} 
                className="border-b border-border hover:bg-white/5 transition-colors text-sm cursor-pointer"
                onClick={() => navigate(`/member/${member.id}`)}
              >
                <td className="py-4 px-6 text-text-secondary">{String(index + 1).padStart(3, '0')}</td>
                <td className="py-4 px-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#B45309] bg-[#1A0F00] shadow-sm flex items-center justify-center font-bold text-white text-xs">
                    {getInitials(member.name)}
                  </div>
                  <span className="font-medium text-text-primary">{member.name}</span>
                </td>
                <td className="py-4 px-4 text-text-secondary">{member.phone}</td>
                <td className="py-4 px-4 text-text-secondary">{member.plan}</td>
                <td className="py-4 px-4 text-text-secondary">{member.amount}</td>
                <td className="py-4 px-4 text-text-secondary">{member.nextDueDate}</td>
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </td>
                <td className="py-4 px-4 relative" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => setOpenDropdownId(openDropdownId === member.id ? null : member.id)}
                    className="text-text-secondary hover:text-text-primary p-1"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {openDropdownId === member.id && (
                    <>
                      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all" onClick={() => setOpenDropdownId(null)}></div>
                      <div className="absolute right-8 top-10 z-50 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl w-36 p-1.5 flex flex-col gap-0.5 overflow-hidden">
                        <button 
                          onClick={() => { setOpenDropdownId(null); navigate(`/member/${member.id}`); }} 
                          className="flex items-center px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-left"
                        >
                          <Eye className="w-4 h-4 mr-3" /> View
                        </button>
                        <button 
                          onClick={() => setOpenDropdownId(null)} 
                          className="flex items-center px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-left"
                        >
                          <Edit className="w-4 h-4 mr-3" /> Edit
                        </button>
                        <div className="h-px bg-white/5 my-1 mx-2"></div>
                        <button 
                          onClick={() => setOpenDropdownId(null)} 
                          className="flex items-center px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors text-left"
                        >
                          <Trash2 className="w-4 h-4 mr-3" /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Desktop */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <span className="text-sm text-text-secondary">Showing 1 – {filteredMembers.length} of {filteredMembers.length} members</span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-medium text-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary text-sm">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary text-sm">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cards List */}
      <div className="md:hidden flex flex-col gap-3">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#B45309] bg-[#1A0F00] shadow-sm flex items-center justify-center font-bold text-white text-xl tracking-wide">
                {getInitials(member.name)}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-text-primary text-base">{member.name}</span>
                <span className="text-text-secondary text-sm">#{member.id}</span>
                <span className="text-text-secondary text-sm">{member.plan} Plan</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium mb-1 ${getStatusColor(member.status)}`}>
                {member.status}
              </span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-base">{member.amount}</span>
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </div>
              <div className="flex items-center gap-1 text-text-secondary text-xs mt-1">
                <Calendar className="w-3 h-3" />
                <span>{member.nextDueDate}</span>
              </div>
            </div>
            
            <Link to={`/member/${member.id}`} className="absolute inset-0 z-10">
              <span className="sr-only">View {member.name}</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Mobile More Options Dropdown/Modal */}
      {isMobileMoreMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm transition-all"
            onClick={() => setIsMobileMoreMenuOpen(false)}
          ></div>
          <div className="absolute top-0 right-4 z-[100] bg-[#1e1e1e] border border-primary rounded-xl shadow-lg w-56 p-2 flex flex-col gap-1 overflow-hidden" style={{marginTop: '-2rem'}}>
            <button 
              className="flex items-center gap-3 px-3 py-3 text-sm text-text-primary hover:bg-white/5 rounded-lg w-full text-left"
              onClick={() => {
                setIsMobileMoreMenuOpen(false);
                setIsExportModalOpen(true);
              }}
            >
              <Download className="w-4 h-4" /> Export Members
            </button>
            <div className="h-px bg-border my-1"></div>
            <button 
              className="flex items-center gap-3 px-3 py-3 text-sm text-text-primary hover:bg-white/5 rounded-lg w-full text-left"
              onClick={() => {
                setIsMobileMoreMenuOpen(false);
                // Handle refresh action if needed
              }}
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </>
      )}

      {/* Export Members Modal */}
      {isExportModalOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsExportModalOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-[#1e1e1e] border border-border rounded-2xl p-6 max-h-[85vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Export Members</h2>
              <button onClick={() => setIsExportModalOpen(false)} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-text-secondary text-sm mb-4">What would you like to export?</p>
            
            <div className="flex flex-col gap-3 mb-8">
              {[
                { id: 'All Members', label: 'All Members' },
                { id: 'Active Members', label: 'Active Members' },
                { id: 'Due Soon', label: 'Due Soon' },
                { id: 'Overdue', label: 'Overdue' }
              ].map((option) => (
                <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${exportOption === option.id ? 'border-primary' : 'border-border'}`}>
                    {exportOption === option.id && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                  </div>
                  <input 
                    type="radio" 
                    name="exportOption" 
                    value={option.id} 
                    checked={exportOption === option.id}
                    onChange={(e) => setExportOption(e.target.value)}
                    className="hidden"
                  />
                  <span className="text-text-primary text-sm">{option.label}</span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="flex-1 py-3 px-4 border border-border rounded-xl text-text-primary font-medium hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Handle export
                  setIsExportModalOpen(false);
                }}
                className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Filter Modal */}
      {isFilterModalOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterModalOpen(false)}></div>
          <div className="relative w-full bg-[#1e1e1e] border-t border-border rounded-t-3xl max-h-[85vh] flex flex-col">
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-12 h-1 bg-white/20 rounded-full"></div>
            </div>
            
            <div className="px-5 pb-8 overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-center mb-6 mt-2">
                <h2 className="text-xl font-bold text-white">Filter Members</h2>
                <button onClick={() => setIsFilterModalOpen(false)} className="text-text-secondary hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
               <div className="mb-6">
                 <p className="text-white font-medium mb-3">Membership Plan</p>
                 <div className="flex flex-wrap gap-3">
                   {['All Plans', 'Monthly', '3 Months', '6 Months', '1 Year'].map(plan => (
                     <button 
                       key={plan}
                       onClick={() => setFilterPlan(plan)}
                       className={`px-4 py-2 text-sm rounded-full border transition-colors ${filterPlan === plan ? 'bg-primary border-primary text-white font-medium' : 'bg-transparent border-border text-text-secondary hover:text-text-primary'}`}
                     >
                       {plan}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="mb-8">
                 <p className="text-white font-medium mb-3">Due Date</p>
                 <div className="flex flex-wrap gap-3">
                   {['All', 'Next 7 Days', 'Next 30 Days'].map(date => (
                     <button 
                       key={date}
                       onClick={() => setFilterDate(date)}
                       className={`px-4 py-2 text-sm rounded-full border transition-colors ${filterDate === date ? 'bg-primary border-primary text-white font-medium' : 'bg-transparent border-border text-text-secondary hover:text-text-primary'}`}
                     >
                       {date}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="flex gap-4">
                 <button 
                   onClick={() => {
                     setFilterStatus('All');
                     setFilterPlan('All Plans');
                     setFilterDate('All');
                   }}
                   className="flex-1 py-3 px-4 border border-border rounded-xl text-text-primary font-medium hover:bg-white/5 transition-colors"
                 >
                   Clear Filters
                 </button>
                 <button 
                   onClick={() => setIsFilterModalOpen(false)}
                   className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors"
                 >
                   Apply Filters
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      <AddMemberModal 
        isOpen={isAddMemberModalOpen} 
        onClose={() => setIsAddMemberModalOpen(false)} 
      />
    </div>
  );
};

export default Members;
