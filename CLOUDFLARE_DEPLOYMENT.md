# Qadam: Cloudflare free deployment profile

Inside the source ZIP, `deploy/cloudflare/` builds the canonical Qadam source in `../../qadam`. It serves the phone-first planner, live possibilities map and local city passport. The earlier Sites public deployment remains a preserved v15 backup; it is not republished by this profile.

Target public hostname: https://qadam-astana.pages.dev/
Backup Sites hostname: https://qadam-astana-walk.pubg-bekzat.chatgpt.site/

## Published v17 release

Production deployment: `aad9e602-76f0-491a-ae0f-e36e4e8743a1`; the primary URL is unchanged. Client bundle: `/assets/index-BatgoU7C.js`. Canonical source commit: `397ad3ad0391385021d1b2991e3569e573c83785`. Health confirms the configured key, `gemini-3.1-flash-lite`, 1,204 POIs and `serverGraph=false`; it is not a model-availability test.

The source archive contains 276 entries, 2,966,173 bytes, SHA256 `85a72dbe009f06fff019c100cc39a714e81c25c92451cc62f9bc9ec065943ef1`. Its fresh rebuild matched all 21 runtime files byte for byte. Runtime ZIP: 4,002,709 bytes, SHA256 `86fcdd47523d0c5b9e3881696b88ca96ee3be299ef5f5eaa2d6be89f7f257363`. The final API binary SHA256 `2e3d2ce4c2af9a1adec76937cd26e89df1f0c143d60cb7911a2bdfada353038a` is unchanged from the tested Lite API; the Home quick-action UI is the final runtime change.

## Architecture

Cloudflare Pages serves the React interface, map assets, the 1,204-place source snapshot and dedicated Web Workers. Initial graph planning and walking rerouting execute in browser workers, avoiding the Free Functions CPU budget. The graph and route constraints are the same canonical Qadam implementation. Initial planning fetches the POI and graph as hashed static JSON assets inside its worker, avoiding large dynamically imported JavaScript data modules. The foreground UI has no synchronous graph-planning fallback.

Pages Functions (`_worker.js`, API-only `_routes.json`) provide a server clock and bounded Gemini interpretation/explanation endpoints. `GEMINI_API_KEY` is an encrypted runtime secret and is absent from browser bundles and source packages. Structured GPS tracking remains in browser memory. The model receives bounded query/control and canonical source-explanation inputs; the server never attests graph geometry supplied by the browser.

`src/Home.tsx` is generated from the canonical Home by replacing only the planning POST call with the fetch-compatible worker client. `scripts/prepare.mjs` checks that this adapter target still occurs exactly once. A server-synchronized monotonic clock preserves chosen deadlines; cancellation, failure and timeout terminate the owned initial-planning worker. The canonical planner validates all returned AI codes and itinerary constraints.

## AI policy in the v17 source

The default is `gemini-3.1-flash-lite`, using the provider's default generation controls: no forced temperature or thinking override for this model. Optional 3.6/3.5 Flash configurations retain explicit MINIMAL thinking controls. A model/configuration change does not establish the cause of earlier timeouts. Strict schema/semantic and negation guards remain enabled. An unavailable or invalid intent produces clarification and explicit manual choices, never a silent keyword interpretation of the wish. Optional explanation failure keeps the feasible plan with source-derived local text.

When the query is empty, four explicit Food/Coffee/Park/Museum actions use the existing manual recovery path: browser graph planning with local explanations, no AI call. They preserve A/B, time and filters. When text is present, these fast actions are absent; free-text interpretation remains a separate Gemini path. There is no lexical fallback or silent clearing of a typed wish.

| Layer | Deadline |
|---|---:|
| Server intent provider operation | 20 s |
| Intent HTTP transport/body parsing | 21 s |
| Model-stage total | 26 s |
| Optional explanation within that total | Up to 4 s |
| Browser planning RPC, including clock and cold worker data | 40 s |

These are cancellation bounds, not latency guarantees. Intent retries once only for HTTP 503, after 750–1249 ms of jitter, within the original shared provider deadline. The retry does not renew that deadline. HTTP 429, network errors and invalid contracts are not retried by intent. A same-model explanation retry after HTTP 503 uses the remaining overall explanation budget; it does not halve the first request's allowance. Other failures and invalid grounded codes remain visible, with no invented facts. Deployment configuration can override `GEMINI_MODEL`; the actual published model and production checks belong in release metadata.

