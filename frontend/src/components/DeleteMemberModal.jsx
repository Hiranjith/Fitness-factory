import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteMemberModal = ({ isOpen, onClose, member }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
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
        <h2 className="text-xl font-bold text-white mb-3 text-center">Delete Member?</h2>
        
        <p className="text-[15px] text-white text-center mb-3 leading-snug">
          Are you sure you want to delete<br/>
          {member?.name} (#{member?.id})?
        </p>
        
        <p className="text-[13px] text-[#98989f] text-center mb-8 leading-snug">
          This action will remove the member<br/>
          from your active member list.
        </p>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button className="w-full bg-[#ff453a] hover:bg-[#ff453a]/90 text-white font-bold py-4 rounded-[14px] transition-colors text-[15px]">
            Delete Member
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

export default DeleteMemberModal;
