import React, { useState, useEffect } from 'react';
import { ChevronLeft, X } from 'lucide-react';

const ReminderMessageModal = ({ isOpen, onClose, initialMessage, onSave, title = "Edit Reminder Message", description = "Customize the WhatsApp message sent to members." }) => {
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    setMessage(initialMessage);
  }, [initialMessage, isOpen]);

  const handleSave = () => {
    onSave(message);
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
              <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
              <p className="text-sm text-text-secondary mt-1">{description}</p>
            </div>
          </div>
          <button onClick={onClose} className="hidden md:flex p-2 bg-surface hover:bg-bg border border-border rounded-xl transition-colors">
            <X className="w-5 h-5 text-text-primary" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">Message Content *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="w-full bg-surface md:bg-bg border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div>
            <p className="text-text-secondary text-xs mb-3">Available Variables (Click to copy, or type them directly)</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white/10 text-text-primary text-xs px-3 py-1.5 rounded-lg border border-white/5">{'{name}'}</span>
              <span className="bg-white/10 text-text-primary text-xs px-3 py-1.5 rounded-lg border border-white/5">{'{due_date}'}</span>
              <span className="bg-white/10 text-text-primary text-xs px-3 py-1.5 rounded-lg border border-white/5">{'{plan_name}'}</span>
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
            Save Message
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReminderMessageModal;
