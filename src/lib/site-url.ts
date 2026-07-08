const PRODUCTION_SITE_URL = "https://design-to-build.vercel.app";

function normalizeOrigin(url: string) {
  return url.replace(/\/$/, "");
}

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  }

  // Prefer the stable production domain over ephemeral Vercel preview hosts.
  // Preview deployments still work locally via NEXT_PUBLIC_SITE_URL override.
  if (process.env.VERCEL_ENV === "production" || process.env.VERCEL) {
    return PRODUCTION_SITE_URL;
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
  return `${normalizeOrigin(base)}${getDetailPath(slug)}`;
}

export function getAbsoluteUrl(pathname: string, origin?: string) {
  const base = origin ?? getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${normalizeOrigin(base)}${path}`;
}

export function getKalashAppUrl() {
  if (process.env.NEXT_PUBLIC_KALASH_APP_URL) {
    return process.env.NEXT_PUBLIC_KALASH_APP_URL;
  }
  return getSiteUrl();
}
