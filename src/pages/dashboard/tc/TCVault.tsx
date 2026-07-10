import React, { useState } from 'react';
import { useTC, ActiveCertificate } from '../../../context/TCContext';
import { ShieldCheck, Download, Printer, Lock, Calendar, Box, Search, AlertCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotification } from '../../../context/NotificationContext';

export default function TCVault() {
  const { activeCertificates } = useTC();
  const [selectedCert, setSelectedCert] = useState<ActiveCertificate | null>(activeCertificates[0] || null);

  const handleRestrictedAction = (action: string) => {
    toast.error(`Action Restricted: ${action} is disabled for digital Transaction Certificates to prevent misuse.`);
  };

  if (activeCertificates.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Digital Certificate Vault</h2>
        <p className="text-gray-500 mb-6">You don't have any active Transaction Certificates yet.</p>
        <p className="text-sm text-gray-400">Head to the TC Services Marketplace to request one.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex h-[calc(100vh-100px)] gap-6 pb-6">
      
      {/* Left Sidebar: Cert List */}
      <div className="w-80 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-primary" /> My Certificates
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {activeCertificates.map(cert => (
            <button
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className={`w-full text-left p-4 rounded-xl transition-colors border ${
                selectedCert?.id === cert.id ? 'bg-blue-50 border-primary ring-1 ring-primary' : 'border-transparent hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold text-gray-900 text-sm truncate">{cert.certNumber}</div>
              <div className="text-xs text-gray-500 mt-1 truncate">{cert.providerName}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                  {cert.status}
                </span>
                <span className="text-[10px] text-gray-400">{cert.validityEnd}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Area: Secure Viewer */}
      {selectedCert && (
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          {/* Viewer Toolbar */}
          <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-gray-50/50">
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-900">{selectedCert.certNumber}</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> ACTIVE
              </span>
            </div>
          </div>

          {/* Secure Document Viewer Area */}
          <div 
            className="flex-1 bg-gray-100 p-8 overflow-y-auto relative select-none"
            onContextMenu={(e) => { e.preventDefault(); handleRestrictedAction('Right-click'); }}
          >
            {/* Watermark Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden opacity-10">
              <div className="transform -rotate-45 text-4xl font-black text-gray-900 whitespace-nowrap tracking-widest uppercase" style={{ textShadow: '2px 2px 0 #fff' }}>
                PLATFORM USE ONLY - NOT VALID OUTSIDE SIKKIM ORGANIC DIGITAL PLATFORM - DO NOT COPY - PLATFORM USE ONLY
              </div>
            </div>

            {/* The Certificate Document (A4 Ratio styling) */}
            <div className="max-w-3xl mx-auto bg-white shadow-xl min-h-[900px] p-8 md:p-12 relative z-0 border border-gray-200 rounded-sm flex flex-col">
              <div className="border-4 border-double border-gray-300 p-6 md:p-8 flex-1 flex flex-col relative">
                
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-black text-gray-900 uppercase tracking-widest mb-2">Transaction Certificate</h1>
                  <p className="text-gray-500 font-medium">Organic Certification Ecosystem</p>
                  <p className="text-sm font-bold text-gray-400 mt-2">CERTIFICATE NO: {selectedCert.certNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Issued To</h3>
                    <p className="text-lg font-bold text-gray-900">Sikkim Organic FPO</p>
                    <p className="text-gray-600">ID: {selectedCert.fpoId}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Issued By</h3>
                    <p className="text-lg font-bold text-gray-900">{selectedCert.providerName}</p>
                    <p className="text-gray-600">ID: {selectedCert.providerId}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 border border-gray-200 mb-10">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Scope of Certification</h3>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <span className="block text-xs text-gray-500 font-semibold uppercase mb-1">Applicable Crops</span>
                      <span className="font-bold text-gray-900">{selectedCert.applicableCrops.join(', ')}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 font-semibold uppercase mb-1">Max Authorized Quantity</span>
                      <span className="font-bold text-gray-900">{selectedCert.maxQty} MT</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 font-semibold uppercase mb-1">Validity Start</span>
                      <span className="font-bold text-gray-900">{selectedCert.validityStart}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 font-semibold uppercase mb-1">Validity End</span>
                      <span className="font-bold text-gray-900">{selectedCert.validityEnd}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-12">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Terms of Validity</h3>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                    This certificate is issued under the framework of the Sikkim Organic Digital Platform. It serves as digital proof of organic compliance for the specified crops and quantities within the validity period. This certificate is legally binding only when utilized within the platform's product publishing and B2B procurement workflows. Any physical printout, screenshot, or downloaded copy of this document is explicitly invalid and holds no legal standing.
                  </p>
                </div>

                <div className="flex justify-between items-end mt-auto pt-8 border-t-2 border-gray-200">
                  <div className="text-center">
                    <div className="w-32 h-12 bg-gray-100 mb-2 flex items-center justify-center font-cursive text-gray-400">Digitally Signed</div>
                    <div className="text-xs font-bold text-gray-900">Authorized Signatory</div>
                    <div className="text-[10px] text-gray-500">{selectedCert.providerName}</div>
                  </div>
                  <div className="w-24 h-24 border-4 border-primary/20 rounded-full flex items-center justify-center text-primary/20 font-black transform -rotate-12">
                    SEAL
                  </div>
                </div>

              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
