import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, MapPin, Phone, Calendar, IndianRupee, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import usePlanStore from '../store/usePlanStore';
import useMemberStore from '../store/useMemberStore';

const AddMemberModal = ({ isOpen, onClose }) => {
  const { plans, fetchPlans } = usePlanStore();
  const { createMember, isLoading } = useMemberStore();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    serial_no: '',
    name: '',
    phone: '',
    address: '',
    plan_id: '',
    amount: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'Active',
  });

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
      setError(null);
      setFormData({
        serial_no: '',
        name: '',
        phone: '',
        address: '',
        plan_id: '',
        amount: '',
        startDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      });
    }
  }, [isOpen, fetchPlans]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (name === 'phone') {
      processedValue = processedValue.replace(/\D/g, '');
      if (processedValue.length > 10) {
        processedValue = processedValue.slice(-10);
      }
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: processedValue };
      if (name === 'plan_id') {
        const selectedPlan = plans.find(p => p.id === processedValue);
        if (selectedPlan) {
          newData.amount = selectedPlan.price.toString();
        }
      }
      return newData;
    });
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      if (!formData.serial_no || !formData.name || !formData.phone || !formData.plan_id) {
        setError("Please fill all required fields");
        return;
      }
      await createMember({
        serial_no: formData.serial_no,
        name: formData.name,
        mobile_number: formData.phone,
        address: formData.address,
        plan_id: formData.plan_id,
        start_date: formData.startDate,
      });
      setIsSuccessModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add member');
    }
  };

  const handleOk = () => {
    setIsSuccessModalOpen(false);
    onClose();
  };

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
              <h2 className="text-xl md:text-2xl font-bold">Add New Member</h2>
              <p className="text-sm text-text-secondary mt-1">Enter details to register a new member.</p>
            </div>
          </div>
          <button onClick={onClose} className="hidden md:flex p-2 bg-surface hover:bg-bg border border-border rounded-xl transition-colors">
            <X className="w-5 h-5 text-text-primary" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="overflow-y-auto p-4 md:p-6 flex flex-col gap-6 md:gap-8">
          


          {/* Form Fields */}
          <div className="flex flex-col gap-6">
            
            {/* Personal Information */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-text-secondary">Serial Number *</label>
                  <input 
                    type="number" 
                    name="serial_no"
                    value={formData.serial_no}
                    onChange={handleChange}
                    className="w-full bg-surface md:bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
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
                      {plans.filter(p => p.is_active).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Amount (₹) *</label>
                  <input 
                    type="text" 
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full bg-surface md:bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
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

            {/* Error banner removed - now handled via modal overlay */}

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
            disabled={isLoading}
            className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3.5 px-8 rounded-xl transition-colors"
          >
            {isLoading ? 'Adding...' : 'Add Member'}
          </button>
        </div>

      </div>

      {/* Success Modal Overlay */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-3xl p-8 flex flex-col items-center max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Member Added!</h3>
            <p className="text-text-secondary text-center mb-8">
              The new member has been successfully registered.
            </p>
            <button 
              onClick={handleOk}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-xl transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

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
              onClick={() => setError(null)}
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

export default AddMemberModal;
