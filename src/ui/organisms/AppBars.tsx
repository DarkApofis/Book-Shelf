'use client';

import { useState } from 'react';
import { useUiStore, type AppView } from '../../store/useUiStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Icon, type IconName } from '../atoms/Icon';
import { SrOnlyLabel } from '../atoms/SrOnlyLabel';
import { cn } from '../lib/cn';
import { BrandMark } from './Sidebar';

/**
 * Desktop top bar: a quick "find a book to add" search that hands off to
 * Discover, plus the primary Add book action. Hidden on Discover itself, which
 * has its own full search field.
 */
export function DesktopTopBar() {
  const view = useUiStore((s) => s.view);
  const navigate = useUiStore((s) => s.navigate);
  const setQuery = useUiStore((s) => s.setQuery);
  const [draft, setDraft] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.trim()) setQuery(draft.trim());
    setDraft('');
    navigate('discover');
  };

  if (view === 'yir') return null;

  return (
    <header className="sticky top-0 z-20 hidden h-16 items-center justify-between gap-4 border-b border-line bg-paper/95 px-10 backdrop-blur nav:flex">
      {view !== 'discover' ? (
        <form role="search" onSubmit={submit} className="flex h-10 w-[360px] items-center gap-2.5 rounded-lg border border-line bg-sidebar px-3 text-muted focus-within:border-accent">
          <Icon name="search" size={17} />
          <SrOnlyLabel htmlFor="top-search">Find a book to add</SrOnlyLabel>
          <input
            id="top-search"
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Find a book to add…"
            className="min-w-0 flex-1 border-none bg-transparent text-[14px] text-ink outline-none placeholder:text-faint"
          />
        </form>
      ) : <span />}
      <button
        type="button"
        onClick={() => navigate('discover')}
        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border-none bg-ink px-4 text-[14px] font-semibold text-white hover:bg-ink-soft"
      >
        <Icon name="plus" size={17} strokeWidth={2} />
        Add book
      </button>
    </header>
  );
}

/** Phone top bar: brand plus search / add shortcuts. */
export function MobileTopBar() {
  const view = useUiStore((s) => s.view);
  const navigate = useUiStore((s) => s.navigate);
  if (view === 'yir') return null;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-paper/95 px-5 backdrop-blur nav:hidden">
      <BrandMark />
      <div className="-mr-2.5 flex items-center">
        <button type="button" aria-label="Search books" onClick={() => navigate('discover')} className="grid h-11 w-11 cursor-pointer place-items-center border-none bg-transparent text-ink">
          <Icon name="search" size={21} />
        </button>
        <button type="button" aria-label="Add book" onClick={() => navigate('discover')} className="grid h-11 w-11 cursor-pointer place-items-center border-none bg-transparent text-ink">
          <Icon name="plus" size={22} />
        </button>
      </div>
    </header>
  );
}

function Tab({ icon, label, active, onClick }: { icon: IconName; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex min-h-[54px] cursor-pointer flex-col items-center justify-center gap-[3px] border-none bg-transparent text-[11.5px]',
        active ? 'font-semibold text-ink' : 'font-medium text-muted',
      )}
    >
      {active && <span aria-hidden="true" className="absolute top-0 h-0.5 w-6 rounded-sm bg-accent" />}
      <Icon name={icon} size={22} />
      {label}
    </button>
  );
}

const TABS: { view: AppView; icon: IconName; label: string }[] = [
  { view: 'library', icon: 'library', label: 'Library' },
  { view: 'discover', icon: 'search', label: 'Discover' },
  { view: 'yir', icon: 'year', label: 'Year' },
];

/** Phone bottom navigation. The last tab is the account action. */
export function MobileTabBar() {
  const view = useUiStore((s) => s.view);
  const navigate = useUiStore((s) => s.navigate);
  const status = useAuthStore((s) => s.status);
  const signOut = useAuthStore((s) => s.signOut);
  const goToAuth = useAuthStore((s) => s.goToAuth);
  const isMember = status === 'member';

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-paper/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur nav:hidden"
    >
      {TABS.map((t) => (
        <Tab key={t.view} icon={t.icon} label={t.label} active={view === t.view} onClick={() => navigate(t.view)} />
      ))}
      {isMember
        ? <Tab icon="signOut" label="Sign out" onClick={signOut} />
        : <Tab icon="signIn" label="Sign in" onClick={() => goToAuth('signin')} />}
    </nav>
  );
}
