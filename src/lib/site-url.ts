export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function getDetailPath(slug: string) {
  return `/detail/${slug}`;
}

export function getDetailShareUrl(slug: string, origin?: string) {
  const base = origin ?? getSiteUrl();
  return `${base.replace(/\/$/, "")}${getDetailPath(slug)}`;
}

export function getKalashAppUrl() {
  return process.env.NEXT_PUBLIC_KALASH_APP_URL ?? "http://localhost:3001";
}
