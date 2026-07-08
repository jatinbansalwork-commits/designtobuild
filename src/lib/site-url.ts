export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function getDetailPath(slug: string) {
  return `/detail/${slug}`;
}

export function getDetailShareUrl(slug: string, origin?: string) {
  const base = origin ?? getSiteUrl();
  return `${base.replace(/\/$/, "")}${getDetailPath(slug)}`;
}

export function getKalashAppUrl() {
  if (process.env.NEXT_PUBLIC_KALASH_APP_URL) {
    return process.env.NEXT_PUBLIC_KALASH_APP_URL;
  }
  return getSiteUrl();
}
