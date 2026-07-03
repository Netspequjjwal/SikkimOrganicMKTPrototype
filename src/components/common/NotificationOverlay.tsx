import React from 'react';
import { useNotification, type SMSNotification, type EmailNotification } from '../../context/NotificationContext';
import { Mail, Smartphone, X, Paperclip, FileText, Download } from 'lucide-react';
import clsx from 'clsx';

const NotificationOverlay: React.FC = () => {
  const { activeNotification, dismissNotification } = useNotification();

  if (!activeNotification) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-start justify-center sm:justify-end px-4 py-6 sm:p-6 pointer-events-none">
      <div className="flex flex-col w-full max-w-sm sm:max-w-md pointer-events-auto">
        
        {/* SMS Notification UI */}
        {activeNotification.type === 'SMS' && (
          <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden animate-slideUp sm:animate-slideLeft">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <Smartphone className="w-4 h-4 text-green-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">New Message</p>
                  <p className="text-sm font-bold text-gray-900">To: {activeNotification.to}</p>
                </div>
              </div>
              <button onClick={dismissNotification} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 bg-[#E5F5E0] relative">
              <div className="bg-white rounded-xl rounded-tl-none p-4 shadow-sm inline-block max-w-[90%]">
                <p className="text-sm text-gray-800 leading-relaxed">{activeNotification.message}</p>
              </div>
              <p className="text-right text-[10px] text-gray-500 mt-2">Just now &bull; SMS</p>
            </div>
          </div>
        )}

        {/* Email Notification UI */}
        {activeNotification.type === 'EMAIL' && (
          <div className="bg-white rounded-xl shadow-[0_10px_50px_rgba(0,0,0,0.3)] border border-gray-200 overflow-hidden animate-slideUp sm:animate-slideLeft">
            {/* Header */}
            <div className="bg-blue-600 px-4 py-3 flex items-center justify-between text-white">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span className="font-bold tracking-wide">Inbox - New Email</span>
              </div>
              <button onClick={dismissNotification} className="text-blue-100 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Metadata */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 space-y-1">
              <p className="text-sm"><span className="text-gray-500 w-16 inline-block font-medium">To:</span> <span className="font-bold text-gray-900">{activeNotification.to}</span></p>
              <p className="text-sm"><span className="text-gray-500 w-16 inline-block font-medium">From:</span> <span className="text-gray-900">Sikkim Organic Digital Platform &lt;noreply@sikkimorganic.gov.in&gt;</span></p>
              <p className="text-sm"><span className="text-gray-500 w-16 inline-block font-medium">Subject:</span> <span className="font-bold text-gray-900">{(activeNotification as EmailNotification).subject}</span></p>
            </div>
            
            {/* Body */}
            <div className="p-5">
              <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-sans">
                {(activeNotification as EmailNotification).body}
              </div>
              
              {/* Attachment */}
              {(activeNotification as EmailNotification).attachmentName && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                    <Paperclip className="w-3.5 h-3.5 mr-1.5" /> 1 Attachment
                  </p>
                  
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className={clsx(
                      "w-10 h-10 rounded-lg flex items-center justify-center mr-3",
                      (activeNotification as EmailNotification).attachmentType === 'PDF' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                    )}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{(activeNotification as EmailNotification).attachmentName}</p>
                      <p className="text-xs text-gray-500">{(activeNotification as EmailNotification).attachmentType === 'PDF' ? 'PDF Document' : 'Spreadsheet'} &bull; 2.4 MB</p>
                    </div>
                    <Download className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NotificationOverlay;
