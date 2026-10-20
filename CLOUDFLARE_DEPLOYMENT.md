# Qadam: Cloudflare free deployment profile

Inside the source ZIP, `deploy/cloudflare/` builds the canonical Qadam source in `../../qadam`. It serves the phone-first planner, live possibilities map and local city passport. The earlier Sites public deployment remains a preserved v15 backup; it is not republished by this profile.

Target public hostname: https://qadam-astana.pages.dev/
Backup Sites hostname: https://qadam-astana-walk.pubg-bekzat.chatgpt.site/

## Published v18 identity

Canonical source commit: `e03dc88f92c465f8bb5e96e52569b89b4f236bb2`. Production deployment: `3c0aabe1-33f9-4f3d-8f9b-f33c75bf9e48`; primary hostname unchanged. Client: `/assets/index-2D4MFpyA.js`; API SHA256: `35d508943398f60be9dea68964668dddf692cd6b8efde9d402f5df5fa841bba8`.

Source ZIP: **281 entries, 2,985,114 bytes**, SHA256 `0967a575261223287e896c44407293e6b33c2f9858d99d6bd4b8b77ea890f7a3`. Runtime ZIP: **21 files, 4,005,189 bytes**, SHA256 `1066f96b77ec0443086d1a367d665be27df7a639d55151e0b0e961d91ad72276`. A clean copy of the final source archive reproduced 21/21 byte-identical runtime files with existing pinned dependencies and no env credentials. This was not a fresh `npm ci`.

## Architecture

Cloudflare Pages serves the React interface, map assets, the 1,204-place source snapshot and dedicated Web Workers. Initial graph planning and walking rerouting execute in browser workers, avoiding the Free Functions CPU budget. The graph and route constraints are the same canonical Qadam implementation. Initial planning fetches the POI and graph as hashed static JSON assets inside its worker, avoiding large dynamically imported JavaScript data modules. The foreground UI has no synchronous graph-planning fallback.

Pages Functions (`_worker.js`, API-only `_routes.json`) provide a server clock, a bounded Gemini/Workers AI intent path, and optional Gemini explanation endpoints. `GEMINI_API_KEY` is an encrypted runtime secret and is absent from browser bundles and source packages. Structured GPS tracking remains in browser memory. The model receives bounded query/control and canonical source-explanation inputs; the server never attests graph geometry supplied by the browser.

`src/Home.tsx` is generated from the canonical Home by replacing only the planning POST call with the fetch-compatible worker client. `scripts/prepare.mjs` checks that this adapter target still occurs exactly once. A server-synchronized monotonic clock preserves chosen deadlines; cancellation, failure and timeout terminate the owned initial-planning worker. The canonical planner validates all returned AI codes and itinerary constraints.

## AI policy in the v18 source

The primary is `gemini-3.1-flash-lite`, without forced temperature or a thinking override. The reserve is Google's Gemma 4 model `@cf/google/gemma-4-26b-a4b-it`, hosted through Cloudflare Workers AI's server-side `AI` binding. Reserve inference starts after 1,500 ms without a validated answer, or immediately after a primary failure. With the binding configured, the intent path makes at most one call to each provider under the original shared 20-second deadline; it does not retry Gemini after HTTP 503. The first validated contract wins, including a valid request for clarification. The loser is sent an abort signal and its late result is ignored; this is not a guarantee that a remote provider instantly stops all work.

Both paths use the same closed JSON schema, source-bound quotation checks and semantics validator. Unsupported activities require quoted clarification, not a convenient café substitution. The validator canonicalizes `all` to `any` for zero or one desired category, where the contract treats them equivalently; it does not clear exclusions, unknown wishes or clarification flags. Multi-category `all/any` stays unchanged. Response caching and a lexical interpretation fallback are not used.

The UI and trace disclose `mode: cloudflare` when the reserve supplied the intent. That path skips further Gemini enrichment and renders local source-backed explanations. A primary Gemini result may use the existing optional explanation stage, with at most 4 seconds from the remaining model budget. Empty-query Food/Coffee/Park/Museum actions remain explicit local planning with no AI call; they do not silently erase typed text. If neither provider can produce a valid contract, the visitor receives clarification/manual choices with the same A/B, deadline and hard filters.

| Layer | Deadline |
|---|---:|
| Combined intent operation, including both providers | 20 s shared |
| Intent HTTP transport/body parsing | 21 s |
| Model-stage total | 26 s |
| Optional Gemini explanation within that total | Up to 4 s |
| Browser planning RPC, including clock and cold worker data | 40 s |

These are bounds, not latency guarantees. Without an `AI` binding the legacy Gemini-only path remains available, including its single bounded HTTP 503 retry; it never retries HTTP 429, network errors or invalid contracts. A reported quota failure has separate translated copy and no immediate-retry invitation. Gemini and Workers AI have separate external capacity/quota limits; the combined path does not remove them.

The `AI` binding is enabled only for the existing `qadam-astana` Production deployment. The release did not create a new API key, OAuth/Wrangler grant, billing account or paid plan. Workers AI's current [free allocation is 10,000 neurons/day](https://developers.cloudflare.com/workers-ai/platform/pricing/), shared account capacity rather than an unlimited request allowance. Operations can fail when a free limit is reached; using more requires an explicitly authorized paid setup. Google quotas also remain external limits. Health exposes `reserveConfigured` and model names; configuration is not proof of model availability.

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

