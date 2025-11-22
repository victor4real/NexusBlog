import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<boolean>; // Simplified for MVP
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string): Promise<boolean> => {
    // Simulating Supabase Auth
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email === email);
        if (foundUser) {
          if (foundUser.is_suspended) {
            alert("Your account has been suspended. Please contact support.");
            resolve(false);
            return;
          }
          setUser(foundUser);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === UserRole.ADMIN,
    isModerator: user?.role === UserRole.MODERATOR || user?.role === UserRole.ADMIN,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
