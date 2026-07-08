export function DesignOfTheDayBadge() {
  return (
    <div className="pointer-events-none absolute top-2 right-2 z-20 sm:top-3 sm:right-3">
      <div className="flex items-center gap-2 bg-[#f5f5f5] px-3 py-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#FBB833]" aria-hidden />
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#121212]">
          Design of the day
        </span>
      </div>
    </div>
  );
}
