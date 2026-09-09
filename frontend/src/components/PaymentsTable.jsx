import React from 'react';
import { MoreVertical, ChevronRight, ChevronDown, Calendar, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Active':
        return {
          styles: 'bg-transparent text-success border-success/50',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 fill-success text-bg" />
        };
      case 'Due Soon':
        return {
          styles: 'bg-transparent text-primary border-primary/50',
          icon: <Clock className="w-3.5 h-3.5 mr-1.5" />
        };
      case 'Overdue':
        return {
          styles: 'bg-transparent text-danger border-danger/50',
          icon: <Clock className="w-3.5 h-3.5 mr-1.5" />
        };
      default:
        return {
          styles: 'bg-surface text-text-secondary border-border',
          icon: null
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${config.styles}`}>
      {config.icon}
      {status}
    </div>
  );
};

export const UpcomingPaymentsTable = ({ data }) => {
  return (
    <div className="flex flex-col mb-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl border-2 border-primary text-primary flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Upcoming Payments</h2>
            <p className="text-sm text-text-secondary mt-0.5">Members with payments due soon</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {data.map((row, idx) => (
          <Link to={`/member/${row.id}`} key={row.id} className={`block ${idx >= 3 ? 'hidden md:block' : ''}`}>
            <div className="bg-surface rounded-2xl p-4 flex items-center justify-between border border-border hover:border-text-secondary/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-4 md:gap-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-border bg-bg flex items-center justify-center text-sm font-medium text-text-primary flex-shrink-0">
                  {row.id}
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="font-bold text-base md:text-lg text-text-primary">{row.name}</p>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">{row.plan}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-6">
                <div className="flex flex-col items-end gap-2">
                  <span className={`${row.dueDate === 'Tomorrow' ? 'text-primary font-bold tracking-wide' : 'text-text-secondary font-medium'} text-xs md:text-sm`}>
                    {row.dueDate}
                  </span>
                  <StatusBadge status={row.status} />
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary hidden sm:block" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/upcoming-payments" className="self-start mt-3">
        <button className="text-primary hover:text-primary/80 text-sm font-bold transition-colors">
          View All
        </button>
      </Link>
    </div>
  );
};

export const RecentPaymentsTable = ({ data }) => {
  return (
    <div className="flex flex-col mb-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl border-2 border-primary text-primary flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Recent Payments</h2>
            <p className="text-sm text-text-secondary mt-0.5">Latest payments received from members</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {data.map((row, idx) => {
          const initials = row.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
          return (
            <Link to={`/member/${row.id}`} key={idx} className={`block ${idx >= 3 ? 'hidden md:block' : ''}`}>
              <div className="bg-surface rounded-2xl p-4 flex items-center justify-between border border-border hover:border-text-secondary/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center font-bold text-text-primary flex-shrink-0 text-lg">
                    {initials}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="font-bold text-base md:text-lg text-text-primary">{row.name}</p>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{row.plan} &bull; {row.paidDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="bg-success/10 border border-success/30 px-3 py-1.5 md:px-4 md:py-2 rounded-xl">
                    <span className="text-success font-bold text-sm md:text-base tracking-wide">
                      {row.amount}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-secondary hidden sm:block" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <Link to="/recent-payments" className="self-start mt-3">
        <button className="text-primary hover:text-primary/80 text-sm font-bold transition-colors">
          View All
        </button>
      </Link>
    </div>
  );
};
