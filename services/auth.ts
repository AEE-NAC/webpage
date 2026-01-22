import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from './types_db';

// Admin client to bypass RLS for auth checks
// We use <any> here because cms_users and cms_invites are not yet in types_db generated types
const supabaseAdmin = createClient<any>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export type AuthUser = {
  username: string;
  role: 'super_admin' | 'admin' | 'editor';
  country_code: string | null;
};

// Simple hash (In prod, use bcryptjs or argon2)
const hashPassword = async (pwd: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(pwd + process.env.AUTH_SECRET); // Salt with env
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
};

export const AuthService = {
  async login(username: string, password: string): Promise<{ success: boolean; user?: AuthUser }> {
    // 1. Check Hardcoded Super Admin
    if (
      process.env.ADMIN_USERNAME && 
      username === process.env.ADMIN_USERNAME && 
      password === process.env.ADMIN_PASSWORD
    ) {
      await this.createSession({ username: 'SuperAdmin', role: 'super_admin', country_code: null });
      return { success: true, user: { username: 'SuperAdmin', role: 'super_admin', country_code: null } };
    }

    // 2. Check DB Users
    const pwdHash = await hashPassword(password);
    
    // Using supabaseAdmin typed as any allows us to query cms_users without error
    const { data } = await supabaseAdmin
      .from('cms_users')
      .select('*')
      .eq('username', username)
      .eq('password_hash', pwdHash)
      .single();

    if (data) {
      const user: AuthUser = { 
        username: data.username, 
        role: data.role as any, 
        country_code: data.country_code 
      };
      await this.createSession(user);
      return { success: true, user };
    }

    return { success: false };
  },

  async registerViaInvite(token: string, username: string, password: string) {
    const { data: invite } = await supabaseAdmin
      .from('cms_invites')
      .select('*')
      .eq('token', token)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (!invite) throw new Error("Invite invalide ou expiré.");

    const pwdHash = await hashPassword(password);
    
    // Create User
    const { error } = await supabaseAdmin.from('cms_users').insert({
      username,
      password_hash: pwdHash,
      role: invite.role,
      country_code: invite.country_code
    });

    if (error) throw new Error("Nom d'utilisateur déjà pris ?");

    // Burn Invite
    await supabaseAdmin.from('cms_invites').update({ is_used: true }).eq('id', (invite as any).id);

    return { success: true };
  },

  async createSession(user: AuthUser) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const sessionData = JSON.stringify({ ...user, expires: expires.toISOString() });
    // In a real app, encrypt this string
    const cookieStore = await cookies();
    cookieStore.set('cms_session', sessionData, { httpOnly: true, secure: true, path: '/' });
  },

  async getSession(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const sessionVal = cookieStore.get('cms_session')?.value;
    if (!sessionVal) return null;

    try {
      const session = JSON.parse(sessionVal);
      if (new Date(session.expires) < new Date()) return null;
      return session;
    } catch {
      return null;
    }
  },

  async logout() {
    const cookieStore = await cookies();
    cookieStore.delete('cms_session');
  },

  /**
   * INVITATION MANAGEMENT (For Super Admins)
   */
  async getInvites() {
    const { data, error } = await supabaseAdmin
      .from('cms_invites')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createInvite(role: string, countryCode: string | null) {
    const { data, error } = await supabaseAdmin
      .from('cms_invites')
      .insert({
        role,
        country_code: countryCode,
        is_used: false,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteInvite(id: string) {
    const { error } = await supabaseAdmin
      .from('cms_invites')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
