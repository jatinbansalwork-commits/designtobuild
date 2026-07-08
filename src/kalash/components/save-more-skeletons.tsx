function Ghost({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-200/75 ${className}`.trim()}
      aria-hidden
    />
  );
}

/** Matches live price strip while buy price is fetched. */
export function LivePriceBarSkeleton() {
  return (
    <div
      className="shrink-0 border-t border-[#f9d8d3] bg-[#FCE2DD] px-4 py-2.5"
      aria-busy="true"
      aria-label="Loading live gold price"
    >
      <div className="flex items-center justify-between gap-4">
        <Ghost className="h-3.5 w-[58%] max-w-[220px]" />
        <Ghost className="h-3.5 w-[72px] shrink-0" />
      </div>
    </div>
  );
}

/** Matches coupon carousel while offers are fetched. */
export function CouponCardsSkeleton() {
  return (
    <div
      className="flex w-full gap-3"
      aria-busy="true"
      aria-label="Loading coupons"
    >
      {[0, 1].map((index) => (
        <div
          key={index}
          className="relative flex min-w-0 flex-1 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white"
        >
          <Ghost className="w-8 shrink-0 rounded-none bg-neutral-100" />
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3 pr-4">
            <div className="flex items-start justify-between gap-3">
              <Ghost className="h-4 w-24" />
              <Ghost className="h-4 w-12" />
            </div>
            <Ghost className="h-3 w-full" />
            <Ghost className="h-3 w-[88%]" />
            {index === 0 ? <Ghost className="h-4 w-16 rounded-sm" /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GramEstimateSkeleton() {
  return <Ghost className="ml-auto h-3.5 w-[72px]" />;
}
