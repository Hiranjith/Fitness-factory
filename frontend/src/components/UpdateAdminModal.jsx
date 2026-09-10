import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, Mail, Phone, User } from 'lucide-react';

const UpdateAdminModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center md:p-6 bg-bg md:bg-bg/80 md:backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-xl bg-bg md:bg-surface md:border border-border md:rounded-3xl flex flex-col overflow-hidden md:shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="md:hidden p-2 -ml-2 text-text-primary">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Update Login Details</h2>
              <p className="text-sm text-text-secondary mt-1">Change your admin account information.</p>
            </div>
          </div>
          <button onClick={onClose} className="hidden md:flex p-2 bg-surface hover:bg-bg border border-border rounded-xl transition-colors">
            <X className="w-5 h-5 text-text-primary" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="overflow-y-auto p-4 md:p-6 flex flex-col gap-5">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Admin Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-surface md:bg-bg border border-border rounded-xl pl-10 pr-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface md:bg-bg border border-border rounded-xl pl-10 pr-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-surface md:bg-bg border border-border rounded-xl pl-10 pr-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
              />
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
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-xl transition-colors"
          >
            Save Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdateAdminModal;
