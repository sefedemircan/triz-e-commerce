import { create } from 'zustand';
import { supabase } from '../services/supabase/client';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  userProfile: null,

  initAuth: async () => {
    try {
      set({ loading: true });
      // Mevcut oturumu kontrol et
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Kullanıcı profilini al
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({ 
          user: session.user,
          userProfile: profile,
          loading: false 
        });
      } else {
        set({ user: null, userProfile: null, loading: false });
      }
    } catch (error) {
      console.error('Auth init error:', error);
      set({ user: null, userProfile: null, loading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true });
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Kullanıcı profilini al
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      set({ user: session.user, userProfile: profile, loading: false });
      return session;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await supabase.auth.signOut();
      set({ user: null, userProfile: null, loading: false });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ loading: false });
    }
  },

  signUp: async (email, password) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
})); 