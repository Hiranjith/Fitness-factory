import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, MapPin, Phone, Calendar, IndianRupee, ChevronDown, AlertCircle, Loader2 } from 'lucide-react';
import useMemberStore from '../store/useMemberStore';
import usePlanStore from '../store/usePlanStore';

const EditMemberModal = ({ isOpen, onClose, member }) => {
  const { updateMember } = useMemberStore();
  const { plans, fetchPlans } = usePlanStore();
  
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: member?.name || '',
    phone: member?.phone || '',
    address: member?.location || '',
    plan_id: member?.plan_id || '',
    amount: member?.amount ? member.amount.replace('₹', '').replace(',', '') : '',
    startDate: member?.rawStartDate ? new Date(member.rawStartDate).toISOString().split('T')[0] : '',
    status: member?.status || 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (name === 'phone') {
      processedValue = processedValue.replace(/\D/g, '');
      if (processedValue.length > 10) {
        processedValue = processedValue.slice(-10);
      }
    }

    if (name === 'plan_id') {
      const selectedPlan = plans.find(p => p.id === processedValue);
      setFormData(prev => ({ 
        ...prev, 
        plan_id: processedValue,
        amount: selectedPlan ? selectedPlan.price.toString() : prev.amount
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      await updateMember(member._id, {
        name: formData.name,
        mobile_number: formData.phone,
        address: formData.address,
        status: formData.status.toLowerCase(),
        plan_id: formData.plan_id,
        start_date: formData.startDate,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update member details');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen && member) {
      setFormData({
        name: member.name || '',
        phone: member.phone || '',
        address: member.location || '',
        plan_id: member.plan_id || '',
        amount: member.amount ? member.amount.replace('₹', '').replace(',', '') : '',
        startDate: member.rawStartDate ? new Date(member.rawStartDate).toISOString().split('T')[0] : '',
        status: member.status || 'Active',
      });
      setError('');
    }
  }, [isOpen, member]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center md:p-6 bg-bg md:bg-bg/80 md:backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl bg-bg md:bg-surface md:border border-border md:rounded-3xl flex flex-col overflow-hidden md:shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="md:hidden p-2 -ml-2 text-text-primary">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Edit Member</h2>
              <p className="text-sm text-text-secondary mt-1">Update member details and membership information.</p>
            </div>
          </div>
          <button onClick={onClose} className="hidden md:flex p-2 bg-surface hover:bg-bg border border-border rounded-xl transition-colors">
            <X className="w-5 h-5 text-text-primary" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="overflow-y-auto p-4 md:p-6 flex flex-col gap-6 md:gap-8">
          
          {/* Member Summary Card (Desktop Only) */}
          <div className="hidden md:flex bg-surface border border-border rounded-2xl p-5 items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl text-bg font-bold flex-shrink-0">
                {member?.name?.charAt(0) || 'M'}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-text-primary">{member?.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary">#{member?.id}</span>
                  <div className="bg-success/10 text-success px-2 py-0.5 rounded text-[11px] font-bold flex items-center">
                    {member?.status}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Phone className="w-4 h-4 text-primary" />
                <span>{member?.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{formData.address || member?.location}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="flex flex-col gap-6">
            
            {/* Personal Information */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface md:bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Phone Number *</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full bg-surface md:bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-text-secondary">Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-surface md:bg-bg border border-border rounded-xl pl-10 pr-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Details */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg">Membership Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Plan *</label>
                  <div className="relative">
                    <select 
                      name="plan_id"
                      value={formData.plan_id}
                      onChange={handleChange}
                      className="w-full bg-surface md:bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a plan</option>
                      {plans.filter(p => p.is_active || p.id === member?.plan_id).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Amount (Not Editable)</label>
                  <input 
                    type="text" 
                    disabled
                    name="amount"
                    value={formData.amount}
                    className="w-full bg-surface/50 md:bg-bg/50 border border-border rounded-xl px-4 py-3 text-text-secondary text-sm cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Start Date *</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full bg-surface md:bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg">Status</h3>
              
              <div className="flex flex-col gap-1.5 w-full md:w-1/2">
                <label className="text-sm font-medium text-text-secondary">Status *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-success"></div>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-surface md:bg-bg border border-border rounded-xl pl-9 pr-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-6 border-t border-border bg-bg md:bg-surface flex flex-row items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3.5 bg-surface md:bg-transparent border border-border md:border-transparent text-text-primary font-bold hover:bg-bg rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-8 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

      </div>

      {/* Error Modal Overlay */}
      {error && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-3xl p-8 flex flex-col items-center max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-danger" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Error</h3>
            <p className="text-text-secondary text-center mb-8">
              {error}
            </p>
            <button 
              onClick={() => setError('')}
              className="w-full bg-surface hover:bg-bg border border-border text-white font-bold py-3.5 px-8 rounded-xl transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default EditMemberModal;
