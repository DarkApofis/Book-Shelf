'use client';

import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_BRAND } from '../../config/app';
import { cn } from '../lib/cn';

const SPINES = [
  { h: 128, c: '#4f7a6a' }, { h: 104, c: '#45597e' }, { h: 118, c: '#9a6849' },
  { h: 92, c: '#5b4a66' }, { h: 112, c: '#356a68' }, { h: 98, c: '#5a6a4d' },
];

const COPY = {
  signin: { title: 'Welcome back', sub: 'Pick up exactly where you left off.', cta: 'Sign in' },
  signup: { title: 'Create your account', sub: 'Start your shelf in under a minute.', cta: 'Create account' },
};

export function AuthScreen() {
  const authView = useAuthStore((s) => s.authView);
  const setAuthView = useAuthStore((s) => s.setAuthView);
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const resendConfirmation = useAuthStore((s) => s.resendConfirmation);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const pendingEmail = useAuthStore((s) => s.pendingEmail);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isSignup = authView === 'signup';
  const isConfirm = authView === 'confirm';
  const copy = isSignup ? COPY.signup : COPY.signin;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) signUp(name, email, password);
    else signIn(email, password);
  };

  const tabClass = (active: boolean) =>
    cn('flex-1 cursor-pointer rounded-[9px] border-none py-[9px] text-[13.5px] font-semibold',
      active ? 'bg-surface text-ink shadow-card' : 'bg-transparent text-muted');
  const inputClass = 'w-full rounded-[10px] border border-line-strong bg-surface px-[14px] py-3 text-[14.5px] text-ink outline-none';

  return (
    <div className="flex min-h-screen animate-[flFade_.4s_ease] bg-paper font-sans text-ink antialiased">
      {/* Brand panel */}
      <div className="fl-authbrand relative flex min-w-0 flex-1 flex-col justify-between overflow-hidden bg-[radial-gradient(120%_90%_at_80%_-10%,#22332f_0%,#16201f_55%,#101918_100%)] px-[58px] py-[54px] text-night-ink">
        <div className="flex items-center gap-[11px]">
          <div className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-mint font-display text-[19px] font-extrabold text-[#16201f]">{APP_BRAND.slice(0, 1)}</div>
          <span className="font-display text-[21px] font-bold tracking-[-0.01em]">{APP_BRAND}</span>
        </div>
        <div className="max-w-[430px]">
          <div className="mb-[18px] font-mono text-[12.5px] tracking-[0.14em] text-mint-soft">YOUR READING, REMEMBERED</div>
          <h1 className="m-0 font-display text-[clamp(34px,4vw,48px)] font-black leading-[1.02] tracking-[-0.02em]">Every book you&rsquo;ve loved, in one quiet place.</h1>
          <p className="mt-5 text-[16px] leading-[1.5] text-[#c4d2cc]">Track what you&rsquo;re reading, build shelves worth keeping, and look back on a year that actually felt like yours.</p>
        </div>
        <div className="flex h-[128px] items-end gap-[9px]" aria-hidden="true">
          {SPINES.map((s, i) => (
            <div key={i} className="w-9 rounded-[4px_4px_2px_2px] shadow-[0_10px_24px_rgba(0,0,0,0.3)]" style={{ height: s.h, background: s.c }} />
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="fl-authform flex w-[480px] flex-none items-center justify-center bg-sidebar px-9 py-10">
        <div className="w-full max-w-[352px]">
          <div className="fl-authbrand-sm mb-7 hidden items-center gap-2.5">
            <div className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-ink font-display text-[17px] font-extrabold text-paper">{APP_BRAND.slice(0, 1)}</div>
            <span className="font-display text-[19px] font-bold tracking-[-0.01em]">{APP_BRAND}</span>
          </div>

          {isConfirm ? (
            <div className="text-center">
              <div className="mx-auto mb-5 grid h-[52px] w-[52px] place-items-center rounded-2xl bg-accent-soft text-[22px] text-accent">✉</div>
              <h2 className="m-0 mb-[7px] font-display text-[24px] font-extrabold tracking-[-0.01em]">Confirm your email</h2>
              <p className="m-0 mb-1.5 text-[14px] leading-[1.55] text-muted">We sent a confirmation link to</p>
              <p className="m-0 mb-[18px] text-[14.5px] font-semibold text-ink">{pendingEmail}</p>
              <p className="m-0 mb-[22px] text-[13.5px] leading-[1.55] text-muted">Click it to activate your account, then come back here to sign in.</p>

              {error && <p className="mb-3 text-[12.5px] text-accent" role="status">{error}</p>}

              <button type="button" onClick={() => setAuthView('signin')} className="w-full cursor-pointer rounded-[11px] border-none bg-accent p-[13px] text-[15px] font-bold text-white">
                Back to sign in
              </button>
              <button type="button" onClick={resendConfirmation} className="mt-2.5 w-full cursor-pointer rounded-[11px] border border-line-strong bg-surface p-3 text-[14px] font-semibold text-ink-soft">
                Resend confirmation email
              </button>
              <p className="mx-0 mb-0 mt-[18px] text-[11.5px] leading-[1.5] text-[#a4aeab]">
                Wrong address?{' '}
                <button type="button" onClick={() => setAuthView('signup')} className="cursor-pointer border-none bg-transparent p-0 font-semibold text-accent">Start over</button>.
              </p>
            </div>
          ) : (
          <>
          <div className="mb-[26px] flex gap-1 rounded-xl bg-line-soft p-1">
            <button type="button" className={tabClass(!isSignup)} onClick={() => setAuthView('signin')}>Sign in</button>
            <button type="button" className={tabClass(isSignup)} onClick={() => setAuthView('signup')}>Create account</button>
          </div>

          <h2 className="m-0 mb-[5px] font-display text-[24px] font-extrabold tracking-[-0.01em]">{copy.title}</h2>
          <p className="m-0 mb-[22px] text-[14px] text-muted">{copy.sub}</p>

          <form onSubmit={submit} noValidate>
            {isSignup && (
              <>
                <label htmlFor="auth-name" className="mb-1.5 block text-[12.5px] font-semibold text-ink-soft">Name</label>
                <input id="auth-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={cn(inputClass, 'mb-4')} />
              </>
            )}

            <label htmlFor="auth-email" className="mb-1.5 block text-[12.5px] font-semibold text-ink-soft">Email</label>
            <input id="auth-email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="you@example.com" className={cn(inputClass, 'mb-4')} />

            <label htmlFor="auth-password" className="mb-1.5 flex items-center justify-between text-[12.5px] font-semibold text-ink-soft">
              Password
              {!isSignup && (
                <button type="button" onClick={() => resetPassword(email)} className="cursor-pointer border-none bg-transparent font-medium text-accent">Forgot?</button>
              )}
            </label>
            <input id="auth-password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} placeholder="••••••••" className={inputClass} />

            {error && <p className="mt-3 mb-0 text-[12.5px] text-want" role="alert">{error}</p>}

            <button type="submit" disabled={loading} className="mt-[22px] w-full cursor-pointer rounded-[11px] border-none bg-accent p-[13px] text-[15px] font-bold text-white disabled:opacity-60">
              {loading ? 'One moment…' : copy.cta}
            </button>
          </form>

          <div className="my-[22px] flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="text-[12px] text-[#a4aeab]">or</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <button type="button" onClick={continueAsGuest} className="w-full cursor-pointer rounded-[11px] border border-line-strong bg-surface p-3 text-[14px] font-semibold text-ink-soft">
            Continue as guest
          </button>
          <p className="mx-0 mb-0 mt-[18px] text-center text-[11.5px] leading-[1.5] text-[#a4aeab]">By continuing you agree to Folio&rsquo;s Terms &amp; Privacy Policy.</p>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
