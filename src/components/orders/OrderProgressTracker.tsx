import React from 'react';
import { OrderStatus } from '../../context/OrderContext';
import { Check, Clock } from 'lucide-react';
import clsx from 'clsx';

interface OrderProgressTrackerProps {
  currentStatus: OrderStatus;
}

const steps = [
  { label: 'Details Pending', activeStatuses: ['Ready for Delivery Details', 'Awaiting Buyer Delivery Confirmation'] },
  { label: 'Address Confirmed', activeStatuses: ['Delivery Address Confirmed'] },
  { label: 'Preparing', activeStatuses: ['Preparing Order', 'Quality Inspection Completed', 'Packaging Completed'] },
  { label: 'Way Bill', activeStatuses: ['Way Bill Generated', 'Ready for Dispatch'] },
  { label: 'Shipped', activeStatuses: ['Handed Over to Logistics Partner', 'Shipment In Transit', 'Out for Delivery'] },
  { label: 'Delivered', activeStatuses: ['Delivered (Awaiting Buyer Confirmation)'] },
  { label: 'Completed', activeStatuses: ['Completed'] }
];

const OrderProgressTracker: React.FC<OrderProgressTrackerProps> = ({ currentStatus }) => {
  // Find current step index
  let currentIndex = -1;
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].activeStatuses.includes(currentStatus)) {
      currentIndex = i;
      break;
    }
  }

  // Fallback
  if (currentIndex === -1) currentIndex = 0;

  return (
    <div className="w-full pt-4 pb-8 px-4">
      <div className="flex justify-between relative">
        {/* Connecting Line */}
        <div className="absolute left-0 top-5 w-full h-1 bg-gray-200 z-0 -translate-y-1/2"></div>
        
        {/* Active Line Fill */}
        <div 
          className="absolute left-0 top-5 h-1 bg-primary transition-all duration-500 z-0 -translate-y-1/2"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center flex-1">
              <div 
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-300 z-10 shrink-0",
                  isCompleted ? "bg-primary text-white" : 
                  isActive ? "bg-white border-primary border-4 text-primary" : 
                  "bg-gray-100 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isActive ? (
                  <Clock className="w-5 h-5 animate-pulse" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <div className="mt-3 text-center w-full px-1">
                <span className={clsx(
                  "text-xs font-bold transition-colors duration-300 block",
                  (isCompleted || isActive) ? "text-gray-900" : "text-gray-400"
                )}>
                  {step.label}
                </span>
                {isActive && (
                  <span className="text-[10px] text-primary font-medium w-full block mt-0.5 leading-tight" title={currentStatus}>
                    {currentStatus}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgressTracker;
