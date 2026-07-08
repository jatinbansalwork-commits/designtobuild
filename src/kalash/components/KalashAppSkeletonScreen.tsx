import { ViewContainer } from "@/kalash/components/ViewContainer";
import { KALASH_VIEW } from "@/kalash/lib/kalash-view-tokens";

function Ghost({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-200/80 ${className}`.trim()}
      aria-hidden
    />
  );
}

function HeaderSkeleton() {
  const { space } = KALASH_VIEW;

  return (
    <div
      className="flex w-full items-center justify-between pb-3 pt-16"
      style={{ paddingInline: space.headerGutterX }}
    >
      <Ghost className="size-[46px] rounded-full" />
      <div className="flex items-center gap-2">
        <Ghost className="h-9 w-[120px] rounded-full" />
        <Ghost className="h-9 w-[72px] rounded-full" />
      </div>
    </div>
  );
}

function PromoStripSkeleton() {
  return <Ghost className="h-8 w-full rounded-none" />;
}

function BottomNavSkeleton() {
  return (
    <div
      className="border-t border-neutral-200/40 bg-white"
      style={{ height: KALASH_VIEW.space.bottomNavHeight }}
    >
      <div className="flex h-full items-center justify-around px-2 pt-1">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-1">
            <Ghost className="size-6 rounded-md" />
            <Ghost className="h-3.5 w-12 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Ghost loading placeholder — mirrors Kalash home layout before content loads. */
export function KalashAppSkeletonScreen() {
  const { space } = KALASH_VIEW;

  return (
    <ViewContainer
      header={
        <>
          <HeaderSkeleton />
          <PromoStripSkeleton />
        </>
      }
      bottomNav={<BottomNavSkeleton />}
    >
      <div
        style={{
          paddingTop: space.sectionMajor,
          paddingInline: space.headerGutterX,
        }}
      >
        <Ghost className="h-5 w-28" />
        <Ghost className="mt-2 h-14 w-48" />
        <Ghost className="mt-6 h-px w-full rounded-none" />
      </div>

      <div
        className="grid grid-cols-2 gap-3"
        style={{
          paddingTop: space.sectionY,
          paddingInline: space.headerGutterX,
        }}
      >
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Ghost className="size-10 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Ghost className="h-3.5 w-20" />
              <Ghost className="h-4 w-16" />
              <Ghost className="h-3.5 w-14" />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: space.sectionY }}>
        <Ghost className="h-8 w-full rounded-none" />
      </div>

      <div
        style={{
          paddingTop: space.sectionY,
          paddingInline: space.headerGutterX,
        }}
      >
        <Ghost className="h-14 w-full rounded-full" />
      </div>

      <div
        style={{
          paddingTop: space.sectionY,
          paddingInline: space.headerGutterX,
        }}
      >
        <Ghost className="h-[154px] w-full rounded-2xl" />
        <Ghost className="mt-5 h-5 w-40" />
      </div>
    </ViewContainer>
  );
}
