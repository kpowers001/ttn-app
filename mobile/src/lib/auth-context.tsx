import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const STUDENT_EMAIL_DOMAIN = '@tuskegee.edu';
const MOCK_SESSION_KEY = 'ttn.mock-session';

interface AuthState {
  ready: boolean;
  signedIn: boolean;
  email: string | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, username: string, classification: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        setEmail(data.session?.user.email ?? null);
        setReady(true);
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setEmail(session?.user.email ?? null);
      });
      return () => sub.subscription.unsubscribe();
    }
    AsyncStorage.getItem(MOCK_SESSION_KEY).then((stored) => {
      setEmail(stored);
      setReady(true);
    });
  }, []);

  const validateStudentEmail = (value: string): string | null =>
    value.toLowerCase().endsWith(STUDENT_EMAIL_DOMAIN)
      ? null
      : `Use your ${STUDENT_EMAIL_DOMAIN} email address`;

  const signIn = async (emailInput: string, password: string) => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password });
      return error ? error.message : null;
    }
    if (!emailInput || !password) return 'Enter your email and password';
    await AsyncStorage.setItem(MOCK_SESSION_KEY, emailInput);
    setEmail(emailInput);
    return null;
  };

  const signUp = async (emailInput: string, password: string, username: string, classification: string) => {
    const emailError = validateStudentEmail(emailInput);
    if (emailError) return emailError;
    if (!username) return 'Pick a username';
    if (!classification) return 'Select your classification';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (supabase) {
      const { error } = await supabase.auth.signUp({
        email: emailInput,
        password,
        options: { data: { username, classification } },
      });
      return error ? error.message : null;
    }
    await AsyncStorage.setItem(MOCK_SESSION_KEY, emailInput);
    setEmail(emailInput);
    return null;
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      await AsyncStorage.removeItem(MOCK_SESSION_KEY);
    }
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ ready, signedIn: email != null, email, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
