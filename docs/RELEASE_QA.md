# Release browser and installation checks · 20 October 2026

These checks complement the 167 automated tests. They are not additional automated tests, field trials, or population accuracy estimates.

- Isolated installation: official-registry npm ci succeeded with the same lockfile; TypeScript passed; 167/167 tests; 8/8 HTTP checks without a model key. [Sanitized log](evaluation/clean-install.txt).
- Published app: anonymous curl requests to `/`, `/api/plan` and `/api/places` returned HTTP200 without account headers or cookies. Health reported 890 POI, 81,383 graph nodes and configured Gemini.
- Four original audit regressions were checked through the public API with no account credentials: cafe+park exclusions, cafe negation, museum overriding the initial coffee chip, and unverified quiet/price/sockets. All four passed; the museum case correctly returned empty within the chosen budget. [Exact requests and outputs](evaluation/live-audit-regressions.v4.json). These calls are outside the frozen30-case model evaluation.
- Real browser, published app: Russian park request with cafe exclusion returned a park and explicitly excluded coffee, 31/45 minutes including return. The quiet/inexpensive/cafe/sockets request returned partial matching, with all three attributes visibly unverified, 33/45 minutes.
- Real browser: manual coffee with listed-hours-only returned Coffee Original, 39/45 minutes; reducing the budget to20 returned no plan. The source dialog showed OSM24/7 as a source claim, not a field-verified opening guarantee.
- Real browser: changing RU/EN/KK cleared the previous result. New EN and KK results used localized generated text and return labels; Kazakh dates display `21 қаз.2026` instead of an ICU `M10` fallback. Real source venue names are preserved unless a translated OSM name exists.
- Responsive browser check at390×844: document width=scroll width=390, language controls44×44, fixed48px primary action. The temporary viewport override was reset.
- Dialog keyboard check: focus starts on Close; Tab/Shift+Tab stay inside; Escape closes and returns focus to the source control.
- Local browser regression after the final UI fix: start a45-minute request, observe Loading, immediately choose20minutes. The old request is aborted, the action becomes ready, and no result panel appears later. No old45-minute result is displayed under the20-minute input.

Video footage uses real published-app frames. The last budget-cancellation fix changes an interrupted-request edge case; the normal scenarios in the footage retain the same behavior. Exact frozen model evaluation is documented separately in [EVALUATION.md](EVALUATION.md).
