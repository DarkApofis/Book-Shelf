import { cn } from '../lib/cn';

/** Circular initial avatar. */
export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        'grid h-[30px] w-[30px] flex-none place-items-center rounded-full bg-accent text-[13px] font-semibold text-white',
        className,
      )}
      aria-hidden="true"
    >
      {name.slice(0, 1)}
    </div>
  );
}
