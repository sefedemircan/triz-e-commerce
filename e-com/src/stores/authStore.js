import { create } from 'zustand';
import { supabase } from '../services/supabase/client';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user });
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  initAuth: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    set({ user, loading: false });
  },
})); 