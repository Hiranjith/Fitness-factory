import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layers, Users, IndianRupee, TrendingUp, Search, Calendar, Dumbbell, MoreVertical, Lightbulb, ChevronRight, ChevronDown, Filter, Trash2, ArrowUpDown, Edit2, PauseCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import AddPlanModal from '../components/AddPlanModal';
import PlanDetailsModal from '../components/PlanDetailsModal';
import DeletePlanModal from '../components/DeletePlanModal';
import DeactivatePlanModal from '../components/DeactivatePlanModal';

const plansData = [
  { id: 1, name: 'Monthly', category: 'General Fitness', duration: '1 Month', price: '₹1,000', priceSubtext: 'per month', members: 42, status: 'Active', icon: Calendar },
  { id: 2, name: '3 Months', category: 'General Fitness', duration: '3 Months', price: '₹2,500', priceSubtext: 'per 3 months', members: 28, status: 'Active', icon: Calendar },
  { id: 3, name: '6 Months', category: 'General Fitness', duration: '6 Months', price: '₹4,500', priceSubtext: 'per 6 months', members: 18, status: 'Active', icon: Calendar },
  { id: 4, name: '1 Year', category: 'General Fitness', duration: '12 Months', price: '₹8,000', priceSubtext: 'per year', members: 12, status: 'Active', icon: Calendar },
  { id: 5, name: 'Personal Training', category: 'One-on-One Training', duration: '1 Month', price: '₹3,500', priceSubtext: 'per month', members: 6, status: 'Active', icon: Dumbbell },
];

