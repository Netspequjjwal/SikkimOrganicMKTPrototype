import React from 'react';
import { OrganizationData } from '../../context/OrganizationContext';
import { UploadCloud, FileText, X, CheckCircle, Calendar } from 'lucide-react';

interface DocumentUploadStepProps {
  data: Partial<OrganizationData>;
  errors: Record<string, string>;
  onChange: (data: Partial<OrganizationData>) => void;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ data, errors, onChange }) => {
  const documents = data.documents || {};

  const handleFileChange = (key: keyof typeof documents, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onChange({
        documents: {
          ...documents,
          [key]: file.name,
        },
      });
    }
  };

  const removeFile = (key: keyof typeof documents) => {
    const newDocs = { ...documents };
    delete newDocs[key];
    onChange({ documents: newDocs });
  };

  const renderUploadCard = (
    title: string,
    key: keyof typeof documents,
    required: boolean,
    maxSize: string,
    validityBadge?: string,
    accept: string = '.pdf,.jpg,.jpeg,.png'
  ) => {
    const fileName = documents[key];
    const hasError = !!errors[`doc_${key}`];

    return (
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="text-base font-bold text-gray-900">
              {title} {required && <span className="text-red-500">*</span>}
            </h4>
            <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 font-semibold rounded-full">
              {maxSize}
            </span>
          </div>

          {validityBadge && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>{validityBadge}</span>
            </div>
          )}
        </div>

        <div
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors min-h-[140px] ${
            hasError
              ? 'border-red-300 bg-red-50'
              : fileName
              ? 'border-emerald-300 bg-emerald-50/50'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {!fileName ? (
            <div className="text-center space-y-2">
              <UploadCloud
                className={`mx-auto h-9 w-9 ${hasError ? 'text-red-400' : 'text-emerald-500'}`}
              />
              <label className="cursor-pointer text-sm font-bold text-emerald-600 hover:text-emerald-700 block">
                Browse File
                <input
                  type="file"
                  className="sr-only"
                  accept={accept}
                  onChange={(e) => handleFileChange(key, e)}
                />
              </label>
              <p className="text-xs text-gray-400">
                Supported formats: {accept.replace(/\./g, '').toUpperCase()} ({maxSize})
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2 w-full">
              <FileText className="mx-auto h-9 w-9 text-emerald-600" />
              <p
                className="text-sm font-bold text-gray-900 truncate max-w-[220px] mx-auto"
                title={fileName}
              >
                {fileName}
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Uploaded
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(key)}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center"
                >
                  <X className="w-3.5 h-3.5 mr-0.5" /> Remove
                </button>
              </div>
            </div>
          )}
        </div>
        {hasError && <p className="text-xs text-red-600 mt-1 font-medium">{errors[`doc_${key}`]}</p>}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">4. Document Upload</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload mandatory organization logo and statutory certificates for verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderUploadCard('Organization/Farmer Logo', 'logo', true, 'Max 2MB', undefined, '.png,.jpg,.jpeg')}
        {renderUploadCard(
          'Scope Certificate (NPOP/PGS)',
          'scopeCertificate',
          true,
          'Max 5MB',
          'Annual Validity 2026 - 2027 (Current Annual Cycle) (Expires 2027-03-31)'
        )}
        {renderUploadCard(
          'FSSAI License',
          'fssaiLicense',
          true,
          'Max 5MB',
          'Valid until: 2028-12-31'
        )}
        {renderUploadCard('IEC Certificate', 'iecCertificate', false, 'Max 5MB')}
        {renderUploadCard(
          'APEDA RCMC',
          'apedaRcmc',
          false,
          'Max 5MB',
          'Valid until: 2029-03-31'
        )}
      </div>

      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
        <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-emerald-900">
          <strong>Verification Notice:</strong> Documents will be verified by SOFDA officials during the onboarding review. Please ensure document numbers match the details provided in earlier sections.
        </p>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
