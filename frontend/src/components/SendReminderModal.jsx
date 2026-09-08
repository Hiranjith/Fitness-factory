import React, { useState } from 'react';
import { ChevronLeft, X, CheckCircle2, Phone, MapPin, MessageCircle, Edit2, Info, Check } from 'lucide-react';

const SendReminderModal = ({ isOpen, onClose, member }) => {
  const [includeAutoDetails, setIncludeAutoDetails] = useState(true);
  const [message, setMessage] = useState(
    `Hi ${member?.name || 'Member'},\n\nYour gym membership payment of ${member?.amount || '₹1,000'} is due on ${member?.nextDueDate || '10 Sep 2026'}.\n\nPlease make the payment at your earliest convenience.\n\nThank you,\nFitness Factory`
  );

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
              <h2 className="text-xl md:text-2xl font-bold">Send Reminder</h2>
              <p className="hidden md:block text-sm text-text-secondary mt-1">Send a payment reminder to {member?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="hidden md:flex p-2 bg-surface hover:bg-bg border border-border rounded-xl transition-colors">
            <X className="w-5 h-5 text-text-primary" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 md:gap-8">
          
          {/* Member Summary Card */}
          <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-5">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center text-2xl text-bg font-bold flex-shrink-0">
                {member?.name?.charAt(0) || 'M'}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg md:text-xl font-bold text-text-primary">{member?.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary">#{member?.id}</span>
                  <div className="bg-success/10 text-success px-2 py-0.5 rounded text-[11px] font-bold flex items-center">
                    {member?.status}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden sm:flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Phone className="w-4 h-4 text-primary" />
                <span>{member?.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{member?.location}</span>
              </div>
            </div>
          </div>

          {/* Message Box */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <h3 className="font-bold text-lg">Message</h3>
              <span className="text-xs text-text-secondary">Edit the message below if needed</span>
            </div>
            
            <div className="relative bg-surface border border-border rounded-2xl p-4 transition-colors">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent text-text-primary text-sm leading-relaxed resize-none outline-none min-h-[160px]"
              />
              <div className="absolute bottom-4 right-4 text-xs font-medium text-text-secondary">
                {message.length}/1000
              </div>
            </div>
          </div>
          
          {/* Checkbox */}
          <div className="flex items-start gap-3 mt-2">
            <button 
              onClick={() => setIncludeAutoDetails(!includeAutoDetails)}
              className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${includeAutoDetails ? 'bg-primary' : 'bg-surface border border-border'}`}
            >
              {includeAutoDetails && <Check className="w-3.5 h-3.5 text-bg font-bold" strokeWidth={3} />}
            </button>
            <p className="text-sm text-text-secondary">Include member name, amount and due date automatically</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-4 pb-4 md:px-6 md:pb-6 bg-bg md:bg-surface flex flex-col md:flex-row items-center justify-end gap-3 mt-auto md:mt-0">
          <button 
            onClick={onClose}
            className="hidden md:block px-6 py-3.5 text-text-primary font-bold hover:bg-bg rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <MessageCircle className="w-5 h-5" />
            Send Reminder
          </button>
        </div>

      </div>
    </div>
  );
};

export default SendReminderModal;
