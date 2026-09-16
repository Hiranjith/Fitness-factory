import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { UpcomingPaymentsTable, RecentPaymentsTable } from '../components/PaymentsTable';
import Banner from '../components/Banner';
import { Users, UserCheck, Clock, AlertCircle } from 'lucide-react';
import api from '../api/axios';

// Mock Data replaced by dynamic API calls

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentPayments, setRecentPayments] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    dueTomorrow: 0,
    overdue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };

    const fetchRecentPayments = async () => {
      try {
        const res = await api.get('/payments/recent?limit=5');
        const formatted = res.data.data.map(p => ({
          id: p.member.id, // For initials
          memberId: p.member.id, // Keep the real ID to link
          name: p.member.name,
          plan: p.plan.name,
          paidDate: new Date(p.payment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          amount: `₹${p.amount}`
        }));
        setRecentPayments(formatted);
      } catch (err) {
        console.error('Failed to fetch recent payments', err);
      }
    };

    const fetchUpcomingPayments = async () => {
      try {
        const res = await api.get('/payments/upcoming?limit=5');
        setUpcomingPayments(res.data.data);
      } catch (err) {
        console.error('Failed to fetch upcoming payments', err);
      }
    };

    fetchStats();
    fetchRecentPayments();
    fetchUpcomingPayments();
  }, []);

  const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      {/* Header section - Date only */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold">{todayStr}</h1>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-16">
        <StatCard 
          title="Total Members" 
          value={stats.totalMembers} 
          icon={Users} 
          colorClass="text-primary" 
          bgClass="bg-primary/10" 
          onClick={() => navigate('/members?tab=All')}
        />
        <StatCard 
          title="Active Members" 
          value={stats.activeMembers} 
          icon={UserCheck} 
          colorClass="text-success" 
          bgClass="bg-success/10" 
          onClick={() => navigate('/members?tab=Active')}
        />
        <StatCard 
          title="Due Tomorrow" 
          value={stats.dueTomorrow} 
          icon={Clock} 
          colorClass="text-warning" 
          bgClass="bg-warning/10" 
          onClick={() => navigate('/members?tab=Due Soon')}
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdue} 
          icon={AlertCircle} 
          colorClass="text-danger" 
          bgClass="bg-danger/10" 
          onClick={() => navigate('/members?tab=Overdue')}
        />
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <UpcomingPaymentsTable data={upcomingPayments} />
        <RecentPaymentsTable data={recentPayments} />
      </div>

      {/* Banner */}
      <div className="hidden md:block">
        <Banner />
      </div>
    </>
  );
};

export default Dashboard;
