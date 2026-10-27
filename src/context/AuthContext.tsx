import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<{ user: User; isAdmin: boolean }>;
  register: (name: string, phone: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  saveAddress: (address: Omit<Address, 'id'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('fabricprint_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Explicitly clear any legacy mock demo customer state ("Ananya Sharma" / "usr-1")
        if (
          parsed?.name === 'Ananya Sharma' ||
          parsed?.email?.toLowerCase().includes('ananya') ||
          parsed?.id === 'usr-1'
        ) {
          localStorage.removeItem('texprint_user');
          localStorage.removeItem('texprint_token');
          localStorage.removeItem('fabricprint_user');
          localStorage.removeItem('fabricprint_token');
          return null;
        }
        return parsed;
      }
    } catch {
      // ignore parse error
    }
    // Clean any legacy texprint keys
    localStorage.removeItem('texprint_user');
    localStorage.removeItem('texprint_token');
    return null; // Visitors are guests by default!
  });

  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('fabricprint_token');
    if (!savedToken) return null;
    return savedToken;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fabricprint_user', JSON.stringify(currentUser));
      localStorage.removeItem('texprint_user');
    } else {
      localStorage.removeItem('fabricprint_user');
      localStorage.removeItem('texprint_user');
      localStorage.removeItem('fabricprint_token');
      localStorage.removeItem('texprint_token');
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<{ user: User; isAdmin: boolean }> => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Please enter your email or username');
    }
    if (!password || !password.trim()) {
      throw new Error('Please enter your password');
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password })
    });

    const data: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Invalid credentials. Please verify your email and password.');
    }

    const userToSet: User = data.user;
    const userToken: string = data.token;
    const isAdminUser: boolean = !!data.isAdmin;

    setCurrentUser(userToSet);
    setToken(userToken);
    localStorage.setItem('fabricprint_token', userToken);
    localStorage.setItem('fabricprint_user', JSON.stringify(userToSet));

    return { user: userToSet, isAdmin: isAdminUser };
  };

  const register = async (name: string, phone: string, email: string, password: string): Promise<User> => {
    if (!name.trim()) {
      throw new Error('Please enter your full name');
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Please enter your email address');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        email: cleanEmail,
        password
      })
    });

    const data: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed. Please try again.');
    }

    const newUser: User = data.user;
    const userToken: string = data.token;

    setCurrentUser(newUser);
    setToken(userToken);
    localStorage.setItem('fabricprint_token', userToken);
    localStorage.setItem('fabricprint_user', JSON.stringify(newUser));

    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('fabricprint_user');
    localStorage.removeItem('fabricprint_token');
    localStorage.removeItem('texprint_user');
    localStorage.removeItem('texprint_token');
  };

  const saveAddress = (addressData: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`
    };
    const updatedUser: User = {
      ...currentUser,
      addresses: [...currentUser.addresses, newAddress]
    };
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        token,
        login,
        register,
        logout,
        saveAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
