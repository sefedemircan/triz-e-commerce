import { create } from 'zustand';
import { supabase } from '../services/supabase/client';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  userProfile: null,

  initAuth: async () => {
    try {
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

      set({ user: session.user, userProfile: profile });
      return session;
    } catch (error) {
      throw error;
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, userProfile: null });
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user });
  },
})); 