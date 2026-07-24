import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useBuyerRegistration } from '../../context/BuyerRegistrationContext';

const BuyerApprovals: React.FC = () => {
  const navigate = useNavigate();
  const { status, registrationData } = useBuyerRegistration();

  // In a real app, this would be an array of all buyers.
  // For this prototype, we'll use a mix of dummy data and the context data.
  const allApplications = [
    ...(registrationData ? [{
      id: registrationData.referenceId || 'BUY-2026-PENDING',
      name: registrationData.legalEntityName || 'Pending Application',
      type: registrationData.businessType || 'Retailer',
      submittedOn: registrationData.submissionDate ? new Date(registrationData.submissionDate).toISOString().split('T')[0] : '2026-07-24',
      status: status === 'PENDING_APPROVAL' ? 'Pending' : status === 'APPROVED' ? 'Approved' : 'Unregistered',
      isCurrentUser: true
    }] : []),
    { id: 'BUY-2026-882314', name: 'Green Earth Organics Ltd', type: 'Wholesaler', submittedOn: '2026-07-20', status: 'Pending', isCurrentUser: false },
    { id: 'BUY-2026-773421', name: 'Fresh Valley Foods', type: 'Retailer', submittedOn: '2026-07-19', status: 'Approved', isCurrentUser: false },
    { id: 'BUY-2026-664532', name: 'Pure Spices Export', type: 'Exporter', submittedOn: '2026-07-18', status: 'Pending', isCurrentUser: false },
  ].filter(app => app.status !== 'Unregistered');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buyer Approvals</h1>
          <p className="text-sm text-gray-500">Review and verify organic buyer registration applications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900">{allApplications.length + 142}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Review</p>
            <p className="text-2xl font-bold text-orange-600">{allApplications.filter(a => a.status === 'Pending').length + 24}</p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Approved Today</p>
            <p className="text-2xl font-bold text-green-600">8</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Rejected / Returned</p>
            <p className="text-2xl font-bold text-red-600">3</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2 text-gray-400" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{app.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.submittedOn}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => navigate(`/dashboard/buyer-approvals/${app.id}`)}
                      className="inline-flex items-center text-primary hover:text-primary-dark"
                      title="Review Application"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerApprovals;
