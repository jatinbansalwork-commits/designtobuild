"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  Monitor,
  MoreHorizontal,
  MoreVertical,
  RefreshCw,
  ScanFace,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

export const FINGUARD_DESIGN_WIDTH = 1200;
export const FINGUARD_DESIGN_HEIGHT = 780;

const INDIGO = "#4f46e5";
const ORANGE = "#ff7a28";
const PILL_BORDER = "border-[#e5e7eb]";
const CARD_SHADOW = "shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-black/[0.04]";
const CARD_CLASS = `rounded-[28px] bg-white p-5 ${CARD_SHADOW}`;
const CARD_TITLE = "text-[15px] font-semibold text-[#111]";
const CARD_TITLE_HERO = "text-[20px] font-semibold tracking-[-0.02em]";
const METRIC_VALUE = "text-[42px] font-light leading-none tracking-[-0.04em] text-[#111]";
const TABULAR = "tabular-nums";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function parseInrAmount(amount: string): number {
  const match = amount.match(/₹([\d,]+)/);
  return match ? Number.parseInt(match[1].replace(/,/g, ""), 10) : 0;
}

const NAV_ITEMS = [
  "Overview",
  "Operations",
  "Security Center",
  "Activity",
  "Reports",
] as const;

type NavItem = (typeof NAV_ITEMS)[number];
type StatusFilter = "all" | "pending" | "done";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const SUCCESS_TOP_HEIGHTS = [98, 92, 95, 104, 149, 101, 86];
const SUCCESS_STRIPE_HEIGHTS = [25, 28, 27, 30, 31, 27, 24];
const SUCCESS_RATES = [58, 62, 60, 64, 67, 61, 57];
const SUCCESS_STRIPE_PATTERN =
  "repeating-linear-gradient(135deg, #dfe5ee 0px, #dfe5ee 2px, #eef2f7 2px, #eef2f7 6px)";

const SUBSCRIPTION_PRICES = {
  netflix: 649,
  lightroom: 796,
  mobbin: 849,
  figma: 1299,
} as const;

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

const TRANSACTIONS = [
  {
    id: "netflix",
    name: "Netflix",
    meta: "7 Jul, 3:20 PM",
    status: "In process",
    statusTone: "pending" as const,
    amount: `- ${formatInr(SUBSCRIPTION_PRICES.netflix)}`,
    mark: "N",
    markBg: "#E50914",
  },
  {
    id: "lightroom",
    name: "Lightroom",
    meta: "6 Jul, 12:45 PM",
    status: "In process",
    statusTone: "pending" as const,
    amount: `- ${formatInr(SUBSCRIPTION_PRICES.lightroom)}`,
    mark: "Lr",
    markBg: "#31A8FF",
  },
  {
    id: "mobbin",
    name: "Mobbin",
    meta: "5 Jul, 5:37 PM",
    status: "Completed",
    statusTone: "done" as const,
    amount: `- ${formatInr(SUBSCRIPTION_PRICES.mobbin)}`,
    mark: "M",
    markBg: "#111111",
  },
  {
    id: "figma",
    name: "Figma",
    meta: "5 Jul, 11:02 AM",
    status: "Completed",
    statusTone: "done" as const,
    amount: `- ${formatInr(SUBSCRIPTION_PRICES.figma)}`,
    mark: "F",
    markBg: "#F24E1E",
  },
];

const SPENDING_MONTHS = ["May", "June", "July", "August"] as const;
const SPENDING_BAR_HEIGHT_SCALE = 0.9;
const SPENDING_BY_MONTH: Record<
  (typeof SPENDING_MONTHS)[number],
  { label: string; height: number; category: string }[]
> = {
  May: [
    { label: "61%", height: 164, category: "Entertainment" },
    { label: "49%", height: 132, category: "Software" },
    { label: "41%", height: 108, category: "Food & drink" },
    { label: "34%", height: 88, category: "Travel" },
  ],
  June: [
    { label: "64%", height: 172, category: "Software" },
    { label: "51%", height: 138, category: "Entertainment" },
    { label: "43%", height: 114, category: "Health & wellness" },
    { label: "36%", height: 92, category: "Shopping" },
  ],
  July: [
    { label: "67%", height: 180, category: "Software" },
    { label: "53%", height: 142, category: "Entertainment" },
    { label: "45%", height: 118, category: "Subscriptions" },
    { label: "38%", height: 96, category: "Health & wellness" },
  ],
  August: [
    { label: "59%", height: 156, category: "Gifts" },
    { label: "47%", height: 126, category: "Travel" },
    { label: "39%", height: 102, category: "Food & drink" },
    { label: "31%", height: 80, category: "Shopping" },
  ],
};

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "Retry succeeded for Lightroom",
    detail: `${formatInr(SUBSCRIPTION_PRICES.lightroom)} · Subscription`,
    time: "2m ago",
    emoji: "✅",
    tint: "#22c55e",
  },
  {
    id: "n2",
    title: "New device sign-in from Safari",
    detail: "Bengaluru, IN",
    time: "18m ago",
    emoji: "🔐",
    tint: "#4f46e5",
  },
  {
    id: "n3",
    title: "Netflix payment is processing",
    detail: `${formatInr(SUBSCRIPTION_PRICES.netflix)} · Due 7 Jul`,
    time: "34m ago",
    emoji: "💳",
    tint: "#ff7a28",
  },
  {
    id: "n4",
    title: "Weekly spending report is ready",
    detail: "Jul 5 – Jul 7",
    time: "1h ago",
    emoji: "📊",
    tint: "#0ea5e9",
  },
  {
    id: "n5",
    title: "Figma renews in 3 days",
    detail: `${formatInr(SUBSCRIPTION_PRICES.figma)} · 5 Aug`,
    time: "3h ago",
    emoji: "🔔",
    tint: "#8b5cf6",
  },
];

