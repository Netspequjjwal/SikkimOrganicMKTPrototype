import React, { useState } from 'react';
import { useOrganization, BankAccountData } from '../../context/OrganizationContext';
import { CreditCard, X, CheckCircle, UploadCloud, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface BankAccountModalProps {
  onClose: () => void;
  isBuyer?: boolean;
}

const BankAccountModal: React.FC<BankAccountModalProps> = ({ onClose, isBuyer = false }) => {
  const { bankAccount, saveBankAccount, buyerPaymentAccount, saveBuyerPaymentAccount } = useOrganization();

  const currentAccount = isBuyer ? buyerPaymentAccount : bankAccount;
  const saveFn = isBuyer ? saveBuyerPaymentAccount : saveBankAccount;

  const [formData, setFormData] = useState<BankAccountData>(
    currentAccount || {
      bankName: isBuyer ? 'HDFC Bank' : 'State Bank of India',
      branchName: isBuyer ? 'Gangtok Main Branch' : 'MG Marg Branch, Gangtok',
      ifscCode: isBuyer ? 'HDFC0000881' : 'SBIN0000234',
      accountNumber: isBuyer ? '50200019284718' : '30492817492',
      accountHolderName: 'Karmapa Organic Traders',
      accountType: 'Current Account',
      chequeDocName: isBuyer ? 'HDFC_Cheque.pdf' : 'Cancelled_Cheque_SBI.pdf',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bankName || !formData.accountNumber || !formData.ifscCode) {
      toast.error('Bank Name, Account Number, and IFSC Code are required.');
      return;
    }
    saveFn(formData);
    toast.success(`${isBuyer ? 'Buyer Settlement' : 'Seller'} Bank Account details saved successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fade-in my-6">
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className={`w-6 h-6 ${isBuyer ? 'text-blue-400' : 'text-emerald-400'}`} />
              <h2 className="text-xl font-bold">{isBuyer ? 'Buyer Payment Settlement' : 'Seller Bank Account'} Details</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Required before Payment Processing. Configure settlement bank account details for trade payments.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Account Holder Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.accountHolderName}
                onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                placeholder="e.g. Karmapa Organic Traders"
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Account Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="Current Account">Current Account</option>
                <option value="Savings Account">Savings Account</option>
                <option value="CC / Overdraft Account">CC / Overdraft Account</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g. HDFC Bank"
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Branch Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.branchName}
                onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                placeholder="e.g. Gangtok Main Branch"
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="e.g. 50200019284718"
                className="w-full px-3 py-2 border rounded-lg font-mono text-sm bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={11}
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                placeholder="e.g. HDFC0000881"
                className="w-full px-3 py-2 border rounded-lg font-mono text-sm bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Upload Cancelled Cheque */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700">
              Upload Cancelled Cheque / Passbook Image
            </label>
            <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className={`w-6 h-6 ${isBuyer ? 'text-blue-600' : 'text-emerald-600'}`} />
                <div>
                  <p className="text-xs font-bold text-gray-900">{formData.chequeDocName || 'Cancelled_Cheque.pdf'}</p>
                  <p className="text-[10px] text-gray-500">PDF, JPG, PNG up to 5MB</p>
                </div>
              </div>
              <label className="cursor-pointer px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-xs font-bold text-gray-700 rounded-lg shadow-xs flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5 text-gray-500" /> Upload File
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({ ...formData, chequeDocName: e.target.files[0].name });
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white font-bold text-sm rounded-xl shadow-xs flex items-center gap-1.5 ${
                isBuyer ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              Save Details <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankAccountModal;
