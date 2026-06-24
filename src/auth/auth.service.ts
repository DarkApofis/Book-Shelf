/**
 * Thin wrapper over Supabase Auth. Translates Supabase users into our
 * `SessionUser` and guards every call behind configuration so the UI can give a
 * clear message when keys aren't set yet (instead of throwing opaque errors).
 */
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { SessionUser, SignUpOutcome } from './auth.types';

/** Where the confirmation/reset link returns the user — the running app's origin. */
const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;

const NOT_CONFIGURED = 'Sign-in isn’t set up yet. Add your Supabase keys to .env.local, or continue as a guest.';

function toSessionUser(user: User | null): SessionUser | null {
  if (!user) return null;
  const name = (user.user_metadata?.name as string | undefined)?.trim();
  return {
    id: user.id,
    email: user.email ?? '',
    name: name || user.email?.split('@')[0] || 'Reader',
  };
}

export const authService = {
  isConfigured: isSupabaseConfigured,

  async signIn(email: string, password: string): Promise<SessionUser | null> {
    if (!supabase) throw new Error(NOT_CONFIGURED);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return toSessionUser(data.user);
  },

  async signUp(name: string, email: string, password: string): Promise<SignUpOutcome> {
    if (!supabase) throw new Error(NOT_CONFIGURED);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: redirectTo },
    });
    if (error) throw error;
    // A session is only present when email confirmation is disabled. Otherwise the
    // user exists but is inactive until they click the emailed link.
    if (data.session && data.user) return { status: 'active', user: toSessionUser(data.user)! };
    return { status: 'confirm' };
  },

  /** Re-send the sign-up confirmation email (e.g. it expired or was lost). */
  async resendConfirmation(email: string): Promise<void> {
    if (!supabase) throw new Error(NOT_CONFIGURED);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) throw error;
  },

  async signOut(): Promise<void> {
    if (supabase) await supabase.auth.signOut();
  },

  async resetPassword(email: string): Promise<void> {
    if (!supabase) throw new Error(NOT_CONFIGURED);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  /** Restore an existing session on load (returns the member, or null). */
  async currentUser(): Promise<SessionUser | null> {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return toSessionUser(data.session?.user ?? null);
  },

  /** Subscribe to auth changes (e.g. token refresh, sign-out in another tab). */
  onChange(cb: (user: SessionUser | null) => void): () => void {
    if (!supabase) return () => {};
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      cb(toSessionUser(session?.user ?? null)),
    );
    return () => data.subscription.unsubscribe();
  },
};
