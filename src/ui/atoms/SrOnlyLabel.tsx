/** Visually-hidden `<label>` that stays available to screen readers. */
export function SrOnlyLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="sr-only">
      {children}
    </label>
  );
}
