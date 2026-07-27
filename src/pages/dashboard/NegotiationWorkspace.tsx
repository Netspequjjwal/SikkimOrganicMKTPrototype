import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNegotiation } from '../../context/NegotiationContext';
import { useNotification } from '../../context/NotificationContext';
import { useActionCenter } from '../../context/ActionCenterContext';
import { useContract } from '../../context/ContractContext';
import { ArrowLeft, Send, Paperclip, CheckCircle2, AlertCircle, FileText, Download, Clock, Briefcase, FileSignature, X, MessageSquare, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

const NegotiationWorkspace: React.FC = () => {
  const { enquiryId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enquiries, addMessage, updateStatus } = useNegotiation();
  const { triggerSMS, triggerEmail } = useNotification();
  const { logAction } = useActionCenter();
  const { contracts } = useContract();
  
  const [activeTab, setActiveTab] = useState<'CHAT' | 'DETAILS'>('CHAT');
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
      iconType: 'quotation' as any,
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
      case 'New Enquiry': return <span className="bg-blue-100 text-blue-800 text-[10px] px-2.5 py-1 rounded-full font-extrabold border border-blue-300 uppercase">{status}</span>;
      case 'Quotation Submitted': return <span className="bg-purple-100 text-purple-800 text-[10px] px-2.5 py-1 rounded-full font-extrabold border border-purple-300 uppercase">{status}</span>;
      case 'Converted to Digital Contract': return <span className="bg-teal-100 text-teal-800 text-[10px] px-2.5 py-1 rounded-full font-extrabold border border-teal-300 uppercase flex items-center gap-1"><FileSignature className="w-3 h-3"/> Contract Pending</span>;
      default: return <span className="bg-slate-100 text-slate-800 text-[10px] px-2.5 py-1 rounded-full font-extrabold border border-slate-200 uppercase">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12">
      
      {/* Top Header Card with Quick Action Buttons */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono tracking-tight">{enquiry.id}</h1>
              {getStatusBadge(enquiry.status)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Commodity: <strong className="text-slate-900">{enquiry.product}</strong> ({enquiry.quantityRequested} {enquiry.uom}) • Created {new Date(enquiry.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Quick Primary Actions Bar */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {!isBuyer && enquiry.status !== 'Converted to Digital Contract' && (
            <button 
              onClick={() => setShowUploadModal(true)} 
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> 
              {enquiry.status === 'Quotation Submitted' ? 'Revise Quote' : 'Send Quotation'}
            </button>
          )}

          {isBuyer && enquiry.status === 'Quotation Submitted' && (
            <button 
              onClick={handleAcceptContract} 
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Send Purchase Intent
            </button>
          )}

          {!isBuyer && enquiry.status === 'Converted to Digital Contract' && (
            <button 
              onClick={() => navigate(`/dashboard/contracts/generate/${enquiry.id}`)} 
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <FileSignature className="w-4 h-4" /> Generate Digital Contract
            </button>
          )}
        </div>
      </div>

      {/* Mobile/Medium Devices Tab Switcher (< lg screens) */}
      <div className="flex lg:hidden bg-slate-200/70 p-1 rounded-xl gap-1 text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('CHAT')}
          className={clsx(
            "flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5",
            activeTab === 'CHAT' ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" /> Chat Thread & Quotes
        </button>
        <button
          onClick={() => setActiveTab('DETAILS')}
          className={clsx(
            "flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5",
            activeTab === 'DETAILS' ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          )}
        >
          <FileText className="w-4 h-4 text-indigo-600" /> Procurement Specs
        </button>
      </div>

      {/* Workspace Main Split Container (Fixed Viewport Height ~ 72vh) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-col lg:flex-row h-[72vh] min-h-[550px] overflow-hidden">
        
        {/* Left Panel: Procurement Details & Counterparty Info */}
        <div className={clsx(
          "w-full lg:w-80 xl:w-96 border-r border-slate-200 bg-slate-50/40 flex-col h-full overflow-y-auto p-4 space-y-4 shrink-0",
          activeTab === 'DETAILS' ? "flex" : "hidden lg:flex"
        )}>
          {/* Status Alert */}
          <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl space-y-1 text-xs">
            <span className="font-extrabold text-blue-900 uppercase text-[10px] flex items-center">
              <AlertCircle className="w-3.5 h-3.5 text-blue-600 mr-1" /> Negotiation Status Overview
            </span>
            <p className="text-blue-800 text-[11px] leading-relaxed">
              {enquiry.status === 'New Enquiry' && !isBuyer && "A buyer has submitted a new enquiry. Please review specs and upload your formal quotation."}
              {enquiry.status === 'New Enquiry' && isBuyer && "Waiting for the supplier to acknowledge and upload a formal quotation."}
              {enquiry.status === 'Quotation Submitted' && isBuyer && "The supplier has submitted a quotation. Accept it to generate a digital contract or send counter-messages."}
              {enquiry.status === 'Quotation Submitted' && !isBuyer && "Your quotation has been submitted. Waiting for buyer's purchase intent."}
              {enquiry.status === 'Converted to Digital Contract' && "Negotiation concluded! Move forward to generate & execute the digital contract."}
            </p>
          </div>

          {/* Procurement Specs Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h3 className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider border-b pb-2 flex items-center">
              <FileText className="w-3.5 h-3.5 text-emerald-600 mr-1.5" /> Procurement Specifications
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Product</span>
                <strong className="text-slate-900 block text-xs">{enquiry.product}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Requested Qty</span>
                <strong className="text-emerald-700 block text-xs">{enquiry.quantityRequested} {enquiry.uom}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Listing Stage</span>
                <strong className="text-slate-800 block text-xs">{enquiry.procurementType}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Target Date</span>
                <strong className="text-slate-800 block text-xs">{new Date(enquiry.deliveryDate).toLocaleDateString()}</strong>
              </div>
            </div>
          </div>

          {/* Counterparty Info Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h3 className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider border-b pb-2 flex items-center">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600 mr-1.5" /> Transacting Counterparty
            </h3>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">{isBuyer ? 'Seller (ICS Provider)' : 'Buyer Organization'}</span>
              <strong className="text-slate-900 flex items-center text-xs mt-0.5">
                <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                {isBuyer ? enquiry.supplierName : enquiry.buyerName}
              </strong>
            </div>
          </div>

          {/* Organic Scope & Quality Audit */}
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-1 text-xs">
            <span className="font-extrabold text-emerald-950 uppercase text-[10px] flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" /> Organic Scope Compliance
            </span>
            <p className="text-emerald-900 text-[11px]">
              Commodity "<strong>{enquiry.product}</strong>" is verified under active NPOP/PGS Scope Certificate.
            </p>
          </div>

          {/* Bottom Action CTA in details sidebar */}
          <div className="pt-2">
            {!isBuyer && enquiry.status !== 'Converted to Digital Contract' && (
              <button 
                onClick={() => setShowUploadModal(true)} 
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-2.5 px-4 rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" /> 
                {enquiry.status === 'Quotation Submitted' ? 'Upload Revised Quotation' : 'Upload Quotation Document'}
              </button>
            )}

            {isBuyer && enquiry.status === 'Quotation Submitted' && (
              <button 
                onClick={handleAcceptContract} 
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-2.5 px-4 rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Send Purchase Intent
              </button>
            )}

            {!isBuyer && enquiry.status === 'Converted to Digital Contract' && (
              <button 
                onClick={() => navigate(`/dashboard/contracts/generate/${enquiry.id}`)} 
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold py-2.5 px-4 rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <FileSignature className="w-4 h-4" /> Generate Digital Contract
              </button>
            )}
          </div>
        </div>

        {/* Right Panel: Interactive Chat & Quotation Thread */}
        <div 
          className={clsx(
            "flex-1 flex flex-col bg-slate-50/70 relative h-full overflow-hidden",
            activeTab === 'CHAT' ? "flex" : "hidden lg:flex"
          )}
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}
        >
          
          {/* Chat Messages Scroll Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="text-center my-1">
              <span className="bg-slate-200/80 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Negotiation Thread Started on {new Date(enquiry.createdAt).toLocaleDateString()}
              </span>
            </div>

            {enquiry.messages.map(msg => {
              const isMe = (isBuyer && msg.sender === 'Buyer') || (!isBuyer && msg.sender === 'Supplier');
              return (
                <div key={msg.id} className={clsx("flex flex-col max-w-lg", isMe ? "ml-auto items-end" : "mr-auto items-start")}>
                  <div className="flex items-baseline mb-1 space-x-2">
                    <span className="text-[10px] font-extrabold text-slate-700">{isMe ? 'You' : (isBuyer ? enquiry.supplierName : enquiry.buyerName)}</span>
                    <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <div className={clsx(
                    "px-4 py-3 rounded-2xl shadow-xs relative text-xs",
                    msg.isPurchaseIntent 
                      ? (isMe ? "bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-tr-none" : "bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-tl-none")
                      : (isMe ? "bg-emerald-800 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-900 rounded-tl-none")
                  )}>
                    {msg.isPurchaseIntent ? (
                      <div className="flex items-center space-x-2 py-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <p className="font-extrabold">
                          {isBuyer ? `Purchase intent sent to ${enquiry.supplierName}` : `${enquiry.buyerName} sent purchase intent`}
                        </p>
                      </div>
                    ) : (
                      <>
                        {msg.text && <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
                        
                        {msg.isQuotation && msg.quotationDetails && (
                          <div className={clsx("mt-2.5 p-3 rounded-xl border", isMe ? "bg-emerald-950/40 border-emerald-600/40" : "bg-slate-50 border-slate-200 text-slate-900")}>
                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-current/20">
                              <div className="flex items-center space-x-2 truncate mr-2">
                                <FileText className="w-5 h-5 shrink-0 opacity-80" />
                                <div className="truncate">
                                  <p className="text-[9px] font-black uppercase tracking-wider opacity-75">Official Quotation</p>
                                  <p className="font-bold text-xs truncate">{msg.attachmentName}</p>
                                </div>
                              </div>
                              {msg.fileUrl ? (
                                <a href={msg.fileUrl} download={msg.attachmentName} className="opacity-90 hover:opacity-100 bg-white/20 p-1.5 rounded-lg shrink-0">
                                  <Download className="w-4 h-4" />
                                </a>
                              ) : (
                                <button className="opacity-70 bg-white/20 p-1.5 rounded-lg shrink-0 cursor-not-allowed">
                                  <Download className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                              <div>
                                <p className="text-[9px] opacity-70 font-sans uppercase">Price Per MT</p>
                                <p className="font-bold">₹{msg.quotationDetails.pricePerUnit.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-[9px] opacity-70 font-sans uppercase">Total Quote Amount</p>
                                <p className="font-bold">₹{msg.quotationDetails.totalAmount.toLocaleString()}</p>
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

          {/* Sticky Bottom Message Bar */}
          {enquiry.status === 'Converted to Digital Contract' ? (
            <div className="p-3.5 bg-white border-t border-slate-200">
              {isBuyer ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                  <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <h4 className="font-extrabold text-blue-900 text-xs">Awaiting Digital Contract Generation</h4>
                  <p className="text-blue-800 text-[11px] mt-0.5">The Service Provider is drafting the digital procurement agreement.</p>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-left">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-emerald-950 text-xs">Purchase Intent Confirmed</h4>
                      <p className="text-emerald-800 text-[11px]">Click to generate the digital contract for execution.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/dashboard/contracts/generate/${enquiry.id}`)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs shrink-0"
                  >
                    Generate Contract
                  </button>
                </div>
              )}
            </div>
          ) : (enquiry.status !== 'Negotiation Declined') ? (
            <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
              <button 
                onClick={() => setShowUploadModal(true)}
                title="Attach Quotation"
                className="p-2.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
              >
                <Paperclip className="w-4 h-4" />
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
                className="flex-1 max-h-24 min-h-[40px] bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Type your message or counter-offer details..."
              />
              <button 
                onClick={handleSendMessage}
                disabled={!draftMessage.trim()}
                className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-all shadow-xs shrink-0 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Upload Quotation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 space-y-4">
            <div className="bg-emerald-800 px-6 py-4 flex items-center justify-between text-white">
              <h3 className="font-extrabold text-sm flex items-center">
                <FileText className="w-4 h-4 mr-2" /> Upload Official Quotation Document
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-emerald-200 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Price per MT (₹) *</label>
                <input 
                  type="number" 
                  value={quoteForm.price}
                  onChange={(e) => setQuoteForm({...quoteForm, price: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900"
                  placeholder="e.g. 850000"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Amount (₹) *</label>
                <input 
                  type="number" 
                  value={quoteForm.total}
                  onChange={(e) => setQuoteForm({...quoteForm, total: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900"
                  placeholder="e.g. 1275000"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Upload Quotation PDF Document *</label>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setQuoteForm({...quoteForm, file: e.target.files[0]});
                    }
                  }}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 text-xs font-semibold file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 text-xs">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUploadQuotation}
                disabled={!quoteForm.file || !quoteForm.price || !quoteForm.total}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl transition-all shadow-xs disabled:opacity-40"
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
