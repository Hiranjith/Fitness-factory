import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, Calendar, IndianRupee, CheckCircle2, 
  MoreVertical, Eye, FileText, Phone, MapPin, PenSquare, Loader2
} from 'lucide-react';
import api from '../api/axios';

const MemberPayments = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/members/${id}/payments`);
        setData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-4">
        <p className="text-danger">{error || 'Member not found'}</p>
        <Link to="/members" className="text-primary hover:underline">Go back to members</Link>
      </div>
    );
  }

  const { member, payments } = data;
  const currentMembership = member.currentMembership || {};
  const planName = currentMembership.planName || 'Unknown Plan';
  
  // Format dates
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPayments = payments.length;
  // Payments are sorted by date descending, so last is oldest (first payment)
  const firstPayment = payments.length > 0 ? formatDate(payments[payments.length - 1].payment_date) : 'N/A';
  const lastPayment = payments.length > 0 ? formatDate(payments[0].payment_date) : 'N/A';

  const memberStatus = member.status === 'active' ? 'Active' : 'Inactive';

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
            <span className="text-success font-bold text-lg">₹{totalPaid}</span>
          </div>
          
          <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-bg border border-border flex items-center justify-center flex-shrink-0">
                <Calendar className="w-3.5 h-3.5 text-text-secondary" />
              </div>
              <span className="text-text-secondary text-xs font-medium">Total Payments</span>
            </div>
            <span className="text-text-primary font-bold text-lg">{totalPayments}</span>
          </div>
        </div>

        {/* Payment List */}
        <div className="flex flex-col gap-3 mt-6">
          {payments.length === 0 ? (
            <div className="text-center text-text-secondary py-8 bg-surface border border-border rounded-2xl">
              No payments found.
            </div>
          ) : (
            payments.map((payment, idx) => (
              <div key={payment._id || idx} className="bg-surface rounded-2xl p-4 flex items-center justify-between border border-border">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-lg bg-bg border border-border flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-text-secondary" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-text-primary text-sm">{formatDate(payment.payment_date)}</p>
                    <p className="text-[11px] text-text-secondary font-medium">{planName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="font-bold text-text-primary text-sm">₹{payment.amount}</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-success text-bg">
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>


      {/* ---------------- DESKTOP VIEW ---------------- */}
      <div className="hidden md:flex flex-col pb-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/clients" className="text-text-secondary hover:text-text-primary transition-colors">Clients</Link>
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
                <span className="text-base text-text-secondary font-medium">#{member.serial_no}</span>
                <div className={`${memberStatus === 'Active' ? 'bg-success/10 text-success border-success/30' : 'bg-danger/10 text-danger border-danger/30'} border px-3 py-1 rounded-full text-xs font-bold flex items-center capitalize`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 mr-1.5 ${memberStatus === 'Active' ? 'fill-success text-bg' : 'fill-danger text-bg'}`} />
                  {memberStatus}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2.5 text-text-secondary text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{member.mobile_number}</span>
                </div>
                <div className="flex items-center gap-2.5 text-text-secondary text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{member.address || 'No Address Provided'}</span>
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
                <span className="text-text-primary font-bold text-base">{planName}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                     <IndianRupee className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Amount
                </div>
                <span className="text-text-primary font-bold text-base">₹{currentMembership.amount || 0}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                     <Calendar className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Start Date
                </div>
                <span className="text-text-primary font-bold text-base">{formatDate(currentMembership.start_date)}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                     <Calendar className="w-3.5 h-3.5 text-primary" />
                  </div>
                  Next Due Date
                </div>
                <span className="text-text-primary font-bold text-base">{formatDate(currentMembership.end_date)}</span>
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
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-text-secondary">No payments found.</td>
                  </tr>
                ) : (
                  payments.map((payment, idx) => (
                    <tr key={payment._id || idx} className="border-b border-border last:border-0 hover:bg-bg/50 transition-colors">
                      <td className="py-5 px-6 text-text-secondary">{idx + 1}</td>
                      <td className="py-5 px-6 font-medium">{formatDate(payment.payment_date)}</td>
                      <td className="py-5 px-6 font-medium">₹{payment.amount}</td>
                      <td className="py-5 px-6 text-text-secondary">{planName}</td>
                      <td className="py-5 px-6">
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-success text-bg">
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-text-secondary">{payment.payment_method}</td>
                      <td className="py-5 px-6">
                        <div className="flex items-center justify-center">
                           <button className="p-2 hover:bg-bg rounded-lg text-text-secondary transition-colors">
                             <Eye className="w-5 h-5" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
                  <span className="text-text-primary font-bold text-xl">₹{totalPaid}</span>
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
                  <span className="text-text-primary font-bold text-xl">{totalPayments}</span>
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
                  <span className="text-text-primary font-bold text-base">{firstPayment}</span>
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
                  <span className="text-text-primary font-bold text-base">{lastPayment}</span>
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
