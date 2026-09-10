import React, { useState } from 'react';
import { Trash2, CheckCircle } from 'lucide-react';

const DeletePlanModal = ({ isOpen, onClose, plan }) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleDelete = () => {
    // Typically you would call an API here to delete the plan
    setIsSuccessModalOpen(true);
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
          <h3 className="text-xl font-bold text-white mb-2 text-center">Plan Deleted!</h3>
          <p className="text-[#98989f] md:text-text-secondary text-center mb-8">
            The membership plan has been successfully deleted.
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
        <div className="w-16 h-16 rounded-full bg-[#3a1c1e] flex items-center justify-center mb-5">
          <Trash2 className="w-7 h-7 text-[#ff453a]" strokeWidth={2.5} />
        </div>

        {/* Text content */}
        <h2 className="text-xl font-bold text-white mb-3 text-center">Delete Plan?</h2>
        
        <p className="text-[15px] text-white text-center mb-3 leading-snug">
          Are you sure you want to delete<br/>
          {plan?.name}?
        </p>
        
        <p className="text-[13px] text-[#98989f] text-center mb-8 leading-snug">
          This action will permanently remove the plan<br/>
          and cannot be undone.
        </p>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button onClick={handleDelete} className="w-full bg-[#ff453a] hover:bg-[#ff453a]/90 text-white font-bold py-4 rounded-[14px] transition-colors text-[15px]">
            Delete Plan
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

export default DeletePlanModal;
