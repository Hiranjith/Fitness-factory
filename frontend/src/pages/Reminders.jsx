import React, { useState } from 'react';
import { Search, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';


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


const Reminders = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReminders = reminderHistory.filter(reminder => 
    reminder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full relative">


      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 scrollbar-hide">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 hidden md:block">Reminders</h1>


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
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary whitespace-nowrap">Serial Number</th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary">Member</th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary">Phone</th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary">Plan</th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary">Due Date</th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary">Sent On</th>
                  <th className="py-4 px-6 text-sm font-medium text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReminders.map((reminder) => (
                  <tr key={reminder.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-text-secondary text-sm">{reminder.memberId}</td>
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs bg-[#2A1700] border border-primary shadow-sm">
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
          {filteredReminders.map((reminder) => (
            <div key={reminder.id} className="bg-[#1c1c1e] border border-[#38383a] rounded-[20px] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-[46px] h-[46px] flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white text-[16px] bg-[#2A1700] border border-primary shadow-sm">
                  {getInitials(reminder.name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-[16px] leading-tight">{reminder.name}</span>
                </div>
              </div>

              <div className="flex items-center">
                <span className={`text-[13px] font-bold px-3 py-1.5 rounded-xl border ${
                  reminder.status === 'Sent' ? 'bg-[#0f3b21] text-[#2ebd59] border-[#1e6132]' : 'bg-[#401214] text-[#f23838] border-[#7f1d1d]'
                }`}>
                  {reminder.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
