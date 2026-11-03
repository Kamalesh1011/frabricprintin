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

  // Re-validate the stored session with the server on load. Tokens issued by
  // the old backend (or expired ones) are rejected, so the user is signed out
  // instead of seeing a broken dashboard.
  useEffect(() => {
    const savedToken = localStorage.getItem('fabricprint_token');
    if (!savedToken) {
      if (currentUser) setCurrentUser(null);
      return;
    }
    let cancelled = false;
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${savedToken}` } })
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 401) {
          setToken(null);
          setCurrentUser(null);
          return;
        }
        if (res.ok) {
          const data: any = await res.json();
          if (data?.user) setCurrentUser(data.user);
        }
      })
      .catch(() => {
        /* offline: keep the cached session */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const isAdminUser: boolean = data.user?.role === 'admin';

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
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
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
    const sameAs = (a: Address) =>
      a.street.trim().toLowerCase() === addressData.street.trim().toLowerCase() &&
      String(a.pincode).trim() === String(addressData.pincode).trim();
    if (currentUser.addresses.some(sameAs)) return;
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`
    };
    const updatedUser: User = {
      ...currentUser,
      addresses: [...currentUser.addresses, newAddress]
    };
    setCurrentUser(updatedUser);
    const savedToken = localStorage.getItem('fabricprint_token');
    if (savedToken && currentUser.role === 'user') {
      fetch('/api/auth/me/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${savedToken}` },
        body: JSON.stringify({ addresses: updatedUser.addresses })
      }).catch(() => {
        /* address stays cached locally */
      });
    }
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
