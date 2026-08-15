# Sangeet Ghar Production Upgrade Tasks

The canonical production origin is **https://sangeet.pravingyawali.com.np/**. It must be the only public URL represented in output metadata, structured data, the sitemap, robots, and application configuration.

## Split-deployment implementation

- [x] Add one authoritative static copy of each of the five immutable listening-room assets under `client/public/manus-storage/`, retaining the exact existing public asset URLs.
- [x] Add public `VITE_API_BASE_URL` support to the tRPC client while preserving same-origin local development.
- [x] Add restrictive origin-based CORS, a conservative API rate limit, trusted single-proxy support, a health endpoint, and production-safe API errors in Express.
- [x] Preserve public listener presence and its privacy thresholds while restricting country aggregation to an explicitly trusted proxy header.
- [x] Add focused unit tests for API-origin resolution and API middleware policy.
- [x] Verify production assets in `dist/public/manus-storage`, TypeScript, unit tests, production build, local production runtime, listener presence, and unchanged visual interactions.
- [x] Update deployment documentation with actual completed source changes, required production variables, country-header behavior, and remaining account-level steps.

## Static asset optimization for independent hosting

- [x] Inspect original image, audio, and font characteristics and establish quality-safe target formats and sizes.
- [x] Optimize the logo, social card, tuning sound, hero artwork, and Ranjana font for checkpoint-safe static delivery without replacing their content.
- [x] Update only the asset references required by any format changes while preserving stable runtime paths where practical.
- [x] Compare optimized assets against originals for visual/audio/font fidelity and verify the five static runtime paths in development and production builds.
- [x] Save a checkpoint for the optimized split-deployment state after the final build and asset-size verification.

## Cloudflare Pages deployment handoff

- [x] Remove the “The Sound of Nepali Radio” bilingual editorial folio and its dedicated styling, restoring the original post-player page flow.
- [x] Inspect the package, build, server, environment, and static-output configuration without modifying the repository.
- [x] Determine whether the existing anonymous presence API can operate separately from a Cloudflare Pages static frontend.
- [x] Prepare a project-specific Cloudflare Pages Free, DNS, HTTPS, SEO, and production testing guide without deploying or changing DNS.

### Deployment research record

Cloudflare Pages Git integration is configured from **Workers & Pages → Create application → Pages → Connect to Git**. Its build image supports version pinning through `NODE_VERSION` and `PNPM_VERSION`; the current Pages build image documents Node 22.16.0 and pnpm 10.11.1 as defaults, while this project declares pnpm 10.4.1 and was validated under Node 22.13.0. Pages treats a project without a root `404.html` as an SPA, so the existing Wouter routes can fall back to `index.html`. For a Pages custom subdomain, first use the project’s **Custom domains → Set up a domain** flow; if the parent zone is not on Cloudflare, create the instructed CNAME only after association. Sources: https://developers.cloudflare.com/pages/get-started/git-integration/, https://developers.cloudflare.com/pages/configuration/build-configuration/, https://developers.cloudflare.com/pages/configuration/build-image/, https://developers.cloudflare.com/pages/configuration/custom-domains/, and https://developers.cloudflare.com/pages/configuration/serving-pages/.

The user-provided GitHub URL `https://github.com/py-cyberops/Nepali-Sangeet` currently returned a public GitHub 404 in the unauthenticated browser. It may be private, not yet created, or unavailable to the current session; the guide therefore provides the exact remote command but does not assume public repository access.

## Public launch-candidate verification

- [x] Explicitly validate radio-dial bounds, no-scroll behavior, and no-jump behavior for pointer interaction.
- [x] Force a missing track-artwork case and verify that the branded fallback appears without a broken image.
- [x] Guard the radio dial’s pointer-capture call so non-active synthetic pointer events cannot create a client error.
- [x] Review the full launch-candidate specification and preserve the existing single-room product direction.
- [x] Add one concise, original bilingual editorial folio titled “The Sound of Nepali Radio” without unverified historical claims.
- [x] Audit every production-domain reference in application configuration, canonical metadata, social metadata, structured data, sitemap, robots, and absolute links.
- [ ] Verify production-hostname DNS, TLS, redirects, static assets, homepage, and public routes without claiming launch readiness if the domain is unresolved.
- [x] Verify player fallback, radio dial boundaries/input modes, artwork fallback, and privacy-preserving listener presence in available environments.
- [x] Document real-device/browser and multi-listener presence checks that must be performed after the production hostname is live.

### Editorial source note

The radio folio will limit its historical statements to Radio Nepal’s own organizational overview: Radio Nepal dates to 2 April 1951; it broadcasts on Medium Wave and FM; its Singha Durbar music library holds about 40,000 songs; and it has begun digitizing older analog-reel recordings. Source: https://radionepal.gov.np/en/organizational-overview/.

### Deployment status

As of the launch-candidate audit, `sangeet.pravingyawali.com.np` returns `ERR_NAME_NOT_RESOLVED` in both browser and resolver-level checks. Production DNS, TLS, redirects, assets, and public-route testing cannot be completed until the hostname is pointed at the published deployment.

