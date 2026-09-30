'use client';

import { useEffect } from 'react';
import { useUiStore } from '../../store/useUiStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { Sidebar } from '../organisms/Sidebar';
import { DesktopTopBar, MobileTabBar, MobileTopBar } from '../organisms/AppBars';
import { LibraryView } from '../organisms/LibraryView';
import { LibraryGate } from '../organisms/LibraryGate';
import { DiscoverView } from '../organisms/DiscoverView';
import { YearInReview } from '../organisms/YearInReview';
import { YirGate } from '../organisms/YirGate';
import { BookDetail } from '../organisms/BookDetail';
import { Toast } from '../organisms/Toast';
import { AuthScreen } from '../organisms/AuthScreen';

/**
 * Top-level gate. Unauthenticated → auth screen. Otherwise the app, with
 * Library and Year-in-Review gated for guests (Discover stays open).
 *
 * Layout: sidebar + top bar from the `nav` breakpoint up; below it, a compact
 * top bar and a fixed bottom tab bar. Each view owns its own horizontal padding.
 */
export function AppShell() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const hydrate = useAuthStore((s) => s.hydrate);
  const view = useUiStore((s) => s.view);
  const selectedId = useUiStore((s) => s.selectedId);
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
  const showBook = isMember && selectedId !== null;

  return (
    <div id="fl-root" className="flex min-h-screen bg-paper font-sans text-[15px] leading-normal text-ink antialiased">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {!showBook && <MobileTopBar />}
        <DesktopTopBar />
        <main id="fl-main" className="min-w-0 flex-1 pb-[76px] nav:pb-0">
          {showBook ? (
            <BookDetail />
          ) : (
            <>
              {view === 'library' && (isMember ? <LibraryView /> : <LibraryGate />)}
              {view === 'discover' && <DiscoverView />}
              {view === 'yir' && (isMember ? <YearInReview /> : <YirGate />)}
            </>
          )}
        </main>
      </div>
      <MobileTabBar />
      <Toast />
    </div>
  );
}
