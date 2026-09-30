import { goalPace, type GoalStanding } from '../../domain/reading/goal';
import { cn } from '../lib/cn';

interface GoalPanelProps {
  read: number;
  target: number;
  today: Date;
}

const STANDING: Record<GoalStanding, { dot: string; text: string }> = {
  ahead: { dot: 'bg-accent', text: 'text-accent-ink' },
  'on-track': { dot: 'bg-accent', text: 'text-accent-ink' },
  behind: { dot: 'bg-warn-dot', text: 'text-warn' },
  complete: { dot: 'bg-accent', text: 'text-accent-ink' },
};

function standingLabel(standing: GoalStanding, delta: number): string {
  const n = Math.abs(delta);
  const books = `${n} book${n === 1 ? '' : 's'}`;
  switch (standing) {
    case 'ahead': return `${books} ahead of pace`;
    case 'behind': return `${books} behind pace`;
    case 'on-track': return 'On track';
    case 'complete': return 'Goal complete';
  }
}

/** Annual goal: count, a bar with a "where you should be today" marker, and pace. */
export function GoalPanel({ read, target, today }: GoalPanelProps) {
  const year = today.getFullYear();
  const pace = goalPace(read, target, today);
  const pct = Math.min(100, Math.round((read / target) * 100));
  const tone = STANDING[pace.standing];

  return (
    <aside aria-labelledby="goal-h" className="self-start rounded-[10px] border border-line bg-surface p-5">
      <h2 id="goal-h" className="m-0 text-[13.5px] font-semibold text-ink-soft">{year} reading goal</h2>
      <div className="mt-2.5 font-display tabular-nums">
        <span className="text-[38px] font-bold leading-none tracking-[-0.03em]">{read}</span>
        <span className="text-[17px] font-medium text-muted"> / {target} books</span>
      </div>

      <div
        role="progressbar"
        aria-label={`Goal progress: ${read} of ${target} books`}
        aria-valuenow={read}
        aria-valuemin={0}
        aria-valuemax={target}
        className="relative mt-4 h-1.5 rounded-full bg-line-soft"
      >
        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
        {pace.standing !== 'complete' && (
          <div
            aria-hidden="true"
            className="absolute -top-[5px] h-4 w-0.5 rounded-sm bg-ink"
            style={{ left: `${pace.yearElapsed * 100}%` }}
          />
        )}
      </div>
      <div className="mt-2 flex justify-between text-[12.5px] tabular-nums text-muted">
        <span>{pct}% complete</span>
        {pace.standing !== 'complete' && <span>Expected today: {pace.expected}</span>}
      </div>

      <div className="mt-4 flex flex-col gap-1 border-t border-line pt-3.5">
        <div className={cn('flex items-center gap-2 text-[14px] font-semibold', tone.text)}>
          <span aria-hidden="true" className={cn('h-[7px] w-[7px] rounded-full', tone.dot)} />
          {standingLabel(pace.standing, pace.delta)}
        </div>
        <div className="text-[13.5px] text-muted">
          {pace.standing === 'complete'
            ? `You hit ${target} books in ${year}. Anything more is a bonus.`
            : `${pace.remaining} to go — about ${pace.perMonthNeeded} a month to finish by Dec 31.`}
        </div>
      </div>
    </aside>
  );
}
