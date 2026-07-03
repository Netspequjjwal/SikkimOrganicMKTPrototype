import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNegotiation } from '../../context/NegotiationContext';
import { Search, Filter, MessageSquare, Clock, FileText, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

const MyEnquiries: React.FC = () => {
  const navigate = useNavigate();
  const { enquiries } = useNegotiation();

  // In a real app, we'd filter by buyerName === user.name
  const myEnquiries = enquiries; 

  const activeCount = myEnquiries.filter(e => e.status !== 'Negotiation Successful' && e.status !== 'Negotiation Declined' && e.status !== 'Converted to Digital Contract').length;
  const quotesCount = myEnquiries.filter(e => e.status === 'Quotation Submitted').length;
  const convertedCount = myEnquiries.filter(e => e.status === 'Converted to Digital Contract').length;

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
        <h1 className="text-2xl font-bold text-gray-900">My Enquiries</h1>
        <p className="text-sm text-gray-500">Track and negotiate your active procurement requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center text-gray-500 mb-2"><MessageSquare className="w-4 h-4 mr-2"/> Active Enquiries</div>
          <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center text-gray-500 mb-2"><FileText className="w-4 h-4 mr-2"/> Quotes Received</div>
          <p className="text-2xl font-bold text-gray-900">{quotesCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center text-gray-500 mb-2"><Clock className="w-4 h-4 mr-2"/> Avg Response Time</div>
          <p className="text-2xl font-bold text-gray-900">4h 12m</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center text-gray-500 mb-2"><CheckCircle2 className="w-4 h-4 mr-2"/> Converted</div>
          <p className="text-2xl font-bold text-gray-900">{convertedCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex space-x-2">
            <button className="bg-white px-4 py-2 border border-gray-300 rounded-md text-sm font-medium shadow-sm">All</button>
            <button className="px-4 py-2 text-gray-500 text-sm font-medium hover:bg-gray-100 rounded-md">Pending Response</button>
            <button className="px-4 py-2 text-gray-500 text-sm font-medium hover:bg-gray-100 rounded-md">Quotations</button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search ENQ ID or Supplier..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary" />
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Enquiry ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product Details</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {myEnquiries.map(enq => (
              <tr key={enq.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-primary cursor-pointer hover:underline" onClick={() => navigate(`/dashboard/negotiation/${enq.id}`)}>{enq.id}</div>
                  <div className="text-xs text-gray-500">{new Date(enq.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{enq.supplierName}</div>
                  <div className="text-xs text-gray-500">{enq.priority} Priority</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{enq.quantityRequested} {enq.uom} of {enq.product}</div>
                  <div className="text-xs text-gray-500">{enq.procurementType} (Req: {new Date(enq.deliveryDate).toLocaleDateString()})</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx("px-2.5 py-1 text-xs font-semibold rounded-md border border-opacity-20", getStatusColor(enq.status))}>
                    {enq.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => navigate(`/dashboard/negotiation/${enq.id}`)} className="text-primary hover:text-primary-dark font-semibold">
                    {enq.status === 'Quotation Submitted' ? 'Review Quote' : 'View Thread'}
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

export default MyEnquiries;
