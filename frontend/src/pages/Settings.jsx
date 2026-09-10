import React, { useState, useEffect } from 'react';
import { 
  Bell, ChevronRight, ChevronDown, Calendar, MessageSquare, Wifi, 
  User, Users, Mail, Phone, Lock, LogOut, 
  Settings as SettingsIcon, Info 
} from 'lucide-react';
import ReminderMessageModal from '../components/ReminderMessageModal';
import UpdateAdminModal from '../components/UpdateAdminModal';


const WhatsAppIconFilled = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const Settings = () => {
  const [whatsappRemindersEnabled, setWhatsappRemindersEnabled] = useState(true);
  const [editingMessageType, setEditingMessageType] = useState(null);
  const [isTimingDropdownOpen, setIsTimingDropdownOpen] = useState(false);
  const [isUpdateAdminModalOpen, setIsUpdateAdminModalOpen] = useState(false);
  const [reminderTiming, setReminderTiming] = useState('3 days before');
  const [reminderMessage, setReminderMessage] = useState(
    "Hi {name},\n\nYour Fitness Factory membership is due tomorrow ({due_date}). Please make your membership payment to continue your fitness journey.\n\nThank you!\nFitness Factory 💪"
  );
  const [overdueMessage, setOverdueMessage] = useState(
    "Hi {name},\n\nYour Fitness Factory membership was due on {due_date}. Please make your membership payment as soon as possible to continue using the gym.\n\nThank you!\nFitness Factory 💪"
  );
  const [adminDetails, setAdminDetails] = useState({
    name: 'Admin',
    email: 'admin@fitnessfactory.in',
    phone: '+91 98765 43210'
  });

  useEffect(() => {
    if (isTimingDropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isTimingDropdownOpen]);

  return (
    <div className="flex flex-col h-full relative">


      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 scrollbar-hide max-w-4xl mx-auto w-full">
        
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Settings</h1>
          <p className="text-text-secondary text-sm">Manage your app preferences.</p>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* Reminder Settings */}
          <div className="bg-[#18181b] border border-border rounded-2xl overflow-hidden">

            <div className="p-4 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-4">
                <WhatsAppIconFilled className="w-6 h-6 text-[#25D366]" />
                <div>
                  <h4 className="text-white font-semibold text-sm">WhatsApp Reminders</h4>
                  <p className="text-text-secondary text-[11px] mt-0.5">Send automatic reminders to members</p>
                </div>
              </div>
              <button 
                onClick={() => setWhatsappRemindersEnabled(!whatsappRemindersEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${whatsappRemindersEnabled ? 'bg-primary' : 'bg-[#3a3a3c]'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform transform shadow-sm ${whatsappRemindersEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="p-4 flex items-center justify-between border-b border-border/50 relative">
              <div className="flex items-center gap-4">
                <Calendar className="w-6 h-6 text-white" strokeWidth={1.5} />
                <div>
                  <h4 className="text-white font-semibold text-sm">Reminder Timing</h4>
                </div>
              </div>
              <div 
                className="flex items-center gap-2 border border-primary px-3 py-1.5 rounded-lg bg-surface relative z-10 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setIsTimingDropdownOpen(true)}
              >
                <span className="text-white text-sm font-medium">{reminderTiming}</span>
                <ChevronDown className="w-4 h-4 text-primary" />
              </div>

              {/* Dropdown Overlay and Menu */}
              {isTimingDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsTimingDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-4 top-16 z-50 w-48 bg-[#1e1e1e] border border-primary rounded-xl shadow-xl overflow-hidden">
                    {['Same day', '1 day before', '3 days before'].map((option) => (
                      <button 
                        key={option}
                        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors border-b border-border/50 last:border-0"
                        onClick={() => {
                          setReminderTiming(option);
                          setIsTimingDropdownOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors border-b border-border/50"
              onClick={() => setEditingMessageType('reminder')}
            >
              <div className="flex items-center gap-4">
                <MessageSquare className="w-6 h-6 text-white" strokeWidth={1.5} />
                <div>
                  <h4 className="text-white font-semibold text-sm">Reminder Message</h4>
                  <p className="text-text-secondary text-[11px] mt-0.5">Customize the message sent to members</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-text-secondary" />
            </div>

            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors border-b border-border/50"
              onClick={() => setEditingMessageType('overdue')}
            >
              <div className="flex items-center gap-4">
                <MessageSquare className="w-6 h-6 text-white" strokeWidth={1.5} />
                <div>
                  <h4 className="text-white font-semibold text-sm">Overdue Message</h4>
                  <p className="text-text-secondary text-[11px] mt-0.5">Customize the message sent for overdue payments</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-text-secondary" />
            </div>

            <div className="p-4 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-4">
                <Wifi className="w-6 h-6 text-success" strokeWidth={1.5} />
                <div>
                  <h4 className="text-white font-semibold text-sm">WhatsApp Connection</h4>
                  <p className="text-text-secondary text-[11px] mt-0.5">Connected and ready to send reminders</p>
                </div>
              </div>
              <div className="bg-[#0f3b21] border border-[#1e6132] px-3 py-1.5 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-success text-xs font-bold">Connected</span>
              </div>
            </div>
          </div>

          {/* Admin Account */}
          <div className="bg-[#18181b] border border-border rounded-2xl overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-border/50">
              <User className="w-6 h-6 text-primary" strokeWidth={2.5} />
              <div>
                <h3 className="text-white font-bold text-[15px]">Admin Account</h3>
                <p className="text-text-secondary text-xs mt-0.5">Manage your account details.</p>
              </div>
            </div>

            <div className="p-4 flex items-start gap-4">
              <Users className="w-5 h-5 text-text-secondary mt-0.5" strokeWidth={2} />
              <div>
                <h4 className="text-white font-semibold text-sm">Admin Name</h4>
                <p className="text-text-secondary text-[13px] mt-0.5">{adminDetails.name}</p>
              </div>
            </div>

            <div className="p-4 flex items-start gap-4 pt-1">
              <Mail className="w-5 h-5 text-text-secondary mt-0.5" strokeWidth={2} />
              <div>
                <h4 className="text-white font-semibold text-sm">Email</h4>
                <p className="text-text-secondary text-[13px] mt-0.5">{adminDetails.email}</p>
              </div>
            </div>

            <div className="p-4 flex items-start gap-4 pt-1 border-b border-border/50 pb-5">
              <Phone className="w-5 h-5 text-text-secondary mt-0.5" strokeWidth={2} />
              <div>
                <h4 className="text-white font-semibold text-sm">Mobile Number</h4>
                <p className="text-text-secondary text-[13px] mt-0.5">{adminDetails.phone}</p>
              </div>
            </div>

            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors border-b border-border/50"
              onClick={() => setIsUpdateAdminModalOpen(true)}
            >
              <div className="flex items-center gap-4">
                <Lock className="w-5 h-5 text-white" strokeWidth={2} />
                <h4 className="text-white font-semibold text-sm">Change Login Details</h4>
              </div>
              <ChevronRight className="w-5 h-5 text-text-secondary" />
            </div>

            <div className="p-4">
              <button className="w-full flex items-center justify-center gap-2 border border-[#f23838]/50 hover:bg-[#f23838]/10 text-[#f23838] py-3 rounded-2xl font-medium transition-colors bg-transparent">
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          </div>

          {/* General Settings */}
          <div className="bg-[#18181b] border border-border rounded-2xl overflow-hidden mb-6">
            <div className="p-4 flex items-center gap-4 border-b border-border/50">
              <SettingsIcon className="w-6 h-6 text-primary" strokeWidth={2.5} />
              <div>
                <h3 className="text-white font-bold text-[15px]">General Settings</h3>
                <p className="text-text-secondary text-xs mt-0.5">App related information.</p>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <Info className="w-6 h-6 text-white" strokeWidth={1.5} />
                <div>
                  <h4 className="text-white font-semibold text-sm">App Information</h4>
                  <p className="text-text-secondary text-[11px] mt-0.5">Version, privacy policy and support</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-text-secondary" />
            </div>
          </div>

        </div>
      </div>

      <ReminderMessageModal 
        isOpen={editingMessageType !== null}
        onClose={() => setEditingMessageType(null)}
        initialMessage={editingMessageType === 'reminder' ? reminderMessage : (editingMessageType === 'overdue' ? overdueMessage : '')}
        onSave={(newMessage) => {
          if (editingMessageType === 'reminder') setReminderMessage(newMessage);
          if (editingMessageType === 'overdue') setOverdueMessage(newMessage);
        }}
        title={editingMessageType === 'reminder' ? "Edit Reminder Message" : "Edit Overdue Message"}
        description={editingMessageType === 'reminder' ? "Customize the message sent before the due date." : "Customize the message sent after the due date."}
      />

      <UpdateAdminModal 
        isOpen={isUpdateAdminModalOpen}
        onClose={() => setIsUpdateAdminModalOpen(false)}
        initialData={adminDetails}
        onSave={(newData) => setAdminDetails(newData)}
      />
    </div>
  );
};

export default Settings;
