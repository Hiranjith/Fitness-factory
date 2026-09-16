import React, { useState } from 'react';
import { IndianRupee, AlertCircle, Loader2, CheckCircle2, X } from 'lucide-react';
import useMemberStore from '../store/useMemberStore';

const RecordPaymentModal = ({ isOpen, onClose, member }) => {
  const { recordPayment } = useMemberStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const today = new Date();
  const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const [paymentDate, setPaymentDate] = useState(localDate);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const paymentData = {
        amount: member.currentMembership?.amount || 0,
        payment_method: paymentMethod,
        payment_date: paymentDate,
      };

      await recordPayment(member._id, paymentData);
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to record payment');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setError('');
    onClose();
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-surface border border-border rounded-3xl p-8 flex flex-col items-center max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 text-center">Payment Recorded!</h3>
          <p className="text-text-secondary text-center mb-8">
            The membership has been successfully extended.
          </p>
          <button 
            onClick={handleClose}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-xl transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center bg-black/60 backdrop-blur-sm" onClick={handleClose}>
      <div 
        className="w-full md:w-auto md:min-w-[420px] bg-bg md:bg-surface border-t md:border border-border rounded-t-[32px] md:rounded-[32px] p-6 md:p-8 flex flex-col items-center animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 md:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Record Payment</h2>
          <button onClick={handleClose} className="p-2 bg-surface md:bg-bg border border-border rounded-full text-text-secondary hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="w-full bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl flex items-center gap-3 text-sm mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Info Card */}
        <div className="w-full bg-surface border border-border rounded-2xl p-4 mb-6 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-sm">Member</span>
            <span className="font-bold">{member?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-sm">Plan</span>
            <span className="font-bold">{member?.plan}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-border">
            <span className="text-text-secondary font-medium">Amount Due</span>
            <span className="font-bold text-primary flex items-center text-lg">
              <IndianRupee className="w-4 h-4 mr-0.5" />
              {member?.currentMembership?.amount || member?.amount?.replace('₹', '') || '0'}
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="w-full flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Payment Method</label>
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-surface md:bg-bg border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI / QR Code</option>
              <option value="Card">Credit/Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Payment Date</label>
            <input 
              type="date" 
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full bg-surface md:bg-bg border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col md:flex-row gap-3">
          <button 
            onClick={handleClose} 
            disabled={isSubmitting}
            className="flex-1 bg-transparent md:bg-surface border border-border md:border-transparent text-white font-bold py-3.5 rounded-xl transition-colors order-2 md:order-1 hover:bg-bg"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 order-1 md:order-2"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Recording...</>
            ) : (
              'Confirm Payment'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RecordPaymentModal;
