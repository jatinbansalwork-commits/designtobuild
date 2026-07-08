import { KALASH_RING_MINT, KALASH_RING_TEAL } from "@/kalash/components/slider/kalash/kalash-tokens";

const AVATAR_SIZE = "size-12";
const AVATAR_INNER = "size-9";

export function KalashHeaderAvatar() {
  return (
    <div
      className={`relative flex ${AVATAR_SIZE} shrink-0 items-center justify-center`}
      aria-label="Profile"
    >
      <svg
        viewBox="0 0 48 48"
        className="absolute inset-0 size-full animate-spin-slow"
        aria-hidden
      >
        <circle
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke={KALASH_RING_TEAL}
          strokeWidth="2.4"
          strokeDasharray="11 7"
          strokeLinecap="round"
        />
      </svg>

      <svg
        viewBox="0 0 48 48"
        className="absolute inset-0 size-full animate-spin-slow-reverse opacity-60"
        aria-hidden
      >
        <circle
          cx="24"
          cy="24"
          r="19.5"
          fill="none"
          stroke={KALASH_RING_MINT}
          strokeWidth="1.8"
          strokeDasharray="7 9"
          strokeLinecap="round"
        />
      </svg>

      <div
        className={`relative ${AVATAR_INNER} overflow-hidden rounded-full bg-[#f79780]`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/kalash-profile-avatar.svg"
          alt=""
          className="size-full object-cover"
        />
      </div>
    </div>
  );
}