Quota errors are classified separately from timeouts/provider failures. On HTTP 429, the translated UI explains the usage limit and does not offer an immediate retry. An explicit manual activity keeps A/B, the current budget, the absolute deadline and hard filters; no plan is silently substituted. The observed existing Free project's 3.6 Flash daily limit was 20 requests and was exhausted; its Lite model entries showed 500 requests/day and 15 requests/minute at inspection. Those account observations are not a promise of future quota, capacity or availability. No billing, key or project change was made to obtain a different quota. The premature timeout was fixed in code; external capacity and quota constraints remain.

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

The final v17 code run passed 453/453 canonical tests and 30/30 in the full standalone suite (`tests/*.test.ts src/tests/server.test.ts`), including six quota/recovery tests. Both TypeScript checks and both production builds passed. The final Cloudflare deployment and archive hashes are recorded above and in `cloudflare-deployment.json`. Coverage includes the Safari 16 `Response.json` fallback, safe support codes, cancellation, clock failures, ordered AI deadlines and the single shared-deadline 503 retry.

The initial v17 production deployment `6d992d4f-1d7c-42e9-be09-f06cc434eb91`, using LOW through the former 3.5 alias to model version 3.6, returned valid intent contracts in 5/10 cases across two batches. All failures are retained; this did not pass a reliability acceptance gate. Later direct MINIMAL probes for model version 3.6 passed in 4,184 and 7,436 ms before the daily quota was observed exhausted. Different times/runtimes prevent a causal comparison.

The completed 3.1 Flash Lite production series returned valid intent contracts in **6/10 cases across two batches of five**, with four provider/timeout failures retained in the denominator. The successful cases correctly handled the tested negations, all/any logic, KK and Wi-Fi as unknown data. This selected small series did not pass a reliability acceptance gate and is not an SLA. Earlier direct probes and failed alternatives remain evidence, not a claim that switching model fixed external availability. The final fast-action UI is now published. Its API binary is byte-identical to the tested API, as verified during packaging; the 6/10 result remains a limitation of this release.

A local 390-pixel browser check without an API key and the final public 390-pixel UI both used the explicit Food fast action and returned four walking-network routes within 45 minutes. The trace showed manual intent (0 ms), local explanations and no AI calls; A/time were retained. An earlier v17 production food request also returned four routes, but it is not substituted for the 6/10 language result above. Browser QA covered 320/390/430/667 layouts, dialog focus and destination/return deadline labels in RU/KK/EN. A real compiled rerouting worker with controlled GPS events recovered after a 120-second gap 150 m ahead while retaining B and the absolute deadline; a short simulated completion yielded no walk XP. These checks do not constitute a physical GPS/voice walk or live-language reliability measurement.

Earlier browser checks exercised four route choices, A/optional B, compiled rerouting workers and iframe widths 320/390/430. The participant previously confirmed that routes appear on a physical iPhone after switching worker data imports to JSON assets. Those observations do not prove the new v17 fixes in production or a physical GPS/voice walk. Publication and current live verification are recorded separately in `cloudflare-deployment.json`.

Local passport/preferences stay on the device. Its private ledger contains completion IDs, exact completion timestamps, full elapsed minutes and ordered public POI IDs; it is not anonymous city telemetry. Only a minimal preference snapshot is sent to the local planning worker, outside the public API request. A bounded ±6 soft bias reorders comparable source-quality candidates; zero, OFF or unrelated profiles preserve the baseline. It never overrides category coverage, time, filters, exclusions or a required POI. GPS-qualified completion is the only source of passport progress; deliberate preview yields no XP and 30–59 seconds are not rounded up to a rewarded minute.

After a long GPS gap, a fix farther along the active line does not silently advance progress or mark stops visited. An explicit Recover route from GPS action recalculates from the fresh position while preserving the original finish and absolute deadline. The possibilities map uses cached endpoint search trees, raw JSON assets and no AI calls on slider changes. Past/invalid departures and expired return windows disable the map. Planning through a selected place offers to keep or explicitly replace an existing wish; both preserve A/B, time and hard filters.

API requests can send structured A/B and selected-plan data to the server for current context/shape validation; initial graph computation stays in the browser. Structured A/B are omitted from the model's intent input. Raw live GPS is not streamed to the API, and passport history/preferences are not sent to the model. Free text can contain personal details; tile providers and hosting/model infrastructure have their own technical logs. Public city reporting is a future opt-in proposal; collection/transmission is not enabled.

The original presentation/video remain baseline v9 until the participant approves a final product version. The official application is on HOLD and has not been submitted.
