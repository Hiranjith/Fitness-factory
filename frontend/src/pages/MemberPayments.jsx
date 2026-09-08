import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, Calendar, IndianRupee, CheckCircle2, 
  MoreVertical, Eye, FileText, Phone, MapPin, PenSquare
} from 'lucide-react';

const MemberPayments = () => {
  const { id } = useParams();

  // Mock data for the specific member
  const member = {
    id: '001',
    name: 'Rahul Kumar',
    phone: '+91 98765 43210',
    location: 'Kochi, Kerala',
    plan: 'Monthly',
    amount: '₹1,000',
    startDate: '10 Aug 2026',
    nextDueDate: '10 Sep 2026',
    status: 'Active',
    totalPaid: '₹5,000',
    totalPayments: 5,
    firstPayment: '10 Apr 2026',
    lastPayment: '10 Aug 2026'
  };

  const paymentHistory = [
    { date: '10 Aug 2026', amount: '₹1,000', period: '10 Aug - 10 Sep 2026', status: 'Paid', method: 'Manual / Cash' },
    { date: '10 Jul 2026', amount: '₹1,000', period: '10 Jul - 10 Aug 2026', status: 'Paid', method: 'Manual / Cash' },
    { date: '10 Jun 2026', amount: '₹1,000', period: '10 Jun - 10 Jul 2026', status: 'Paid', method: 'Manual / Cash' },
    { date: '10 May 2026', amount: '₹1,000', period: '10 May - 10 Jun 2026', status: 'Paid', method: 'UPI' },
    { date: '10 Apr 2026', amount: '₹1,000', period: '10 Apr - 10 May 2026', status: 'Paid', method: 'Manual / Cash' },
  ];

  return (
    <div className="flex flex-col h-full relative">
      
      {/* ---------------- MOBILE VIEW ---------------- */}
      <div className="md:hidden flex flex-col px-4 pb-6">
        {/* Header */}
        <h1 className="text-2xl font-bold mt-2">Payment History</h1>
        <p className="text-text-secondary text-sm mt-1">{member.name} • #{member.id}</p>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <IndianRupee className="w-3.5 h-3.5 text-success" />
              </div>
              <span className="text-text-secondary text-xs font-medium">Total Paid</span>
            </div>
            <span className="text-success font-bold text-lg">{member.totalPaid}</span>
          </div>
          
          <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-bg border border-border flex items-center justify-center flex-shrink-0">
                <Calendar className="w-3.5 h-3.5 text-text-secondary" />
              </div>
              <span className="text-text-secondary text-xs font-medium">Total Payments</span>
            </div>
            <span className="text-text-primary font-bold text-lg">{member.totalPayments}</span>
          </div>
        </div>

        {/* Payment List */}
        <div className="flex flex-col gap-3 mt-6">
          {paymentHistory.map((payment, idx) => (
            <div key={idx} className="bg-surface rounded-2xl p-4 flex items-center justify-between border border-border">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-text-secondary" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-text-primary text-sm">{payment.date}</p>
                  <p className="text-[11px] text-text-secondary font-medium">Monthly Plan ({payment.date.split(' ')[1]})</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-bold text-text-primary text-sm">{payment.amount}</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-success text-bg">
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>


      {/* ---------------- DESKTOP VIEW ---------------- */}
      <div className="hidden md:flex flex-col pb-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-text-secondary hover:text-text-primary transition-colors">Clients</Link>
          <ChevronRight className="w-4 h-4 text-text-secondary" />
          <Link to={`/member/${id}`} className="text-text-secondary hover:text-text-primary transition-colors">{member.name}</Link>
          <ChevronRight className="w-4 h-4 text-text-secondary" />
          <span className="font-bold text-text-primary">Payments</span>
        </div>

        {/* Custom Header Card for Payments View */}
        <div className="rounded-3xl p-8 relative overflow-hidden bg-surface border border-border flex items-start justify-between gap-6 mb-10">
          {/* Left: Avatar and basic info */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-5xl text-bg font-medium flex-shrink-0">
              {member.name.charAt(0)}
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-text-primary">{member.name}</h2>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-base text-text-secondary font-medium">#{member.id}</span>
                <div className="bg-success/10 text-success border border-success/30 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 fill-success text-bg" />
                  {member.status}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2.5 text-text-secondary text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-text-secondary text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{member.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: Info Grid and Actions */}
          <div className="flex flex-col items-end gap-8 w-[400px]">
            <div className="flex items-center gap-3">
              <button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-xl flex items-center gap-2 transition-colors">
                <PenSquare className="w-4 h-4" /> Edit
              </button>
              <button className="bg-surface border border-border hover:bg-bg p-2 rounded-xl text-text-primary transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 w-full">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                     <Calendar className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Plan
                </div>
                <span className="text-text-primary font-bold text-base">{member.plan}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                     <IndianRupee className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Amount
                </div>
                <span className="text-text-primary font-bold text-base">{member.amount}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                     <Calendar className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Start Date
                </div>
                <span className="text-text-primary font-bold text-base">{member.startDate}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                     <Calendar className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Next Due Date
                </div>
                <span className="text-text-primary font-bold text-base">{member.nextDueDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="flex flex-col">
          <div className="flex items-end justify-between mb-6">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-xl">Payment History</h3>
              <p className="text-text-secondary text-sm">Complete list of payments made by this member.</p>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="bg-surface border border-border rounded-3xl overflow-hidden mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-text-secondary text-sm border-b border-border bg-bg/50">
                  <th className="py-5 px-6 font-medium">#</th>
                  <th className="py-5 px-6 font-medium">Date</th>
                  <th className="py-5 px-6 font-medium">Amount</th>
                  <th className="py-5 px-6 font-medium">Period</th>
                  <th className="py-5 px-6 font-medium">Status</th>
                  <th className="py-5 px-6 font-medium">Payment Method</th>
                  <th className="py-5 px-6 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {paymentHistory.map((payment, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0 hover:bg-bg/50 transition-colors">
                    <td className="py-5 px-6 text-text-secondary">{idx + 1}</td>
                    <td className="py-5 px-6 font-medium">{payment.date}</td>
                    <td className="py-5 px-6 font-medium">{payment.amount}</td>
                    <td className="py-5 px-6 text-text-secondary">{payment.period}</td>
                    <td className="py-5 px-6">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-success text-bg">
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-text-secondary">{payment.method}</td>
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-center">
                         <button className="p-2 hover:bg-bg rounded-lg text-text-secondary transition-colors">
                           <Eye className="w-5 h-5" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                  <IndianRupee className="w-5 h-5 text-success" />
                </div>
                <div className="flex flex-col">
                  <span className="text-text-secondary text-xs font-medium">Total Paid</span>
                  <span className="text-text-primary font-bold text-xl">{member.totalPaid}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-danger" />
                </div>
                <div className="flex flex-col">
                  <span className="text-text-secondary text-xs font-medium">Total Payments</span>
                  <span className="text-text-primary font-bold text-xl">{member.totalPayments}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-text-secondary text-xs font-medium">First Payment</span>
                  <span className="text-text-primary font-bold text-base">{member.firstPayment}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-text-secondary text-xs font-medium">Last Payment</span>
                  <span className="text-text-primary font-bold text-base">{member.lastPayment}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default MemberPayments;
