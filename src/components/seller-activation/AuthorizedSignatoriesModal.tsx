import React, { useState } from 'react';
import { useOrganization, AuthorizedSignatory } from '../../context/OrganizationContext';
import { UserCheck, Plus, Trash2, X, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthorizedSignatoriesModalProps {
  onClose: () => void;
  isBuyer?: boolean;
}

const AUTHORITIES_LIST = [
  'Primary Signatory (Sole / Unlimited Authority)',
  'Joint Signatory (Contracts > Rs 25 Lakhs)',
  'Financial Signatory (< Rs 10 Lakhs)',
  'Authorized Operations Representative'
];

const AuthorizedSignatoriesModal: React.FC<AuthorizedSignatoriesModalProps> = ({ onClose, isBuyer = false }) => {
  const {
    authorizedSignatories,
    addAuthorizedSignatory,
    removeAuthorizedSignatory,
    buyerAuthorizedSignatories,
    addBuyerAuthorizedSignatory,
    removeBuyerAuthorizedSignatory,
  } = useOrganization();

  const currentList = isBuyer ? buyerAuthorizedSignatories : authorizedSignatories;
  const addFn = isBuyer ? addBuyerAuthorizedSignatory : addAuthorizedSignatory;
  const removeFn = isBuyer ? removeBuyerAuthorizedSignatory : removeAuthorizedSignatory;

  const [isAdding, setIsAdding] = useState(false);
  const [newSignatory, setNewSignatory] = useState({
    name: '',
    designation: '',
    signingAuthority: AUTHORITIES_LIST[0],
    mobile: '',
    email: '',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSignatory.name || !newSignatory.designation) {
      toast.error('Please enter name and designation.');
      return;
    }
    addFn(newSignatory);
    toast.success(`${isBuyer ? 'Buyer' : 'Seller'} Authorized Signatory added successfully!`);
    setNewSignatory({
      name: '',
      designation: '',
      signingAuthority: AUTHORITIES_LIST[0],
      mobile: '',
      email: '',
    });
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className={`w-6 h-6 ${isBuyer ? 'text-blue-400' : 'text-emerald-400'}`} />
              <h2 className="text-xl font-bold">{isBuyer ? 'Buyer' : 'Seller'} Authorized Signatories Setup</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Required before Contract Execution. Add authorized individuals who can sign digital trade agreements.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* List of existing signatories */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Configured Signatories ({currentList.length})
              </h3>
              {!isAdding && (
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className={`px-3 py-1.5 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 ${
                    isBuyer ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Plus className="w-4 h-4" /> Add Signatory
                </button>
              )}
            </div>

            {currentList.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
                No authorized signatories configured yet. Adding at least one is required before contract execution.
              </div>
            ) : (
              <div className="space-y-3">
                {currentList.map((sig) => (
                  <div key={sig.id} className="p-4 bg-gray-50 border rounded-xl flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{sig.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 font-semibold rounded-md ${
                            isBuyer ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {sig.designation}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Authority: <strong className="text-slate-800">{sig.signingAuthority}</strong>
                      </p>
                      <p className="text-xs text-gray-500">
                        {sig.email} {sig.mobile && `| ${sig.mobile}`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFn(sig.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Signatory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form to add signatory */}
          {isAdding && (
            <form onSubmit={handleAdd} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 animate-fade-in">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className={`w-4 h-4 ${isBuyer ? 'text-blue-600' : 'text-emerald-600'}`} /> Add Authorized Signatory Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newSignatory.name}
                    onChange={(e) => setNewSignatory({ ...newSignatory, name: e.target.value })}
                    placeholder="e.g. Tenzing Bhutia"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newSignatory.designation}
                    onChange={(e) => setNewSignatory({ ...newSignatory, designation: e.target.value })}
                    placeholder="e.g. Director of Procurement"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Signing Authority Role / Limit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newSignatory.signingAuthority}
                    onChange={(e) => setNewSignatory({ ...newSignatory, signingAuthority: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {AUTHORITIES_LIST.map((auth) => (
                      <option key={auth} value={auth}>
                        {auth}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={newSignatory.mobile}
                    onChange={(e) => setNewSignatory({ ...newSignatory, mobile: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newSignatory.email}
                    onChange={(e) => setNewSignatory({ ...newSignatory, email: e.target.value })}
                    placeholder="e.g. tenzing@karmapaorganic.in"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold text-xs rounded-lg shadow-xs ${
                    isBuyer ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  Save Signatory
                </button>
              </div>
            </form>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorizedSignatoriesModal;
