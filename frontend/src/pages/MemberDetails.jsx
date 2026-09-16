import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import SendReminderModal from '../components/SendReminderModal';
import EditMemberModal from '../components/EditMemberModal';
import DeleteMemberModal from '../components/DeleteMemberModal';
import RecordPaymentModal from '../components/RecordPaymentModal';
import { 
  ChevronLeft, MoreVertical, Phone, MapPin, 
  Calendar, CreditCard, Clock, CheckCircle2, 
  PenSquare, Trash2, IndianRupee, Send, FileText, ChevronRight, MoreHorizontal, Loader2
} from 'lucide-react';
import useMemberStore from '../store/useMemberStore';

const MemberDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const fromPath = location.state?.from || '/members';
  const fromName = location.state?.fromName || 'Members';
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { currentMember, fetchMemberDetails, isLoading } = useMemberStore();

  useEffect(() => {
    fetchMemberDetails(id);
  }, [id, fetchMemberDetails]);

  if (isLoading || !currentMember) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-text-secondary gap-3 mt-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p>Loading member details...</p>
      </div>
    );
  }

  const getDynamicStatus = (memberData) => {
    if (memberData.status === 'inactive') return 'Inactive';
    if (!memberData.currentMembership?.endDate) return 'Active';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(memberData.currentMembership.endDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Overdue';
    if (diffDays <= 7) return 'Due Soon';
    return 'Active';
  };

  const getDueInfo = (memberData) => {
    if (!memberData.currentMembership?.endDate) return { title: 'No Due Date', description: 'No active plan end date found.' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(memberData.currentMembership.endDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const days = Math.abs(diffDays);
      return { title: `Overdue by ${days} day${days !== 1 ? 's' : ''}`, description: 'Payment is overdue. Please make the payment immediately.' };
    } else if (diffDays === 0) {
      return { title: 'Due Today', description: 'Please make the payment today to continue your membership.' };
    } else if (diffDays === 1) {
      return { title: 'Due Tomorrow', description: 'Please make the payment tomorrow to continue your membership.' };
    } else if (diffDays <= 7) {
      return { title: `Due in ${diffDays} Days`, description: 'Please make the payment before the due date to continue your membership.' };
    } else {
      return { title: `Next Payment in ${diffDays} Days`, description: 'Your membership is active and running.' };
    }
  };

  const dueInfo = getDueInfo(currentMember);

  // Dynamic mapped data for the specific member
  const member = {
    _id: currentMember.id, // For backend calls
    id: String(currentMember.serial_no).padStart(3, '0'), // For display
    name: currentMember.name || 'Unknown',
    phone: currentMember.mobile_number || 'N/A',
    location: currentMember.address || 'Location unavailable',
    plan: currentMember.currentMembership?.planName || 'N/A',
    plan_id: currentMember.currentMembership?.planId || '',
    amount: currentMember.currentMembership?.amount ? `₹${currentMember.currentMembership.amount}` : 'N/A',
    startDate: currentMember.currentMembership?.startDate 
      ? new Date(currentMember.currentMembership.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
      : 'N/A',
    rawStartDate: currentMember.currentMembership?.startDate || '',
    nextDueDate: currentMember.currentMembership?.endDate 
      ? new Date(currentMember.currentMembership.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
      : 'N/A',
    status: getDynamicStatus(currentMember),
    paymentDueTitle: dueInfo.title,
    paymentDueDescription: dueInfo.description,
    latestPaymentDate: currentMember.latestPayment?.payment_date 
      ? new Date(currentMember.latestPayment.payment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : null
  };

  const paymentHistory = [
    { date: '10 Aug 2026', amount: '₹1,000', period: '10 Aug - 10 Sep', status: 'Active' },
    { date: '10 Jul 2026', amount: '₹1,000', period: '10 Jul - 10 Aug', status: 'Paid' },
    { date: '10 Jun 2026', amount: '₹1,000', period: '10 Jun - 10 Jul', status: 'Paid' },
    { date: '10 May 2026', amount: '₹1,000', period: '10 May - 10 Jun', status: 'Paid' },
    { date: '10 Apr 2026', amount: '₹1,000', period: '10 Apr - 10 May', status: 'Paid' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Title */}
      <h1 className="md:hidden text-2xl font-bold mb-6 mt-2">Member Details</h1>

      {/* Desktop Breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-sm mb-6">
        <Link to={fromPath} className="text-text-secondary hover:text-text-primary transition-colors">{fromName}</Link>
        <ChevronRight className="w-4 h-4 text-text-secondary" />
        <span className="font-bold text-text-primary">{member.name}</span>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-4 md:gap-6 pb-24 md:pb-0">
        
        {/* Header Card */}
        <div className="rounded-3xl p-5 md:p-8 relative overflow-hidden bg-surface border border-border">
          {/* Top section: Avatar and basic info */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 md:mb-10">
            <div className="flex items-center gap-5 md:gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary flex items-center justify-center text-4xl md:text-5xl text-bg font-medium flex-shrink-0">
                {member.name.charAt(0)}
              </div>
              <div className="flex flex-col gap-1 md:gap-2">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary">{member.name}</h2>
                <div className="flex items-center gap-3 md:gap-4 mb-2">
                  <span className="text-sm md:text-base text-text-secondary font-medium">#{member.id}</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center border capitalize ${member.status === 'Active' ? 'bg-success/10 text-success border-success/30' : member.status === 'Due Soon' ? 'bg-warning/10 text-warning border-warning/30' : member.status === 'Overdue' ? 'bg-danger/10 text-danger border-danger/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 mr-1.5 text-bg ${member.status === 'Active' ? 'fill-success' : member.status === 'Due Soon' ? 'fill-warning' : member.status === 'Overdue' ? 'fill-danger' : 'fill-gray-500'}`} />
                    {member.status}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 md:gap-2 mt-1 md:mt-2">
                  <div className="flex items-center gap-2.5 text-text-secondary text-sm md:text-base">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-text-secondary text-sm md:text-base">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    <span>{member.location}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop Action Buttons inside Header */}
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => setIsEditModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-xl flex items-center gap-2 transition-colors">
                <PenSquare className="w-4 h-4" /> Edit
              </button>
              <button className="bg-surface border border-border hover:bg-bg p-2 rounded-xl text-text-primary transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Info Grid (Plan, Amount, Dates) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-8 mb-6 md:mb-10">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-primary font-medium text-sm md:text-base mb-1">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5" /> Plan
              </div>
              <span className="text-text-primary font-bold text-base md:text-lg">{member.plan}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-primary font-medium text-sm md:text-base mb-1">
                <IndianRupee className="w-4 h-4 md:w-5 md:h-5" /> Amount
              </div>
              <span className="text-text-primary font-bold text-base md:text-lg">{member.amount}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-primary font-medium text-sm md:text-base mb-1">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" /> Start Date
              </div>
              <span className="text-text-primary font-bold text-base md:text-lg">{member.startDate}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-primary font-medium text-sm md:text-base mb-1">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" /> Next Due Date
              </div>
              <span className="text-text-primary font-bold text-base md:text-lg">{member.nextDueDate}</span>
            </div>
          </div>

          {/* Warning / Success Box */}
            <div className={`border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${member.status === 'Overdue' ? 'bg-danger/10 border-danger/20' : member.status === 'Active' ? 'bg-success/10 border-success/20' : 'bg-primary/10 border-primary/20'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${member.status === 'Overdue' ? 'bg-danger' : member.status === 'Active' ? 'bg-success' : 'bg-primary'}`}>
                  {member.status === 'Active' ? <CheckCircle2 className="w-5 h-5 text-bg" /> : <Clock className="w-4 h-4 text-bg" />}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className={`font-bold text-base md:text-lg ${member.status === 'Overdue' ? 'text-danger' : member.status === 'Active' ? 'text-success' : 'text-primary'}`}>
                    {member.status === 'Active' ? 'Payment Received' : member.paymentDueTitle}
                  </h3>
                  <p className="text-text-secondary text-sm md:text-base">
                    {member.status === 'Active' ? (member.latestPaymentDate ? `Last payment on ${member.latestPaymentDate}` : 'Membership is active and running.') : member.paymentDueDescription}
                  </p>
                </div>
              </div>
              {member.status !== 'Active' && (
                <button 
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-3.5 md:py-3 px-8 rounded-xl transition-colors text-base md:text-lg"
                >
                  Mark as Paid
                </button>
              )}
            </div>
        </div>

          {/* Mobile Specific - Quick Actions */}
          <div className="md:hidden flex flex-col mb-8 mt-2">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setIsReminderModalOpen(true)} className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-3">
                <Send className="w-6 h-6 text-primary" />
                <span className="text-[11px] text-text-primary font-medium text-center">Send Reminder</span>
              </button>
              <button onClick={() => setIsEditModalOpen(true)} className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-3">
                <PenSquare className="w-6 h-6 text-purple-400" />
                <span className="text-[11px] text-text-primary font-medium text-center">Edit Member</span>
              </button>
              <Link to={`/member/${member._id}/payments`} className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                <span className="text-[11px] text-text-primary font-medium text-center">View Payments</span>
              </Link>

              <button onClick={() => setIsDeleteModalOpen(true)} className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-3">
                <Trash2 className="w-6 h-6 text-danger" />
                <span className="text-[11px] text-text-primary font-medium text-center">Delete Member</span>
              </button>

            </div>
          </div>



        {/* Split Section for Desktop */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Payment History Table/List */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-4 md:mb-6 px-1 md:px-0">
              <h3 className="font-bold text-lg md:text-xl">Payment History</h3>
              <Link to="#" className="text-primary font-medium text-sm md:text-base hidden md:flex items-center gap-2 bg-surface border border-primary/30 hover:bg-primary/10 px-4 py-2 rounded-xl transition-colors">
                <span className="text-xl leading-none mb-0.5">+</span> Add Payment
              </Link>
              <Link to="#" className="text-primary font-medium text-sm md:hidden">View all</Link>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-surface border border-border rounded-3xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-text-secondary text-sm border-b border-border bg-bg/50">
                    <th className="py-5 px-6 font-medium">#</th>
                    <th className="py-5 px-6 font-medium">Date</th>
                    <th className="py-5 px-6 font-medium">Amount</th>
                    <th className="py-5 px-6 font-medium">Period</th>
                    <th className="py-5 px-6 font-medium">Status</th>
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
                        <span className={`px-3 py-1.5 rounded-md text-xs font-bold border ${payment.status === 'Active' ? 'bg-success/10 text-success border-success/30' : 'bg-transparent text-success border-success/30'}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden flex flex-col gap-3">
              {paymentHistory.map((payment, idx) => (
                <div key={idx} className="bg-surface rounded-2xl p-4 flex items-center justify-between border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-medium text-text-primary text-sm">{payment.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-text-primary">{payment.amount}</span>
                    <ChevronRight className="w-4 h-4 text-text-secondary" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Member Actions (Desktop) */}
          <div className="hidden lg:flex flex-col">
            <h3 className="font-bold text-xl mb-6">Member Actions</h3>
            <div className="bg-surface border border-border rounded-3xl overflow-hidden flex flex-col">
              
              <button onClick={() => setIsPaymentModalOpen(true)} className="flex items-center justify-between p-5 border-b border-border hover:bg-bg/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-text-primary text-base">Mark as Paid</span>
                    <span className="text-text-secondary text-xs">Record a new payment</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
              </button>

              <button onClick={() => setIsReminderModalOpen(true)} className="flex items-center justify-between p-5 border-b border-border hover:bg-bg/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <Send className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-text-primary text-base">Send Reminder</span>
                    <span className="text-text-secondary text-xs">Send WhatsApp reminder</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
              </button>

              <button onClick={() => setIsEditModalOpen(true)} className="flex items-center justify-between p-5 border-b border-border hover:bg-bg/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <PenSquare className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-text-primary text-base">Edit Member</span>
                    <span className="text-text-secondary text-xs">Update member details</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
              </button>

              <Link to={`/member/${member._id}/payments`} className="flex items-center justify-between p-5 border-b border-border hover:bg-bg/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-text-primary text-base">View All Payments</span>
                    <span className="text-text-secondary text-xs">See complete history</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
              </Link>

              <button onClick={() => setIsDeleteModalOpen(true)} className="flex items-center justify-between p-5 hover:bg-danger/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-danger">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-danger text-base">Delete Member</span>
                    <span className="text-text-secondary text-xs">Remove member from system</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-danger transition-colors" />
              </button>
              
            </div>
          </div>

        </div>

      </div>

      <SendReminderModal 
        isOpen={isReminderModalOpen} 
        onClose={() => setIsReminderModalOpen(false)} 
        member={member} 
      />

      <EditMemberModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        member={member} 
      />

      <DeleteMemberModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        member={member} 
        onDeleteSuccess={() => navigate(fromPath)}
      />

      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        member={{...member, currentMembership: currentMember.currentMembership}}
      />

    </div>
  );
};

export default MemberDetails;
