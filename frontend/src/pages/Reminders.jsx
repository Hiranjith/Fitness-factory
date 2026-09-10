import React, { useState } from 'react';
import { Search, Edit2, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import TopBar from '../components/TopBar';
import MobileNav from '../components/MobileNav';

const reminderHistory = [
  { id: 1, memberId: '048', name: 'Divya S', phone: '+91 76501 23456', plan: 'Quarterly', fullPlanName: 'Quarterly Plan', dueDate: '5 Sep 2026', sentOn: '5 Sep 2026, 9:00 AM', status: 'Sent' },
  { id: 2, memberId: '053', name: 'Kiran Nair', phone: '+91 65401 23456', plan: 'Monthly', fullPlanName: 'Monthly Plan', dueDate: '4 Sep 2026', sentOn: '4 Sep 2026, 9:00 AM', status: 'Sent' },
  { id: 3, memberId: '059', name: 'Pranav K', phone: '+91 91234 56789', plan: '1 Year', fullPlanName: '1 Year Plan', dueDate: '3 Sep 2026', sentOn: '3 Sep 2026, 9:00 AM', status: 'Sent' },
  { id: 4, memberId: '062', name: 'Neha Raj', phone: '+91 87650 12345', plan: '3 Months', fullPlanName: '3 Months Plan', dueDate: '2 Sep 2026', sentOn: '2 Sep 2026, 9:00 AM', status: 'Failed' },
  { id: 5, memberId: '067', name: 'Rahul Kumar', phone: '+91 89876 54321', plan: 'Monthly', fullPlanName: 'Monthly Plan', dueDate: '1 Sep 2026', sentOn: '1 Sep 2026, 9:00 AM', status: 'Sent' },
];

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const WhatsAppIconFilled = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const Reminders = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col h-full relative">
      <TopBar title="Reminders" />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 scrollbar-hide">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 hidden md:block">Reminders</h1>

        {/* Reminder Message Card */}
        <div className="bg-[#18181b] border border-border rounded-2xl p-4 md:p-6 mb-8">
          <div className="flex flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center gap-4">
              <WhatsAppIconFilled className="w-10 h-10 md:w-12 md:h-12 text-[#25D366]" />
              <div>
                <h2 className="text-white font-bold text-lg hidden md:block">WhatsApp Reminder Message</h2>
                <h2 className="text-white font-bold text-lg md:hidden">Reminder Message</h2>
                <p className="text-text-secondary text-xs md:text-sm">Customize your WhatsApp reminder message.</p>
              </div>
            </div>
            <button className="flex items-center gap-2 border border-border bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-xl text-sm transition-colors flex-shrink-0">
              <Edit2 className="w-4 h-4" /> <span className="hidden md:inline">Edit</span><span className="md:hidden">Edit</span>
            </button>
          </div>

          <div className="bg-[#1e1e1e] border border-border/50 rounded-xl p-4 mb-4">
            <p className="text-[#e5e5e5] text-sm leading-relaxed whitespace-pre-line">
              Hi {'{name}'},{'\n\n'}
              Your Fitness Factory membership is due tomorrow ({'{due_date}'}). Please make your membership payment to continue your fitness journey.{'\n\n'}
              Thank you!{'\n'}
              Fitness Factory 💪
            </p>
          </div>

          <div>
            <p className="text-text-secondary text-xs mb-2">Available Variables</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white/10 text-text-primary text-xs px-3 py-1.5 rounded-lg border border-white/5">{'{name}'}</span>
              <span className="bg-white/10 text-text-primary text-xs px-3 py-1.5 rounded-lg border border-white/5">{'{due_date}'}</span>
              <span className="bg-white/10 text-text-primary text-xs px-3 py-1.5 rounded-lg border border-white/5">{'{plan_name}'}</span>
            </div>
          </div>
        </div>

        {/* Reminder History Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">Reminder History</h2>
          
          <div className="flex items-center bg-[#18181b] border border-border rounded-xl px-4 py-2.5 w-full md:w-72">
            <Search className="w-5 h-5 text-text-secondary mr-2" />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-text-secondary"
            />
          </div>
        </div>

        {/* Reminder History Desktop Table */}
        <div className="hidden md:block bg-[#18181b] border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-[#222]">
                  <th className="py-4 px-6 w-12">
                    <input type="checkbox" className="w-4 h-4 rounded border-text-secondary/30 bg-transparent text-primary focus:ring-primary focus:ring-offset-0" />
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary whitespace-nowrap">#</th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary">Member</th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary">Phone</th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary">Plan</th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary">Due Date</th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary">Sent On</th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {reminderHistory.map((reminder) => (
                  <tr key={reminder.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <input type="checkbox" className="w-4 h-4 rounded border-text-secondary/30 bg-transparent text-primary focus:ring-primary focus:ring-offset-0" />
                    </td>
                    <td className="py-4 px-6 text-text-secondary text-sm">{reminder.memberId}</td>
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm ${
                        reminder.name === 'Divya S' ? 'bg-[#ca8a04]' : 
                        reminder.name === 'Kiran Nair' ? 'bg-[#0891b2]' :
                        reminder.name === 'Pranav K' ? 'bg-[#0284c7]' :
                        reminder.name === 'Neha Raj' ? 'bg-[#7c3aed]' :
                        'bg-[#dc2626]'
                      }`}>
                        {getInitials(reminder.name)}
                      </div>
                      <span className="text-white text-sm font-medium">{reminder.name}</span>
                    </td>
                    <td className="py-4 px-6 text-text-secondary text-sm">{reminder.phone}</td>
                    <td className="py-4 px-6 text-text-secondary text-sm">{reminder.plan}</td>
                    <td className="py-4 px-6 text-text-secondary text-sm">{reminder.dueDate}</td>
                    <td className="py-4 px-6 text-text-secondary text-sm">{reminder.sentOn}</td>
                    <td className="py-4 px-6">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-md ${
                        reminder.status === 'Sent' ? 'bg-[#0f3b21] text-[#2ebd59]' : 'bg-[#401214] text-[#f23838]'
                      }`}>
                        {reminder.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-border/50 flex items-center justify-between bg-[#18181b]">
            <span className="text-text-secondary text-sm">Showing 1 – 5 of 24 reminders</span>
            <div className="flex gap-1 items-center">
              <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white rounded-md transition-colors border border-transparent hover:border-border">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-primary text-white font-medium text-sm rounded-md">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 font-medium text-sm rounded-md transition-colors">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 font-medium text-sm rounded-md transition-colors">
                3
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 font-medium text-sm rounded-md transition-colors">
                4
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 font-medium text-sm rounded-md transition-colors">
                5
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white rounded-md transition-colors border border-transparent hover:border-border">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Reminder History Mobile Cards */}
        <div className="md:hidden flex flex-col gap-3">
          {reminderHistory.map((reminder) => (
            <div key={reminder.id} className="bg-[#18181b] border border-border rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white text-base shadow-sm ${
                  reminder.name === 'Divya S' ? 'bg-[#ca8a04]' : 
                  reminder.name === 'Kiran Nair' ? 'bg-[#0891b2]' :
                  reminder.name === 'Pranav K' ? 'bg-[#0284c7]' :
                  reminder.name === 'Neha Raj' ? 'bg-[#7c3aed]' :
                  'bg-[#dc2626]'
                }`}>
                  {getInitials(reminder.name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">{reminder.name}</span>
                  <span className="text-text-secondary text-xs">#{reminder.memberId} • {reminder.fullPlanName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-text-secondary mb-1" />
                  <div className="flex flex-col">
                    <span className="text-text-secondary text-[10px]">Sent on</span>
                    <span className="text-text-secondary text-[10px]">{reminder.sentOn}</span>
                  </div>
                </div>
                
                <span className={`text-[11px] font-bold px-2 py-1 rounded-md flex items-center justify-center ${
                  reminder.status === 'Sent' ? 'bg-[#0f3b21] text-[#2ebd59]' : 'bg-[#401214] text-[#f23838]'
                }`}>
                  {reminder.status}
                </span>
                <ChevronRight className="w-5 h-5 text-text-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Reminders;
