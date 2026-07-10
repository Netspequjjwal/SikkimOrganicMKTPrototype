import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTC } from '../../../context/TCContext';
import { Shield, MapPin, Clock, IndianRupee, Star, CheckCircle2, Award, Users, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import bannerImg from '../../../assets/cardamom.jpg';

export default function TCProviderProfile() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { providers } = useTC();

  const provider = providers.find(p => p.id === providerId);

  if (!provider) {
    return <div className="p-10 text-center">Provider not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="relative h-48">
          <img src={bannerImg} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row md:justify-between md:items-end mb-6">
            <div className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-lg -mt-16 z-10">
              <img src={provider.logo} alt={provider.name} className="w-full h-full object-contain p-2" />
            </div>
            <button 
              onClick={() => navigate(`/dashboard/tc/request/${provider.id}`)}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2 mt-4 md:mt-0"
            >
              Request Transaction Certificate <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.name}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {provider.districts.join(', ')}</span>
                <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-primary" /> {provider.certAuthority}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {provider.badges.map((badge, idx) => (
                  <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 mb-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-xl font-bold text-gray-900">{provider.rating}</span>
                <span className="text-sm text-gray-500">/ 5.0</span>
              </div>
              <div className="text-sm text-gray-500">Based on 84 FPO reviews</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Stats & Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-gray-400" /> Provider Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Experience</span>
                <span className="font-semibold text-gray-900">{provider.experienceYears} Years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Active Certs Issued</span>
                <span className="font-semibold text-gray-900">{provider.activeCertsIssued}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Compliance Score</span>
                <span className="font-semibold text-green-600">{provider.complianceScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Avg. Response Time</span>
                <span className="font-semibold text-gray-900">{provider.avgResponseTime}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" /> Commercial Terms
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Starting Service Charge</div>
                <div className="text-xl font-bold text-gray-900 flex items-center">
                  <IndianRupee className="w-5 h-5 mr-0.5 text-gray-400" /> {provider.startingPrice.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Standard Processing Time</div>
                <div className="font-medium text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" /> {provider.processingTime}
                </div>
              </div>
              <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>Final charges are calculated based on crop volume, districts, and requested validity period.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">About the Provider</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {provider.name} is a verified and SOFDA approved ICS Provider specializing in organic certification services. 
              We empower Farmer Producer Organizations (FPOs) by issuing legally compliant Transaction Certificates (TCs) that allow you to sell your produce in the premium organic B2B marketplace.
            </p>
            
            <h4 className="font-bold text-gray-900 mb-4">Supported Crops</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {provider.crops.map(crop => (
                <span key={crop} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">{crop}</span>
              ))}
              <span className="px-4 py-2 bg-gray-50 rounded-lg text-gray-500 font-medium">+ Many more</span>
            </div>

            <h4 className="font-bold text-gray-900 mb-4">Certificate Issuance Policy</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Certificates are strictly non-transferable and can only be used by the requesting FPO.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Usage is limited to the predefined maximum quantity and validity period specified in the offer.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>The certificate remains digital and cannot be downloaded or printed outside the Sikkim Organic Platform Vault.</span>
              </li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-orange-900 mb-1">Important Notice</h4>
              <p className="text-orange-800 text-sm leading-relaxed">
                Submitting a request does not guarantee certificate issuance. The ICS Provider will thoroughly review your documents and business requirements before offering a Certificate Usage Proposal. Providing accurate information expedites the process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
