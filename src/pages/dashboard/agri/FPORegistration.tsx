import React, { useState, useMemo } from 'react';
import { useOrganization } from '../../../context/OrganizationContext';
import { Users, Building2, Store, ShoppingBag, CheckCircle, Search, Filter, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';

interface ActiveOrgRecord {
  id: string;
  refId: string;
  legalName: string;
  tradeName: string;
  orgType: string;
  district: string;
  representative: string;
  email: string;
  phone: string;
  isSellerActive: boolean;
  isBuyerActive: boolean;
  approvedDate: string;
}

const MOCK_ACTIVE_ORGS: ActiveOrgRecord[] = [
  {
    id: 'ACT-001',
    refId: 'ORG-2026-650195',
    legalName: 'Karmapa Organic Traders',
    tradeName: 'Karmapa Organics',
    orgType: 'Private Limited Company',
    district: 'Gangtok',
    representative: 'Tenzing Bhutia (MD)',
    email: 'contact@karmapaorganic.in',
    phone: '9876543210',
    isSellerActive: true,
    isBuyerActive: true,
    approvedDate: '2026-08-18',
  },
  {
    id: 'ACT-002',
    refId: 'ORG-2026-992144',
    legalName: 'Sikkim Himalayan Spices Producer Co.',
    tradeName: 'Himalayan Organic Spices',
    orgType: 'Farmer Producer Organization (FPO)',
    district: 'Namchi',
    representative: 'Pemba Lepcha (Director)',
    email: 'info@himalayanspices.org',
    phone: '9876599887',
    isSellerActive: true,
    isBuyerActive: false,
    approvedDate: '2026-08-15',
  },
  {
    id: 'ACT-003',
    refId: 'ORG-2026-110023',
    legalName: 'Yuksom Organic Farmers Collective',
    tradeName: 'Yuksom Organics',
    orgType: 'Cooperative Society',
    district: 'Gyalshing',
    representative: 'Dawa Sherpa (President)',
    email: 'contact@yuksomorganics.org',
    phone: '9733001122',
    isSellerActive: true,
    isBuyerActive: true,
    approvedDate: '2026-08-10',
  },
  {
    id: 'ACT-004',
    refId: 'ORG-2026-443311',
    legalName: 'Green Valley Organic Exporters Ltd.',
    tradeName: 'Green Valley Organics',
    orgType: 'Public Limited Company',
    district: 'Pakyong',
    representative: 'Sanjay Sharma (VP Procurement)',
    email: 'procure@greenvalley.com',
    phone: '9811223344',
    isSellerActive: false,
    isBuyerActive: true,
    approvedDate: '2026-08-05',
  },
  {
    id: 'ACT-005',
    refId: 'ORG-2026-887766',
    legalName: 'Mangan Hill Growers Association',
    tradeName: 'Mangan Growers',
    orgType: 'Self Help Group (SHG)',
    district: 'Mangan',
    representative: 'Karma Rai (Secretary)',
    email: 'mangan.growers@gmail.com',
    phone: '9877665544',
    isSellerActive: false,
    isBuyerActive: false,
    approvedDate: '2026-08-19',
  }
];

const FPORegistration: React.FC = () => {
  const { orgStatus, orgData, capabilities, sellerStatus } = useOrganization();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Both' | 'Seller' | 'Buyer' | 'Pending'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const orgList = useMemo(() => {
    let list = [...MOCK_ACTIVE_ORGS];
    if (orgStatus === 'APPROVED' && orgData) {
      const liveItem: ActiveOrgRecord = {
        id: 'ACT-LIVE',
        refId: orgData.referenceId || 'ORG-2026-LIVE',
        legalName: orgData.legalName,
        tradeName: orgData.tradeName,
        orgType: orgData.organizationTypeId,
        district: orgData.districtId,
        representative: `${orgData.representativeName} (${orgData.designation})`,
        email: orgData.organizationEmail,
        phone: orgData.organizationPhoneNumber,
        isSellerActive: capabilities.isSellerActive || sellerStatus === 'ACTIVE',
        isBuyerActive: capabilities.isBuyerActive,
        approvedDate: '2026-08-19',
      };
      const idx = list.findIndex(o => o.legalName === liveItem.legalName);
      if (idx >= 0) {
        list[idx] = liveItem;
      } else {
        list.unshift(liveItem);
      }
    }
    return list;
  }, [orgStatus, orgData, capabilities, sellerStatus]);

  const filteredOrgs = useMemo(() => {
    return orgList.filter(org => {
      let matchesFilter = true;
      if (activeFilter === 'Both') matchesFilter = org.isSellerActive && org.isBuyerActive;
      else if (activeFilter === 'Seller') matchesFilter = org.isSellerActive && !org.isBuyerActive;
      else if (activeFilter === 'Buyer') matchesFilter = org.isBuyerActive && !org.isSellerActive;
      else if (activeFilter === 'Pending') matchesFilter = !org.isSellerActive && !org.isBuyerActive;

      const matchesSearch =
        org.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.district.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [orgList, activeFilter, searchQuery]);

  const getCapabilityBadge = (seller: boolean, buyer: boolean) => {
    if (seller && buyer) {
      return (
        <span className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold text-xs rounded-full shadow-xs flex items-center gap-1.5 w-fit">
          <Store className="w-3.5 h-3.5" /> + <ShoppingBag className="w-3.5 h-3.5" /> Buyer & Seller Active
        </span>
      );
    }
    if (seller) {
      return (
        <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-xs flex items-center gap-1.5 w-fit">
          <Store className="w-3.5 h-3.5" /> Seller Profile Active
        </span>
      );
    }
    if (buyer) {
      return (
        <span className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-full shadow-xs flex items-center gap-1.5 w-fit">
          <ShoppingBag className="w-3.5 h-3.5" /> Buyer Profile Active
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-full w-fit">
        Capabilities Pending Activation
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold">Active Organizations Profiles Directory</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Regulatory Tracker of SOFDA-Approved Organizations & Live Business Capabilities Matrix.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Active Approved Entities: <strong>{orgList.length} Organizations</strong></span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 border-b md:border-b-0 pb-2 md:pb-0 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'All', label: 'All Organizations' },
            { id: 'Both', label: 'Buyer & Seller Active' },
            { id: 'Seller', label: 'Seller Active' },
            { id: 'Buyer', label: 'Buyer Active' },
            { id: 'Pending', label: 'Capabilities Pending' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Org Name, District..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Grid of Active Organizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrgs.map((org) => (
          <div key={org.id} className="bg-white border rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                {getCapabilityBadge(org.isSellerActive, org.isBuyerActive)}
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">{org.legalName}</h3>
                <p className="text-xs text-gray-500">Trade: <strong>{org.tradeName}</strong> | {org.orgType}</p>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>District: <strong>{org.district}, Sikkim</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>Rep: <strong>{org.representative}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{org.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="text-gray-400 font-mono text-[10px]">{org.refId}</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Approved {org.approvedDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FPORegistration;
