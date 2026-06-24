/** Join class names, dropping falsy values. Tiny `clsx` stand-in. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
