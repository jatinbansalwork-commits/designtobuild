import { FOCUS_RING } from "@/kalash/lib/a11y";

interface IphoneHomeIndicatorProps {
  onPress: () => void;
  tone?: "light" | "dark";
}

export function IphoneHomeIndicator({
  onPress,
  tone = "dark",
}: IphoneHomeIndicatorProps) {
  return (
    <button
      type="button"
      aria-label="Back to home screen"
      className={`absolute bottom-2 left-1/2 z-20 flex h-6 w-[34%] -translate-x-1/2 items-end justify-center pb-1 ${FOCUS_RING}`}
      onClick={onPress}
    >
      <span
        className={`block h-[5px] w-[42%] rounded-full ${
          tone === "light" ? "bg-white/70" : "bg-black/30"
        }`}
      />
    </button>
  );
}
