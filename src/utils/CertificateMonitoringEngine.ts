export interface CertificateStatus {
  status: 'valid' | 'warning' | 'expired';
  daysRemaining: number;
  message: string;
  color: string;
  iconColor: string;
}

export const checkCertificateStatus = (expiryDate: string | undefined): CertificateStatus => {
  if (!expiryDate) {
    return {
      status: 'expired',
      daysRemaining: 0,
      message: 'Certificate details missing',
      color: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-500'
    };
  }

  const expiry = new Date(expiryDate);
  const today = new Date();
  
  // For the sake of the demo, let's pretend today is slightly before the expiry date if it's very far in the future
  // Or we just calculate the real difference.
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'expired',
      daysRemaining: diffDays,
      message: 'Organic Certificate Expired',
      color: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-500'
    };
  }
  
  if (diffDays <= 30) {
    return {
      status: 'warning',
      daysRemaining: diffDays,
      message: `Action Required: Certificate expiring in ${diffDays} days`,
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      iconColor: 'text-orange-500'
    };
  }

  return {
    status: 'valid',
    daysRemaining: diffDays,
    message: 'Certificate Valid',
    color: 'bg-green-50 border-green-200 text-green-800',
    iconColor: 'text-green-500'
  };
};
