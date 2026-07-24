import React, { useRef } from 'react';
import { BuyerRegistrationData } from '../../context/BuyerRegistrationContext';
import { UploadCloud, FileText, X, CheckCircle } from 'lucide-react';

interface DocumentUploadStepProps {
  data: Partial<BuyerRegistrationData>;
  errors: Record<string, string>;
  onChange: (data: Partial<BuyerRegistrationData>) => void;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ data, errors, onChange }) => {
  const documents = data.documents || {};

  const handleFileChange = (key: keyof typeof documents, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onChange({
        documents: {
          ...documents,
          [key]: file.name
        }
      });
    }
  };

  const removeFile = (key: keyof typeof documents) => {
    const newDocs = { ...documents };
    delete newDocs[key];
    onChange({ documents: newDocs });
  };

  const renderUploadBox = (title: string, key: keyof typeof documents, required: boolean, accept: string = ".pdf,.jpg,.png") => {
    const fileName = documents[key];
    const hasError = !!errors[`doc_${key}`];

    return (
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {title} {required && <span className="text-red-500">*</span>}
        </label>
        <div className={`flex-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors
          ${hasError ? 'border-red-300 bg-red-50 hover:bg-red-100' : 
            fileName ? 'border-green-300 bg-green-50' : 
            'border-gray-300 hover:bg-gray-50'}`}
        >
          <div className="space-y-1 text-center w-full">
            {!fileName ? (
              <>
                <UploadCloud className={`mx-auto h-10 w-10 ${hasError ? 'text-red-400' : 'text-gray-400'}`} />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                    <span>Upload a file</span>
                    <input type="file" className="sr-only" accept={accept} onChange={(e) => handleFileChange(key, e)} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <FileText className="h-10 w-10 text-green-500 mb-2" />
                <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={fileName}>{fileName}</p>
                <div className="flex items-center mt-3 space-x-3">
                  <span className="flex items-center text-xs text-green-600 font-medium">
                    <CheckCircle className="w-3 h-3 mr-1" /> Uploaded
                  </span>
                  <button type="button" onClick={() => removeFile(key)} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center">
                    <X className="w-3 h-3 mr-1" /> Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {hasError && <p className="mt-2 text-xs text-red-600">{errors[`doc_${key}`]}</p>}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">5. Document Upload</h2>
        <p className="mt-1 text-sm text-gray-500">Upload all mandatory licenses and certificates to verify your business and compliance.</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Mandatory Documents</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderUploadBox("GST Certificate", "gstCertificate", true)}
          {renderUploadBox("PAN Card", "panCard", true)}
          {renderUploadBox("FSSAI License", "fssaiLicense", true)}
          {renderUploadBox("Organic Scope Certificate", "scopeCertificate", true)}
          {renderUploadBox("Organic Certification", "organicCertification", true)}
        </div>
      </div>

      <div className="space-y-6 pt-4 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Infrastructure Images</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderUploadBox("Warehouse / Storage Images", "warehouseImages", data.warehouseAvailability === 'Yes', ".jpg,.jpeg,.png")}
          {renderUploadBox("Processing / Facility Images", "facilityImages", data.processingFacility === 'Yes', ".jpg,.jpeg,.png")}
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start mt-6">
        <FileText className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Ensure all uploaded documents are clear, legible, and currently valid. Blurry or expired documents will lead to your registration being returned for correction, delaying your access to the marketplace.
        </p>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
