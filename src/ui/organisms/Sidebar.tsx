'use client';

import { useUiStore } from '../../store/useUiStore';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_BRAND, READER } from '../../config/app';
import { Avatar } from '../atoms/Avatar';
import { NavItem } from '../molecules/NavItem';

export function Sidebar() {
  const view = useUiStore((s) => s.view);
  const navigate = useUiStore((s) => s.navigate);
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const goToAuth = useAuthStore((s) => s.goToAuth);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <aside
      id="fl-side"
      className="sticky top-0 flex h-screen w-[228px] flex-none flex-col gap-1.5 border-r border-line bg-sidebar px-[18px] py-[26px]"
    >
      <div className="fl-brand flex items-center gap-2.5 px-2 pb-[22px]">
        <div className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-ink font-display text-[17px] font-extrabold text-paper">
          {APP_BRAND.slice(0, 1)}
        </div>
        <span className="font-display text-[19px] font-bold tracking-[-0.01em]">{APP_BRAND}</span>
      </div>

      <NavItem icon="▣" label="Library" active={view === 'library'} onClick={() => navigate('library')} />
      <NavItem icon="◎" label="Discover" active={view === 'discover'} onClick={() => navigate('discover')} />
      <NavItem icon="✦" label="Year in Review" active={view === 'yir'} onClick={() => navigate('yir')} />

      <div className="fl-foot mt-auto border-t border-line-soft pt-1.5">
        {status === 'member' ? (
          <div className="flex items-center gap-2.5 px-2 pb-1 pt-2">
            <Avatar name={user?.name ?? READER.name} />
            <div className="min-w-0 flex-1 leading-[1.2]">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] font-semibold">{user?.name ?? READER.name}</div>
              <div className="text-[11.5px] text-faint">Member since {READER.memberSince}</div>
            </div>
            <button onClick={signOut} title="Sign out" aria-label="Sign out" className="flex-none cursor-pointer border-none bg-transparent p-1 text-[16px] leading-none text-faint">⏻</button>
          </div>
        ) : (
          <div className="p-2">
            <div className="mb-[9px] flex items-center gap-2">
              <div className="grid h-[30px] w-[30px] flex-none place-items-center rounded-full bg-line text-[13px] font-semibold text-faint">G</div>
              <div className="leading-[1.2]">
                <div className="text-[13.5px] font-semibold">Guest</div>
                <div className="text-[11.5px] text-faint">Browsing only</div>
              </div>
            </div>
            <button onClick={() => goToAuth('signin')} className="w-full cursor-pointer rounded-[9px] border-none bg-accent py-[9px] text-[13px] font-semibold text-white">Sign in</button>
          </div>
        )}
      </div>
    </aside>
  );
}
