'use client';

import { cn } from '../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'mint' | 'nightGhost';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'border-none bg-accent text-white',
  secondary: 'border border-line-strong bg-surface text-ink-soft',
  mint: 'border-none bg-mint text-[#16201f]',
  nightGhost: 'border border-white/20 bg-transparent text-night-ink',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/** Themeable action button. Sizing/padding comes from `className`. */
export function Button({ variant = 'primary', className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn('cursor-pointer rounded-md font-semibold', VARIANT_CLASS[variant], className)}
      {...rest}
    />
  );
}
