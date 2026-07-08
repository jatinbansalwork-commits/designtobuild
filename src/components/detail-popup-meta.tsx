"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import type { DetailItem } from "@/lib/details-data";
import { DetailProjectTitle } from "@/components/detail-project-title";
import {
  getProjectFilterLabel,
  isPortfolioFilter,
} from "@/lib/portfolio-filters";

type TagVariant = "domain" | "type" | "status";

function EditorNoteText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <p className="text-[15px] leading-relaxed text-text-secondary">
      {parts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code
            key={index}
            className="rounded-md bg-surface-hover px-1.5 py-0.5 font-mono text-[0.92em] text-text-primary"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </p>
  );
}

function MetaTagPill({
  icon,
  label,
  href,
  variant = "type",
  onSelect,
}: {
  icon?: ReactNode;
  label: string;
  href?: string;
  variant?: TagVariant;
  onSelect?: () => void;
}) {
  const variantClass =
    variant === "domain"
      ? "border-transparent bg-text-primary/10 text-text-primary"
      : variant === "status"
        ? "border-transparent bg-emerald-500/15 text-emerald-300"
        : "border-border/60 bg-transparent text-text-secondary";

  const className = `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors ${variantClass}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-tertiary/40`}
      >
        {icon}
        {label}
      </a>
    );
  }

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`${className} cursor-pointer hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-tertiary/40`}
      >
        {icon}
        {label}
      </button>
    );
  }

  return (
    <span className={className}>
      {icon}
      {label}
    </span>
  );
}

function getStatusTag(detail: DetailItem): string | null {
  const fromExtra = detail.extraTags?.find((tag) =>
    ["Live", "Inspired", "Coming soon"].includes(tag),
  );
  if (fromExtra) return fromExtra;
  if (/coming soon/i.test(detail.date)) return "Coming soon";
  if (detail.media.type === "color" && detail.media.mockup?.flow) return "Live";
  return null;
}

function getTypeTags(detail: DetailItem): string[] {
  return detail.categories;
}

/** Structured popup footer — name, tags, editor note, date. */
export function DetailPopupMeta({
  detail,
  onFilterSelect,
}: {
  detail: DetailItem;
  onFilterSelect?: (filter: string) => void;
}) {
  const domainTag = getProjectFilterLabel(detail);
  const typeTags = getTypeTags(detail);
  const statusTag = getStatusTag(detail);
  const note = detail.editorNote ?? detail.description;

  const statusClass =
    statusTag === "Coming soon"
      ? "border-transparent bg-amber-500/15 text-amber-200"
      : statusTag === "Inspired"
        ? "border-transparent bg-violet-500/15 text-violet-200"
        : undefined;

  return (
    <div className="relative flex flex-col px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
      <DetailProjectTitle
        detail={detail}
        as="h2"
        className="text-2xl font-medium tracking-tight text-text-primary sm:text-[1.75rem]"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {domainTag ? (
          <MetaTagPill
            label={domainTag}
            variant="domain"
            onSelect={
              onFilterSelect && isPortfolioFilter(domainTag)
                ? () => onFilterSelect(domainTag)
                : undefined
            }
          />
        ) : null}
        {typeTags.map((tag) => (
          <MetaTagPill key={tag} label={tag} variant="type" />
        ))}
        {statusTag ? (
          <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[12px] font-medium ${
              statusClass ??
              "border-transparent bg-emerald-500/15 text-emerald-300"
            }`}
          >
            {statusTag === "Live" ? (
              <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
            ) : null}
            {statusTag}
          </span>
        ) : null}
        {detail.source ? (
          <MetaTagPill
            icon={
              <Image
                src="/icon.svg"
                alt=""
                width={12}
                height={12}
                className="size-3 opacity-80"
                aria-hidden
              />
            }
            label={detail.source}
            href={detail.sourceUrl}
            variant="type"
          />
        ) : null}
      </div>

      {note ? (
        <div className="mt-5">
          <EditorNoteText text={note} />
        </div>
      ) : null}

      <div className="mt-5 flex items-center gap-2 text-[13px] text-text-tertiary">
        <time dateTime={detail.date}>{detail.date}</time>
        {domainTag ? (
          <>
            <span aria-hidden>·</span>
            <span>{domainTag}</span>
          </>
        ) : null}
        {typeTags.length > 0 ? (
          <>
            <span aria-hidden>·</span>
            <span>{typeTags.join(" · ")}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
