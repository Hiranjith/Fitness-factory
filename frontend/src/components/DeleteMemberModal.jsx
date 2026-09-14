import React, { useState } from 'react';
import { Trash2, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import useMemberStore from '../store/useMemberStore';

const DeleteMemberModal = ({ isOpen, onClose, member, onDeleteSuccess }) => {
  const { deleteMember } = useMemberStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError('');
      await deleteMember(member._id);
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete member');
      setIsDeleting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-surface border border-border rounded-3xl p-8 flex flex-col items-center max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 text-center">Member Deleted!</h3>
          <p className="text-text-secondary text-center mb-8">
            The member has been successfully deleted.
          </p>
          <button 
            onClick={onDeleteSuccess}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-xl transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full md:w-auto md:min-w-[400px] bg-[#1c1c1e] md:bg-surface border-t md:border border-border rounded-t-[32px] md:rounded-[32px] p-6 pb-8 md:p-8 flex flex-col items-center animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 md:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drag Handle for Mobile */}
        <div className="w-12 h-1.5 bg-border rounded-full mb-8 md:hidden"></div>
        
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#3a1c1e] flex items-center justify-center mb-5 mt-2">
          <Trash2 className="w-7 h-7 text-[#ff453a]" strokeWidth={2.5} />
        </div>

        {/* Text content */}
        <h2 className="text-xl font-bold text-white mb-3 text-center">Delete Member?</h2>

        {error && (
          <div className="w-full bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl flex items-center gap-3 text-sm mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
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
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full bg-[#ff453a] hover:bg-[#ff453a]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-[14px] transition-colors text-[15px] flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Deleting...</>
            ) : (
              'Delete Member'
            )}
          </button>
          
          <button 
            onClick={onClose} 
            disabled={isDeleting}
            className="w-full bg-transparent border border-[#38383a] disabled:opacity-50 text-white font-bold py-4 rounded-[14px] transition-colors text-[15px]"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteMemberModal;
