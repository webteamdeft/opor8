import { supabase } from './supabase';
import { User, Role } from '../types';

export const authService = {
  async signUp(email: string, password: string, name: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    const { error: userError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      name,
      role: 'user',
      is_paid: false,
      email_verified: true
    });

    if (userError) throw userError;

    return authData.user;
  },

  async signIn(email: string, password: string): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to sign in');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (userError) throw userError;
    if (!userData) throw new Error('User profile not found');

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role as Role,
      isPaid: userData.is_paid,
      emailVerified: userData.email_verified,
      createdAt: userData.created_at
    };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return null;

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error || !userData) return null;

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role as Role,
      isPaid: userData.is_paid,
      emailVerified: userData.email_verified,
      createdAt: userData.created_at
    };
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
};
