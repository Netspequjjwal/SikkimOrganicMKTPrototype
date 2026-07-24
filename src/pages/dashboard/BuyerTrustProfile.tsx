import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Building2, Calendar, CheckCircle2, Award, ExternalLink, Leaf, Factory, Users } from 'lucide-react';
import { useBuyerRegistration } from '../../context/BuyerRegistrationContext';
import { checkCertificateStatus } from '../../utils/CertificateMonitoringEngine';

const BuyerTrustProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { status, registrationData } = useBuyerRegistration();

  // If the profile being requested matches our context (or if we just want to show the context data as a demo)
  const isTargetApp = registrationData && (registrationData.referenceId === id || id === 'demo');
  const data = isTargetApp ? registrationData : null;
  const isApproved = isTargetApp ? status === 'APPROVED' : true; // Assuming other viewed profiles are approved

  // Fallback demo data if no matching data is found
  const profileData = data || {
    legalEntityName: 'Green Earth Organics Ltd.',
    businessType: 'Wholesaler / Distributor',
    district: 'East Sikkim',
    state: 'Sikkim',
    yearOfEstablishment: '2015',
    certificationSystem: 'NPOP',
    certificationBody: 'Aditi Organic Certifications',
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    fssaiLicenseNumber: '11419850000123',
    warehouseAvailability: 'Yes',
    processingFacility: 'Yes',
    certifiedProductCategories: 'Spices, Fruits, Tea'
  };

  const certStatus = checkCertificateStatus(profileData.expiryDate);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-primary to-green-400"></div>
        <div className="px-6 sm:px-10 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-xl shadow-md border-4 border-white flex items-center justify-center overflow-hidden">
              <Building2 className="w-12 h-12 text-gray-300" />
            </div>
            {isApproved && (
              <div className="flex items-center bg-green-50 text-green-700 px-4 py-1.5 rounded-full border border-green-200 shadow-sm">
                <ShieldCheck className="w-5 h-5 mr-2 text-green-500" />
                <span className="text-sm font-bold tracking-wide">Government Verified Buyer</span>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profileData.legalEntityName}</h1>
            <div className="flex flex-wrap items-center mt-3 text-sm text-gray-600 gap-y-2">
              <span className="flex items-center mr-6 bg-gray-100 px-2.5 py-1 rounded-md">
                <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                {profileData.district}, {profileData.state}
              </span>
              <span className="flex items-center mr-6 bg-gray-100 px-2.5 py-1 rounded-md">
                <Building2 className="w-4 h-4 mr-1.5 text-gray-400" />
                {profileData.businessType}
              </span>
              <span className="flex items-center bg-gray-100 px-2.5 py-1 rounded-md">
                <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                Est. {profileData.yearOfEstablishment}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Trust Badges & Certifications */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b pb-3">
              <Award className="w-5 h-5 mr-2 text-primary" />
              Trust Badges
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg shrink-0">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-bold text-gray-900">KYC Verified</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Identity & Address verified by Sikkim Agriculture Dept.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-bold text-gray-900">FSSAI Registered</h4>
                  <p className="text-xs text-gray-500 mt-0.5">License: {profileData.fssaiLicenseNumber}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b pb-3">
              <Leaf className="w-5 h-5 mr-2 text-green-500" />
              Organic Compliance
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">System</p>
                <p className="text-sm font-bold text-gray-900">{profileData.certificationSystem}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Certifying Body</p>
                <p className="text-sm font-medium text-gray-900">{profileData.certificationBody}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Certificate Status</p>
                <div className={`mt-1 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${certStatus.color}`}>
                  {certStatus.status === 'valid' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <ShieldCheck className="w-3 h-3 mr-1" />}
                  {certStatus.message}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Infrastructure & Categories */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center border-b pb-3">
              <Factory className="w-5 h-5 mr-2 text-gray-700" />
              Infrastructure Capabilities
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 shrink-0">
                  <Building2 className="w-5 h-5 text-gray-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-bold text-gray-900">Warehousing</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {profileData.warehouseAvailability === 'Yes' 
                      ? 'Dedicated storage facilities available for organic produce.'
                      : 'No dedicated storage facilities declared.'}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 shrink-0">
                  <Factory className="w-5 h-5 text-gray-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-bold text-gray-900">Processing</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {profileData.processingFacility === 'Yes' 
                      ? 'In-house processing and packaging capabilities.'
                      : 'Third-party processing / Trade only.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b pb-3">
              <Users className="w-5 h-5 mr-2 text-gray-700" />
              Procurement Interest
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              This buyer is authorized and verified to procure the following categories of organic produce from the Sikkim Organic Digital Platform:
            </p>
            <div className="flex flex-wrap gap-2">
              {profileData.certifiedProductCategories?.split(',').map((cat, idx) => (
                <span key={idx} className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full text-sm font-medium">
                  {cat.trim()}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-center pt-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-sm font-bold text-primary hover:text-primary-dark inline-flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Return to Marketplace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerTrustProfile;
