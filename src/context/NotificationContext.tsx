import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type NotificationType = 'SMS' | 'EMAIL';

export interface BaseNotification {
  id: string;
  type: NotificationType;
  to: string;
  timestamp: number;
}

export interface SMSNotification extends BaseNotification {
  type: 'SMS';
  message: string;
}

export interface EmailNotification extends BaseNotification {
  type: 'EMAIL';
  subject: string;
  body: string;
  attachmentName?: string;
  attachmentType?: 'PDF' | 'EXCEL' | 'DOC';
}

export type AppNotification = SMSNotification | EmailNotification;

interface NotificationContextType {
  activeNotification: AppNotification | null;
  triggerSMS: (to: string, message: string) => void;
  triggerEmail: (to: string, subject: string, body: string, attachmentName?: string, attachmentType?: 'PDF' | 'EXCEL' | 'DOC') => void;
  dismissNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<AppNotification[]>([]);
  const [activeNotification, setActiveNotification] = useState<AppNotification | null>(null);

  // When there is no active notification but we have items in queue, pop the first one
  React.useEffect(() => {
    if (!activeNotification && queue.length > 0) {
      setActiveNotification(queue[0]);
      setQueue(q => q.slice(1));
    }
  }, [activeNotification, queue]);

  // Auto-dismiss after 8 seconds
  React.useEffect(() => {
    if (activeNotification) {
      const timer = setTimeout(() => {
        dismissNotification();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [activeNotification]);

  const triggerSMS = useCallback((to: string, message: string) => {
    const newNotif: SMSNotification = {
      id: `sms-${Date.now()}`,
      type: 'SMS',
      to,
      message,
      timestamp: Date.now()
    };
    setQueue(prev => [...prev, newNotif]);
  }, []);

  const triggerEmail = useCallback((to: string, subject: string, body: string, attachmentName?: string, attachmentType?: 'PDF' | 'EXCEL' | 'DOC') => {
    const newNotif: EmailNotification = {
      id: `email-${Date.now()}`,
      type: 'EMAIL',
      to,
      subject,
      body,
      attachmentName,
      attachmentType,
      timestamp: Date.now()
    };
    setQueue(prev => [...prev, newNotif]);
  }, []);

  const dismissNotification = useCallback(() => {
    setActiveNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ activeNotification, triggerSMS, triggerEmail, dismissNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
