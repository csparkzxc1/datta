import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from './supabase';

type AuthResult = { error?: string };

type AuthState = {
  session: Session | null;
  user: User | null;
  initializing: boolean;
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initializing: true,

  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    set({
      session: data.session,
      user: data.session?.user ?? null,
      initializing: false,
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
    });
  },

  signInWithEmail: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: humanizeAuthError(error.message) };
    return {};
  },

  signUpWithEmail: async (email, password, name) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { error: humanizeAuthError(error.message) };
    return {};
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },
}));

function humanizeAuthError(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('invalid login')) return '이메일이나 비밀번호를 다시 확인해주세요';
  if (lower.includes('user already registered')) return '이미 가입된 이메일입니다';
  if (lower.includes('password should be at least')) return '비밀번호는 6자 이상이어야 합니다';
  if (lower.includes('email rate limit')) return '잠시 후 다시 시도해주세요';
  if (lower.includes('network')) return '잠시 후 다시 닿게 해드릴게요';
  return '잠시 멈췄어요. 다시 시도해보실까요';
}
