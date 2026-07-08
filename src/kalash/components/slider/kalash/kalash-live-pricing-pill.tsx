interface KalashLivePricingPillProps {
  label?: string;
  price?: string;
}

function LiveSignalIcon() {
  return (
    <svg viewBox="0 0 16 10" fill="none" aria-hidden className="h-2.5 w-4 shrink-0">
      <path
        d="M5.405 2.405a.75.75 0 0 1 1.075.968A2.5 2.5 0 0 0 5.5 5a2.5 2.5 0 0 0 1.48 2.22.75.75 0 1 1-.868 1.228A4 4 0 0 1 4 5a4 4 0 0 1 2.112-3.367.75.75 0 0 1 1.293.772ZM10.595 7.595a.75.75 0 0 0 1.132.118A4 4 0 0 0 12.5 5a4 4 0 0 0-1.227-2.713.75.75 0 0 0-1.132.118.75.75 0 0 0 .118 1.132A2.5 2.5 0 0 1 11 5a2.5 2.5 0 0 1-.746 1.785.75.75 0 0 0-.659 1.81ZM8 3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM12.74 8.74a.75.75 0 0 0 1.125-.06A6 6 0 0 0 15.5 5a6 6 0 0 0-1.635-4.18.75.75 0 0 0-1.125-.06.75.75 0 0 0-.06 1.125A4.5 4.5 0 0 1 14 5a4.5 4.5 0 0 1-1.32 3.115.75.75 0 0 0-.94 1.625ZM3.26.26a.75.75 0 0 0-1.125.06A6 6 0 0 0 .5 5a6 6 0 0 0 1.635 4.18.75.75 0 0 0 1.125.06.75.75 0 0 0 .06-1.125A4.5 4.5 0 0 1 2 5a4.5 4.5 0 0 1 1.32-3.115.75.75 0 0 0-.06-1.625Z"
        fill="#ee4d37"
      />
    </svg>
  );
}

export function KalashLivePricingPill({
  label = "Gold Buy Price",
  price = "₹6096.23/gm",
}: KalashLivePricingPillProps) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-full border border-neutral-200/40 bg-white py-1 pl-2 pr-3">
      <div className="flex shrink-0 flex-col items-center justify-center gap-0.5">
        <LiveSignalIcon />
        <span
          className="text-[9px] font-semibold uppercase leading-[12px] tracking-tight text-[#ee4d37]"
        >
          Live
        </span>
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-0.5 py-px">
        <p className="truncate text-[10px] leading-[12px] tracking-tight text-neutral-500">
          {label}
        </p>
        <p className="truncate text-sm font-bold leading-[20px] tracking-tight text-neutral-900">
          {price}
        </p>
      </div>
    </div>
  );
}
