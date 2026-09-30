'use client';

import { useAuthStore } from '../../store/useAuthStore';

/** Year-in-Review gate for guests — the dark, shareable-moment treatment. */
export function YirGate() {
  const goToAuth = useAuthStore((s) => s.goToAuth);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(120%_90%_at_80%_-10%,#22332f_0%,#16201f_55%,#101918_100%)] px-5 py-[46px] nav:px-[44px] text-night-ink">
      <div className="max-w-[520px] animate-[flUp_.4s_ease] text-center">
        <div className="font-mono text-[12.5px] tracking-[0.14em] text-mint-soft">2025 · WRAPPED</div>
        <h1 className="mt-[14px] font-display text-[clamp(34px,5vw,52px)] font-black leading-[1.02] tracking-[-0.02em]">
          Your year in books<br /><span className="text-mint">is waiting.</span>
        </h1>
        <p className="mx-auto mb-[30px] mt-[18px] max-w-[400px] text-[16px] leading-[1.5] text-[#c4d2cc]">
          Sign in and Folio remembers every book, every page, every late night — then hands it back to you as a year worth sharing.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <button onClick={() => goToAuth('signup')} className="cursor-pointer rounded-[11px] border-none bg-mint px-6 py-3 text-[14.5px] font-bold text-[#16201f]">Create your account</button>
          <button onClick={() => goToAuth('signin')} className="cursor-pointer rounded-[11px] border border-white/20 bg-transparent px-6 py-3 text-[14.5px] font-semibold text-night-ink">Sign in</button>
        </div>
      </div>
    </div>
  );
}
