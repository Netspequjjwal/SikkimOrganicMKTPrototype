import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceProvider } from '../../context/ServiceProviderContext';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

const ServiceProviderRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { addApplication } = useServiceProvider();

  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    email: '',
    mobile: '',
    altMobile: '',
    address: '',
    additionalDocName: '',
  });

  const [files, setFiles] = useState<{ license: File | null; additional: File | null }>({
    license: null,
    additional: null,
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Service Provider Name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner Name is required';
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.address.trim()) newErrors.address = 'Office Address is required';
    if (!files.license) newErrors.license = 'Valid Service Provider License is required';
    if (!agreeTerms) newErrors.terms = 'You must agree to the Terms and Conditions to proceed.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (type: 'license' | 'additional', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [type]: 'File size must be less than 5MB' }));
        return;
      }
      setFiles(prev => ({ ...prev, [type]: file }));
      if (errors[type]) setErrors(prev => ({ ...prev, [type]: '' }));
    }
  };

  const removeFile = (type: 'license' | 'additional') => {
    setFiles(prev => ({ ...prev, [type]: null }));
    if (type === 'license' && fileInputRef.current) fileInputRef.current.value = '';
    if (type === 'additional' && additionalFileInputRef.current) additionalFileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newApp = addApplication({
        name: formData.name,
        ownerName: formData.ownerName,
        email: formData.email,
        mobile: formData.mobile,
        altMobile: formData.altMobile,
        address: formData.address,
        licenseFileName: files.license?.name,
        additionalDocName: formData.additionalDocName,
        additionalDocFileName: files.additional?.name,
      });
      navigate(`/dashboard/sp-success`, { state: { id: newApp.id } });
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
      setFormData({ name: '', ownerName: '', email: '', mobile: '', altMobile: '', address: '', additionalDocName: '' });
      setFiles({ license: null, additional: null });
      setAgreeTerms(false);
      setErrors({});
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Register Service Provider</h2>
          <p className="mt-1 text-sm text-gray-500">
            All registered Service Providers require approval from the Agriculture Department before becoming active on the platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">1. Organization Details</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Provider Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Owner / Authorized Representative <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.ownerName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
                />
                {errors.ownerName && <p className="mt-1 text-xs text-red-600">{errors.ownerName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="mobile"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.mobile ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
                />
                {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alternate Mobile <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input
                  type="tel"
                  name="altMobile"
                  maxLength={10}
                  value={formData.altMobile}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Office Address for Correspondence <span className="text-red-500">*</span></label>
              <textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${errors.address ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary focus:border-primary'}`}
              />
              {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">2. Required Documents</h3>
            
            {/* License Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid Service Provider License <span className="text-red-500">*</span></label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${errors.license ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                <div className="space-y-1 text-center">
                  {!files.license ? (
                    <>
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="license-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                          <span>Upload a file</span>
                          <input id="license-upload" name="license-upload" type="file" className="sr-only" ref={fileInputRef} accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange('license', e)} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileText className="mx-auto h-12 w-12 text-green-500" />
                      <p className="text-sm font-medium text-gray-900 mt-2">{files.license.name}</p>
                      <button type="button" onClick={() => removeFile('license')} className="mt-2 text-sm text-red-500 hover:text-red-700 flex items-center">
                        <X className="w-4 h-4 mr-1" /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {errors.license && <p className="mt-1 text-xs text-red-600 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.license}</p>}
            </div>

            {/* Additional Docs */}
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Supporting Document <span className="text-gray-400 font-normal">(Optional)</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <input
                  type="text"
                  name="additionalDocName"
                  placeholder="e.g., Tax Certificate"
                  value={formData.additionalDocName}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border"
                />
                
                <div className="flex items-center">
                  {!files.additional ? (
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <UploadCloud className="w-4 h-4 mr-2" /> Upload File
                      <input type="file" className="sr-only" ref={additionalFileInputRef} accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange('additional', e)} />
                    </label>
                  ) : (
                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 truncate max-w-[150px]">{files.additional.name}</span>
                      <button type="button" onClick={() => removeFile('additional')} className="ml-2 text-gray-400 hover:text-red-500"><X className="w-4 h-4"/></button>
                    </div>
                  )}
                </div>
              </div>
              {errors.additional && <p className="mt-1 text-xs text-red-600">{errors.additional}</p>}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">3. Declaration & Terms of Usage</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 h-40 overflow-y-auto text-sm text-gray-600 space-y-3">
              <p className="font-bold text-gray-800">Sikkim Organic Digital Platform - Service Provider Agreement</p>
              <p>1. <strong>Accuracy of Information:</strong> I declare that all information provided in this registration form is true, complete, and accurate to the best of my knowledge. I understand that any false or misleading information may lead to the immediate rejection of this application or subsequent cancellation of my registration.</p>
              <p>2. <strong>Compliance with Standards:</strong> I agree to strictly adhere to the organic farming standards, certification guidelines, and inspection protocols mandated by the Agriculture Department, Government of Sikkim.</p>
              <p>3. <strong>Data Privacy:</strong> I consent to the platform collecting, processing, and storing my organizational data for the purpose of maintaining the organic ecosystem registry.</p>
              <p>4. <strong>Audit and Inspection:</strong> I agree to make my premises, records, and farm data available for inspection or audit by authorized officials at any time without prior notice.</p>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (e.target.checked && errors.terms) {
                      setErrors(prev => ({ ...prev, terms: '' }));
                    }
                  }}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700 cursor-pointer">I agree to the Terms and Conditions</label>
                {errors.terms && <p className="mt-1 text-xs text-red-600">{errors.terms}</p>}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Reset Form
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
              >
                Submit Registration
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceProviderRegistration;
