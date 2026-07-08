const ILLUSTRATION_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/Component%204.svg";
const ILLUSTRATION_WIDTH = 164;
const ILLUSTRATION_HEIGHT = 152;

/** Static gift-box illustration above the action sheet — halo + float. */
export function ActionSheetIllustration() {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="pointer-events-none absolute size-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(17, 141, 130, 0.2) 0%, rgba(255, 193, 7, 0.08) 42%, transparent 72%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-1 size-24 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 225, 97, 0.35) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ILLUSTRATION_SRC}
        alt=""
        width={ILLUSTRATION_WIDTH}
        height={ILLUSTRATION_HEIGHT}
        className="relative z-10 h-[152px] w-[164px] object-contain drop-shadow-[0_12px_24px_rgba(17,141,130,0.12)]"
        draggable={false}
      />
    </div>
  );
}

export const ACTION_SHEET_ILLUSTRATION_HEIGHT_PX = ILLUSTRATION_HEIGHT;
export const ACTION_SHEET_ILLUSTRATION_OVERLAP_PX = ILLUSTRATION_HEIGHT / 2;
