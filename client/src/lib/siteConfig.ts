/** Himalayan Letterpress: one authoritative production identity for every public route and metadata surface. */
export const siteConfig = {
  name: "Sangeet Ghar",
  origin: "https://sangeet.pravingyawali.com.np/",
  description: "A digital listening room for timeless Nepali classical music, traditional Nepali songs, and old songs—available to listeners everywhere.",
  socialImage: "/manus-storage/sangeet-ghar-social-card_dbc58915.jpg",
  logo: "/manus-storage/sangeet-ghar-logo_eb966bc7.webp",
  generalEmail: "admin@pravingyawali.com.np",
  rightsEmail: "support@pravingyawali.com.np",
  playlistId: "PLAlwzcwDUjBA",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.origin).toString();
}