### Rendered metadata validation

The current build rendered the canonical and Open Graph URLs as `https://sangeet.pravingyawali.com.np/`, emitted a `summary_large_image` Twitter card, exposed valid JSON-LD, and contained the full crawlable “The Sound of Nepali Radio” editorial folio.

The active track image was forced into its error path during browser validation; the image element was replaced by the branded `artwork-fallback` state, leaving no broken image in the player.

The dial’s Home and End keys correctly clamp its accessible readout to FM 88.0 and FM 108.0. With focus stabilized using `preventScroll`, key-driven tuning leaves page scroll unchanged. Direct pointer validation confirmed no frequency jump at drag start, FM 88.0/108.0 clamp behavior for extreme drag distances, unchanged page scroll, and computed `touch-action: none` on the dial.

### External launch gates after DNS is live

Use real Chrome, Firefox, Safari, Chrome Android, and Safari iOS sessions to confirm user-initiated YouTube playback, the blocked-autoplay fallback, transport controls, volume/mute, progress, shuffle, loop, transitions, metadata, artwork, retry handling, dial audio, and touch dragging. Use several separate browser sessions—preferably from distinct networks—to confirm explicit-start presence admission, sustained-playback counting, session expiry, country thresholds, and no personal data exposure. These checks cannot be honestly completed while the canonical hostname has no DNS record.

## Radio tuning-dial replacement

- [x] Upload and use the user-provided vintage radio-room artwork as the primary hero atmosphere, preserving the art’s visible radio, window, lamp, cassette, and Nepali visual details.
- [x] Remove the Sangeet Bell component, sound asset reference, server bell event path, bell database table, and all bell-specific copy.
- [x] Add one tactile, pointer- and keyboard-accessible old Nepali radio tuning dial that uses drag, click, and arrow-key input without changing the music playlist.
- [x] Add a non-dashboard analog FM/AM tuning window, Devanagari station marks, mechanical settling, and a restrained room/radio response.
- [x] Add an original low-volume tuning-click accent that respects the player’s volume and mute state.
- [x] Preserve anonymous presence as independent of the dial interaction and revise privacy content to remove bell-event language.
- [x] Validate radio-dial behavior across desktop, tablet, mobile, keyboard, reduced motion, and playback-fallback states.

Keyboard validation confirmed that the radio dial is discoverable as an accessible slider and responds to Arrow keys by advancing the analog readout from FM 96.6 to FM 96.8, with a corresponding mechanical frequency indicator update. This interaction is cosmetic only and does not alter the YouTube playlist or shared-listener state.

Pointer validation confirmed that the physical dial accepts a drag gesture, maintains a stable analog frequency display after settling, and leaves both music playback and shared-listener presence unchanged.

After adding the pointer-capture guard, a synthetic pointer sequence dispatched without the prior `setPointerCapture` exception. Real touch-device validation remains an external launch gate.

Final validation confirmed that the rendered page contains no bell component and that the radio-dial stylesheet carries an explicit `prefers-reduced-motion` override. The user explicitly authorized deletion of the empty legacy `room_bell_events` table, and the retired `bellLastRung` column was also removed.

## Shared listening and Nepali typography enhancement

- [x] Review both complete enhancement specifications and reconcile their shared-listening, privacy, interaction, typography, and performance requirements.
- [x] Add a privacy-preserving anonymous presence system that reports real active sessions rather than fabricated counts.
- [x] Aggregate country-level presence only; never expose raw IP addresses, exact locations, or low-volume personal-location detail.
- [x] Add a small ambient listener-count and listening-from treatment near the player without creating a social feed or dashboard.
- [x] Implement exactly one primary physical-feeling interaction, selected for cultural fit and restrained sound/motion behavior.
- [x] Use only legally available, Unicode-compatible Nepali typography and avoid legacy-encoded font failures.
- [x] Add an authentic bilingual typographic hierarchy and subtle Ranjana-inspired motif without using unreadable decorative text for controls or long copy.
- [x] Update privacy disclosures for presence processing and test mobile, reduced-motion, keyboard, and fallback behavior.

## Typography research record

Google Fonts presents **Tiro Devanagari Hindi** as a readable Devanagari family with regular and italic styles, and its catalog is described as open source. It will remain the Unicode-compatible Nepali text layer for readable content. The **Nithya Ranjana** repository confirms SIL Open Font License v1.1, offers Devanagari-Unicode and Newa-Unicode variants, and explains that Ranjana itself does not currently have a Unicode encoding. A Devanagari-Unicode Nithya Ranjana font may therefore be used only for short, decorative Nepali brand words with accessible plain-text equivalents; it will not be used for body copy, controls, or SEO-critical copy. Exact legacy Kantipur/Himalaya fonts will not be bundled without a confirmed web license and Unicode compatibility. Sources: https://fonts.google.com/specimen/Tiro+Devanagari+Hindi and https://github.com/EkType/Nithya-Ranjana.

