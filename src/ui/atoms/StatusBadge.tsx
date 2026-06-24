import type { BookStatus } from '../../domain/book/book.types';
import { statusLabel } from '../../domain/shared/format';
import { STATUS_PILL_CLASS } from '../lib/status';
import { cn } from '../lib/cn';

/** A status pill ("Reading" / "Want to read" / "Finished") in its tone. */
export function StatusBadge({ status, className }: { status: BookStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block rounded-[14px] px-[11px] py-1 text-[11.5px] font-semibold',
        STATUS_PILL_CLASS[status],
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
