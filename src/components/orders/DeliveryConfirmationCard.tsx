import React from 'react';
import { Order, useOrder } from '../../context/OrderContext';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  order: Order;
}

const DeliveryConfirmationCard: React.FC<Props> = ({ order }) => {
  const { confirmDeliveryReceipt } = useOrder();
  const navigate = useNavigate();

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className="bg-white p-2 rounded-full border border-purple-200 shadow-sm mt-1">
          <AlertCircle className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-purple-900 mb-1">Please Confirm Delivery</h3>
          <p className="text-purple-800 mb-2">
            Order <span className="font-semibold">{order.id}</span> ({order.product}) has been marked as In-Transit by <span className="font-semibold">{order.supplierName}</span>. Please mark it as delivered upon receiving the consignment and initiate the pending payment, if any.
          </p>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => {
                confirmDeliveryReceipt(order.id);
                navigate('/dashboard/payments/ledger'); // Might have pending payments
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Mark as Delivered
            </button>
            <button 
              onClick={() => navigate(`/dashboard/orders/${order.id}`)}
              className="bg-white text-purple-700 border border-purple-300 hover:bg-purple-100 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryConfirmationCard;
