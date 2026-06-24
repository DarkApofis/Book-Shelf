interface StatTileProps {
  label: string;
  value: string | number;
  sub: string;
  /** `light` for the in-app drawer, `night` for the Year-in-Review theme. */
  tone?: 'light' | 'night';
}

/** Small "label / big value / sub" stat card. */
export function StatTile({ label, value, sub, tone = 'light' }: StatTileProps) {
  if (tone === 'night') {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/5 px-5 py-[18px]">
        <div className="text-[11.5px] text-mint-soft">{label}</div>
        <div className="mt-[5px] mb-0.5 font-display text-[21px] font-extrabold tracking-[-0.01em]">{value}</div>
        <div className="text-[12px] text-[#a9b8b1]">{sub}</div>
      </div>
    );
  }
  return (
    <div className="rounded-[11px] border border-line bg-surface p-[13px]">
      <div className="text-[11px] text-faint">{label}</div>
      <div className="mt-[3px] font-display text-[17px] font-bold">{value}</div>
      <div className="text-[10.5px] text-faint">{sub}</div>
    </div>
  );
}
