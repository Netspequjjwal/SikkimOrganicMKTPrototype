import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface ActionLog {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  iconType: 'enquiry' | 'contract' | 'payment' | 'order' | 'quotation' | 'general';
  actionUrl: string;
  refId?: string;
}

interface ActionCenterContextType {
  recentActions: ActionLog[];
  logAction: (action: Omit<ActionLog, 'id' | 'timestamp'>) => void;
  clearActions: () => void;
}

const ActionCenterContext = createContext<ActionCenterContextType | undefined>(undefined);

export const ActionCenterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recentActions, setRecentActions] = useState<ActionLog[]>([]);

  const logAction = (action: Omit<ActionLog, 'id' | 'timestamp'>) => {
    const newAction: ActionLog = {
      ...action,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    setRecentActions(prev => {
      let updatedList = prev;
      if (newAction.refId) {
        // Remove older status for the same entity
        updatedList = prev.filter(a => a.refId !== newAction.refId);
      }
      return [newAction, ...updatedList].slice(0, 20); // Keep latest 20
    });
  };

  const clearActions = () => {
    setRecentActions([]);
  };

  return (
    <ActionCenterContext.Provider value={{ recentActions, logAction, clearActions }}>
      {children}
    </ActionCenterContext.Provider>
  );
};

export const useActionCenter = () => {
  const context = useContext(ActionCenterContext);
  if (context === undefined) {
    throw new Error('useActionCenter must be used within an ActionCenterProvider');
  }
  return context;
};
