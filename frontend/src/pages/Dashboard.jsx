import React from 'react';
import StatCard from '../components/StatCard';
import { UpcomingPaymentsTable, RecentPaymentsTable } from '../components/PaymentsTable';
import Banner from '../components/Banner';
import { Users, UserCheck, Clock, AlertCircle } from 'lucide-react';

// Mock Data
const upcomingPaymentsData = [
  { id: '001', name: 'Rahul Kumar', plan: 'Monthly', dueDate: 'Tomorrow', status: 'Due Soon' },
  { id: '002', name: 'Arun Nair', plan: '3 Months', dueDate: '12 Sep 2026', status: 'Active' },
  { id: '003', name: 'Vishnu P', plan: 'Monthly', dueDate: '15 Sep 2026', status: 'Active' },
  { id: '004', name: 'Akhil M', plan: '6 Months', dueDate: '16 Sep 2026', status: 'Active' },
  { id: '005', name: 'Sreeraj', plan: '1 Year', dueDate: '18 Sep 2026', status: 'Active' },
];

const recentPaymentsData = [
  { id: '006', name: 'Albin Jose', plan: 'Monthly', paidDate: '6 Sep 2026', amount: '₹1,000' },
  { id: '007', name: 'Nikhil S', plan: '3 Months', paidDate: '6 Sep 2026', amount: '₹2,500' },
  { id: '008', name: 'Rahul A', plan: 'Monthly', paidDate: '5 Sep 2026', amount: '₹1,000' },
  { id: '009', name: 'Jithin K', plan: '6 Months', paidDate: '5 Sep 2026', amount: '₹4,500' },
  { id: '010', name: 'Pranav M', plan: '1 Year', paidDate: '4 Sep 2026', amount: '₹8,000' },
];

const Dashboard = () => {
  return (
    <>
      {/* Header section - Date only */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Monday, 7 September 2026</h1>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-16">
        <StatCard 
          title="Total Members" 
          value="128" 
          icon={Users} 
          colorClass="text-primary" 
          bgClass="bg-primary/10" 
        />
        <StatCard 
          title="Active Members" 
          value="115" 
          icon={UserCheck} 
          colorClass="text-success" 
          bgClass="bg-success/10" 
        />
        <StatCard 
          title="Due Tomorrow" 
          value="8" 
          icon={Clock} 
          colorClass="text-warning" 
          bgClass="bg-warning/10" 
        />
        <StatCard 
          title="Overdue" 
          value="5" 
          icon={AlertCircle} 
          colorClass="text-danger" 
          bgClass="bg-danger/10" 
        />
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <UpcomingPaymentsTable data={upcomingPaymentsData} />
        <RecentPaymentsTable data={recentPaymentsData} />
      </div>

      {/* Banner */}
      <div className="hidden md:block">
        <Banner />
      </div>

      {/* Mobile Add Client Button */}
      <div className="md:hidden mt-6 mb-4">
        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <span className="text-xl leading-none mb-0.5">+</span> Add Client
        </button>
      </div>
    </>
  );
};

export default Dashboard;
