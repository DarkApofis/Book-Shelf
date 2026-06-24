/** Authenticated session types — framework-agnostic. */

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export type AuthView = 'signin' | 'signup' | 'confirm';

/**
 * Result of a sign-up attempt. `active` means a session was issued immediately
 * (email confirmation disabled); `confirm` means the user must click the emailed
 * link before any session exists.
 */
export type SignUpOutcome =
  | { status: 'active'; user: SessionUser }
  | { status: 'confirm' };

/**
 * `unauthenticated` → show the auth screen.
 * `guest` → browsing-only (session-scoped, never persisted).
 * `member` → signed in via Supabase.
 */
export type AuthStatus = 'unauthenticated' | 'guest' | 'member';
