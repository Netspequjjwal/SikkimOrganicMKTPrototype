import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTC } from '../../../context/TCContext';
import toast from 'react-hot-toast';
import { useNotification } from '../../../context/NotificationContext';
import { ShieldCheck, Upload, Leaf, ChevronRight, AlertCircle, FileText } from 'lucide-react';

export default function PublishProduct() {
  const { activeCertificates } = useTC();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    category: 'Spices',
    quantity: '',
    price: '',
    description: '',
    selectedCertId: ''
  });

  // For real validation, check if the certificate covers the selected crop, quantity, and is not expired.
  const selectedCert = activeCertificates.find(c => c.id === product.selectedCertId);
  const isCertValid = selectedCert && selectedCert.status === 'Active';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCertValid) {
      toast.error('Missing Certificate: You must link a valid Transaction Certificate to publish organic produce.');
      return;
    }
    
    // Check quantity limit conceptually
    if (parseInt(product.quantity) > (selectedCert.maxQty - selectedCert.utilizedQty)) {
      toast.error(`Quantity Exceeded: The listed quantity exceeds your certificate's remaining authorized limit (${selectedCert.maxQty - selectedCert.utilizedQty} MT).`);
      return;
    }

    toast.success('Product Published: Your product has been successfully listed on the marketplace.');
    navigate('/dashboard'); // go back to FPO dashboard
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" /> Publish Organic Produce
        </h1>
        <p className="text-gray-500 mb-8">List your certified organic products on the B2B marketplace.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">1. Product Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required type="text" className="w-full p-3 border border-gray-300 rounded-xl" placeholder="e.g. Premium Large Cardamom" value={product.name} onChange={e => setProduct({...product, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full p-3 border border-gray-300 rounded-xl" value={product.category} onChange={e => setProduct({...product, category: e.target.value})}>
                  <option>Spices</option>
                  <option>Cereals</option>
                  <option>Fruits</option>
                  <option>Vegetables</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Quantity (MT)</label>
                <input required type="number" className="w-full p-3 border border-gray-300 rounded-xl" placeholder="e.g. 50" value={product.quantity} onChange={e => setProduct({...product, quantity: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Price per MT (₹)</label>
                <input required type="number" className="w-full p-3 border border-gray-300 rounded-xl" placeholder="e.g. 450000" value={product.price} onChange={e => setProduct({...product, price: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> 2. Compliance & Certification
            </h3>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>To publish a product on the Sikkim Organic Marketplace, you must link an active Transaction Certificate (TC) that covers the intended crop and quantity.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link Transaction Certificate</label>
              <select 
                required 
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-primary transition-colors font-medium text-gray-900"
                value={product.selectedCertId} 
                onChange={e => setProduct({...product, selectedCertId: e.target.value})}
              >
                <option value="">-- Select an Active Certificate --</option>
                {activeCertificates.map(cert => (
                  <option key={cert.id} value={cert.id} disabled={cert.status !== 'Active'}>
                    {cert.certNumber} - {cert.applicableCrops.join(', ')} ({cert.status}) 
                  </option>
                ))}
              </select>

              {activeCertificates.length === 0 && (
                <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-xl flex items-start gap-3">
                  <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-800">No Active Certificates Found</p>
                    <p className="text-sm text-red-700 mt-1 mb-3">You do not have any active TCs available to link to this product. You must obtain one before publishing.</p>
                    <button type="button" onClick={() => navigate('/dashboard/tc/marketplace')} className="text-sm font-bold text-primary hover:underline">
                      Go to TC Services Marketplace &rarr;
                    </button>
                  </div>
                </div>
              )}

              {selectedCert && (
                <div className="mt-4 p-4 border border-green-200 bg-green-50 rounded-xl grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-green-700 font-semibold">Max Authorized Qty</div>
                    <div className="font-bold text-green-900">{selectedCert.maxQty} MT</div>
                  </div>
                  <div>
                    <div className="text-xs text-green-700 font-semibold">Qty Already Utilized</div>
                    <div className="font-bold text-green-900">{selectedCert.utilizedQty} MT</div>
                  </div>
                  <div>
                    <div className="text-xs text-green-700 font-semibold">Validity Ends</div>
                    <div className="font-bold text-green-900">{selectedCert.validityEnd}</div>
                  </div>
                  <div>
                    <div className="text-xs text-green-700 font-semibold">Issued By</div>
                    <div className="font-bold text-green-900 truncate">{selectedCert.providerName}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button 
              type="submit"
              disabled={!isCertValid}
              className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${
                isCertValid 
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-sm' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Upload className="w-5 h-5" /> Publish to Marketplace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
