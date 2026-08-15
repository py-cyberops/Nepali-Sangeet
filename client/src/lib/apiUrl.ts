/** Build the tRPC endpoint without requiring the browser bundle to know server secrets. */
export function buildTrpcUrl(apiBaseUrl?: string) {
  const baseUrl = apiBaseUrl?.trim().replace(/\/+$/, "") ?? "";
  return `${baseUrl}/api/trpc`;
}

/**
 * The public listening room does not require cross-origin cookies. Retain the
 * existing same-origin development behavior, while avoiding needless browser
 * credential traffic when Pages calls the separate production API host.
 */
export function shouldIncludeApiCredentials(apiBaseUrl?: string) {
  return (apiBaseUrl?.trim() ?? "") === "";
}