const Plans = () => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const planIdParam = searchParams.get('plan');
  const selectedPlan = planIdParam ? plansData.find(p => p.id === Number(planIdParam)) : null;

  const setSelectedPlan = (plan) => {
    if (plan) {
      searchParams.set('plan', plan.id);
      setSearchParams(searchParams);
    } else {
      searchParams.delete('plan');
      searchParams.delete('view');
      setSearchParams(searchParams);
    }
  };

  const [planToEdit, setPlanToEdit] = useState(null);
  const [returnToPlanDetails, setReturnToPlanDetails] = useState(false);

  useEffect(() => {
    if (openDropdownId !== null || isMoreMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [openDropdownId, isMoreMenuOpen]);

  const handleEditPlan = (plan, fromDetails = false) => {
    if (fromDetails) {
      setReturnToPlanDetails(true);
      setSelectedPlan(null);
    } else {
      setReturnToPlanDetails(false);
    }
    setPlanToEdit(plan);
    setIsAddPlanModalOpen(true);
  };

  const handleCloseAddPlan = () => {
    setIsAddPlanModalOpen(false);
    if (returnToPlanDetails && planToEdit) {
      setSelectedPlan(planToEdit);
    }
    setPlanToEdit(null);
    setReturnToPlanDetails(false);
  };

  const [isDeletePlanModalOpen, setIsDeletePlanModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const handleDeletePlan = (plan, fromDetails = false) => {
    if (fromDetails) {
      setSelectedPlan(null); // Close details modal first
    }
    setPlanToDelete(plan);
    setIsDeletePlanModalOpen(true);
  };

  const [isDeactivatePlanModalOpen, setIsDeactivatePlanModalOpen] = useState(false);
  const [planToDeactivate, setPlanToDeactivate] = useState(null);

  const handleDeactivatePlan = (plan, fromDetails = false) => {
    if (fromDetails) {
      setSelectedPlan(null); // Close details modal first
    }
    setPlanToDeactivate(plan);
    setIsDeactivatePlanModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header section - Desktop */}
      <div className="hidden md:flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Plans</h1>
          <p className="text-text-secondary text-sm">Manage your membership plans</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center transition-colors"
            onClick={() => setIsAddPlanModalOpen(true)}
          >
            + Add Plan
          </button>
          <button 
            className="p-2 border border-border bg-surface hover:bg-surface/80 rounded-lg text-text-primary transition-colors"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Desktop More Dropdown */}
          {isMoreMenuOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setIsMoreMenuOpen(false)}></div>
              <div className="absolute top-12 right-0 z-50 w-48 bg-[#1e1e1e] border border-primary rounded-xl shadow-xl overflow-hidden">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors text-sm text-text-primary">
                  <ArrowUpDown className="w-4 h-4" /> Sort Plans
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors text-sm text-text-primary border-t border-border/50">
                  <Filter className="w-4 h-4" /> Filter Plans
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors text-sm text-text-primary border-t border-border/50">
                  <Layers className="w-4 h-4" /> Plan Categories
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-error/10 transition-colors text-sm text-error border-t border-border/50">
                  <Trash2 className="w-4 h-4" /> Delete Plans
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Header section - Mobile */}
      <div className="md:hidden flex flex-col mb-4">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold">Plans</h1>
          <button 
            className="bg-primary hover:bg-primary/90 text-white font-medium py-1.5 px-4 rounded-lg flex items-center gap-1 text-sm transition-colors"
            onClick={() => setIsAddPlanModalOpen(true)}
          >
            <span>+</span> Add Plan
          </button>
        </div>
        <p className="text-text-secondary text-sm mb-4">Manage your membership plans</p>
        
        {/* Mobile Search */}
        <div className="flex items-center bg-surface rounded-lg px-4 py-3 w-full border border-border">
          <Search className="w-5 h-5 text-text-secondary mr-2" />
          <input 
            type="text" 
            placeholder="Search plans..." 
            className="bg-transparent border-none outline-none text-text-primary w-full placeholder-text-secondary"
          />
        </div>
      </div>

      {/* Stat Cards - Desktop Only */}
      <div className="hidden md:grid grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Plans" 
          value="5" 
          icon={Layers} 
          colorClass="text-[#d97706]" 
          bgClass="bg-[#d97706]/10" 
        />
        <StatCard 
          title="Total Enrolled" 
          value="86" 
          subtitle="Active members"
          icon={Users} 
          colorClass="text-success" 
          bgClass="bg-success/10" 
        />
        <StatCard 
          title="Expected Revenue" 
          value="₹1,42,000" 
          subtitle="From active plans"
          icon={IndianRupee} 
          colorClass="text-primary" 
          bgClass="bg-primary/10" 
        />
        <StatCard 
          title="Most Popular" 
          value="3 Months" 
          subtitle="28 members"
          icon={TrendingUp} 
          colorClass="text-[#8b5cf6]" 
          bgClass="bg-[#8b5cf6]/10" 
        />
      </div>

      {/* Desktop Search and Filters */}
      <div className="hidden md:flex gap-4 mb-6">
        <div className="flex items-center bg-surface border border-border rounded-lg px-4 py-2 flex-1">
          <Search className="w-4 h-4 text-text-secondary mr-2" />
          <input 
            type="text" 
            placeholder="Search plans..." 
            className="bg-transparent border-none outline-none text-text-primary w-full text-sm placeholder-text-secondary"
          />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm text-text-primary hover:bg-surface/80">
            All Durations <ChevronDown className="w-4 h-4 text-text-secondary" />
          </button>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm text-text-primary hover:bg-surface/80">
            All Categories <ChevronDown className="w-4 h-4 text-text-secondary" />
          </button>
          <button className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm text-text-primary hover:bg-surface/80">
            Status <ChevronDown className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-surface border border-border rounded-xl overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-[#18181b]">
                <th className="p-4 text-sm font-medium text-text-secondary">Plan Name</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Duration</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Price</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Members</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="p-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plansData.map((plan) => {
                const Icon = plan.icon;
                return (
                  <tr key={plan.id} className="border-b border-border/50 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedPlan(plan)}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{plan.name}</p>
                          <p className="text-xs text-text-secondary">{plan.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{plan.duration}</td>
                    <td className="p-4">
                      <p className="font-bold text-primary">{plan.price}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-bold">{plan.members}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-success/10 text-success text-xs font-medium px-2.5 py-1 rounded-md border border-success/20">
                        {plan.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <button 
                          className="text-text-secondary hover:text-white transition-colors"
                          onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === plan.id ? null : plan.id); }}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {/* Desktop Row Dropdown */}
                        {openDropdownId === plan.id && (
                          <>
                            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); }}></div>
                            <div className="absolute top-8 right-0 z-50 w-48 bg-[#18181b] border border-primary rounded-xl shadow-2xl overflow-hidden py-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleEditPlan(plan); setOpenDropdownId(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-white/5 transition-colors text-sm text-text-primary"
                              >
                                <Edit2 className="w-4 h-4" /> Edit Plan
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeactivatePlan(plan); setOpenDropdownId(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-white/5 transition-colors text-sm text-text-primary"
                              >
                                <PauseCircle className="w-4 h-4" /> Deactivate Plan
                              </button>
                              <div className="h-px bg-border/50 my-1"></div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan); setOpenDropdownId(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-error/10 transition-colors text-sm text-error"
                              >
                                <Trash2 className="w-4 h-4" /> Delete Plan
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-3">
        {plansData.map((plan) => {
          const Icon = plan.icon;
          return (
            <div key={plan.id} className="bg-[#1c1c1e] border border-[#38383a] rounded-[20px] p-4 flex items-center justify-between cursor-pointer" onClick={() => setSelectedPlan(plan)}>
              
              {/* Left Side */}
              <div className="flex items-center gap-3.5">
                <div className="w-[46px] h-[46px] flex-shrink-0 rounded-full flex items-center justify-center bg-[#2A1700] border border-primary shadow-sm">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-[16px] leading-tight">{plan.name}</span>
                  <span className="text-[#98989f] text-[13px] mt-1">{plan.duration}</span>
                  <div className="flex items-center gap-1 text-[#98989f] text-[13px] mt-0.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{plan.members} Active</span>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col items-end text-right">
                <div className="flex items-center text-primary font-bold text-[16px] leading-tight">
                  {plan.price}
                </div>
                <span className="text-[#98989f] text-[12px] mt-1">{plan.priceSubtext}</span>
              </div>

            </div>
          );
        })}
      </div>



      <AddPlanModal 
        isOpen={isAddPlanModalOpen} 
        onClose={handleCloseAddPlan} 
        planToEdit={planToEdit}
      />

      <PlanDetailsModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
        onEdit={(p) => handleEditPlan(p, true)}
        onDelete={(p) => handleDeletePlan(p, true)}
        onDeactivate={(p) => handleDeactivatePlan(p, true)}
      />
      
      <DeletePlanModal
        isOpen={isDeletePlanModalOpen}
        onClose={() => setIsDeletePlanModalOpen(false)}
        plan={planToDelete}
      />

      <DeactivatePlanModal
        isOpen={isDeactivatePlanModalOpen}
        onClose={() => setIsDeactivatePlanModalOpen(false)}
        plan={planToDeactivate}
      />
    </div>
  );
};

export default Plans;