const FINDINGS = [
  "Your Transaction Volume has Increased by 5% Since June",
  "Software now makes up 67% of your July spending",
  `2 payments are retrying — ${formatInr(SUBSCRIPTION_PRICES.netflix + SUBSCRIPTION_PRICES.lightroom)} could settle today`,
  "You're on track to save ₹12,400 versus last month",
] as const;

const PROFILE_MENU: { label: string; hint?: string; danger?: boolean }[] = [
  { label: "Account settings" },
  { label: "Billing & plans", hint: "Pro" },
  { label: "Notifications", hint: "5" },
  { label: "Help & support" },
  { label: "Sign out", danger: true },
];

const MONTHLY_SPEND = formatInr(
  SUBSCRIPTION_PRICES.netflix +
    SUBSCRIPTION_PRICES.lightroom +
    SUBSCRIPTION_PRICES.mobbin +
    SUBSCRIPTION_PRICES.figma,
);
const ACTIVE_SUBSCRIPTIONS = TRANSACTIONS.length;

const OVERVIEW_STATS = [
  { id: "subs", label: "Active subscriptions", value: `${ACTIVE_SUBSCRIPTIONS}`, hint: "All auto-renewing" },
  { id: "spend", label: "Spend this month", value: MONTHLY_SPEND, hint: "+5% vs June" },
  { id: "success", label: "Success rate", value: "70%", hint: "Retry included" },
];

const UPCOMING_RENEWALS = [
  { id: "netflix", name: "Netflix", date: "Renews 7 Aug", amount: formatInr(SUBSCRIPTION_PRICES.netflix), mark: "N", markBg: "#E50914" },
  { id: "lightroom", name: "Lightroom", date: "Renews 6 Aug", amount: formatInr(SUBSCRIPTION_PRICES.lightroom), mark: "Lr", markBg: "#31A8FF" },
  { id: "mobbin", name: "Mobbin", date: "Renews 5 Aug", amount: formatInr(SUBSCRIPTION_PRICES.mobbin), mark: "M", markBg: "#111111" },
  { id: "figma", name: "Figma", date: "Renews 5 Aug", amount: formatInr(SUBSCRIPTION_PRICES.figma), mark: "F", markBg: "#F24E1E" },
];

const OPERATION_STATS = [
  { id: "processing", label: "In process", value: "2", hint: "Netflix · Lightroom" },
  { id: "settled", label: "Settled today", value: "2", hint: "Mobbin · Figma" },
  { id: "failed", label: "Failed", value: "0", hint: "Last 30 days" },
  { id: "avg", label: "Avg. settle time", value: "1.4s", hint: "Per transaction" },
];

const PROCESSING_QUEUE = [
  { id: "netflix", name: "Netflix", amount: formatInr(SUBSCRIPTION_PRICES.netflix), mark: "N", markBg: "#E50914", progress: 64, stage: "Awaiting bank" },
  { id: "lightroom", name: "Lightroom", amount: formatInr(SUBSCRIPTION_PRICES.lightroom), mark: "Lr", markBg: "#31A8FF", progress: 32, stage: "Retrying" },
];

const SIGN_INS = [
  { id: "s1", device: "Safari on macOS", place: "Bengaluru, IN", time: "18m ago", current: true },
  { id: "s2", device: "FinGuard for iOS", place: "Bengaluru, IN", time: "Yesterday", current: false },
  { id: "s3", device: "Chrome on Windows", place: "Mumbai, IN", time: "Jul 3", current: false },
];

type ActivityTone = "done" | "pending" | "security" | "info";

const ACTIVITY_FEED: {
  id: string;
  title: string;
  meta: string;
  time: string;
  tone: ActivityTone;
}[] = [
  { id: "a1", title: "Retry succeeded for Lightroom", meta: `${formatInr(SUBSCRIPTION_PRICES.lightroom)} · Subscription`, time: "2m ago", tone: "done" },
  { id: "a2", title: "New device sign-in from Safari", meta: "Bengaluru, IN", time: "18m ago", tone: "security" },
  { id: "a3", title: "Weekly spending report is ready", meta: "Jul 5 – Jul 7", time: "1h ago", tone: "info" },
  { id: "a4", title: "Figma payment completed", meta: `${formatInr(SUBSCRIPTION_PRICES.figma)} · Subscription`, time: "5 Jul", tone: "done" },
  { id: "a5", title: "Mobbin payment completed", meta: `${formatInr(SUBSCRIPTION_PRICES.mobbin)} · Subscription`, time: "5 Jul", tone: "done" },
  { id: "a6", title: "Netflix payment initiated", meta: `${formatInr(SUBSCRIPTION_PRICES.netflix)} · Subscription`, time: "7 Jul", tone: "pending" },
];

const ACTIVITY_TONE_DOT: Record<ActivityTone, string> = {
  done: "bg-[#22c55e]",
  pending: "bg-[#ff7a28]",
  security: "bg-[#4f46e5]",
  info: "bg-[#9ca3af]",
};

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "pending" | "done";
}) {
  return (
    <span className="inline-flex min-h-[26px] items-center gap-1.5 rounded-full bg-[#f4f5f7] px-2.5 py-1 text-[11px] font-medium leading-none text-[#111]">
      <span
        className={`size-1.5 shrink-0 rounded-full ${
          tone === "pending" ? "bg-[#ff7a28]" : "bg-[#22c55e]"
        }`}
        aria-hidden
      />
      {label}
    </span>
  );
}

