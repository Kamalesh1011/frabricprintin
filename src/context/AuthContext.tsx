import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: User; isAdmin: boolean }>;
  register: (name: string, phone: string, email: string, password: string) => Promise<User>;
  sendPhoneOtp: (phone: string) => Promise<{ success: boolean; message: string; testOtp?: string }>;
  verifyPhoneOtp: (phone: string, otp: string, name?: string) => Promise<{ user: User; isAdmin: boolean }>;
  loginWithGoogle: (payload: { credential?: string; email?: string; name?: string; picture?: string; googleId?: string }) => Promise<{ user: User; isAdmin: boolean }>;
  logout: () => void;
  saveAddress: (address: Omit<Address, 'id'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('fabricprint_user');
      const savedToken = localStorage.getItem('fabricprint_token');
      if (saved && savedToken) {
        const decoded = parseJwt(savedToken);
        if (decoded && decoded.exp && decoded.exp * 1000 < Date.now()) {
          // Token expired
          localStorage.removeItem('fabricprint_user');
          localStorage.removeItem('fabricprint_token');
          return null;
        }
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('fabricprint_token');
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync token and user in storage
  useEffect(() => {
    if (currentUser && token) {
      localStorage.setItem('fabricprint_user', JSON.stringify(currentUser));
      localStorage.setItem('fabricprint_token', token);
    } else {
      localStorage.removeItem('fabricprint_user');
      localStorage.removeItem('fabricprint_token');
    }
  }, [currentUser, token]);

  // Re-validate session with server on boot
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
        /* offline fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAuthSuccess = (userToSet: User, userToken: string, isAdminUser: boolean) => {
    setCurrentUser(userToSet);
    setToken(userToken);
    localStorage.setItem('fabricprint_token', userToken);
    localStorage.setItem('fabricprint_user', JSON.stringify(userToSet));
    return { user: userToSet, isAdmin: isAdminUser };
  };

  // 1. Traditional Email / Password Login
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

    const isAdminUser: boolean = !!data.isAdmin || data.user?.role === 'admin';
    return handleAuthSuccess(data.user, data.token, isAdminUser);
  };

  // 2. Email / Password Register
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

    handleAuthSuccess(data.user, data.token, !!data.isAdmin);
    return data.user;
  };

  // 3. Amazon-Style Phone + OTP: Send OTP
  const sendPhoneOtp = async (phone: string): Promise<{ success: boolean; message: string; testOtp?: string }> => {
    const clean = phone.trim();
    if (!clean) {
      throw new Error('Please enter your 10-digit mobile number');
    }

    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: clean })
    });

    const data: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Failed to send OTP. Please check the mobile number.');
    }

    return data;
  };

  // 4. Amazon-Style Phone + OTP: Verify OTP
  const verifyPhoneOtp = async (phone: string, otp: string, name?: string): Promise<{ user: User; isAdmin: boolean }> => {
    const cleanPhone = phone.trim();
    const cleanOtp = otp.trim();

    if (!cleanPhone) throw new Error('Mobile number is required');
    if (!cleanOtp) throw new Error('Please enter the 6-digit OTP code');

    const res = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, otp: cleanOtp, name })
    });

    const data: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Incorrect or expired OTP. Please try again.');
    }

    const isAdminUser: boolean = !!data.isAdmin || data.user?.role === 'admin';
    return handleAuthSuccess(data.user, data.token, isAdminUser);
  };

  // 5. Google / Gmail OAuth Login
  const loginWithGoogle = async (payload: { credential?: string; email?: string; name?: string; picture?: string; googleId?: string }): Promise<{ user: User; isAdmin: boolean }> => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Google authentication failed. Please try again.');
    }

    const isAdminUser: boolean = !!data.isAdmin || data.user?.role === 'admin';
    return handleAuthSuccess(data.user, data.token, isAdminUser);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('fabricprint_user');
    localStorage.removeItem('fabricprint_token');
  };

  const saveAddress = (addressData: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`
    };
    const updatedUser: User = {
      ...currentUser,
      addresses: [...(currentUser.addresses || []), newAddress]
    };
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        token,
        isLoading,
        login,
        register,
        sendPhoneOtp,
        verifyPhoneOtp,
        loginWithGoogle,
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
