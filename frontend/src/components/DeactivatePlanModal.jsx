import React, { useState } from 'react';
import { PauseCircle, CheckCircle } from 'lucide-react';
import usePlanStore from '../store/usePlanStore';

const DeactivatePlanModal = ({ isOpen, onClose, plan }) => {
  const { deactivatePlan } = usePlanStore();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleDeactivate = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await deactivatePlan(plan.id, plan.is_active);
      setIsSuccessModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${plan.is_active ? 'deactivate' : 'activate'} plan`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOk = () => {
    setIsSuccessModalOpen(false);
    onClose();
  };

  if (isSuccessModalOpen) {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={handleOk}>
        <div className="bg-[#1c1c1e] md:bg-surface border border-border rounded-[32px] md:rounded-3xl p-8 flex flex-col items-center max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 text-center">
            {plan.is_active ? 'Plan Deactivated!' : 'Plan Activated!'}
          </h3>
          <p className="text-[#98989f] md:text-text-secondary text-center mb-8">
            The membership plan has been successfully {plan.is_active ? 'deactivated' : 'activated'}.
          </p>
          <button 
            onClick={handleOk}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-xl transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center md:items-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full md:w-auto md:min-w-[400px] bg-[#1c1c1e] md:bg-surface border-t md:border border-border rounded-t-[32px] md:rounded-[32px] p-6 pb-8 md:p-8 flex flex-col items-center animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 md:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle for Mobile */}
        <div className="w-12 h-1.5 bg-border rounded-full mb-8 md:hidden"></div>
        
        {/* Icon */}
        <div className={`w-16 h-16 rounded-full ${plan.is_active ? 'bg-primary/20' : 'bg-success/20'} flex items-center justify-center mb-5`}>
          <PauseCircle className={`w-7 h-7 ${plan.is_active ? 'text-primary' : 'text-success'}`} strokeWidth={2.5} />
        </div>

        {/* Text content */}
        <h2 className="text-xl font-bold text-white mb-3 text-center">
          {plan.is_active ? 'Deactivate' : 'Activate'} Plan?
        </h2>
        
        <p className="text-[15px] text-white text-center mb-3 leading-snug">
          Are you sure you want to {plan.is_active ? 'deactivate' : 'activate'}<br/>
          {plan?.name}?
        </p>
        
        <p className="text-[13px] text-[#98989f] text-center mb-8 leading-snug">
          {plan.is_active 
            ? <>This action will pause the plan. You can<br/>reactivate it later from the settings.</>
            : <>This action will make the plan available<br/>for members to enroll in again.</>
          }
        </p>

        {error && (
          <div className="w-full text-error text-sm p-3 mb-3 bg-error/10 border border-error/20 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button 
            onClick={handleDeactivate} 
            disabled={isSubmitting}
            className={`w-full ${plan.is_active ? 'bg-primary hover:bg-primary/90' : 'bg-success hover:bg-success/90'} disabled:opacity-50 text-white font-bold py-4 rounded-[14px] transition-colors text-[15px]`}
          >
            {isSubmitting 
              ? (plan.is_active ? 'Deactivating...' : 'Activating...') 
              : (plan.is_active ? 'Deactivate Plan' : 'Activate Plan')
            }
          </button>
          
          <button 
            onClick={onClose} 
            className="w-full bg-transparent border border-[#38383a] text-white font-bold py-4 rounded-[14px] transition-colors text-[15px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivatePlanModal;
