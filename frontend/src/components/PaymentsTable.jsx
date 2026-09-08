import React from 'react';
import { MoreVertical, ChevronRight } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-success/10 text-success border-success/20';
      case 'Due Soon':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Overdue':
        return 'bg-danger/10 text-danger border-danger/20';
      default:
        return 'bg-surface text-text-secondary border-border';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-medium border ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

export const UpcomingPaymentsTable = ({ data }) => {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="flex justify-between items-center p-4 md:p-6 border-b border-border">
        <h3 className="font-semibold text-base md:text-lg">Upcoming Payments</h3>
        <a href="#" className="text-primary text-xs md:text-sm font-medium hover:underline">View all</a>
      </div>
      
      {/* Mobile List View */}
      <div className="md:hidden flex flex-col">
        {data.map((row) => (
          <div key={row.id} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-bg/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-xs text-text-secondary flex-shrink-0">
                {row.id}
              </div>
              <div>
                <p className="font-medium text-sm text-text-primary">{row.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">{row.plan}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end gap-1">
                <span className={`${row.status === 'Due Soon' ? 'text-warning' : 'text-text-secondary'} text-[10px] md:text-xs font-medium`}>
                  {row.dueDate}
                </span>
                <StatusBadge status={row.status} />
              </div>
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-text-secondary text-sm border-b border-border bg-bg/50">
              <th className="py-4 px-6 font-medium">#</th>
              <th className="py-4 px-6 font-medium">Name</th>
              <th className="py-4 px-6 font-medium">Plan</th>
              <th className="py-4 px-6 font-medium">Due Date</th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-bg/50 transition-colors">
                <td className="py-4 px-6 text-text-secondary">{row.id}</td>
                <td className="py-4 px-6 font-medium">{row.name}</td>
                <td className="py-4 px-6 text-text-secondary">{row.plan}</td>
                <td className={`py-4 px-6 ${row.status === 'Due Soon' ? 'text-warning font-medium' : 'text-text-secondary'}`}>
                  {row.dueDate}
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-4 px-6 text-center">
                  <button className="text-text-secondary hover:text-text-primary">
                    <MoreVertical className="w-5 h-5 mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const RecentPaymentsTable = ({ data }) => {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="flex justify-between items-center p-4 md:p-6 border-b border-border">
        <h3 className="font-semibold text-base md:text-lg">Recent Payments</h3>
        <a href="#" className="text-primary text-xs md:text-sm font-medium hover:underline">View all</a>
      </div>
      
      {/* Mobile List View */}
      <div className="md:hidden flex flex-col">
        {data.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-bg/50 transition-colors">
            <div className="flex flex-col">
              <p className="font-medium text-sm text-text-primary">{row.name}</p>
              <p className="text-xs text-text-secondary mt-0.5">{row.plan} • {row.paidDate}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-text-primary">{row.amount}</span>
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-text-secondary text-sm border-b border-border bg-bg/50">
              <th className="py-4 px-6 font-medium">Name</th>
              <th className="py-4 px-6 font-medium">Plan</th>
              <th className="py-4 px-6 font-medium">Paid Date</th>
              <th className="py-4 px-6 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-border last:border-0 hover:bg-bg/50 transition-colors">
                <td className="py-4 px-6 font-medium">{row.name}</td>
                <td className="py-4 px-6 text-text-secondary">{row.plan}</td>
                <td className="py-4 px-6 text-text-secondary">{row.paidDate}</td>
                <td className="py-4 px-6 font-medium">{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
