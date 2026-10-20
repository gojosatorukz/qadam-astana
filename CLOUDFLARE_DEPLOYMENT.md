# Qadam: Cloudflare free deployment profile

This profile builds the current canonical Qadam source in `../../qadam`. It serves the phone-first planner, live possibilities map and local city passport. The earlier Sites public deployment remains a preserved v15 backup; it is not republished by this profile.

Target public hostname: https://qadam-astana.pages.dev/
Backup Sites hostname: https://qadam-astana-walk.pubg-bekzat.chatgpt.site/

## Architecture

Cloudflare Pages serves the React interface, map assets, the 1,204-place source snapshot and dedicated Web Workers. Initial graph planning and walking rerouting execute in browser workers, avoiding the Free Functions CPU budget. The graph and route constraints are the same canonical Qadam implementation. Initial planning fetches the POI and graph as hashed static JSON assets inside its worker, avoiding large dynamically imported JavaScript data modules. The foreground UI has no synchronous graph-planning fallback.

Pages Functions (`_worker.js`, API-only `_routes.json`) provide a server clock and bounded Gemini interpretation/explanation endpoints. `GEMINI_API_KEY` is an encrypted runtime secret and is absent from browser bundles and source packages. Structured GPS tracking remains in browser memory. The model receives bounded query/control and canonical source-explanation inputs; the server never attests graph geometry supplied by the browser.

`src/Home.tsx` is generated from the canonical Home by replacing only the planning POST call with the fetch-compatible worker client. `scripts/prepare.mjs` checks that this adapter target still occurs exactly once. A server-synchronized monotonic clock preserves chosen deadlines; cancellation, failure and timeout terminate the owned initial-planning worker. The canonical planner validates all returned AI codes and itinerary constraints.

## Reproduce from the source ZIP

Use Node 22.13+ (verification used the existing runtime and pinned canonical dependencies):

```sh
cd qadam
npm ci
cd ..
node deploy/cloudflare/scripts/setup.mjs
cd deploy/cloudflare
npm run build
node node_modules/typescript/bin/tsc --noEmit --incremental false
node --experimental-strip-types --test tests/*.test.ts src/tests/server.test.ts
```

For local Functions testing, set `GEMINI_API_KEY` only in an ignored `.dev.vars`, then run:

```sh
node node_modules/wrangler/bin/wrangler.js pages dev dist/client --ip 127.0.0.1 --port 5175
```

For an authorized Cloudflare account, `wrangler pages secret put GEMINI_API_KEY --project-name qadam-astana` configures the production secret; `npm run deploy` publishes to the same Pages project. Keep the project name unchanged to retain its primary hostname. No paid bindings are configured.

## Verification and limits

The canonical suite passed 423/423 and the standalone API/RPC/metadata/error suite passed 29/29; TypeScript and production builds passed. This includes planning with the static `Response.json` API absent (Safari 16), safe support codes, cancellation and server-clock failures. Real browser checks exercised food interpretation with Gemini, four route choices, a return to A and an optional B, actual compiled rerouting workers, and actual iframe widths 320/390/430. The participant confirmed that routes appear on the physical iPhone after switching worker data imports to JSON assets. Tests use synthetic public coordinates; a physical GPS/voice walk remains unverified. Publication and live verification are recorded separately in `cloudflare-deployment.json`.

Local passport/preferences stay on the device. Only a minimal preference snapshot is sent to the local planning worker, outside the public API request. A bounded ±6 soft bias never overrides time, filters, exclusions or a required POI. GPS-qualified completion is the only source of passport progress. The possibilities map uses cached endpoint search trees, raw JSON assets and no AI calls on slider changes. Past/invalid departures and expired return windows disable the map. Public city reporting is a future opt-in proposal; collection/transmission is not enabled.

The original presentation/video remain baseline v9 until the participant approves a final product version. The official application is on HOLD and has not been submitted.
