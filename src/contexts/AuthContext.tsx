import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ecom_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Check customer exists
      const { data } = await supabase
        .from('ecom_customers')
        .select('*')
        .eq('email', email)
        .single();

      if (data) {
        const u: User = { id: data.id, email: data.email, name: data.name || email.split('@')[0] };
        setUser(u);
        localStorage.setItem('ecom_user', JSON.stringify(u));
        toast.success('Welcome back!');
        setLoading(false);
        return true;
      }
      // Auto-create for demo
      const { data: newCustomer } = await supabase
        .from('ecom_customers')
        .insert({ email, name: email.split('@')[0] })
        .select('*')
        .single();
      if (newCustomer) {
        const u: User = { id: newCustomer.id, email: newCustomer.email, name: newCustomer.name || '' };
        setUser(u);
        localStorage.setItem('ecom_user', JSON.stringify(u));
        toast.success('Welcome!');
        setLoading(false);
        return true;
      }
      toast.error('Login failed');
      setLoading(false);
      return false;
    } catch {
      toast.error('Login failed');
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from('ecom_customers')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        toast.error('Account already exists');
        setLoading(false);
        return false;
      }

      const { data } = await supabase
        .from('ecom_customers')
        .insert({ email, name })
        .select('*')
        .single();

      if (data) {
        const u: User = { id: data.id, email: data.email, name: data.name || '' };
        setUser(u);
        localStorage.setItem('ecom_user', JSON.stringify(u));
        toast.success('Account created successfully!');
        setLoading(false);
        return true;
      }
      toast.error('Registration failed');
      setLoading(false);
      return false;
    } catch {
      toast.error('Registration failed');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecom_user');
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
