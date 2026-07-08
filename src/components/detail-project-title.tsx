import type { DetailItem } from "@/lib/details-data";

interface DetailProjectTitleProps {
  detail: DetailItem;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function DetailProjectTitle({
  detail,
  className = "text-xl font-medium tracking-tight text-text-primary",
  as: Tag = "h3",
}: DetailProjectTitleProps) {
  const href = detail.projectUrl ?? detail.sourceUrl;

  if (!href) {
    return <Tag className={className}>{detail.title}</Tag>;
  }

  return (
    <Tag className={className}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-inherit transition-colors hover:text-text-secondary hover:underline"
      >
        {detail.title}
      </a>
    </Tag>
  );
}
