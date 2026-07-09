import { Noto_Sans } from "next/font/google";

/** Noto Sans — merch preview typography. */
export const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-noto-sans",
});

/** @deprecated Use notoSans */
export const canvaSans = notoSans;
