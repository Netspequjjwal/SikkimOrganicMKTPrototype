import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRBAC } from './RBACContext';

export type UserRole = 'AGRI_DEPT' | 'ICS_PROVIDER' | 'FPO_FARMER' | 'BUYER';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, activeRole } = useRBAC();
  const [user, setUser] = useState<User | null>(null);

  // Synchronize legacy AuthContext with active RBAC role & user
  useEffect(() => {
    if (activeRole) {
      let mappedRole: UserRole = 'AGRI_DEPT';
      if (activeRole === 'BUYER_USER') {
        mappedRole = 'BUYER';
      } else if (activeRole === 'SELLER_USER') {
        mappedRole = 'ICS_PROVIDER';
      } else if (activeRole === 'DEPT_ADMIN' || activeRole === 'SOFDA_ADMIN' || activeRole === 'SUPER_ADMIN') {
        mappedRole = 'AGRI_DEPT';
      }

      setUser({
        name: currentUser?.name || 'Authorized User',
        email: currentUser?.email || 'user@sikkim.gov.in',
        role: mappedRole,
        avatar: currentUser?.avatar
      });
    } else {
      setUser(null);
    }
  }, [currentUser, activeRole]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