function BrandMark({
  label,
  bg,
  interactive = false,
}: {
  label: string;
  bg: string;
  interactive?: boolean;
}) {
  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${
        interactive ? "transition-transform hover:scale-105" : ""
      }`}
      style={{ backgroundColor: bg }}
    >
      {label}
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-[22px] bg-[#f8f9fb] p-5 ring-1 ring-black/[0.03]">
      <p className="text-[13px] font-medium text-[#666]">{label}</p>
      <p className="mt-4 text-[32px] font-semibold leading-none tracking-[-0.03em] tabular-nums">
        {value}
      </p>
      {hint ? <p className="mt-2 text-[12px] text-[#999]">{hint}</p> : null}
    </div>
  );
}

function HeroCard({
  badge,
  title,
  footer,
}: {
  badge: string;
  title: string;
  footer?: ReactNode;
}) {
  return (
    <section className="relative col-span-4 overflow-hidden rounded-[28px] bg-[#4f46e5] p-6 text-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-black/[0.04]">
      <div
        className="finguard-hero-bg pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 72% 38%, transparent 0 18px, rgba(255,255,255,0.22) 18px 19px)",
        }}
        aria-hidden
      />
      <div className="relative z-10 flex h-full flex-col">
        <span className="w-fit rounded-full bg-white/14 px-3 py-1 text-[12px] font-medium ring-1 ring-white/20">
          {badge}
        </span>
        <p className="mt-auto max-w-[300px] text-[34px] font-medium leading-[1.08] tracking-[-0.03em]">
          {title}
        </p>
        {footer ? <div className="mt-4">{footer}</div> : null}
      </div>
    </section>
  );
}

function CardShell({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-[28px] bg-white p-6 ${CARD_SHADOW} ${className}`}
    >
      {children}
    </section>
  );
}

