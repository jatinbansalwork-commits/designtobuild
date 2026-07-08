import type { ReactNode } from "react";
import Image from "next/image";
import type { DetailItem } from "@/lib/details-data";
import { DetailProjectTitle } from "@/components/detail-project-title";
import { getProjectFilterLabel } from "@/lib/portfolio-filters";

function EditorNoteText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <p className="text-base leading-relaxed text-text-secondary">
      {parts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code
            key={index}
            className="rounded bg-surface-hover px-1.5 py-0.5 font-mono text-[0.92em] text-text-primary"
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
}: {
  icon?: ReactNode;
  label: string;
  href?: string;
}) {
  const className =
    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-none border border-border bg-surface-hover px-3 py-1.5 text-xs font-medium text-text-secondary";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} transition-colors hover:bg-surface-tertiary`}
      >
        {icon}
        {label}
      </a>
    );
  }

  return (
    <span className={className}>
      {icon}
      {label}
    </span>
  );
}

/** Structured popup footer — name, tags, editor note, date. */
export function DetailPopupMeta({ detail }: { detail: DetailItem }) {
  const portfolioTag = getProjectFilterLabel(detail);
  const note = detail.editorNote ?? detail.description;

  return (
    <div className="relative flex flex-col gap-4 px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
      <div className="space-y-4">
        <DetailProjectTitle
          detail={detail}
          as="h2"
          className="text-2xl font-medium tracking-tight text-text-primary sm:text-[1.75rem]"
        />

        <div className="flex flex-wrap items-center gap-2">
          {detail.categories.map((category) => (
            <MetaTagPill key={category} label={category} />
          ))}
          {portfolioTag ? <MetaTagPill label={portfolioTag} /> : null}
          {detail.extraTags?.map((tag) => (
            <MetaTagPill key={tag} label={tag} />
          ))}
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
            />
          ) : null}
        </div>

        {note ? <EditorNoteText text={note} /> : null}
      </div>

      <div className="border-t border-border pt-6 text-sm text-text-secondary">
        <time dateTime={detail.date}>{detail.date}</time>
      </div>
    </div>
  );
}
