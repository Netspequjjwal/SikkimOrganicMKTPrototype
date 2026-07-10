import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNegotiation } from '../../context/NegotiationContext';
import { useNotification } from '../../context/NotificationContext';
import { useActionCenter } from '../../context/ActionCenterContext';
import { useContract } from '../../context/ContractContext';
import { ArrowLeft, Send, Paperclip, CheckCircle2, AlertCircle, FileText, Download, Clock, Briefcase, FileSignature, X } from 'lucide-react';
import clsx from 'clsx';
import TransactionMap from '../../components/common/TransactionMap';

const NegotiationWorkspace: React.FC = () => {
  const { enquiryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enquiries, addMessage, updateStatus } = useNegotiation();
  const { triggerSMS, triggerEmail } = useNotification();
  const { logAction } = useActionCenter();
  const { contracts } = useContract();
  
  const [draftMessage, setDraftMessage] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    price: '',
    total: '',
    file: null as File | null
  });

  const enquiry = enquiries.find(e => e.id === enquiryId);
  const isBuyer = user?.role === 'BUYER';

  if (!enquiry) {
    return <div className="p-10 text-center">Enquiry not found.</div>;
  }

  const handleSendMessage = () => {
    if (!draftMessage.trim()) return;
    addMessage(enquiry.id, {
      sender: isBuyer ? 'Buyer' : 'Supplier',
      text: draftMessage
    });
    // Auto-update status if it's new
    if (enquiry.status === 'New Enquiry' && !isBuyer) {
      updateStatus(enquiry.id, 'Acknowledged');
    }
    
    triggerSMS(
      isBuyer ? enquiry.supplierName : enquiry.buyerName,
      `New message regarding Enquiry ${enquiry.id}: "${draftMessage.substring(0, 30)}${draftMessage.length > 30 ? '...' : ''}"`
    );

    setDraftMessage('');
  };

  const handleUploadQuotation = () => {
    if (!quoteForm.file || !quoteForm.price || !quoteForm.total) {
      toast.error("Please fill all fields and select a file.");
      return;
    }
    
    // Create a local blob URL for the uploaded file so it can be downloaded
    const fileUrl = URL.createObjectURL(quoteForm.file);

    addMessage(enquiry.id, {
      sender: 'Supplier',
      text: 'Please find attached our formal quotation based on your requirements. The price is valid for 7 days.',
      isQuotation: true,
      attachmentName: quoteForm.file.name,
      fileUrl: fileUrl,
      quotationDetails: {
        pricePerUnit: Number(quoteForm.price),
        totalAmount: Number(quoteForm.total),
        validUntil: new Date(Date.now() + 7 * 86400000).toISOString()
      }
    });
    
    updateStatus(enquiry.id, 'Quotation Submitted');
    
    triggerEmail(
      enquiry.buyerName,
      `Formal Quotation Received for ${enquiry.id}`,
      `Dear ${enquiry.buyerName},\n\nThe Service Provider (${enquiry.supplierName}) has uploaded a formal quotation for your enquiry.\n\nPlease log in to the Sikkim Organic Platform to download and review the quotation.\n\nBest Regards,\nSikkim Organic Digital Platform`,
      quoteForm.file.name,
      'PDF'
    );
    
    logAction({
      title: `Quotation Sent to ${enquiry.buyerName}`,
      description: `For ${enquiry.quantityRequested} ${enquiry.uom} of ${enquiry.product}`,
      iconType: 'quotation' as any, // fallback to general if strict type check
      actionUrl: `/dashboard/negotiation/${enquiry.id}`
    });
    
    setShowUploadModal(false);
  };

  const handleAcceptContract = () => {
    updateStatus(enquiry.id, 'Converted to Digital Contract');
    
    addMessage(enquiry.id, {
      sender: 'Buyer',
      text: '',
      isPurchaseIntent: true
    });

    if (isBuyer) {
      triggerSMS(
        enquiry.supplierName,
        `Sikkim Organic: ${enquiry.buyerName} has sent a Purchase Intent for ${enquiry.id}. Please generate the digital contract.`
      );
      
      logAction({
        title: `Purchase Intent Sent to ${enquiry.supplierName}`,
        description: `Waiting for supplier to generate the contract for ${enquiry.product}.`,
        iconType: 'contract',
        actionUrl: `/dashboard/negotiation/${enquiry.id}`
      });
    } else {
      navigate(`/dashboard/contracts/generate/${enquiry.id}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'New Enquiry': return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Quotation Submitted': return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
      case 'Converted to Digital Contract': return <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider flex items-center"><FileSignature className="w-3 h-3 mr-1"/> Contract Generation Pending</span>;
      default: return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] -m-6 flex flex-col md:flex-row bg-gray-50 overflow-hidden">
      {/* Left Panel: Details */}
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col h-full z-10 shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center bg-gray-50">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 mr-3 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{enquiry.id}</h2>
            <p className="text-xs text-gray-500">Created on {new Date(enquiry.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Current Status</h3>
              {getStatusBadge(enquiry.status)}
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-900">
                {enquiry.status === 'New Enquiry' && !isBuyer && "A buyer has submitted a new enquiry. Please review and respond with a quotation."}
                {enquiry.status === 'New Enquiry' && isBuyer && "Waiting for the supplier to acknowledge and send a quotation."}
                {enquiry.status === 'Quotation Submitted' && isBuyer && "The supplier has submitted a quote. You can accept it to create a contract or counter-offer."}
                {enquiry.status === 'Quotation Submitted' && !isBuyer && "You have submitted a quote. Waiting for buyer's response."}
                {enquiry.status === 'Converted to Digital Contract' && "This negotiation has concluded and moved to contract management."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Procurement Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Product</p>
                <p className="font-bold text-gray-900">{enquiry.product}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Quantity Req.</p>
                <p className="font-bold text-primary">{enquiry.quantityRequested} {enquiry.uom}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Procurement Type</p>
                <p className="font-medium text-gray-900">{enquiry.procurementType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Delivery Date</p>
                <p className="font-medium text-gray-900">{new Date(enquiry.deliveryDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Counterparty Info</h3>
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1">{isBuyer ? 'Supplier (ICS Provider)' : 'Buyer (Company)'}</p>
              <p className="font-bold text-gray-900 flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                {isBuyer ? enquiry.supplierName : enquiry.buyerName}
              </p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        {enquiry.status !== 'Converted to Digital Contract' ? (
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col gap-3">
            {!isBuyer && (
              <button onClick={() => setShowUploadModal(true)} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center">
                <FileText className="w-4 h-4 mr-2" /> 
                {enquiry.status === 'Quotation Submitted' ? 'Upload Revised Quotation' : 'Upload Quotation'}
              </button>
            )}
            {isBuyer && enquiry.status === 'Quotation Submitted' && (
              <button onClick={handleAcceptContract} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Send Purchase Intent
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 bg-teal-50 border-t border-teal-100 flex flex-col gap-3">
            {!isBuyer ? (
              <button onClick={() => navigate(`/dashboard/contracts/generate/${enquiry.id}`)} className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center">
                <FileSignature className="w-5 h-5 mr-2" /> Generate Digital Contract
              </button>
            ) : (
              <p className="text-sm text-teal-800 text-center font-medium">Waiting for Supplier to generate the contract.</p>
            )}
          </div>
        )}
      </div>

      {/* Right Panel: Chat Thread */}
      <div className="flex-1 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-10 bg-white relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center">
            <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
              Negotiation started on {new Date(enquiry.createdAt).toLocaleDateString()}
            </span>
          </div>

          {enquiry.messages.map(msg => {
            const isMe = (isBuyer && msg.sender === 'Buyer') || (!isBuyer && msg.sender === 'Supplier');
            return (
              <div key={msg.id} className={clsx("flex flex-col max-w-lg", isMe ? "ml-auto items-end" : "mr-auto items-start")}>
                <div className="flex items-baseline mb-1 space-x-2">
                  <span className="text-xs font-bold text-gray-700">{isMe ? 'You' : (isBuyer ? enquiry.supplierName : enquiry.buyerName)}</span>
                  <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <div className={clsx(
                  "px-5 py-3 rounded-2xl shadow-sm relative",
                  msg.isPurchaseIntent 
                    ? (isMe ? "bg-green-50 border border-green-200 text-green-900 rounded-tr-none" : "bg-green-50 border border-green-200 text-green-900 rounded-tl-none")
                    : (isMe ? "bg-primary text-white rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none")
                )}>
                  {msg.isPurchaseIntent ? (
                    <div className="flex items-center space-x-3 py-1">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <p className="text-sm font-semibold">
                        {isBuyer ? `Purchase intent has been sent to ${enquiry.supplierName}` : `${enquiry.buyerName} has sent a purchase intent`}
                      </p>
                    </div>
                  ) : (
                    <>
                      {msg.text && <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
                      
                      {msg.isQuotation && msg.quotationDetails && (
                        <div className={clsx("mt-3 p-4 rounded-xl border", isMe ? "bg-primary-dark/30 border-white/20" : "bg-gray-50 border-gray-200")}>
                          <div className="flex justify-between items-center mb-3 pb-3 border-b border-opacity-20 border-current">
                            <div className="flex items-center">
                              <FileText className="w-6 h-6 mr-2 opacity-80" />
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-80">Official Quotation</p>
                                <p className="text-sm font-medium">{msg.attachmentName}</p>
                              </div>
                            </div>
                            {msg.fileUrl ? (
                              <a href={msg.fileUrl} download={msg.attachmentName} className="opacity-80 hover:opacity-100 bg-black/10 p-2 rounded-full cursor-pointer inline-flex">
                                <Download className="w-4 h-4" />
                              </a>
                            ) : (
                              <button className="opacity-80 hover:opacity-100 bg-black/10 p-2 rounded-full cursor-not-allowed">
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-xs opacity-70 mb-0.5">Price Per Unit</p>
                              <p className="font-bold font-mono">₹{msg.quotationDetails.pricePerUnit.toLocaleString()} / {enquiry.uom}</p>
                            </div>
                            <div>
                              <p className="text-xs opacity-70 mb-0.5">Total Amount</p>
                              <p className="font-bold font-mono">₹{msg.quotationDetails.totalAmount.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input or Next Steps CTA */}
        {enquiry.status === 'Converted to Digital Contract' ? (
          <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-10">
            {isBuyer ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-bold text-blue-900">Awaiting Digital Contract</h4>
                <p className="text-blue-800 text-sm mt-1">The Service Provider is currently drafting the legally binding digital contract.</p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-bold text-green-900">Purchase Intent Received</h4>
                <p className="text-green-800 text-sm mt-1">Please proceed to generate the digital contract using the button in the left panel.</p>
              </div>
            )}
          </div>
        ) : (enquiry.status !== 'Negotiation Declined') ? (
          <div className="p-4 bg-white border-t border-gray-200 flex items-end space-x-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-10">
            <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
            <textarea 
              rows={1}
              value={draftMessage}
              onChange={(e) => setDraftMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 max-h-32 min-h-[48px] bg-gray-50 border border-gray-300 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
              placeholder="Type your message here..."
            />
            <button 
              onClick={handleSendMessage}
              disabled={!draftMessage.trim()}
              className="p-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-colors flex-shrink-0 shadow-sm disabled:opacity-50"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </div>
        ) : null}
      </div>
      {/* Upload Quotation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-primary px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Upload Quotation</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-primary-light hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit (₹)</label>
                <input 
                  type="number" 
                  value={quoteForm.price}
                  onChange={(e) => setQuoteForm({...quoteForm, price: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g. 85000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
                <input 
                  type="number" 
                  value={quoteForm.total}
                  onChange={(e) => setQuoteForm({...quoteForm, total: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g. 127500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Quotation Document (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setQuoteForm({...quoteForm, file: e.target.files[0]});
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUploadQuotation}
                disabled={!quoteForm.file || !quoteForm.price || !quoteForm.total}
                className="px-5 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                Send Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NegotiationWorkspace;
