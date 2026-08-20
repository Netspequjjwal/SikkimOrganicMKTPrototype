import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, FileText, CheckCircle, ShieldCheck, ExternalLink, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentFileName: string;
  entityName?: string;
  registrationNumber?: string;
  issuingAuthority?: string;
  validUntil?: string;
  issueDate?: string;
}

const UniversalDocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentFileName,
  entityName = 'Karmapa Organic Traders',
  registrationNumber = 'REG-2026-SK-8891',
  issuingAuthority = 'Government of Sikkim • Department of Agriculture',
  validUntil = '2027-03-31',
  issueDate = '2026-04-01',
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen) return null;

  const isImage = documentFileName.toLowerCase().endsWith('.png') || documentFileName.toLowerCase().endsWith('.jpg') || documentFileName.toLowerCase().endsWith('.jpeg');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-[1200px] h-[95dvh] sm:h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-700 animate-fade-in">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-4 md:px-6 py-3.5 flex justify-between items-center border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base md:text-lg font-bold">{documentTitle}</h2>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] sm:text-xs font-bold rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Digital Verified Document
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Entity: <strong className="text-white">{entityName}</strong> | File: <span className="font-mono text-slate-300">{documentFileName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Document Viewer Toolbar */}
        <div className="bg-slate-800 px-4 py-2.5 flex justify-between items-center text-xs text-slate-200 border-b border-slate-700 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Regulatory Authority:</span>
            <span className="font-semibold text-emerald-400 text-xs">{issuingAuthority}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-700">
              <button
                onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))}
                className="p-1 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(160, zoomLevel + 15))}
                className="p-1 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => toast.success(`Downloading ${documentFileName}...`)}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>

        {/* High-Fidelity Document Canvas Window */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8 flex justify-center items-start shadow-inner">
          {isImage ? (
            /* Image Preview (Logo / Photo) */
            <div
              className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border border-slate-300 text-center space-y-4 transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <div className="w-32 h-32 mx-auto bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center p-4">
                <ShieldCheck className="w-20 h-20 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{documentTitle}</h3>
                <p className="text-xs text-gray-500 font-mono mt-1">{documentFileName}</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                Verified high-resolution digital media asset uploaded for {entityName}.
              </div>
            </div>
          ) : (
            /* High-Fidelity Official PDF Certificate Canvas */
            <div
              className="bg-white text-slate-900 p-6 sm:p-10 rounded-xl shadow-2xl w-full max-w-3xl space-y-6 transition-transform duration-200 border border-slate-300 font-serif"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Certificate Header */}
              <div className="text-center space-y-1.5 border-b-2 border-emerald-800 pb-5">
                <div className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-emerald-900 font-sans">
                  {issuingAuthority.toUpperCase()}
                </div>
                <h1 className="text-lg sm:text-2xl font-bold uppercase tracking-wide text-slate-900 font-serif">
                  {documentTitle.toUpperCase()}
                </h1>
                <div className="text-xs italic text-slate-600 font-sans">
                  Official Statutory & Regulatory Verification Record
                </div>
                <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full font-sans uppercase tracking-wider mt-2 border border-emerald-300">
                  VERIFIED STATUTORY DOCUMENT
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-2 text-xs border-b pb-4 font-sans gap-3">
                <div>
                  <span className="text-slate-500 block">Registration / License No:</span>
                  <strong className="text-slate-900 font-mono text-sm">{registrationNumber}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Valid Until:</span>
                  <strong className="text-slate-900 font-mono text-sm">{validUntil}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Issued To:</span>
                  <strong className="text-slate-900">{entityName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Date of Issue:</span>
                  <strong className="text-slate-900 font-mono">{issueDate}</strong>
                </div>
              </div>

              {/* Legal Declaration Box */}
              <div className="space-y-3 text-xs font-sans leading-relaxed">
                <p>
                  This official document certifies that <strong>{entityName}</strong> has satisfied all compliance, quality, and statutory standards prescribed by the authority under the relevant regulatory framework.
                </p>
                <div className="p-3 bg-slate-50 border rounded-lg space-y-1 text-[11px] font-mono text-slate-700">
                  <div>Document Reference: {documentFileName}</div>
                  <div>Security Hash Digest: sha256-8a99f12bc8d91024f923</div>
                  <div>Status: ACTIVE & VERIFIED COMPLIANT</div>
                </div>
              </div>

              {/* Seal & Authorized Signature Footer */}
              <div className="pt-8 border-t flex justify-between items-end font-sans">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-700 flex flex-col items-center justify-center text-[9px] font-bold text-emerald-950 p-1 mx-auto bg-emerald-50/70">
                    <ShieldCheck className="w-6 h-6 text-emerald-700 mb-0.5" />
                    <span>REGULATORY SEAL</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-serif italic text-base text-slate-900">Dr. N. T. Bhutia</div>
                  <div className="text-xs font-bold text-slate-900">Authorized Inspection Authority</div>
                  <div className="text-[10px] text-slate-500">Department of Agriculture, Govt. of Sikkim</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Close Viewer
          </button>
          <button
            onClick={() => toast.success(`Downloading ${documentFileName}...`)}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Download Official File
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversalDocumentViewer;
