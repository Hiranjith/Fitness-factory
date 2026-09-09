import React, { useState } from 'react';
import { ChevronLeft, X, MapPin, Phone, Calendar, IndianRupee, ChevronDown } from 'lucide-react';

const AddMemberModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    plan: 'Monthly',
    amount: '',
    startDate: '',
    status: 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
                      name="plan"
                      value={formData.plan}
                      onChange={handleChange}
                      className="w-full bg-surface md:bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="1 Year">1 Year</option>
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
                      type="text" 
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full bg-surface md:bg-bg border border-border rounded-xl px-4 py-3 pr-10 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
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
          <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-xl transition-colors">
            Add Member
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddMemberModal;