For an authorized Cloudflare account, `wrangler pages secret put GEMINI_API_KEY --project-name qadam-astana` configures the production secret; `npm run deploy` publishes to the same Pages project. Keep the project name unchanged to retain its primary hostname. The production reserve also requires the Workers AI binding named `AI`, reflected in `wrangler.jsonc`; it needs no model API token in the browser. No paid plan was enabled for this release.

## Verification and limits

The v18 code passed **462/462 canonical tests and 43/43 hosting tests**, both TypeScript checks and both production builds. The hosting count includes `tests/*.test.ts src/tests/server.test.ts`. Controls cover the reserve race, shared deadlines, parent/loser cancellation, invalid/truncated/refused outputs, valid clarification as a winning answer, empty-query zero calls and private structured-context exclusion. Test fixtures are separate from live model evaluation.

The final public API series comprised **three batches of ten real HTTP requests: 30/30 HTTP 200, valid contracts and strict expected-semantics checks**. The third batch contained ten previously unused holdout requests. All 30 used `mode: cloudflare` (Gemini winners: 0); the combined path had zero provider/timeout failures in that series. HTTP elapsed time was 2,173 ms minimum, 2,470.5 ms median and 4,530 ms maximum during 17:22:58–17:25:29 UTC on 20 October 2026. This is one short observed window, not a latency or uptime guarantee. Successful reserve responses do not demonstrate restored Gemini availability. The evaluated API SHA256 is `35d508943398f60be9dea68964668dddf692cd6b8efde9d402f5df5fa841bba8`, client bundle `/assets/index-2D4MFpyA.js`, final production deployment `3c0aabe1-33f9-4f3d-8f9b-f33c75bf9e48`; exact final source/archive identity is recorded in release metadata. A finite selected sample, including ten holdout cases, is not general accuracy, an SLA or proof of support for every wording/activity.

Public raw outcomes are in [AI_VALIDATION.json](./AI_VALIDATION.json); independent expected assertions and the optional Node 22+ script are in [AI_BENCHMARK.mjs](./AI_BENCHMARK.mjs). In the source ZIP these two files are inside `qadam/`. Run `node AI_BENCHMARK.mjs 1` (or `2`/`3`) from the directory containing the script: each batch makes **10 real public API calls**, writes every outcome and consumes finite free allowance. Builds never run it. No credentials are needed, and a later live run can produce different results.

Failures remain part of the record: the earlier Gemini-only v17 run had 6/10 valid contracts (and its preceding LOW run 5/10); the initial reserve prototype had 16/20 strict checks, and the corrected intermediate run 20/20 valid contracts but 19/20 strict checks because an unsupported-football quote was missing. Those outcomes are retained in separate evidence directories. The final prompt used general unsupported-activity examples, and the final football case passed with the required quote; this is not a claim to recognize all activities.

Actual public 390 px UI checks exercised free-form Russian food requests: four routes in a 45-minute round trip, and four routes from Bayterek to the National Museum in a 90-minute window. The latter primary was 52 walking + 30 visit + 8 buffer = 90 minutes; the displayed reserve intent trace was 2,525 ms. The prior explicit manual Food check without an API key also returned four routes with no AI calls; it is a separate path, not part of the language success count.

Browser QA covered 320/390/430/667 layouts, dialog focus and destination/return deadline labels in RU/KK/EN. A real compiled rerouting worker with controlled GPS events recovered after a 120-second gap 150 m ahead while retaining B and the absolute deadline; a short simulated completion yielded no walk XP. The participant previously confirmed routes appeared on a physical iPhone after the JSON-data loader fix. These checks do not constitute a physical GPS/voice walk, field-verified crossings/entrances or an ETA guarantee.

Local passport/preferences stay on the device. Its private ledger contains completion IDs, exact completion timestamps, full elapsed minutes and ordered public POI IDs; it is not anonymous city telemetry. Only a minimal preference snapshot is sent to the local planning worker, outside the public API request. A bounded ±6 soft bias reorders comparable source-quality candidates; zero, OFF or unrelated profiles preserve the baseline. It never overrides category coverage, time, filters, exclusions or a required POI. GPS-qualified completion is the only source of passport progress; deliberate preview yields no XP and 30–59 seconds are not rounded up to a rewarded minute.

After a long GPS gap, a fix farther along the active line does not silently advance progress or mark stops visited. An explicit Recover route from GPS action recalculates from the fresh position while preserving the original finish and absolute deadline. The possibilities map uses cached endpoint search trees, raw JSON assets and no AI calls on slider changes. Past/invalid departures and expired return windows disable the map. Planning through a selected place offers to keep or explicitly replace an existing wish; both preserve A/B, time and hard filters.

API requests can send structured A/B and selected-plan data to the server for current context/shape validation; initial graph computation stays in the browser. Both providers receive the same bounded query, language, manual-category context, minute budget and condition flags. Structured A/B, live GPS, precise timestamps, venue records and passport history/preferences are omitted from intent. Raw live GPS is not streamed to the API. Free text can contain personal details and may reach Gemini and the Workers AI reserve. The reserve requests `store:false`; this request option does not attest all external infrastructure logs. Tile providers and hosting/model infrastructure have their own technical logs. Public city reporting is a future opt-in proposal; collection/transmission is not enabled.

The original presentation/video remain baseline v9 until the participant approves a final product version. The official application is on HOLD and has not been submitted.
