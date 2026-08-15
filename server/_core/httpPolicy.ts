const DEFAULT_DEVELOPMENT_ORIGIN = "http://localhost:3000";

const SUPPORTED_COUNTRY_HEADERS = new Set([
  "cf-ipcountry",
  "x-vercel-ip-country",
  "x-country-code",
]);

export function parseAllowedOrigins(rawOrigins?: string) {
  const source = rawOrigins ?? DEFAULT_DEVELOPMENT_ORIGIN;
  return new Set(
    source
      .split(",")
      .map(origin => origin.trim())
      .filter(Boolean),
  );
}

export function isAllowedBrowserOrigin(origin: string | undefined, allowedOrigins: Set<string>) {
  return Boolean(origin && allowedOrigins.has(origin));
}

/**
 * Country headers are accepted only after the hosting configuration explicitly
 * identifies one trusted proxy header. Direct Railway traffic leaves this unset
 * and intentionally returns no country aggregation rather than trusting a
 * client-supplied value.
 */
export function normalizeTrustedCountryHeader(headerName?: string) {
  const normalized = headerName?.trim().toLowerCase();
  return normalized && SUPPORTED_COUNTRY_HEADERS.has(normalized)
    ? normalized
    : null;
}
