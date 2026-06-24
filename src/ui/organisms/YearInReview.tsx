'use client';

import type { YirScenario, YirYear } from '../../domain/yir/yir.types';
import { buildYir, buildLiveYir } from '../../domain/yir/yir.shape';
import { YIR_DATA } from '../../data/yir.seed';
import { APP_TODAY, READER } from '../../config/app';
import { useUiStore } from '../../store/useUiStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useBookshelf } from '../../store/useBookshelf';
import { useLibraryStore } from '../../store/useLibraryStore';
import { Button } from '../atoms/Button';
import { ProgressBar } from '../atoms/ProgressBar';
import { StatTile } from '../atoms/StatTile';
import { cn } from '../lib/cn';

function NightToggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'cursor-pointer rounded-lg border-none px-[13px] py-1.5 text-[12.5px] font-semibold',
        active ? 'bg-mint text-[#16201f]' : 'bg-transparent text-[#c4d2cc]',
      )}
    >
      {children}
    </button>
  );
}

function NightCard({ label, right, children }: { label: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-[22px] rounded-2xl border border-white/8 bg-white/5 px-8 py-[30px]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-mint-soft">{label}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

export function YearInReview() {
  const scenario = useUiStore((s) => s.scenario);
  const year = useUiStore((s) => s.year);
  const setScenario = useUiStore((s) => s.setScenario);
  const setYear = useUiStore((s) => s.setYear);
  const readerName = useAuthStore((s) => s.user?.name ?? READER.name);
  const { share } = useBookshelf();
  const books = useLibraryStore((s) => s.books);
  const isMember = useLibraryStore((s) => s.userId !== null);

  const elapsedMonths = APP_TODAY.getMonth() + 1;
  // Signed-in readers get a Year-in-Review computed from their real library;
  // guests see the demo personas (a showcase of what the page becomes).
  const liveYir = isMember ? buildLiveYir(books, APP_TODAY.getFullYear(), { elapsedMonths }) : null;

  const SCENARIOS: [YirScenario, string][] = [['you', 'You'], ['light', 'Light reader'], ['avid', 'Avid reader']];
  const YEARS: YirYear[] = [2025, 2026];

  // Member with nothing finished yet — the review fills in as they read.
  if (isMember && !liveYir) {
    return (
      <div className="-mx-[44px] -my-[38px] flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(120%_90%_at_80%_-10%,#22332f_0%,#16201f_55%,#101918_100%)] px-[44px] text-center font-sans text-night-ink">
        <div className="font-mono text-[12.5px] tracking-[0.14em] text-mint-soft">{APP_TODAY.getFullYear()} · YOUR YEAR SO FAR</div>
        <h1 className="mt-[14px] max-w-[520px] font-display text-[clamp(30px,5vw,48px)] font-black leading-[1.05] tracking-[-0.03em]">
          Your Year in Review is still being written.
        </h1>
        <p className="mt-4 max-w-[420px] text-[16px] text-[#c4d2cc]">
          Finish your first book and this page comes alive — pages turned, your reading rhythm,
          favorite reads, and a card worth sharing.
        </p>
      </div>
    );
  }

  // Members: real review (guaranteed non-null past the guard). Guests: demo personas.
  const yir = liveYir ?? buildYir(YIR_DATA, scenario, year, { elapsedMonths });

  return (
    <div className="-mx-[44px] -my-[38px] min-h-screen bg-[radial-gradient(120%_90%_at_80%_-10%,#22332f_0%,#16201f_55%,#101918_100%)] px-[44px] pb-20 pt-[46px] font-sans text-night-ink">
      <div className="mx-auto max-w-[720px]">
        {/* Switchers — demo personas/years, shown for guests only. A signed-in
            reader's review is their real library, so there's nothing to switch. */}
        {!isMember && (
          <div className="mb-2 flex flex-wrap items-center justify-between gap-[14px]">
            <div className="flex gap-1.5 rounded-[11px] bg-white/6 p-1">
              {YEARS.map((y) => <NightToggle key={y} active={year === y} onClick={() => setYear(y)}>{y}</NightToggle>)}
            </div>
            <div className="flex gap-1.5 rounded-[11px] bg-white/6 p-1">
              {SCENARIOS.map(([key, label]) => (
                <NightToggle key={key} active={scenario === key} onClick={() => setScenario(key)}>{label}</NightToggle>
              ))}
            </div>
          </div>
        )}

        {/* Hero */}
        <div className="pb-[14px] pt-[30px]">
          <div className="font-mono text-[12.5px] tracking-[0.14em] text-mint-soft">{yir.eyebrow}</div>
          <h1 className="mt-[14px] font-display text-[clamp(40px,7vw,72px)] font-black leading-[0.98] tracking-[-0.03em]">
            You read<br /><span className="text-mint">{yir.books} books</span>
          </h1>
          <p className="mt-4 max-w-[460px] text-[17px] text-[#c4d2cc]">{yir.headline}</p>
          {yir.inProgress && yir.projNote && (
            <div className="mt-4 inline-block rounded-[20px] bg-[rgba(192,138,62,0.16)] px-[14px] py-[7px] text-[13px] font-semibold text-[#e0b577]">
              {yir.projNote}
            </div>
          )}
        </div>

        {/* Pages */}
        <NightCard label="Pages turned">
          <div className="my-1.5 font-display text-[clamp(34px,5vw,52px)] font-extrabold tracking-[-0.02em]">{yir.pagesStr}</div>
          <div className="text-[15px] text-[#c4d2cc]">{yir.pagesNote}</div>
        </NightCard>

        {/* Monthly rhythm */}
        <NightCard label="Your reading rhythm" right={<span className="text-[13px] text-[#c4d2cc]">Busiest month · <span className="font-semibold text-mint">{yir.topMonth}</span></span>}>
          <div role="img" aria-label={`Monthly reading chart. Busiest month: ${yir.topMonth}`} className="mt-[22px] flex h-[120px] items-end gap-[7px]">
            {yir.monthly.map((m, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-[7px]">
                <div className="w-full rounded-[5px_5px_3px_3px]" style={{ height: `${m.h}%`, background: m.fill }} />
                <div className="font-mono text-[10px] text-[#7f928b]">{m.label}</div>
              </div>
            ))}
          </div>
        </NightCard>

        {/* Genres */}
        <NightCard label="What you reached for">
          <div className="flex flex-col gap-[14px]">
            {yir.genres.map((g) => (
              <div key={g.name}>
                <div className="mb-1.5 flex justify-between text-[13.5px]">
                  <span className="font-semibold">{g.name}</span>
                  <span className="font-mono text-[#a9b8b1]">{g.count}</span>
                </div>
                <ProgressBar pct={g.pct} trackClassName="h-[9px] rounded-md bg-white/8" fillClassName="rounded-md" fillColor={g.color} />
              </div>
            ))}
          </div>
        </NightCard>

        {/* Ratings + favorite */}
        <div className="mt-[22px] grid grid-cols-2 gap-[22px]">
          <div className="rounded-2xl border border-white/8 bg-white/5 p-7">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-mint-soft">Avg rating</div>
            <div className="my-1 mb-[14px] font-display text-[46px] font-extrabold">★ {yir.avgRating}</div>
            <div className="flex flex-col gap-2">
              {yir.ratingDist.map((r) => (
                <div key={r.label} className="flex items-center gap-[9px] text-[11.5px] text-[#a9b8b1]">
                  <span className="w-[30px] font-mono">{r.label}★</span>
                  <ProgressBar pct={r.pct} trackClassName="h-[7px] flex-1 rounded-[5px] bg-white/8" fillClassName="rounded-[5px] bg-[#e0b577]" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-white/8 bg-white/5 p-7">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-mint-soft">Your favorite</div>
            <div className="mt-[14px] flex gap-[14px]">
              <div className="h-[84px] w-[56px] flex-none rounded-[5px] shadow-[0_8px_18px_rgba(0,0,0,0.3)]" style={{ background: yir.fave.cover }} aria-hidden="true" />
              <div>
                <div className="font-display text-[16px] font-bold leading-[1.15]">{yir.fave.title}</div>
                <div className="mt-[3px] text-[12.5px] text-[#a9b8b1]">{yir.fave.author}</div>
              </div>
            </div>
            <p className="mt-[14px] text-[13.5px] leading-[1.45] text-[#c4d2cc]">{yir.fave.note}</p>
          </div>
        </div>

        {/* Records */}
        <div className="mt-[22px]">
          <div className="mb-[14px] font-mono text-[11.5px] uppercase tracking-[0.1em] text-mint-soft">By the numbers</div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[14px]">
            {yir.records.map((r) => <StatTile key={r.label} tone="night" label={r.label} value={r.value} sub={r.sub} />)}
          </div>
        </div>

        {/* Share card */}
        <div className="mt-[34px]">
          <div className="mb-[14px] font-mono text-[11.5px] uppercase tracking-[0.1em] text-mint-soft">Share your year</div>
          <div className="overflow-hidden rounded-[22px] border border-white/10">
            <div className="bg-[linear-gradient(150deg,#4f7a6a,#2c4a44_70%)] px-[30px] py-8 text-white">
              <div className="flex items-center justify-between">
                <span className="font-display text-[17px] font-extrabold">Folio</span>
                <span className="font-mono text-[12px] tracking-[0.1em]">{yir.shareYear}</span>
              </div>
              <div className="my-[22px] mb-1 font-display text-[30px] font-black leading-[1.05] tracking-[-0.02em]">
                {readerName}&apos;s year<br />in books
              </div>
              <div className="mt-[22px] flex flex-wrap gap-[26px]">
                {[
                  { val: yir.books, label: 'books' },
                  { val: yir.pagesStr, label: 'pages' },
                  { val: yir.topGenre, label: 'top genre' },
                  { val: `★ ${yir.avgRating}`, label: 'avg rating' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-[30px] font-extrabold">{s.val}</div>
                    <div className="text-[12px] opacity-85">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2.5 bg-white/5 p-4">
              <Button variant="mint" onClick={share} className="flex-1 rounded-[11px] p-3 text-[14px] font-bold">Save image</Button>
              <Button variant="nightGhost" onClick={share} className="flex-1 rounded-[11px] p-3 text-[14px]">Copy link</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
