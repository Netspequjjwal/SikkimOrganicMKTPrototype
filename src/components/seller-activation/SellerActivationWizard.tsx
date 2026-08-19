import React, { useState } from 'react';
import { useOrganization, ScopeCertData } from '../../context/OrganizationContext';
import { ShieldCheck, Calendar, Plus, X, UploadCloud, FileText, CheckCircle, ArrowLeft, ArrowRight, Save, Building2, UserCheck, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface SellerActivationWizardProps {
  onClose: () => void;
}

const PRESET_CROPS = [
  'Large Cardamom',
  'Dzongu Ginger',
  'Lakadong Turmeric',
  'Buckwheat',
  'Sikkim Mandarin',
  'Dalle Khursani',
  'Organic Passion Fruit',
  'Organic Cymbidium Orchids',
  'Red Cherry Pepper',
  'Sikkim Rajma (Bean)'
];

const SellerActivationWizard: React.FC<SellerActivationWizardProps> = ({ onClose }) => {
  const { scopeCertData, submitSellerScope, approveSellerScope } = useOrganization();

  const [formData, setFormData] = useState<ScopeCertData>(
    scopeCertData || {
      certificationSystem: 'NPOP',
      certificationBody: 'Sikkim State Organic Certification Agency (SSOCA)',
      scopeCertNumber: 'ORG/SC/2026/001',
      activeAnnualCycle: '2026 - 2027 (Current Cycle)',
      issueDate: '2026-04-01',
      expiryDate: '2027-03-31',
      yearWiseHistory: [
        { year: '2025 - 2026', certNumber: 'ORG/SC/2025/084', validFrom: '2025-04-01', validTo: '2026-03-31' },
        { year: '2026 - 2027', certNumber: 'ORG/SC/2026/001', validFrom: '2026-04-01', validTo: '2027-03-31' }
      ],
      scopeVerifiedCrops: [
        'Large Cardamom',
        'Dzongu Ginger',
        'Lakadong Turmeric',
        'Buckwheat',
        'Sikkim Mandarin',
        'Dalle Khursani'
      ],
      docFileName: 'Scope_Certificate_2026.pdf'
    }
  );

  const [customCropInput, setCustomCropInput] = useState('');
  const [docFile, setDocFile] = useState<string>(formData.docFileName || '');

  const handleAddCrop = (cropName: string) => {
    const trimmed = cropName.trim();
    if (!trimmed) return;
    if (!formData.scopeVerifiedCrops.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        scopeVerifiedCrops: [...prev.scopeVerifiedCrops, trimmed]
      }));
    }
    setCustomCropInput('');
  };

  const handleRemoveCrop = (cropName: string) => {
    setFormData((prev) => ({
      ...prev,
      scopeVerifiedCrops: prev.scopeVerifiedCrops.filter((c) => c !== cropName)
    }));
  };

  const handleAddYearWiseRecord = () => {
    const nextYear = 2027 + formData.yearWiseHistory.length - 1;
    const newRecord = {
      year: `${nextYear} - ${nextYear + 1}`,
      certNumber: `ORG/SC/${nextYear}/099`,
      validFrom: `${nextYear}-04-01`,
      validTo: `${nextYear + 1}-03-31`
    };
    setFormData((prev) => ({
      ...prev,
      yearWiseHistory: [...prev.yearWiseHistory, newRecord]
    }));
    toast.success(`Added Scope Certificate record for ${newRecord.year}`);
  };

  const handleRemoveYearWiseRecord = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      yearWiseHistory: prev.yearWiseHistory.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSellerScope({
      ...formData,
      docFileName: docFile || 'Scope_Certificate.pdf'
    });
    toast.success('Scope Certificate submitted for SOFDA Verification!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-8 animate-fade-in">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold">Seller Profile Activation & Scope Certificate Verification</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Submit your organic Scope Certificate credentials and authorized crops for SOFDA verification.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Scope Certificate Annual Validity & Expiry */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-amber-950">
                  Annual Scope Certificate Validity & Expiry Cycle <span className="text-red-500">*</span>
                </h3>
              </div>
              <span className="text-[10px] font-bold px-3 py-1 bg-amber-200/80 text-amber-900 rounded-full uppercase tracking-wider">
                Annual Renewal Required
              </span>
            </div>

            <p className="text-xs text-amber-900">
              Scope Certificates expire annually under NPOP/PGS standards. Specify your active validity period and track year-wise certificates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Active Annual Cycle *
                </label>
                <select
                  value={formData.activeAnnualCycle}
                  onChange={(e) => setFormData({ ...formData, activeAnnualCycle: e.target.value })}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500 font-semibold"
                >
                  <option value="2026 - 2027 (Current Cycle)">2026 - 2027 (Current Cycle)</option>
                  <option value="2027 - 2028 (Upcoming Cycle)">2027 - 2028 (Upcoming Cycle)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Issue Date (Valid From) *
                </label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Expiry Date (Valid Until) *
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            {/* Year-Wise History */}
            <div className="pt-3 border-t border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Year-Wise Scope Certificate History & Renewal Records:
                </span>
                <button
                  type="button"
                  onClick={handleAddYearWiseRecord}
                  className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Annual Scope Cert Record
                </button>
              </div>

              <div className="space-y-2">
                {formData.yearWiseHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-200 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-amber-100 font-bold text-amber-800 rounded-md">
                        Cycle: {item.year}
                      </span>
                      <span className="font-mono font-bold text-gray-900">{item.certNumber}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 font-medium">Valid: <strong>{item.validFrom}</strong> to <strong>{item.validTo}</strong></span>
                      <button
                        type="button"
                        onClick={() => handleRemoveYearWiseRecord(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Authorized Organic Produces for Listing */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-emerald-200/80 pb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
              <h3 className="text-base font-bold text-emerald-950">
                Scope Certified Organic Produces Authorized for Listing <span className="text-red-500">*</span>
              </h3>
            </div>
            <p className="text-xs text-emerald-900">
              Select items from the pre-filled list OR type custom produce names as authorized on your active Scope Certificate.
            </p>

            <div className="flex flex-wrap gap-2">
              {formData.scopeVerifiedCrops.map((crop) => (
                <span
                  key={crop}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs"
                >
                  ✓ {crop}
                  <button
                    type="button"
                    onClick={() => handleRemoveCrop(crop)}
                    className="hover:text-emerald-200 focus:outline-none"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customCropInput}
                onChange={(e) => setCustomCropInput(e.target.value)}
                placeholder="Type custom crop name authorized in scope cert..."
                className="flex-1 px-3 py-2 border border-emerald-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCrop(customCropInput);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleAddCrop(customCropInput)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Produce
              </button>
            </div>
          </div>

          {/* Section 3: Scope Certificate Document Upload */}
          <div className="bg-white border rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b pb-2">
              Upload Scope Certificate Document <span className="text-red-500">*</span>
            </h3>

            <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-xl p-6 text-center">
              <FileText className="mx-auto h-10 w-10 text-emerald-600 mb-2" />
              <p className="text-sm font-bold text-gray-900">{docFile || 'Scope_Certificate_2026.pdf'}</p>
              <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 5MB</p>
              <div className="mt-4 flex justify-center gap-3">
                <label className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4" /> Browse & Replace
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.png,.jpg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setDocFile(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              Submit for SOFDA Scope Verification <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerActivationWizard;
