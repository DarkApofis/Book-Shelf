'use client';

import { useEffect } from 'react';
import { useUiStore } from '../../store/useUiStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { Sidebar } from '../organisms/Sidebar';
import { LibraryView } from '../organisms/LibraryView';
import { LibraryGate } from '../organisms/LibraryGate';
import { DiscoverView } from '../organisms/DiscoverView';
import { YearInReview } from '../organisms/YearInReview';
import { YirGate } from '../organisms/YirGate';
import { BookDrawer } from '../organisms/BookDrawer';
import { Toast } from '../organisms/Toast';
import { AuthScreen } from '../organisms/AuthScreen';

/**
 * Top-level gate. Unauthenticated → auth screen. Otherwise the app, with
 * Library and Year-in-Review gated for guests (Discover stays open).
 */
export function AppShell() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const hydrate = useAuthStore((s) => s.hydrate);
  const view = useUiStore((s) => s.view);
  const loadMember = useLibraryStore((s) => s.loadMember);
  const loadGuest = useLibraryStore((s) => s.loadGuest);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  // Point the library store at the right source whenever the session changes.
  useEffect(() => {
    if (status === 'member' && user) void loadMember(user.id);
    else if (status === 'guest') loadGuest();
  }, [status, user, loadMember, loadGuest]);

  if (status === 'unauthenticated') return <AuthScreen />;

  const isMember = status === 'member';

  return (
    <div id="fl-root" className="flex min-h-screen bg-paper font-sans text-ink antialiased">
      <Sidebar />
      <main id="fl-main" className="min-w-0 flex-1 px-[44px] py-[38px]">
        {view === 'library' && (isMember ? <LibraryView /> : <LibraryGate />)}
        {view === 'discover' && <DiscoverView />}
        {view === 'yir' && (isMember ? <YearInReview /> : <YirGate />)}
      </main>
      {isMember && <BookDrawer />}
      <Toast />
    </div>
  );
}
