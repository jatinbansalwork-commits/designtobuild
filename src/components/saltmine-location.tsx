"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ArrowRight, Check, ChevronRight, MapPin, Search, X } from "lucide-react";

const SALTMINE_PLAN_ILLUSTRATION_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/salt2.svg";

const ALL_LOCATIONS_ICON_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/Goal1.svg";

const SPECIFIC_LOCATIONS_ICON_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/Goal2.svg";

const COST_BASELINE = 23837;
const COST_TARGET_DEFAULT = 43973;

const SUGGESTIONS = [
  "APAC",
  "Europe",
  "Malaysia",
  "Singapore",
  "Bengaluru",
  "North America",
] as const;

type GoalUnit = "number" | "percent";
type SpecificPhase = "sites" | "goal";
type SpecificTab = "location" | "business";

function formatUsd(value: number) {
  return `$ ${value.toLocaleString("en-US")}`;
}

function parseUsdInput(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number.parseInt(digits, 10);
}

function clampPercent(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function targetFromPercent(percent: number) {
  return Math.round(COST_BASELINE * (1 + clampPercent(percent) / 100));
}

const STEPS = [
  { id: "setup", label: "Plan setup" },
  { id: "location", label: "Location" },
  { id: "business", label: "Business line" },
  { id: "goal", label: "Goal" },
  { id: "review", label: "Review" },
] as const;

const CURRENT_STEP = 1;

type LocationScope = "all" | "specific" | null;

const SITES = [
  { id: "hq-sf", name: "San Francisco HQ", region: "North America", role: "HQ" },
  { id: "nyc", name: "New York Office", region: "North America", role: "Hub" },
  { id: "blr", name: "Bengaluru Center", region: "Asia Pacific", role: "New site" },
  { id: "lon", name: "London Studio", region: "Europe", role: "Hub" },
  { id: "sg", name: "Singapore Hub", region: "Asia Pacific", role: "Hub" },
  { id: "my", name: "Kuala Lumpur", region: "Asia Pacific", role: "Hub" },
] as const;

interface SaltmineLocationProps {
  onBack?: () => void;
  onContinue?: () => void;
  planName?: string;
  durationLabel?: string;
}

/**
 * Scroll-safe Location step:
 * Left stays a fixed binary choice.
 * Specific selection UI moves into the right panel (side-by-side), so height never grows.
 */
export function SaltmineLocation({
  onBack,
  onContinue,
  planName = "Strategy 2024",
  durationLabel = "3 months",
}: SaltmineLocationProps) {
  const groupId = useId();
  const [scope, setScope] = useState<LocationScope>(null);
  const [query, setQuery] = useState("");
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
  const [primarySiteId, setPrimarySiteId] = useState<string>("");
  const [specificTouched, setSpecificTouched] = useState(false);
  const [choiceTouched, setChoiceTouched] = useState(false);
  const [specificPhase, setSpecificPhase] = useState<SpecificPhase>("sites");
  const [specificTab, setSpecificTab] = useState<SpecificTab>("location");
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>([]);
  const [goalUnit, setGoalUnit] = useState<GoalUnit>("number");
  const [costTarget, setCostTarget] = useState(COST_TARGET_DEFAULT);
  const [costDraft, setCostDraft] = useState(formatUsd(COST_TARGET_DEFAULT));
  const [goalEditing, setGoalEditing] = useState(false);
  const [goalTouched, setGoalTouched] = useState(false);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const costInputRef = useRef<HTMLInputElement | null>(null);

  const filteredSites = useMemo(() => {
    const q = query.trim().toLowerCase();
    const suggestionMatches = activeSuggestions.map((value) => value.toLowerCase());
    return SITES.filter((site) => {
      const haystack = `${site.name} ${site.region} ${site.role}`.toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      const matchesSuggestion =
        suggestionMatches.length === 0 ||
        suggestionMatches.some((suggestion) => haystack.includes(suggestion.toLowerCase()));
      return matchesQuery && matchesSuggestion;
    });
  }, [activeSuggestions, query]);

  const specificComplete = selectedSiteIds.length > 0;
  const costGap = costTarget - COST_BASELINE;
  const costPercent = clampPercent(
    COST_BASELINE > 0 ? Math.round((costGap / COST_BASELINE) * 100) : 0,
  );
  const allGoalComplete = costTarget > 0;
  const showCostGoal =
    scope === "all" || (scope === "specific" && specificPhase === "goal");
  const displayedTarget = goalEditing
    ? costDraft
    : goalUnit === "percent"
      ? `${costPercent}%`
      : formatUsd(costTarget);

  const syncCostDraft = useCallback(
    (value: number, unit: GoalUnit = goalUnit) => {
      if (unit === "percent") {
        const percent = clampPercent(
          COST_BASELINE > 0
            ? Math.round(((value - COST_BASELINE) / COST_BASELINE) * 100)
            : 0,
        );
        setCostDraft(`${percent}%`);
        return;
      }
      setCostDraft(formatUsd(value));
    },
    [goalUnit],
  );

  const applyCostTarget = useCallback(
    (value: number) => {
      const next = Math.max(0, Math.round(value));
      setCostTarget(next);
      syncCostDraft(next);
      setGoalTouched(true);
    },
    [syncCostDraft],
  );

  const nudgeCostTarget = useCallback(
    (direction: 1 | -1) => {
      if (goalUnit === "percent") {
        applyCostTarget(targetFromPercent(costPercent + direction * 5));
        return;
      }
      applyCostTarget(costTarget + direction * 1000);
    },
    [applyCostTarget, costPercent, costTarget, goalUnit],
  );

  const commitCostDraft = useCallback(() => {
    setGoalEditing(false);
    if (goalUnit === "percent") {
      const nextPercent = Number.parseInt(costDraft.replace(/[^\d-]/g, "") || "0", 10);
      applyCostTarget(targetFromPercent(nextPercent));
      return;
    }
    applyCostTarget(parseUsdInput(costDraft));
  }, [applyCostTarget, costDraft, goalUnit]);

  const canContinue =
    (scope === "all" && allGoalComplete) ||
    (scope === "specific" && specificPhase === "goal" && allGoalComplete);
  const showChoiceError = choiceTouched && scope === null;
  const showSpecificError =
    scope === "specific" &&
    specificPhase === "sites" &&
    specificTouched &&
    !specificComplete;
  const showGoalError = showCostGoal && goalTouched && !allGoalComplete;

  const impact = useMemo(() => {
    if (scope === null) {
      return {
        label: "Choose a scope",
        detail: "",
        value: "Not set",
        chip: "Pending",
        percent: 0,
      };
    }
    if (scope === "all") {
      return {
        label: "All sites",
        detail: "",
        value: formatUsd(costTarget),
        chip: "Org-wide",
        percent: 100,
      };
    }
    const count = selectedSiteIds.length;
    return {
      label: count === 0 ? "No sites" : count === 1 ? "1 site" : `${count} sites`,
      detail: "",
      value: count === 0 ? "No locations" : count === 1 ? "1 location" : `${count} locations`,
      chip: "Focused",
      percent: Math.min(100, Math.max(25, (count / SITES.length) * 100)),
    };
  }, [costTarget, scope, selectedSiteIds.length]);

  const summaryLine = useMemo(() => {
    if (scope === null) return durationLabel;
    if (scope === "all") return `${durationLabel} · ${formatUsd(costTarget)}`;
    if (specificPhase === "sites") {
      if (selectedSiteIds.length === 0) return `${durationLabel} · Pick sites`;
      return `${durationLabel} · ${impact.value}`;
    }
    return `${durationLabel} · ${impact.value} · ${formatUsd(costTarget)}`;
  }, [
    costTarget,
    durationLabel,
    impact.value,
    scope,
    selectedSiteIds.length,
    specificPhase,
  ]);

  const nextCtaLabel = "Continue";

  const focusOption = useCallback((index: number) => {
    optionRefs.current[index]?.focus();
  }, []);

  const selectScope = useCallback((next: "all" | "specific") => {
    setScope((current) => {
      if (current === next) {
        setSpecificPhase("sites");
        setActiveSuggestions([]);
        return null;
      }
      if (next === "specific") {
        setSpecificPhase("sites");
        setSpecificTab("location");
        setSpecificTouched(false);
        setActiveSuggestions([]);
      }
      if (next === "all") {
        setGoalTouched(false);
        setSpecificPhase("sites");
      }
      return next;
    });
    setChoiceTouched(true);
  }, []);

  const toggleSuggestion = useCallback((value: string) => {
    setActiveSuggestions((current) =>
      current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value],
    );
  }, []);

  const confirmSpecificSites = useCallback(() => {
    if (!specificComplete) {
      setSpecificTouched(true);
      return;
    }
    setSpecificPhase("goal");
    setGoalTouched(false);
  }, [specificComplete]);

  const onScopeKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const option = index === 0 ? "all" : "specific";
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      const next = (index + 1) % 2;
      selectScope(next === 0 ? "all" : "specific");
      focusOption(next);
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      const previous = index === 0 ? 1 : 0;
      selectScope(previous === 0 ? "all" : "specific");
      focusOption(previous);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectScope(option);
    }
  };

  const toggleSite = (id: string) => {
    setSpecificTouched(true);
    setSelectedSiteIds((current) => {
      const exists = current.includes(id);
      const next = exists ? current.filter((value) => value !== id) : [...current, id];
      if (!exists && next.length === 1) setPrimarySiteId(id);
      if (exists && primarySiteId === id && next.length > 0) setPrimarySiteId(next[0]);
      if (next.length === 0) setPrimarySiteId("");
      return next;
    });
  };

  useEffect(() => {
    if (!showCostGoal) return;
    const timer = window.setTimeout(() => costInputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [showCostGoal]);

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden bg-[#FAFAFA] text-[#111]"
      style={{
        fontFamily: "var(--font-ibm-plex-sans), system-ui, sans-serif",
      }}
    >
      <header className="shrink-0 px-8 pb-0 pt-4">
        <div className="flex items-center justify-between gap-4 pb-4">
          <p className="text-[12px] font-medium text-[#6B7280]">
            Step {CURRENT_STEP + 1} of {STEPS.length}
          </p>
          <p className="text-[12px] font-medium text-[#9CA3AF]">
            {STEPS[CURRENT_STEP].label}
          </p>
        </div>
        <div className="relative h-px bg-[#ECEEF2]">
          <div
            className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 gap-1.5"
            role="progressbar"
            aria-valuenow={CURRENT_STEP + 1}
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-label="Plan creation progress"
          >
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index <= CURRENT_STEP ? "bg-[#6366F1]" : "bg-[#E5E7EB]"
                }`}
                title={step.label}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main — same 46/54 shell as Plan particulars; minmax(0) locks column width */}
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,46fr)_minmax(0,54fr)] gap-6 px-8 py-5">
        <div className="flex min-h-0 min-w-0 flex-col border-r border-[#ECEEF2] pr-6">
          <h1 className="shrink-0 text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] text-[#111]">
            Where should this plan apply?
          </h1>

          <div
            className="mt-5 shrink-0 space-y-2.5"
            role="radiogroup"
            aria-labelledby={groupId}
          >
            <span id={groupId} className="sr-only">
              Location scope
            </span>

            {(
              [
                {
                  id: "all" as const,
                  title: "All locations, all business lines",
                  subtitle: "Full org footprint",
                  icon: "doc" as const,
                },
                {
                  id: "specific" as const,
                  title: "Specific location / business line",
                  subtitle: "Pick sites first",
                  icon: "pin" as const,
                },
              ] as const
            ).map((option, index) => {
              const selected = scope === option.id;
              return (
                <button
                  key={option.id}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => selectScope(option.id)}
                  onKeyDown={(event) => onScopeKeyDown(event, index)}
                  className={`box-border flex min-h-[64px] w-full max-w-full items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-left transition-[background-color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A5B4FC] ${
                    selected
                      ? "border-[#6366F1] bg-[#EEF2FF]"
                      : "border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]"
                  }`}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center self-center">
                    <Image
                      src={
                        option.icon === "doc"
                          ? ALL_LOCATIONS_ICON_SRC
                          : SPECIFIC_LOCATIONS_ICON_SRC
                      }
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 object-contain"
                      aria-hidden
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold leading-snug text-[#111]">
                      {option.title}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-[#6B7280]">
                      {option.subtitle}
                    </span>
                  </span>
                  {option.id === "specific" && !selected ? (
                    <ChevronRight
                      className="size-4 shrink-0 self-center text-[#9CA3AF]"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  ) : (
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center self-center rounded-full ${
                        selected ? "bg-[#6366F1] text-white" : "bg-white ring-1 ring-[#D1D5DB]"
                      }`}
                      aria-hidden
                    >
                      {selected ? <Check className="size-3" strokeWidth={3} /> : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 min-h-[18px] shrink-0">
            {showChoiceError ? (
              <p className="text-[12px] font-medium text-[#DC2626]">
                Choose a location scope.
              </p>
            ) : showSpecificError ? (
              <p className="text-[12px] font-medium text-[#DC2626]">
                Select at least one site.
              </p>
            ) : showGoalError ? (
              <p className="text-[12px] font-medium text-[#DC2626]">
                Enter a cost goal.
              </p>
            ) : null}
          </div>

          <div className="mt-auto rounded-xl bg-white px-4 py-3 ring-1 ring-[#E5E7EB]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[#111]">
                  {planName.trim() || "Untitled plan"}
                </p>
                <p className="mt-1 truncate text-[12px] text-[#6B7280]">{summaryLine}</p>
              </div>
              {scope !== null ? (
                <span className="shrink-0 rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[12px] font-semibold text-[#4F46E5]">
                  {impact.chip}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* RIGHT — empty | All→cost | Specific→sites then cost */}
        <div className="relative min-h-0 min-w-0 overflow-hidden rounded-2xl bg-[#F5F3FF]">
          {scope === null ? (
            <>
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-[-6%]">
                  <Image
                    src={SALTMINE_PLAN_ILLUSTRATION_SRC}
                    alt="Global locations preview"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>
              </div>

              <div className="absolute inset-x-0 -bottom-px z-20 rounded-b-2xl bg-white/95 px-5 py-4 backdrop-blur-sm">
                <p className="text-[13px] font-semibold text-[#111]">Pick a location scope</p>
                <p className="mt-1 text-[12px] text-[#6B7280]">Then continue.</p>
              </div>
            </>
          ) : showCostGoal ? (
            <div className="flex h-full flex-col bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#111]">
                    Cost goal
                  </h2>
                  {scope === "specific" ? (
                    <button
                      type="button"
                      onClick={() => setSpecificPhase("sites")}
                      className="mt-1 text-[12px] font-medium text-[#4F46E5] hover:text-[#4338CA]"
                    >
                      ← Edit locations
                    </button>
                  ) : null}
                </div>
                <div
                  className="flex shrink-0 rounded-full bg-[#F3F4F6] p-0.5"
                  role="group"
                  aria-label="Goal unit"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setGoalUnit("percent");
                      setGoalEditing(false);
                      const capped = targetFromPercent(costPercent);
                      setCostTarget(capped);
                      syncCostDraft(capped, "percent");
                    }}
                    className={`rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors ${
                      goalUnit === "percent"
                        ? "bg-white text-[#4F46E5] shadow-sm"
                        : "text-[#6B7280] hover:text-[#111]"
                    }`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGoalUnit("number");
                      setGoalEditing(false);
                      syncCostDraft(costTarget, "number");
                    }}
                    className={`rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors ${
                      goalUnit === "number"
                        ? "bg-white text-[#4F46E5] shadow-sm"
                        : "text-[#6B7280] hover:text-[#111]"
                    }`}
                  >
                    123
                  </button>
                </div>
              </div>

              <div
                className="mt-8 rounded-2xl bg-[#F8F7FF] px-4 py-5 ring-1 ring-[#E0E7FF]"
                onClick={() => costInputRef.current?.focus()}
              >
                <label className="sr-only" htmlFor={`${groupId}-cost-target`}>
                  Cost goal target
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={
                      goalUnit === "percent"
                        ? "Decrease target by 5 percent"
                        : "Decrease target by 1000"
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      nudgeCostTarget(-1);
                    }}
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[16px] font-semibold text-[#4F46E5] ring-1 ring-[#E5E7EB] transition-colors hover:bg-[#EEF2FF]"
                  >
                    −
                  </button>
                  <input
                    ref={costInputRef}
                    id={`${groupId}-cost-target`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9$,% ]*"
                    autoComplete="off"
                    value={displayedTarget}
                    onFocus={() => {
                      setGoalEditing(true);
                      setCostDraft(
                        goalUnit === "percent"
                          ? String(costPercent)
                          : String(costTarget),
                      );
                    }}
                    onChange={(event) => {
                      setGoalEditing(true);
                      setGoalTouched(true);
                      if (goalUnit === "percent") {
                        const raw = event.target.value.replace(/[^\d]/g, "");
                        if (!raw) {
                          setCostDraft("");
                          return;
                        }
                        setCostDraft(`${clampPercent(Number.parseInt(raw, 10))}%`);
                        return;
                      }
                      const digits = event.target.value.replace(/[^\d]/g, "");
                      setCostDraft(digits);
                    }}
                    onBlur={commitCostDraft}
                    onKeyDown={(event) => {
                      if (
                        event.key.length === 1 &&
                        /[a-zA-Z]/.test(event.key) &&
                        !event.ctrlKey &&
                        !event.metaKey
                      ) {
                        event.preventDefault();
                        return;
                      }
                      if (event.key === "Enter") {
                        event.preventDefault();
                        commitCostDraft();
                        costInputRef.current?.blur();
                      }
                      if (event.key === "Escape") {
                        event.preventDefault();
                        setGoalEditing(false);
                        syncCostDraft(costTarget);
                        costInputRef.current?.blur();
                      }
                      if (event.key === "ArrowUp") {
                        event.preventDefault();
                        nudgeCostTarget(1);
                      }
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        nudgeCostTarget(-1);
                      }
                    }}
                    className="min-w-0 flex-1 border-0 bg-transparent p-0 text-center text-[28px] font-semibold tabular-nums tracking-tight text-[#111] outline-none"
                  />
                  <button
                    type="button"
                    aria-label={
                      goalUnit === "percent"
                        ? "Increase target by 5 percent"
                        : "Increase target by 1000"
                    }
                    disabled={goalUnit === "percent" && costPercent >= 100}
                    onClick={(event) => {
                      event.stopPropagation();
                      nudgeCostTarget(1);
                    }}
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[16px] font-semibold text-[#4F46E5] ring-1 ring-[#E5E7EB] transition-colors hover:bg-[#EEF2FF] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="mt-4 text-center text-[13px] text-[#6B7280]">
                from {formatUsd(COST_BASELINE)}
                <span className="mx-1.5 text-[#D1D5DB]">·</span>
                <span className="font-medium text-[#4F46E5]">
                  {costGap === 0
                    ? "no change"
                    : `${costPercent >= 0 ? "+" : ""}${costPercent}%`}
                </span>
              </p>

              <p className="mt-auto text-[12px] text-[#9CA3AF]">
                {scope === "all"
                  ? "Applies to all sites"
                  : `Applies to ${selectedSiteIds.length} site${selectedSiteIds.length === 1 ? "" : "s"}`}
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col bg-[#F3F4F8]/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <div
                  className="flex rounded-lg bg-[#E5E7EB]/70 p-0.5"
                  role="tablist"
                  aria-label="Specific scope tabs"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={specificTab === "location"}
                    onClick={() => setSpecificTab("location")}
                    className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      specificTab === "location"
                        ? "bg-white text-[#111] shadow-sm"
                        : "text-[#6B7280] hover:text-[#111]"
                    }`}
                  >
                    Location
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={specificTab === "business"}
                    onClick={() => setSpecificTab("business")}
                    className={`rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      specificTab === "business"
                        ? "bg-white text-[#111] shadow-sm"
                        : "text-[#6B7280] hover:text-[#111]"
                    }`}
                  >
                    Business line
                  </button>
                </div>
                <button
                  type="button"
                  onClick={confirmSpecificSites}
                  disabled={!specificComplete}
                  className="rounded-lg bg-[#6366F1] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-white transition-colors hover:bg-[#4F46E5] disabled:cursor-not-allowed disabled:bg-[#C7D2FE]"
                >
                  Done
                </button>
              </div>

              {specificTab === "location" ? (
                <>
                  <div className="relative mt-3 shrink-0">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search for a location..."
                      className="w-full rounded-xl border-0 bg-white py-2.5 pl-10 pr-3 text-[13px] font-medium text-[#111] outline-none ring-1 ring-[#E5E7EB] placeholder:text-[#C4C9D4] focus:ring-[#A5B4FC]"
                    />
                  </div>

                  <div className="mt-3 shrink-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF]">
                      Suggestion
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {SUGGESTIONS.map((suggestion) => {
                        const active = activeSuggestions.includes(suggestion);
                        return (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => toggleSuggestion(suggestion)}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.02em] transition-colors ${
                              active
                                ? "bg-[#6366F1] text-white"
                                : "bg-white text-[#6B7280] ring-1 ring-[#E5E7EB] hover:text-[#111]"
                            }`}
                          >
                            {suggestion}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {activeSuggestions.length > 0 ? (
                    <div className="mt-2.5 flex shrink-0 flex-wrap gap-1.5">
                      {activeSuggestions.map((suggestion) => (
                        <button
                          key={`active-${suggestion}`}
                          type="button"
                          onClick={() => toggleSuggestion(suggestion)}
                          className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-semibold uppercase text-[#4F46E5]"
                        >
                          {suggestion}
                          <X className="size-3" strokeWidth={2.5} aria-hidden />
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div className="no-scrollbar mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain px-0.5 py-0.5">
                    {filteredSites.map((site) => {
                      const selected = selectedSiteIds.includes(site.id);
                      return (
                        <button
                          key={site.id}
                          type="button"
                          onClick={() => toggleSite(site.id)}
                          className={`flex w-full shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                            selected
                              ? "bg-white ring-1 ring-[#C7D2FE]"
                              : "bg-white/70 ring-1 ring-transparent hover:bg-white"
                          }`}
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#6366F1]">
                            <MapPin className="size-4" strokeWidth={2} aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-[#111]">
                              {site.name}
                            </span>
                            <span className="block truncate text-[12px] text-[#6B7280]">
                              {site.region}
                            </span>
                          </span>
                          <span
                            className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${
                              selected
                                ? "border-[#6366F1] bg-[#6366F1] text-white"
                                : "border-[#D1D5DB] bg-white"
                            }`}
                            aria-hidden
                          >
                            {selected ? <Check className="size-3" strokeWidth={3} /> : null}
                          </span>
                        </button>
                      );
                    })}
                    {filteredSites.length === 0 ? (
                      <p className="px-1 py-3 text-[12px] text-[#9CA3AF]">No locations match.</p>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="mt-8 flex flex-1 flex-col items-center justify-center px-4 text-center">
                  <p className="text-[14px] font-semibold text-[#111]">Business lines</p>
                  <p className="mt-2 text-[12px] leading-5 text-[#6B7280]">
                    Choose locations first, then set business lines in the next step.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="sticky bottom-0 z-20 flex min-h-[64px] shrink-0 items-center justify-between gap-3 border-t border-[#ECEEF2] bg-[#FAFAFA] px-8 py-3">
        <button
          type="button"
          className="rounded-lg px-3 py-2 text-[13px] font-medium text-[#6B7280] transition-colors hover:bg-white hover:text-[#111]"
        >
          Save draft
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (scope === "specific" && specificPhase === "goal") {
                setSpecificPhase("sites");
                return;
              }
              onBack?.();
            }}
            className="rounded-xl px-5 py-2.5 text-[14px] font-semibold text-[#6B7280] ring-1 ring-[#E5E7EB] transition-colors hover:bg-white hover:text-[#111]"
          >
            Back
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => {
              if (!canContinue) {
                if (scope === null) setChoiceTouched(true);
                else if (scope === "specific" && specificPhase === "sites") {
                  setSpecificTouched(true);
                } else setGoalTouched(true);
                return;
              }
              onContinue?.();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-6 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(99,102,241,0.28)] transition-all duration-200 hover:bg-[#4F46E5] hover:shadow-[0_8px_20px_rgba(99,102,241,0.32)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#C7D2FE] disabled:shadow-none"
          >
            {nextCtaLabel}
            <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </footer>
    </div>
  );
}
