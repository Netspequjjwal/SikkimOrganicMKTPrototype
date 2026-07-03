import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNegotiation } from '../../context/NegotiationContext';
import { Search, FileText, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const BuyerEnquiries: React.FC = () => {
  const navigate = useNavigate();
  const { enquiries } = useNegotiation();

  // In a real app, we'd filter by supplierName === user.name
  const supplierEnquiries = enquiries; 

  const newCount = supplierEnquiries.filter(e => e.status === 'New Enquiry').length;
  const activeCount = supplierEnquiries.filter(e => e.status !== 'Negotiation Successful' && e.status !== 'Negotiation Declined' && e.status !== 'Converted to Digital Contract').length;
  const winRate = '85%';

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New Enquiry': return 'bg-blue-100 text-blue-800';
      case 'Quotation Submitted': return 'bg-purple-100 text-purple-800';
      case 'Counter Offer': return 'bg-orange-100 text-orange-800';
      case 'Under Negotiation': return 'bg-yellow-100 text-yellow-800';
      case 'Negotiation Successful': return 'bg-green-100 text-green-800';
      case 'Converted to Digital Contract': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline (Buyer Enquiries)</h1>
        <p className="text-sm text-gray-500">Manage incoming procurement requests and active negotiations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center text-blue-600 mb-2"><AlertCircle className="w-4 h-4 mr-2"/> New Enquiries</div>
          <p className="text-2xl font-bold text-gray-900">{newCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center text-gray-500 mb-2"><FileText className="w-4 h-4 mr-2"/> Active Pipelines</div>
          <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center text-gray-500 mb-2"><TrendingUp className="w-4 h-4 mr-2"/> Win Rate</div>
          <p className="text-2xl font-bold text-gray-900">{winRate}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center text-gray-500 mb-2"><CheckCircle2 className="w-4 h-4 mr-2"/> Closed Deals</div>
          <p className="text-2xl font-bold text-gray-900">24</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex space-x-2">
            <button className="bg-white px-4 py-2 border border-gray-300 rounded-md text-sm font-medium shadow-sm">All</button>
            <button className="px-4 py-2 text-gray-500 text-sm font-medium hover:bg-gray-100 rounded-md flex items-center">New <span className="bg-blue-100 text-blue-600 ml-2 px-1.5 py-0.5 rounded text-xs">{newCount}</span></button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search ENQ ID or Buyer..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary" />
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Enquiry ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Buyer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Request Details</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {supplierEnquiries.map(enq => (
              <tr key={enq.id} className={clsx("hover:bg-gray-50", enq.status === 'New Enquiry' && "bg-blue-50/50")}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-primary cursor-pointer hover:underline" onClick={() => navigate(`/dashboard/negotiation/${enq.id}`)}>{enq.id}</div>
                  <div className="text-xs text-gray-500">{new Date(enq.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{enq.buyerName}</div>
                  {enq.priority === 'Urgent' && <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Urgent</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{enq.quantityRequested} {enq.uom} of {enq.product}</div>
                  <div className="text-xs text-gray-500">{enq.procurementType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx("px-2.5 py-1 text-xs font-semibold rounded-md border border-opacity-20", getStatusColor(enq.status))}>
                    {enq.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => navigate(`/dashboard/negotiation/${enq.id}`)} className="bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary-dark font-semibold shadow-sm transition-colors">
                    {enq.status === 'New Enquiry' ? 'Respond' : 'Open Workspace'}
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

export default BuyerEnquiries;