function IconButton({
  label,
  active = false,
  badge,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`relative flex size-10 items-center justify-center rounded-full transition-colors ${
        active ? "bg-[#111] text-white" : "bg-white text-[#111] hover:bg-[#f4f5f7]"
      } ring-1 ring-black/[0.05]`}
    >
      {children}
      {badge ? (
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#ff7a28] text-[9px] font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function useOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onOutside();
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [enabled, onOutside, ref]);
}

function FinGuardPopover({
  open,
  anchorRef,
  onClose,
  children,
  widthClass = "w-52",
  scale = 1,
  portalContainer,
}: {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
  scale?: number;
  portalContainer?: RefObject<HTMLElement | null>;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const useLocalPortal = Boolean(portalContainer);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;

    const updatePosition = () => {
      const anchorRect = anchorRef.current!.getBoundingClientRect();
      const container = portalContainer?.current;

      if (container) {
        const containerRect = container.getBoundingClientRect();
        setCoords({
          top: anchorRect.bottom - containerRect.top + 8,
          right: containerRect.right - anchorRect.right,
        });
        return;
      }

      setCoords({
        top: anchorRect.bottom + 8,
        right: window.innerWidth - anchorRect.right,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef, open, portalContainer]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (anchorRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      onClose();
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [anchorRef, onClose, open]);

  if (!open || typeof document === "undefined") return null;

  const portalTarget = portalContainer?.current ?? document.body;
  const positionClass = portalContainer ? "absolute" : "fixed";

  return createPortal(
    <div
      ref={popoverRef}
      className={`${positionClass} z-[10050] ${widthClass} overflow-hidden rounded-[20px] bg-white p-2 text-[#111] shadow-[0_18px_40px_rgba(15,23,42,0.14)] ring-1 ring-black/[0.06]`}
      style={{
        top: coords.top,
        right: coords.right,
        transform: useLocalPortal ? undefined : `scale(${scale})`,
        transformOrigin: "top right",
      }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {children}
    </div>,
    portalTarget,
  );
}

/** FinGuard SaaS dashboard — interactive Saltmine portfolio replica. */
export function SaltmineFinGuardDashboard({
  previewScale = 1,
}: {
  previewScale?: number;
}) {
  const searchInputId = useId();
  const monthListboxId = useId();
  const dashboardRootRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const renderScale = previewScale;

  const [activeNav, setActiveNav] = useState<NavItem>("Reports");
  const [emailVerified, setEmailVerified] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(4);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(
    null,
  );
  const [openRowMenuId, setOpenRowMenuId] = useState<string | null>(null);
  const [spendingMonth, setSpendingMonth] =
    useState<(typeof SPENDING_MONTHS)[number]>("July");
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);
  const [hoveredSpendingBar, setHoveredSpendingBar] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [findingIndex, setFindingIndex] = useState(0);
  const [refreshingFindings, setRefreshingFindings] = useState(false);
  const refreshTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const refreshFindings = () => {
    if (refreshingFindings) return;
    setRefreshingFindings(true);
    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    refreshTimeout.current = setTimeout(() => {
      setFindingIndex((current) => (current + 1) % FINDINGS.length);
      setRefreshingFindings(false);
      showToast("Findings updated");
    }, 650);
  };

  useEffect(() => {
    return () => {
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    };
  }, []);

  const profilePercent = 87 + (emailVerified ? 7 : 0) + (twoFactorEnabled ? 6 : 0);
  const unreadNotifications = NOTIFICATIONS.length;

  const profileSegments = [
    {
      id: "bank",
      label: "Bank account details",
      color: INDIGO,
      trackColor: "#eceef2",
      flex: 1.4,
      done: true,
    },
    {
      id: "email",
      label: "Credit card",
      color: ORANGE,
      trackColor: ORANGE,
      flex: 1.1,
      done: emailVerified,
    },
    {
      id: "2fa",
      label: "Security",
      color: "#c5cdd8",
      trackColor: "#eceef2",
      flex: 0.8,
      done: twoFactorEnabled,
    },
  ];

  const profileActions = [
    {
      id: "email",
      label: "Verify email",
      icon: Mail,
      done: emailVerified,
      onAction: () => {},
    },
    {
      id: "2fa",
      label: "Enable 2FA",
      icon: ScanFace,
      done: twoFactorEnabled,
      onAction: () => {},
    },
  ];

  const filteredTransactions = useMemo(() => {
    return TRANSACTIONS.filter((row) => {
      const matchesSearch =
        !searchQuery ||
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.meta.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || row.statusTone === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const transactionSummary = useMemo(() => {
    const total = filteredTransactions.reduce(
      (sum, row) => sum + parseInrAmount(row.amount),
      0,
    );
    return {
      count: filteredTransactions.length,
      total: formatInr(total),
    };
  }, [filteredTransactions]);

  const spendingBars = SPENDING_BY_MONTH[spendingMonth];
  const maxSpendingPercent = Math.max(
    ...spendingBars.map((bar) => parseInt(bar.label, 10)),
  );

  useOnClickOutside(monthRef, () => setMonthMenuOpen(false), monthMenuOpen);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string) => setToast(message);

  const cycleStatusFilter = () => {
    setStatusFilter((current) => {
      if (current === "all") return "pending";
      if (current === "pending") return "done";
      return "all";
    });
  };

  const handleRowMenuAction = (
    event: ReactMouseEvent,
    rowName: string,
    action: string,
  ) => {
    event.stopPropagation();
    setOpenRowMenuId(null);
    showToast(`${action} · ${rowName}`);
  };

  return (
    <div
      ref={dashboardRootRef}
      className="relative overflow-visible bg-[#f3f4f6] text-[#111]"
      style={{
        width: FINGUARD_DESIGN_WIDTH,
        height: FINGUARD_DESIGN_HEIGHT,
        fontFamily: "var(--font-ibm-plex-sans), system-ui, sans-serif",
      }}
    >
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute top-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#111] px-4 py-2 text-[12px] font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}

      <div
        ref={scrollRef}
        onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 4)}
        className="no-scrollbar flex h-full flex-col overflow-hidden px-11 pb-6"
      >
        <header
          className={`sticky top-0 z-30 -mx-11 flex items-center justify-between gap-6 px-11 pb-2 pt-7 transition-all duration-300 ${
            scrolled
              ? "bg-white/70 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur-xl backdrop-saturate-150"
              : "bg-transparent"
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveNav("Overview")}
            className="text-left text-[28px] font-semibold tracking-[-0.03em] transition-opacity hover:opacity-80"
          >
            FinGuard
          </button>

          <nav className="flex flex-wrap items-center justify-center gap-2">
            {NAV_ITEMS.map((item) => {
              const active = item === activeNav;
              return (
                <button
                  key={item}
                  type="button"
                  className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                    active
                      ? "border-[#111] bg-[#111] text-white"
                      : "border-[#e5e7eb] bg-white text-[#666] hover:bg-[#f8f9fb]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div ref={notificationsRef} className="relative">
              <IconButton
                label="Notifications"
                active={notificationsOpen}
                badge={unreadNotifications}
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setProfileMenuOpen(false);
                }}
              >
                <Bell className="size-4" strokeWidth={2} />
              </IconButton>

              <FinGuardPopover
                open={notificationsOpen}
                anchorRef={notificationsRef}
                onClose={() => setNotificationsOpen(false)}
                widthClass="w-80"
                scale={renderScale}
                portalContainer={dashboardRootRef}
              >
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="text-[13px] font-semibold">Notifications</p>
                  <span className="rounded-full bg-[#4f46e5] px-2 py-0.5 text-[10px] font-semibold text-white">
                    {unreadNotifications} new
                  </span>
                </div>
                <div className="no-scrollbar max-h-[280px] overflow-y-auto">
                  {NOTIFICATIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        showToast(item.title);
                      }}
                      className="flex w-full items-start gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors hover:bg-[#f4f5f7]"
                    >
                      <span
                        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-[13px]"
                        style={{ backgroundColor: `${item.tint}1a`, color: item.tint }}
                        aria-hidden
                      >
                        {item.emoji}
                      </span>
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-[13px] font-medium leading-snug">{item.title}</span>
                        <span className="truncate text-[11px] text-[#666]">
                          {item.detail} · {item.time}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(false);
                    showToast("All notifications marked as read");
                  }}
                  className="mt-1 flex w-full items-center justify-center rounded-[14px] bg-[#f4f5f7] px-3 py-2.5 text-[12px] font-medium transition-colors hover:bg-[#eceef2]"
                >
                  Mark all as read
                </button>
              </FinGuardPopover>
            </div>

            <div ref={profileRef} className="relative">
              <button
                type="button"
                aria-label="Account menu"
                aria-expanded={profileMenuOpen}
                onClick={() => {
                  setProfileMenuOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-3 pr-1.5 ring-1 ring-black/[0.05] transition-colors hover:bg-[#f4f5f7]"
              >
                <span className="flex flex-col gap-1">
                  <span className="h-0.5 w-3 rounded-full bg-[#111]" />
                  <span className="h-0.5 w-3 rounded-full bg-[#111]" />
                </span>
                <span className="size-8 overflow-hidden rounded-full bg-[#f79780]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/kalash-profile-avatar.svg"
                    alt=""
                    className="size-full object-cover"
                  />
                </span>
              </button>

              <FinGuardPopover
                open={profileMenuOpen}
                anchorRef={profileRef}
                onClose={() => setProfileMenuOpen(false)}
                widthClass="w-64"
                scale={renderScale}
                portalContainer={dashboardRootRef}
              >
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <span className="size-9 shrink-0 overflow-hidden rounded-full bg-[#f79780]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/kalash-profile-avatar.svg"
                      alt=""
                      className="size-full object-cover"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">jatin Bansal</p>
                    <p className="truncate text-[11px] text-[#666]">jatinbansal.work@gmail.com</p>
                  </div>
                </div>
                <div className="mx-2 mb-1 rounded-[14px] bg-[#f4f5f7] px-3 py-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[#666]">Pro plan</span>
                    <span className="text-[#4f46e5]">Renews 1 Aug</span>
                  </div>
                </div>
                {PROFILE_MENU.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      showToast(item.label);
                    }}
                    className={`flex w-full items-center justify-between rounded-[14px] px-3 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-[#f4f5f7] ${
                      item.danger ? "text-[#dc2626]" : ""
                    }`}
                  >
                    {item.label}
                    {item.hint ? (
                      <span className="text-[11px] font-normal text-[#999]">{item.hint}</span>
                    ) : null}
                  </button>
                ))}
              </FinGuardPopover>
            </div>
          </div>
        </header>

        <div className="mt-5 grid min-h-0 flex-1 grid-cols-12 grid-rows-[auto_minmax(0,1fr)] gap-3 pb-1">
          {activeNav === "Reports" ? (
          <>
          <section className="relative col-span-4 flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] bg-[#4f46e5] p-5 text-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-black/[0.04]">
            <div
              className="finguard-hero-bg pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-radial-gradient(circle at 72% 38%, transparent 0 18px, rgba(255,255,255,0.22) 18px 19px)",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.14)_0%,transparent_55%)]"
              aria-hidden
            />
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-white/14 px-3 py-1 text-[12px] font-medium ring-1 ring-white/20">
                    Findings
                  </span>
                  <p className="mt-2 text-[11px] font-medium text-white/70">
                    Last synced 2 min ago
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Refresh findings"
                  onClick={refreshFindings}
                  disabled={refreshingFindings}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/20 transition-colors hover:bg-white/20 disabled:cursor-wait"
                >
                  <RefreshCw
                    className={`size-4 ${refreshingFindings && !prefersReducedMotion ? "animate-spin" : ""}`}
                    strokeWidth={2}
                  />
                </button>
              </div>
              <p
                className={`mt-auto max-w-[260px] text-[30px] font-medium leading-[1.1] tracking-[-0.03em] transition-opacity duration-300 ${
                  refreshingFindings && !prefersReducedMotion
                    ? "opacity-40 blur-[1px]"
                    : "opacity-100"
                }`}
              >
                {FINDINGS[findingIndex]}
              </p>
            </div>
          </section>

          <section className={`col-span-4 flex h-full min-h-0 flex-col ${CARD_CLASS}`}>
            <p className={CARD_TITLE}>Profile Completion</p>

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className={METRIC_VALUE}>
                {profilePercent}%
              </p>
              {profilePercent >= 100 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf3] px-3 py-1.5 text-[11px] font-medium text-[#15803d]">
                  <Check className="size-3" strokeWidth={3} />
                  All set
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-[#f4f5f7] px-3 py-1.5 text-[11px] font-medium text-[#666]">
                  You&apos;re almost there!
                </span>
              )}
            </div>

            <div className="mt-4 flex gap-1.5">
              {profileSegments.map((segment) => (
                <div
                  key={segment.id}
                  className="min-w-0"
                  style={{ flex: segment.flex }}
                >
                  <div
                    className="h-2.5 overflow-hidden rounded-full"
                    style={{ backgroundColor: segment.trackColor }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: segment.done ? "100%" : "0%",
                        backgroundColor: segment.color,
                      }}
                    />
                  </div>
                  <p
                    className={`mt-2 truncate text-[11px] font-medium ${
                      segment.done ? "text-[#111]" : "text-[#b0b8c4]"
                    }`}
                  >
                    {segment.label}
                  </p>
                </div>
              ))}
            </div>

            {profileActions.length > 0 ? (
              <div className="mt-auto pt-5">
                <p className="text-[13px] text-[#666]">
                  Secure your account further by:
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {profileActions.map((action) => {
                    const Icon = action.icon;
                    if (action.done) {
                      return (
                        <span
                          key={action.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf3] px-3.5 py-2 text-[12px] font-medium text-[#15803d]"
                        >
                          <Check className="size-3.5" strokeWidth={2.5} />
                          {action.id === "2fa" ? "2FA enabled" : "Email verified"}
                        </span>
                      );
                    }
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={action.onAction}
                        className={`inline-flex items-center gap-2 rounded-full border ${PILL_BORDER} bg-white px-3.5 py-2 text-[12px] font-medium text-[#111] transition-colors hover:bg-[#f8f9fb]`}
                      >
                        {action.label}
                        <Icon className="size-3.5 text-[#666]" strokeWidth={2} />
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    aria-label="Profile options"
                    onClick={() => showToast("Profile options")}
                    className={`ml-auto flex size-9 shrink-0 items-center justify-center rounded-full border ${PILL_BORDER} text-[#666] transition-colors hover:bg-[#f8f9fb] hover:text-[#111]`}
                  >
                    <MoreVertical className="size-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </section>

          <section className={`col-span-4 self-start ${CARD_CLASS}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={CARD_TITLE}>Transaction Success Rate</p>
                <p className={`mt-2 ${METRIC_VALUE}`}>70%</p>
                <p className="mt-1.5 text-[13px] text-[#666]">Retry success rate</p>
              </div>
              <button
                type="button"
                aria-label="Collapse chart"
                onClick={() => showToast("Chart collapsed")}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e5e7eb] text-[#666] transition-colors hover:bg-[#f8f9fb] hover:text-[#111]"
              >
                <ChevronUp className="size-4" strokeWidth={2} />
              </button>
            </div>

            <div className="mt-2 overflow-visible">
              <div className="flex items-end gap-3">
                {WEEKDAYS.map((day, index) => {
                  const active = hoveredDay === index;
                  const topHeight = SUCCESS_TOP_HEIGHTS[index];
                  const stripeHeight = SUCCESS_STRIPE_HEIGHTS[index];
                  const segmentGap = 6;
                  return (
                    <button
                      key={day}
                      type="button"
                      onMouseEnter={() => setHoveredDay(index)}
                      onFocus={() => setHoveredDay(index)}
                      className="flex min-w-0 flex-1 flex-col items-center gap-2 outline-none"
                    >
                      <div
                        className="relative flex w-full flex-col justify-end"
                        style={{
                          height: topHeight + stripeHeight + segmentGap,
                          gap: segmentGap,
                        }}
                      >
                        {active ? (
                          <div
                            className="absolute left-1/2 z-10 -translate-x-1/2"
                            style={{
                              bottom: topHeight + stripeHeight + segmentGap + 8,
                            }}
                          >
                            <span className="flex h-6 min-w-[34px] items-center justify-center rounded-[8px] bg-[#111] px-2 text-[10px] font-semibold text-white">
                              {SUCCESS_RATES[index]}%
                            </span>
                          </div>
                        ) : null}
                        <div
                          className="relative w-full rounded-[10px] transition-colors duration-200"
                          style={{
                            height: topHeight,
                            backgroundColor: active ? ORANGE : "#e4e7ef",
                          }}
                        >
                          <span className="absolute top-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-white" />
                        </div>
                        <div
                          className="w-full rounded-[10px]"
                          style={{
                            height: stripeHeight,
                            background: SUCCESS_STRIPE_PATTERN,
                          }}
                        />
                      </div>
                      <span
                        className={`text-[11px] ${
                          active ? "font-semibold text-[#111]" : "text-[#111]"
                        }`}
                      >
                        {day}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className={`col-span-7 row-start-2 flex h-full min-h-0 flex-col ${CARD_CLASS}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={CARD_TITLE_HERO}>Transaction History</p>
                <p className="mt-0.5 text-[13px] text-[#666]">Jul 5 2026 - Jul 7 2026</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Search transactions"
                  aria-pressed={searchOpen}
                  onClick={() => setSearchOpen((open) => !open)}
                  className={`flex size-9 items-center justify-center rounded-full transition-colors ${
                    searchOpen ? "bg-[#111] text-white" : "bg-[#f4f5f7] hover:bg-[#eceef2]"
                  }`}
                >
                  <Search className="size-4" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  aria-label="Filter transactions"
                  onClick={cycleStatusFilter}
                  className={`flex size-9 items-center justify-center rounded-full transition-colors ${
                    statusFilter !== "all"
                      ? "bg-[#111] text-white"
                      : "bg-[#f4f5f7] hover:bg-[#eceef2]"
                  }`}
                >
                  <SlidersHorizontal className="size-4" strokeWidth={2} />
                </button>
              </div>
            </div>

            {searchOpen ? (
              <label
                className={`mt-4 flex items-center gap-2 rounded-full bg-[#f4f5f7] px-4 py-2.5 ring-2 ring-[#111] transition-shadow`}
                htmlFor={searchInputId}
              >
                <Search className="size-4 text-[#666]" />
                <input
                  id={searchInputId}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search transactions"
                  className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#999]"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery("")}
                    className="text-[#666] hover:text-[#111]"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </label>
            ) : null}

            <p className={`mt-4 text-[13px] text-[#666] ${TABULAR}`}>
              {transactionSummary.count} transaction
              {transactionSummary.count === 1 ? "" : "s"} ·{" "}
              <span className="font-medium text-[#111]">
                {transactionSummary.total} outflow
              </span>
            </p>

            <div className="no-scrollbar mt-3 flex-1 space-y-6 overflow-y-auto">
              {filteredTransactions.length === 0 ? (
                <p className="rounded-[18px] bg-[#f8f9fb] px-4 py-8 text-center text-[13px] text-[#666]">
                  No transactions match your filters.
                </p>
              ) : (
                filteredTransactions.map((row) => {
                  const selected = selectedTransactionId === row.id;
                  return (
                    <div
                      key={row.id}
                      className={`relative grid grid-cols-[minmax(0,1.4fr)_auto_auto_auto_auto] items-center gap-3 rounded-[18px] transition-colors ${
                        selected
                          ? "bg-[#f8f9ff] px-3 py-3 ring-1 ring-[#4f46e5]/10"
                          : "px-0"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTransactionId((current) =>
                            current === row.id ? null : row.id,
                          )
                        }
                        className="flex min-w-0 items-center gap-3 text-left"
                      >
                        <BrandMark label={row.mark} bg={row.markBg} interactive />
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-semibold">{row.name}</p>
                          <p className="truncate text-[12px] text-[#666]">{row.meta}</p>
                        </div>
                      </button>
                      <StatusPill label={row.status} tone={row.statusTone} />
                      <span className="rounded-full bg-[#f4f5f7] px-3 py-1 text-[11px] font-medium">
                        Subscription
                      </span>
                      <p className={`text-[14px] font-semibold ${TABULAR}`}>{row.amount}</p>
                      <div className="relative">
                        <button
                          type="button"
                          aria-label={`Actions for ${row.name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setOpenRowMenuId((current) =>
                              current === row.id ? null : row.id,
                            );
                          }}
                          className="rounded-full p-1 text-[#999] transition-colors hover:bg-[#f4f5f7] hover:text-[#111]"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                        {openRowMenuId === row.id ? (
                          <div className="absolute top-7 right-0 z-30 w-40 overflow-hidden rounded-[16px] bg-white p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.06]">
                            {["View receipt", "Retry payment", "Report issue"].map((action) => (
                              <button
                                key={action}
                                type="button"
                                onClick={(event) => handleRowMenuAction(event, row.name, action)}
                                className="flex w-full rounded-[12px] px-3 py-2 text-left text-[12px] font-medium transition-colors hover:bg-[#f4f5f7]"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className={`col-span-5 row-start-2 flex h-full min-h-0 flex-col ${CARD_CLASS}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={CARD_TITLE}>Spending Overview</p>
                <p className="mt-0.5 text-[12px] text-[#666]">Share of total spend</p>
              </div>
              <div ref={monthRef} className="relative shrink-0">
                <button
                  type="button"
                  aria-expanded={monthMenuOpen}
                  aria-haspopup="listbox"
                  aria-controls={monthMenuOpen ? monthListboxId : undefined}
                  onClick={() => setMonthMenuOpen((open) => !open)}
                  className={`inline-flex items-center gap-1 rounded-full border ${PILL_BORDER} bg-white px-3 py-1.5 text-[12px] font-medium text-[#111] transition-colors hover:bg-[#f8f9fb]`}
                >
                  {spendingMonth}
                  <ChevronDown
                    className={`size-3.5 text-[#666] transition-transform ${monthMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {monthMenuOpen ? (
                  <div
                    id={monthListboxId}
                    role="listbox"
                    aria-label="Spending month"
                    className="absolute top-10 right-0 z-30 w-40 overflow-hidden rounded-[16px] bg-white p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.06]"
                  >
                    {SPENDING_MONTHS.map((month) => (
                      <button
                        key={month}
                        type="button"
                        role="option"
                        aria-selected={month === spendingMonth}
                        onClick={() => {
                          setSpendingMonth(month);
                          setHoveredSpendingBar(0);
                          setMonthMenuOpen(false);
                          showToast(`Showing ${month} spending`);
                        }}
                        className={`flex w-full rounded-[12px] px-3 py-2 text-left text-[12px] font-medium transition-colors ${
                          month === spendingMonth
                            ? "bg-[#111] text-white"
                            : "hover:bg-[#f4f5f7]"
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="relative mt-4 min-h-0 flex-1">
              {spendingBars.length === 0 ? (
                <p className="flex h-full items-center justify-center rounded-[18px] bg-[#f8f9fb] px-4 py-8 text-center text-[13px] text-[#666]">
                  No spending data for this month.
                </p>
              ) : (
              <>
              <div className="grid h-full grid-cols-4 items-end gap-3">
                {spendingBars.map((bar, index) => {
                  const active = hoveredSpendingBar === index;
                  const percent = parseInt(bar.label, 10);
                  const normalizedPercent = Math.round(
                    (percent / maxSpendingPercent) * 100,
                  );
                  const barHeight = Math.round(
                    normalizedPercent * SPENDING_BAR_HEIGHT_SCALE,
                  );
                  return (
                    <button
                      key={`${spendingMonth}-${bar.label}`}
                      type="button"
                      aria-label={`${bar.category}, ${normalizedPercent}% of total spend`}
                      aria-pressed={active}
                      onMouseEnter={() => setHoveredSpendingBar(index)}
                      onFocus={() => setHoveredSpendingBar(index)}
                      className="flex h-full flex-col items-center justify-end outline-none"
                    >
                      <div
                        className="relative w-[90%] rounded-[20px] transition-colors duration-200"
                        style={{
                          height: `${barHeight}%`,
                          backgroundColor: active ? INDIGO : "#e4e7ef",
                        }}
                      >
                        <span
                          className={`absolute top-3 left-1/2 -translate-x-1/2 text-[12px] font-semibold tabular-nums ${
                            active ? "text-white" : "text-[#b0b8c4]"
                          }`}
                        >
                          {normalizedPercent}%
                        </span>
                        {active ? (
                          <div
                            className="absolute right-2.5 bottom-2.5 left-2.5 rounded-[12px] border border-white/75"
                            style={{
                              height: "58%",
                              background:
                                "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 3px, rgba(255,255,255,0.28) 3px, rgba(255,255,255,0.28) 7px)",
                            }}
                          />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              {spendingBars.map((bar, index) => {
                if (index !== hoveredSpendingBar) return null;
                const percent = parseInt(bar.label, 10);
                const normalizedPercent = Math.round(
                  (percent / maxSpendingPercent) * 100,
                );
                const barHeight = Math.round(
                  normalizedPercent * SPENDING_BAR_HEIGHT_SCALE,
                );
                const left = (index + 0.5) * 25;
                const barTop = barHeight;
                const isLast = index === spendingBars.length - 1;

                if (isLast) {
                  return (
                    <div
                      key={`${spendingMonth}-annotation-${bar.label}`}
                      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-2"
                      style={{
                        left: `${left}%`,
                        bottom: `${barTop}%`,
                      }}
                    >
                      <span className="rounded-full bg-[#111] px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-white">
                        {bar.category}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${spendingMonth}-annotation-${bar.label}`}
                    className="pointer-events-none absolute z-20 flex items-end"
                    style={{
                      left: `${left}%`,
                      bottom: `${barTop}%`,
                      width: `${100 - left}%`,
                    }}
                  >
                    <div className="h-px flex-1 border-t border-dashed border-[#111]" />
                    <span className="shrink-0 rounded-full bg-[#111] px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-white">
                      {bar.category}
                    </span>
                  </div>
                );
              })}
              </>
              )}
            </div>
          </section>
          </>
          ) : null}

          {activeNav === "Overview" ? (
          <>
            <HeroCard
              badge="This month"
              title={`${MONTHLY_SPEND} tracked across ${ACTIVE_SUBSCRIPTIONS} subscriptions`}
              footer={
                <button
                  type="button"
                  onClick={() => setActiveNav("Reports")}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#4f46e5] transition-colors hover:bg-white/90"
                >
                  View full report
                  <ArrowUpRight className="size-4" strokeWidth={2.25} />
                </button>
              }
            />

            <CardShell className="col-span-8">
              <div className="grid h-full grid-cols-3 gap-4">
                {OVERVIEW_STATS.map((stat) => (
                  <StatCard
                    key={stat.id}
                    label={stat.label}
                    value={stat.value}
                    hint={stat.hint}
                  />
                ))}
              </div>
            </CardShell>

            <CardShell className="col-span-7">
              <div className="flex items-center justify-between">
                <p className="text-[22px] font-semibold tracking-[-0.02em]">
                  Upcoming renewals
                </p>
                <span className="rounded-full bg-[#f4f5f7] px-3 py-1 text-[11px] font-medium text-[#666]">
                  Next 30 days
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {UPCOMING_RENEWALS.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-t border-[#f0f1f3] pt-4 first:border-t-0 first:pt-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <BrandMark label={row.mark} bg={row.markBg} />
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold">{row.name}</p>
                        <p className="truncate text-[12px] text-[#666]">{row.date}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#f4f5f7] px-3 py-1 text-[11px] font-medium">
                      Subscription
                    </span>
                    <p className="text-[14px] font-semibold">{row.amount}</p>
                  </div>
                ))}
              </div>
            </CardShell>

            <CardShell className="col-span-5">
              <p className="text-[22px] font-semibold tracking-[-0.02em]">
                Where your money goes
              </p>
              <p className="mt-1 text-[13px] text-[#666]">July · by category</p>
              <div className="mt-6 space-y-4">
                {SPENDING_BY_MONTH.July.map((bar) => (
                  <div key={bar.category}>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-[#111]">{bar.category}</span>
                      <span className="text-[#666]">{bar.label}</span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#eceef2]">
                      <div
                        className="h-full rounded-full bg-[#4f46e5]"
                        style={{ width: bar.label }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardShell>
          </>
          ) : null}

          {activeNav === "Operations" ? (
          <>
            <HeroCard
              badge="Processing"
              title="2 payments moving through the queue right now"
            />

            <CardShell className="col-span-8">
              <div className="grid h-full grid-cols-4 gap-4">
                {OPERATION_STATS.map((stat) => (
                  <StatCard
                    key={stat.id}
                    label={stat.label}
                    value={stat.value}
                    hint={stat.hint}
                  />
                ))}
              </div>
            </CardShell>

            <CardShell className="col-span-12">
              <div className="flex items-center justify-between">
                <p className="text-[22px] font-semibold tracking-[-0.02em]">
                  Processing queue
                </p>
                <span className="rounded-full bg-[#f4f5f7] px-3 py-1 text-[11px] font-medium text-[#666]">
                  Live
                </span>
              </div>
              <div className="mt-5 space-y-5">
                {PROCESSING_QUEUE.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)_auto] items-center gap-5 border-t border-[#f0f1f3] pt-5 first:border-t-0 first:pt-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <BrandMark label={row.mark} bg={row.markBg} />
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold">{row.name}</p>
                        <p className="truncate text-[12px] text-[#666]">{row.stage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eceef2]">
                        <div
                          className="h-full rounded-full bg-[#ff7a28] transition-all duration-500"
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-[12px] font-medium text-[#666]">
                        {row.progress}%
                      </span>
                    </div>
                    <p className="text-[14px] font-semibold">{row.amount}</p>
                  </div>
                ))}
              </div>
            </CardShell>
          </>
          ) : null}

          {activeNav === "Security Center" ? (
          <>
            <HeroCard
              badge="Security score"
              title={`Your account is ${profilePercent}% secured`}
            />

            <CardShell className="col-span-8">
              <p className="text-[22px] font-semibold tracking-[-0.02em]">
                Account protection
              </p>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[#f8f9fb] px-4 py-3.5 ring-1 ring-black/[0.03]">
                  <div>
                    <p className="text-[14px] font-semibold">Email verification</p>
                    <p className="text-[12px] text-[#666]">Confirm ownership of your inbox</p>
                  </div>
                  {emailVerified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf3] px-3 py-1.5 text-[12px] font-medium text-[#15803d]">
                      <Check className="size-3.5" /> Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEmailVerified(true);
                        showToast("Verification email sent");
                      }}
                      className="rounded-full bg-[#f4f5f7] px-4 py-2 text-[12px] font-medium transition-colors hover:bg-[#eceef2]"
                    >
                      Verify email
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[#f8f9fb] px-4 py-3.5 ring-1 ring-black/[0.03]">
                  <div>
                    <p className="text-[14px] font-semibold">Two-factor authentication</p>
                    <p className="text-[12px] text-[#666]">Add a second step at sign-in</p>
                  </div>
                  {twoFactorEnabled ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf3] px-3 py-1.5 text-[12px] font-medium text-[#15803d]">
                      <Check className="size-3.5" /> Enabled
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTwoFactorEnabled(true);
                        showToast("2FA enabled");
                      }}
                      className="rounded-full bg-[#f4f5f7] px-4 py-2 text-[12px] font-medium transition-colors hover:bg-[#eceef2]"
                    >
                      Enable 2FA
                    </button>
                  )}
                </div>
              </div>
            </CardShell>

            <CardShell className="col-span-12">
              <p className="text-[22px] font-semibold tracking-[-0.02em]">
                Recent sign-ins
              </p>
              <div className="mt-5 space-y-4">
                {SIGN_INS.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] items-center gap-3 border-t border-[#f0f1f3] pt-4 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-[#f4f5f7]">
                        <Monitor className="size-4 text-[#666]" strokeWidth={2} />
                      </span>
                      <div>
                        <p className="text-[15px] font-semibold">{row.device}</p>
                        <p className="text-[12px] text-[#666]">{row.place}</p>
                      </div>
                    </div>
                    {row.current ? (
                      <StatusPill label="This device" tone="done" />
                    ) : (
                      <span className="text-[12px] text-[#666]">Signed in</span>
                    )}
                    <p className="text-[12px] text-[#999]">{row.time}</p>
                  </div>
                ))}
              </div>
            </CardShell>
          </>
          ) : null}

          {activeNav === "Activity" ? (
          <>
            <HeroCard
              badge="Activity"
              title="Everything happening across your account"
            />

            <CardShell className="col-span-8">
              <p className="text-[22px] font-semibold tracking-[-0.02em]">
                Recent activity
              </p>
              <div className="mt-5">
                {ACTIVITY_FEED.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 pb-5 last:pb-0"
                  >
                    <div className="flex flex-col items-center self-stretch">
                      <span className={`mt-1 size-2.5 shrink-0 rounded-full ${ACTIVITY_TONE_DOT[item.tone]}`} />
                      {index < ACTIVITY_FEED.length - 1 ? (
                        <span className="mt-1 w-px flex-1 bg-[#eceef2]" />
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold leading-tight">{item.title}</p>
                        <p className="mt-0.5 text-[12px] text-[#666]">{item.meta}</p>
                      </div>
                      <span className="shrink-0 text-[12px] text-[#999]">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardShell>
          </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
