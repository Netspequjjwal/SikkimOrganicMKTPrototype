import React from 'react';
import { useNegotiation } from '../../context/NegotiationContext';
import { useContract } from '../../context/ContractContext';
import { useOrder } from '../../context/OrderContext';
import { MessageSquare, FileSignature, CreditCard, Truck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface TransactionMapProps {
  enquiryId?: string;
  contractId?: string;
  orderId?: string;
  currentStep: 'negotiation' | 'contract' | 'payment' | 'order';
}

const TransactionMap: React.FC<TransactionMapProps> = ({ enquiryId, contractId, orderId, currentStep }) => {
  const { enquiries } = useNegotiation();
  const { contracts } = useContract();
  const { orders } = useOrder();

  // Resolve the chain
  let resolvedEnquiryId = enquiryId;
  let resolvedContractId = contractId;
  let resolvedOrderId = orderId;

  if (orderId && !contractId) {
    const order = orders.find(o => o.id === orderId);
    if (order) resolvedContractId = order.contractId;
  }

  if (resolvedContractId && !resolvedEnquiryId) {
    const contract = contracts.find(c => c.id === resolvedContractId);
    if (contract) resolvedEnquiryId = contract.enquiryId;
  }

  // Find down the chain if we started from enquiry
  if (resolvedEnquiryId && !resolvedContractId) {
    const contract = contracts.find(c => c.enquiryId === resolvedEnquiryId);
    if (contract) resolvedContractId = contract.id;
  }

  if (resolvedContractId && !resolvedOrderId) {
    const order = orders.find(o => o.contractId === resolvedContractId);
    if (order) resolvedOrderId = order.id;
  }

  const steps = [
    {
      id: 'negotiation',
      label: 'Enquiry & Negotiation',
      icon: MessageSquare,
      link: resolvedEnquiryId ? `/dashboard/negotiation/${resolvedEnquiryId}` : null,
      ref: resolvedEnquiryId
    },
    {
      id: 'contract',
      label: 'Digital Contract',
      icon: FileSignature,
      link: resolvedContractId ? `/dashboard/contracts/${resolvedContractId}` : null,
      ref: resolvedContractId
    },
    {
      id: 'payment',
      label: 'Payments',
      icon: CreditCard,
      link: resolvedContractId ? `/dashboard/payments/ledger` : null, // Payment ledger is the best general link
      ref: resolvedContractId ? 'Ledger' : null
    },
    {
      id: 'order',
      label: 'Order Fulfilment',
      icon: Truck,
      link: resolvedOrderId ? `/dashboard/orders/${resolvedOrderId}` : null,
      ref: resolvedOrderId
    }
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="flex flex-wrap items-center mb-6 text-sm px-2">
      <span className="text-gray-400 font-semibold mr-4 text-xs uppercase tracking-widest hidden sm:inline-block">Lifecycle</span>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentIndex;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              {step.link ? (
                <Link 
                  to={step.link}
                  className={clsx(
                    "flex items-center group transition-colors",
                    isActive ? "text-primary font-bold" : "text-gray-500 hover:text-gray-900 font-medium"
                  )}
                >
                  <Icon className={clsx("w-4 h-4 mr-1.5", isActive ? "text-primary" : "text-gray-400 group-hover:text-primary transition-colors")} />
                  <span className="border-b border-transparent group-hover:border-gray-300 transition-colors">{step.label}</span>
                  {step.ref && (
                    <span className={clsx("ml-1.5 text-xs font-normal", isActive ? "text-primary/70" : "text-gray-400")}>
                      #{step.ref.split('-').pop()}
                    </span>
                  )}
                </Link>
              ) : (
                <div className="flex items-center text-gray-300">
                  <Icon className="w-4 h-4 mr-1.5" />
                  <span>{step.label}</span>
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-300 mx-2 sm:mx-3" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TransactionMap;
