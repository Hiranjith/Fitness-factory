import React, { useState } from 'react';
import { ChevronLeft, X, Calendar, IndianRupee, CheckCircle } from 'lucide-react';
import usePlanStore from '../store/usePlanStore';

const AddPlanModal = ({ isOpen, onClose, planToEdit }) => {
  const { createPlan, updatePlan } = usePlanStore();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration_months: '',
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen && planToEdit) {
      setFormData({
        name: planToEdit.name || '',
        price: planToEdit.price ? planToEdit.price.toString() : '',
        duration_months: planToEdit.duration_months || '',
      });
      setError(null);
    } else if (isOpen && !planToEdit) {
      setFormData({
        name: '',
        price: '',
        duration_months: '',
      });
      setError(null);
    }
  }, [isOpen, planToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'duration_months' ? Number(value) : value }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        duration_months: formData.duration_months,
      };

      if (planToEdit) {
        await updatePlan(planToEdit.id, payload);
      } else {
        await createPlan(payload);
      }
      
      setIsSuccessModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOk = () => {
    setIsSuccessModalOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center md:p-6 bg-bg md:bg-bg/80 md:backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl bg-bg border border-border md:rounded-3xl flex flex-col overflow-hidden md:shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-[#18181b]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="md:hidden p-2 -ml-2 text-text-primary">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">{planToEdit ? 'Edit Plan' : 'Add Plan'}</h2>
              <p className="text-sm text-text-secondary mt-1">{planToEdit ? 'Update membership plan details' : 'Create a new membership plan for your gym'}</p>
            </div>
          </div>
          <button onClick={onClose} className="hidden md:flex p-2 bg-surface hover:bg-bg border border-border rounded-xl transition-colors">
            <X className="w-5 h-5 text-text-primary" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
          
          {/* Plan Details Card */}
          <div className="bg-[#18181b] border border-border rounded-2xl p-4 md:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-primary" />
              <h3 className="font-bold text-lg">Plan Details</h3>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Plan Name <span className="text-error">*</span></label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Monthly, 3 Months, Yearly"
                className="w-full bg-[#18181b] border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors placeholder-text-secondary/50"
              />
            </div>
          </div>

          {/* Pricing & Duration Card */}
          <div className="bg-[#18181b] border border-border rounded-2xl p-4 md:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <IndianRupee className="w-6 h-6 text-primary" />
              <h3 className="font-bold text-lg">Pricing & Duration</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">Price (₹) <span className="text-error">*</span></label>
                <input 
                  type="text" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 1000"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full bg-[#18181b] border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors placeholder-text-secondary/50"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">Duration (Months) <span className="text-error">*</span></label>
                <input 
                  type="number" 
                  name="duration_months"
                  value={formData.duration_months}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  min="1"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full bg-[#18181b] border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors placeholder-text-secondary/50"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-error text-sm p-3 bg-error/10 border border-error/20 rounded-xl">
              {error}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-6 border-t border-border bg-[#18181b]">
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3.5 px-8 rounded-xl transition-colors"
          >
            {isSubmitting ? 'Saving...' : (planToEdit ? 'Update Plan' : 'Save Plan')}
          </button>
        </div>

      </div>

      {/* Success Modal Overlay */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-3xl p-8 flex flex-col items-center max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">{planToEdit ? 'Plan Updated!' : 'Plan Added!'}</h3>
            <p className="text-text-secondary text-center mb-8">
              {planToEdit ? 'The membership plan has been successfully updated.' : 'Your new membership plan has been successfully created.'}
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
    </div>
  );
};

export default AddPlanModal;