## Presence architecture decision

Presence uses the newly enabled tRPC and database layer, not fake client-side counters. The browser generates one opaque, first-party anonymous room token shared across its open tabs; the server stores only that token, the most recent heartbeat, and an optional trusted-proxy country code. No raw IP address, name, account, email, coordinates, or exact location is collected. A session counts only after real player state becomes `playing`, emits a heartbeat approximately every 25 seconds, and expires after 90 seconds without a heartbeat. Country names publish only as country-level aggregates and only when at least three listeners are active and a country has at least two active sessions. Presence queries naturally exclude expired rows and perform opportunistic cleanup; no background job is required.

## Playback decisions

The expanded provider will use the official YouTube IFrame Player API methods for current time, duration, volume, mute, playlist navigation, playlist index, and playlist shuffle. The visible loop-current-track control will be implemented by responding to the official ended state with a seek-to-zero and replay of the active embed; it will take priority before normal or shuffled navigation. Progress will be treated as informational by default and will only become seekable when the active player reports a finite duration. Track artwork will be an application-owned display layer, resolving the current YouTube video ID to a remote YouTube thumbnail when available and falling back to the existing branded artwork when it is not.

## External validation note

The configured production hostname did not resolve from the current environment during validation. The development embed also presented a YouTube sign-in / anti-bot prompt, so end-to-end audio behavior remains dependent on a real browser session, production DNS, and YouTube availability. The application therefore provides its own artwork, metadata fallback, controlled retry state, and user-facing fallback language rather than exposing the third-party prompt.

During development validation, the embed could emit a paused state while the YouTube prompt remained on screen. The playback guard now resolves only after the official playing state, allowing autoplay to become the branded tap-to-start fallback and a failed user-initiated attempt to become the branded retry state.

The same development embed could briefly report playback before returning to a zero-time loading state. The provider now detects that no-progress loading condition and re-arms the appropriate fallback without exposing the underlying third-party prompt.

The branded autoplay fallback was validated in the development build: it presents “Tap to let the room play” and preserves the player artwork and controls. The automated browser remains subject to YouTube’s anti-bot handling and may not count synthetic input as a qualifying user gesture, so successful audio start must still be verified in a normal real-user browser after the production hostname is live.

Historical note: an earlier bell interaction was tested independently of the blocked YouTube embed. It has since been removed from the client, server, schema, data model, and public experience; the radio dial is now the sole physical-style interaction.

- [x] Create a centralized, typed site configuration for the final public origin, brand description, and playlist identifiers.
- [x] Add a restrained, synchronized volume range control and mute/unmute control, with accessible labels and honest provider fallback behavior.
- [x] Add a loop-current-track control whose state persists during the listening session and takes priority at track end.
- [x] Add a true in-memory shuffle sequence with history-aware Previous and sequence-aware Next navigation, avoiding immediate duplicate selections.
- [x] Add a lightweight track-progress indicator that follows real provider time when available and does not imply unsupported precision.
- [x] Replace all remaining placeholder domain references with the exact canonical public URL.
- [x] Create `/about`, `/privacy`, and `/contact` routes using the established Himalayan Letterpress visual system.
- [x] Confirm the real rights/general-inquiry contact destination; do not invent an email address or other contact method.
- [x] Add clear, accurate YouTube embedding and rights-holder disclosures on the relevant public pages.
- [x] Add `sitemap.xml` containing only `/`, `/about`, `/privacy`, and `/contact` at the final HTTPS origin.
- [x] Update `robots.txt` to permit these routes and name the final absolute sitemap URL.
- [x] Ensure homepage title, description, canonical, Open Graph, Twitter, and JSON-LD use the production domain and accurately describe visible content.
- [x] Keep `MusicPlaylist` schema minimal and do not invent tracks, artist details, ratings, or popularity data.
- [x] Strengthen the provider state machine: initialization, metadata fallback, autoplay-blocked prompt, retry path, unavailable state, and end-of-track behavior.
- [x] Preserve the hidden privacy-enhanced YouTube embed; do not add library browsing, direct selection, or YouTube-derived redistributive behavior.
- [x] Complete keyboard, focus, touch-target, contrast, live-announcement, and reduced-motion checks across the added routes.
- [x] Reduce avoidable blocking work and retain the lightweight dependency footprint.
- [x] Validate the desktop, tablet, mobile, fallback, public-route, metadata, social-preview, and runtime console experiences.
- [x] Run production type/build checks, then save a production-upgrade checkpoint.

## Final enhancement validation

- [x] Validate the shared-listening and public-route layout at a tablet viewport.
- [x] Validate the configured social preview metadata and share-card asset are reachable from the rendered site configuration.
- [x] Re-test that a bell interaction alone cannot create an active-listener count after the sustained-playback safeguard.

Historical validation note: before the bell system was retired, a non-listening event did not enter the active-listener count. The final system contains no bell event path; only explicit, sustained verified playback can create an active-listener presence row.
