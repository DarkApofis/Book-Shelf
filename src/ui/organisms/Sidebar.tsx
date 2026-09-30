'use client';

import type { ShelfTab } from '../../domain/book/book.types';
import { countByStatus } from '../../domain/book/book.rules';
import { useUiStore } from '../../store/useUiStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { APP_BRAND, READER } from '../../config/app';
import { Avatar } from '../atoms/Avatar';
import { Icon } from '../atoms/Icon';
import { NavItem } from '../molecules/NavItem';

const SHELVES: { key: Exclude<ShelfTab, 'all'>; label: string }[] = [
  { key: 'reading', label: 'Currently reading' },
  { key: 'want', label: 'Want to read' },
  { key: 'finished', label: 'Read' },
];

export function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-6 w-6 place-items-center rounded-md bg-ink font-display text-[13px] font-bold text-white" aria-hidden="true">
        {APP_BRAND.slice(0, 1)}
      </div>
      <span className="font-display text-[17px] font-bold tracking-[-0.01em]">{APP_BRAND}</span>
    </div>
  );
}

/** Desktop navigation (≥ nav breakpoint). Phones get MobileTopBar + MobileTabBar. */
export function Sidebar() {
  const view = useUiStore((s) => s.view);
  const shelf = useUiStore((s) => s.shelf);
  const navigate = useUiStore((s) => s.navigate);
  const setShelf = useUiStore((s) => s.setShelf);
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const goToAuth = useAuthStore((s) => s.goToAuth);
  const signOut = useAuthStore((s) => s.signOut);
  const books = useLibraryStore((s) => s.books);
  const isMember = status === 'member';

  const openShelf = (key: ShelfTab) => {
    navigate('library');
    setShelf(key);
  };

  return (
    <aside
      aria-label="Sidebar"
      className="sticky top-0 hidden h-screen w-[var(--sidebar-width)] flex-none flex-col gap-0.5 border-r border-line bg-sidebar px-3.5 py-5 nav:flex"
    >
      <div className="px-2.5 pb-[22px] pt-1"><BrandMark /></div>

      <nav aria-label="Primary" className="flex flex-col gap-0.5">
        <NavItem icon="library" label="Library" active={view === 'library'} onClick={() => navigate('library')} />
        <NavItem icon="search" label="Discover" active={view === 'discover'} onClick={() => navigate('discover')} />
        <NavItem icon="year" label="Year in Review" active={view === 'yir'} onClick={() => navigate('yir')} />
      </nav>

      {isMember && (
        <nav aria-labelledby="side-shelves" className="mt-[26px] flex flex-col gap-0.5">
          <div id="side-shelves" className="mx-2.5 mb-1.5 text-[12px] font-semibold text-muted">Shelves</div>
          {SHELVES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => openShelf(s.key)}
              aria-current={view === 'library' && shelf === s.key ? 'true' : undefined}
              className="flex min-h-9 cursor-pointer items-center justify-between rounded-[7px] border-none bg-transparent px-2.5 text-left text-[14px] text-ink-soft hover:bg-line-soft aria-[current=true]:font-semibold aria-[current=true]:text-ink"
            >
              <span>{s.label}</span>
              <span className="text-[13px] tabular-nums text-muted">{countByStatus(books, s.key)}</span>
            </button>
          ))}
        </nav>
      )}

      <div className="mt-auto border-t border-line px-2.5 pt-3">
        {isMember ? (
          <div className="flex items-center gap-2.5">
            <Avatar name={user?.name ?? READER.name} />
            <div className="min-w-0 flex-1 leading-[1.3]">
              <div className="truncate text-[13.5px] font-semibold">{user?.name ?? READER.name}</div>
              <div className="text-[12px] text-muted">Member since {READER.memberSince}</div>
            </div>
            <button
              type="button"
              onClick={signOut}
              aria-label="Sign out"
              title="Sign out"
              className="grid h-9 w-9 flex-none cursor-pointer place-items-center rounded-[7px] border-none bg-transparent text-muted hover:bg-line-soft hover:text-ink"
            >
              <Icon name="signOut" size={17} />
            </button>
          </div>
        ) : (
          <div>
            <div className="text-[13.5px] font-semibold">Browsing as guest</div>
            <div className="mb-2.5 text-[12px] text-muted">Sign in to save your shelves.</div>
            <button
              type="button"
              onClick={() => goToAuth('signin')}
              className="h-10 w-full cursor-pointer rounded-lg border-none bg-ink text-[13.5px] font-semibold text-white hover:bg-ink-soft"
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
