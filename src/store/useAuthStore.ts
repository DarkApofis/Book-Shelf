/**
 * Auth/session store — separate from UI and library state. Drives the top-level
 * gate (auth screen vs app) and the member/guest distinction. Guest sessions are
 * intentionally in-memory only (spec: guest data does not persist).
 */
'use client';

import { create } from 'zustand';
import { authService } from '../auth/auth.service';
import type { AuthStatus, AuthView, SessionUser } from '../auth/auth.types';

interface AuthState {
  status: AuthStatus;
  user: SessionUser | null;
  authView: AuthView;
  /** Email awaiting confirmation, shown on the confirm view. */
  pendingEmail: string | null;
  loading: boolean;
  error: string | null;
  configured: boolean;

  hydrate: () => Promise<void>;
  setAuthView: (view: AuthView) => void;
  goToAuth: (view: AuthView) => void;
  continueAsGuest: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  resendConfirmation: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'unauthenticated',
  user: null,
  authView: 'signin',
  pendingEmail: null,
  loading: false,
  error: null,
  configured: authService.isConfigured,

  hydrate: async () => {
    const user = await authService.currentUser();
    if (user) set({ status: 'member', user });
    // Keep the store in sync if the session changes (refresh, other-tab sign-out).
    authService.onChange((next) => {
      if (next) set({ status: 'member', user: next });
      else if (get().status === 'member') set({ status: 'unauthenticated', user: null });
    });
  },

  setAuthView: (authView) => set({ authView, error: null, pendingEmail: null }),
  goToAuth: (authView) => set({ status: 'unauthenticated', authView, error: null }),
  continueAsGuest: () => set({ status: 'guest', user: null, error: null }),

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.signIn(email, password);
      set({ status: 'member', user, loading: false });
    } catch (error) {
      set({ error: message(error), loading: false });
    }
  },

  signUp: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const result = await authService.signUp(name, email, password);
      if (result.status === 'active') {
        set({ status: 'member', user: result.user, loading: false });
      } else {
        // Email confirmation required: no session yet — move to the confirm view.
        set({ authView: 'confirm', pendingEmail: email, loading: false });
      }
    } catch (error) {
      set({ error: message(error), loading: false });
    }
  },

  resendConfirmation: async () => {
    const email = get().pendingEmail;
    if (!email) return;
    set({ error: null });
    try {
      await authService.resendConfirmation(email);
      set({ error: 'Confirmation email resent — check your inbox.' });
    } catch (error) {
      set({ error: message(error) });
    }
  },

  signOut: async () => {
    await authService.signOut();
    set({ status: 'unauthenticated', user: null, authView: 'signin' });
  },

  resetPassword: async (email) => {
    set({ error: null });
    try {
      await authService.resetPassword(email);
      set({ error: 'Password reset link sent — check your email.' });
    } catch (error) {
      set({ error: message(error) });
    }
  },

  clearError: () => set({ error: null }),
}));
