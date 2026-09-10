import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, Calendar, Edit2, Clock, Users, FileText, Trash2, Power, Search, MoreVertical, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const planMembers = [
  { id: '001', name: 'Rahul Kumar', phone: '+91 98765 43210', joinDate: '5 Aug 2026', nextDueDate: '5 Sep 2026', status: 'Active' },
  { id: '014', name: 'Arun Kumar', phone: '+91 87654 32109', joinDate: '12 Jun 2026', nextDueDate: '12 Sep 2026', status: 'Active' },
  { id: '021', name: 'Sneha P', phone: '+91 76543 21098', joinDate: '1 Aug 2026', nextDueDate: '1 Sep 2026', status: 'Active' },
  { id: '027', name: 'Vishnu Raj', phone: '+91 65432 10987', joinDate: '15 Mar 2026', nextDueDate: '15 Sep 2026', status: 'Active' },
  { id: '032', name: 'Manoj T', phone: '+91 98701 23456', joinDate: '10 Aug 2026', nextDueDate: '10 Sep 2026', status: 'Active' },
];

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const PlanDetailsModal = ({ isOpen, onClose, plan, onEdit, onDelete, onDeactivate }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const mobileView = searchParams.get('view') || 'details';
  
  const setMobileView = (view) => {
    if (view === 'details') {
      searchParams.delete('view');
    } else {
      searchParams.set('view', view);
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const Icon = plan.icon || Calendar;

  if (isMobile) {
    if (mobileView === 'members') {
      return (
        <div className="fixed inset-0 z-[100] bg-bg flex flex-col h-full overflow-hidden">
          <div className="flex items-center p-4 border-b border-border/50 bg-[#121212]">
            <button onClick={() => setMobileView('details')} className="p-2 text-text-primary mr-2">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white">Plan Members ({planMembers.length})</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 pb-24 bg-bg">
            <div className="flex items-center bg-[#18181b] border border-border rounded-lg px-3 py-3 mb-6">
              <Search className="w-5 h-5 text-text-secondary mr-2 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search members..." 
                className="bg-transparent border-none outline-none text-white text-base w-full placeholder-text-secondary"
              />
            </div>
            
            <div className="flex flex-col gap-3">
              {planMembers.map(member => (
                <div 
                  key={member.id} 
                  onClick={() => navigate(`/member/${member.id}`, { state: { from: location.pathname + location.search, fromName: 'Plans' } })}
                  className="flex items-center justify-between bg-[#1e1e1e] p-3 rounded-xl border border-border cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm bg-[#1A0F00] border-2 border-[#B45309] shadow-sm">
                      {getInitials(member.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm">{member.name}</span>
                      <span className="text-text-secondary text-xs">#{member.id}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-text-secondary text-[10px]">Next due: {member.nextDueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-[100] bg-bg flex flex-col h-full overflow-hidden">
        {/* Mobile Header Top */}
        <div className="flex items-center p-4 border-b border-border/50 bg-[#121212]">
          <button onClick={onClose} className="p-2 text-text-primary mr-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/home/logo.png" alt="Fitness Factory" className="h-8 w-auto object-contain" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24 bg-bg">
          <h1 className="text-2xl font-bold mb-6 text-white">Plan Details</h1>
          
          {/* Main Card */}
          <div className="bg-[#1e1e1e] border border-border rounded-xl p-5 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-bold text-white text-lg">{plan.name}</h2>
                  <span className="bg-success/10 text-success text-xs font-medium px-2 py-1 rounded-md border border-success/20">
                    {plan.status || 'Active'}
                  </span>
                </div>
                <div className="flex items-end gap-1">
                  <span className="font-bold text-primary text-xl">{plan.price}</span>
                </div>
                <span className="text-xs text-text-secondary">{plan.priceSubtext}</span>
              </div>
            </div>
          </div>

          {/* Details List */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex gap-4">
              <Clock className="w-5 h-5 text-text-secondary flex-shrink-0" />
              <div className="flex flex-col border-b border-border/50 pb-4 w-full">
                <span className="text-sm text-text-secondary mb-1">Duration</span>
                <span className="text-white text-sm">1 Month (30 days)</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Users className="w-5 h-5 text-text-secondary flex-shrink-0" />
              <div className="flex flex-col border-b border-border/50 pb-4 w-full">
                <span className="text-sm text-text-secondary mb-1">Total Members</span>
                <span className="text-white text-sm">{plan.members} Active members</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Calendar className="w-5 h-5 text-text-secondary flex-shrink-0" />
              <div className="flex flex-col border-b border-border/50 pb-4 w-full">
                <span className="text-sm text-text-secondary mb-1">Created On</span>
                <span className="text-white text-sm">1 Aug 2024</span>
              </div>
            </div>

            <div className="flex gap-4">
              <FileText className="w-5 h-5 text-text-secondary flex-shrink-0" />
              <div className="flex flex-col w-full">
                <span className="text-sm text-text-secondary mb-1">Description</span>
                <span className="text-white text-sm leading-relaxed">
                  Standard monthly membership plan with full gym access.
                </span>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">Members using this plan (42)</h3>
            <button 
              onClick={() => setMobileView('members')}
              className="text-primary text-sm font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {planMembers.slice(0, 4).map(member => (
              <div 
                key={member.id} 
                onClick={() => navigate(`/member/${member.id}`, { state: { from: location.pathname + location.search, fromName: 'Plans' } })}
                className="flex items-center justify-between bg-[#1e1e1e] p-3 rounded-xl border border-border cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm bg-[#1A0F00] border-2 border-[#B45309] shadow-sm">
                    {getInitials(member.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm">{member.name}</span>
                    <span className="text-text-secondary text-xs">#{member.id}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-text-secondary text-[10px]">Next due: {member.nextDueDate}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            <button 
              onClick={() => onEdit(plan)}
              className="flex-1 py-3 px-4 border border-border bg-[#1e1e1e] text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit Plan
            </button>
            <button onClick={() => onDeactivate(plan)} className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2">
              <Power className="w-4 h-4" /> Deactivate
            </button>
          </div>
          <button onClick={() => onDelete(plan)} className="w-full py-3 px-4 border border-border bg-[#1e1e1e] text-error rounded-xl font-medium flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-[800px] bg-[#1e1e1e] border border-border rounded-2xl flex flex-col shadow-2xl max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-border/50">
          <h2 className="text-lg font-bold text-white">Plan Details</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto scrollbar-hide">
          {/* Plan Info Card */}
          <div className="bg-[#18181b] border border-border rounded-xl p-5 mb-6 flex justify-between items-start">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-white text-xl mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="font-bold text-primary text-2xl leading-none">{plan.price}</span>
                </div>
                <span className="text-sm text-text-secondary">{plan.priceSubtext}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="bg-success/10 text-success text-xs font-medium px-2.5 py-1 rounded-md border border-success/20">
                {plan.status || 'Active'}
              </span>
              <button 
                onClick={() => onEdit(plan)}
                className="flex items-center gap-2 border border-border bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit Plan
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8 bg-[#18181b] border border-border rounded-xl p-5">
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-text-secondary flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm text-text-secondary mb-1">Duration</span>
                <span className="text-white text-sm font-medium">1 Month (30 days)</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-text-secondary flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm text-text-secondary mb-1">Created On</span>
                <span className="text-white text-sm font-medium">1 Aug 2024</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Users className="w-5 h-5 text-text-secondary flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm text-text-secondary mb-1">Total Members</span>
                <span className="text-white text-sm font-medium">{plan.members} Active members</span>
              </div>
            </div>

            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-text-secondary flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm text-text-secondary mb-1">Description</span>
                <span className="text-white text-sm font-medium leading-relaxed">
                  Standard monthly membership plan with full gym access.
                </span>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Members using this plan (42)</h3>
            <div className="flex items-center bg-[#18181b] border border-border rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-text-secondary mr-2" />
              <input 
                type="text" 
                placeholder="Search members..." 
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-text-secondary"
              />
            </div>
          </div>

          <div className="bg-[#18181b] border border-border rounded-xl overflow-hidden mb-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-[#222]">
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary whitespace-nowrap">Serial Number</th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary">Name</th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary">Phone</th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary">Join Date</th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary">Next Due Date</th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {planMembers.map((member) => (
                  <tr 
                    key={member.id} 
                    onClick={() => navigate(`/member/${member.id}`, { state: { from: location.pathname + location.search, fromName: 'Plans' } })}
                    className="border-b border-border/50 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 text-text-secondary text-sm">{member.id}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs bg-[#1A0F00] border-2 border-[#B45309] shadow-sm">
                        {getInitials(member.name)}
                      </div>
                      <span className="text-white text-sm font-medium">{member.name}</span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-sm">{member.phone}</td>
                    <td className="py-3 px-4 text-text-secondary text-sm">{member.joinDate}</td>
                    <td className="py-3 px-4 text-text-secondary text-sm">{member.nextDueDate}</td>
                    <td className="py-3 px-4">
                      <span className="bg-success/10 text-success text-[10px] font-medium px-2 py-0.5 rounded-md border border-success/20">
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-end mb-2">
            <div className="flex gap-1 items-center bg-[#18181b] border border-border rounded-lg p-1">
              <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white rounded-md transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-primary text-white font-medium text-sm rounded-md">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 font-medium text-sm rounded-md transition-colors">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 font-medium text-sm rounded-md transition-colors">
                3
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 font-medium text-sm rounded-md transition-colors">
                4
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 font-medium text-sm rounded-md transition-colors">
                5
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white rounded-md transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border/50 flex justify-between items-center bg-[#18181b] rounded-b-2xl">
          <button onClick={() => onDelete(plan)} className="flex items-center gap-2 border border-error/50 hover:bg-error/10 text-error px-4 py-2.5 rounded-xl font-medium transition-colors">
            <Trash2 className="w-4 h-4" /> Delete Plan
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="border border-border hover:bg-[#2a2a2a] text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
              Close
            </button>
            <button 
              onClick={() => onDeactivate(plan)}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Power className="w-5 h-5" /> Deactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsModal;
