'use client';

import { useAuthStore } from '../../store/useAuthStore';
import { Icon, type IconName } from '../atoms/Icon';

const FEATURES: { icon: IconName; title: string; sub: string }[] = [
  { icon: 'library', title: 'Shelves', sub: 'Reading, want, read' },
  { icon: 'edit', title: 'Progress', sub: 'Pace & finish dates' },
  { icon: 'year', title: 'Year in Review', sub: 'Your reading, wrapped' },
];

/** Shown on the Library tab for guests, prompting sign-up. */
export function LibraryGate() {
  const goToAuth = useAuthStore((s) => s.goToAuth);

  return (
    <div className="mx-auto mt-[7vh] max-w-[560px] animate-[flUp_.4s_ease] px-5 text-center motion-reduce:animate-none">
      <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-xl border border-line bg-sidebar text-accent"><Icon name="library" size={22} /></div>
      <h1 className="mb-2.5 mt-0 font-display text-[28px] font-bold tracking-[-0.025em]">Sign in to build your shelf</h1>
      <p className="mx-auto mb-[26px] max-w-[430px] text-[15px] leading-[1.55] text-muted">
        Save books, track every page, and pick up exactly where you left off — on any device. Your reading stays yours.
      </p>
      <div className="flex flex-wrap justify-center gap-2.5">
        <button type="button" onClick={() => goToAuth('signup')} className="h-11 cursor-pointer rounded-lg border-none bg-ink px-5 text-[14.5px] font-semibold text-white hover:bg-ink-soft">Create your account</button>
        <button type="button" onClick={() => goToAuth('signin')} className="h-11 cursor-pointer rounded-lg border border-line bg-surface px-5 text-[14.5px] font-semibold text-ink hover:bg-sidebar">Sign in</button>
      </div>
      <div className="mx-auto mt-10 grid max-w-[480px] grid-cols-3 gap-[18px] border-t border-line pt-6 text-left">
        {FEATURES.map((f) => (
          <div key={f.title}>
            <div className="text-muted"><Icon name={f.icon} size={18} /></div>
            <div className="mt-2 text-[13px] font-semibold">{f.title}</div>
            <div className="mt-0.5 text-[12px] text-muted">{f.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
