import { cn } from '../lib/cn';

interface ProgressBarProps {
  /** Completion percentage, 0..100. */
  pct: number;
  trackClassName?: string;
  fillClassName?: string;
  /** Data-driven fill color (e.g. a genre's series color), applied inline. */
  fillColor?: string;
  /** When set, exposes ARIA progressbar semantics with this label. */
  labelledProgress?: string;
}

/** A track + fill bar. Width is data-driven, so it stays an inline style. */
export function ProgressBar({ pct, trackClassName, fillClassName, fillColor, labelledProgress }: ProgressBarProps) {
  const ariaProps = labelledProgress
    ? { role: 'progressbar' as const, 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': labelledProgress }
    : {};
  return (
    <div {...ariaProps} className={cn('overflow-hidden rounded-md bg-line-soft', trackClassName)}>
      <div className={cn('h-full rounded-md bg-accent', fillClassName)} style={{ width: `${pct}%`, background: fillColor }} />
    </div>
  );
}
