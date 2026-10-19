# Evaluation evidence — Qadam v4

These are public evidence copies from the development evaluation. Queries are synthetic, with public UI start presets and public OpenStreetMap data. No private screenshots, credentials, provider response bodies or real-user GPS traces are included.

## Three separate claims

- [Clean installation](clean-install.txt): official-registry npm ci, unchanged lockfile, TypeScript pass, 167/167 tests, 8/8 no-key HTTP checks. Local paths in this report are sanitized.
- [Oracle replay](replay-contract.v1.json): 30/30 production-pipeline invariants with pre-specified gold contracts and real POI/graph. Cloud calls=0. Simulated mode=gemini metadata does not mean a model was called. Partial/empty results are allowed. These cases are included within the 167 tests.
- [Actual intent run](final-intent-thirty.v4.json): 26/30 strict matches, 27 real API calls + 3 manual cases, including two HTTP429 failures. Development 9 and first-seen 21 are separately reported; first-seen 20/21 includes 3 manual (provider-only 17/18). This selected set is not population accuracy or an external benchmark.

## Provenance

- [Independent frozen gold](gold.v1.json), [gold freeze](gold-freeze.json).
- [Pre-fixed compatibility mapping](contract-mapping.v1.json), [mapping freeze](contract-mapping-freeze.json).
- [Legacy baseline full outputs](baseline.v1.json), [summary](baseline-summary.v1.json), [freeze](baseline-freeze.json): 7/30 strict matches, no cloud calls.
- [Final pre-call freeze](final-intent-freeze.v4.json), [actual outputs](final-intent-thirty.v4.json), [analysis of all four failures](final-analysis.v4.txt).
- [Replay outputs](replay-contract.v1.json).
- [SHA256 manifest](manifest.json) records byte-exact copies. Historical metadata retains its original research-relative paths; corresponding files are now alongside this README. No expected labels were edited after observing final results.

The two final HTTP429 cases triggered the stop policy at case 30 after all 30 cases had already been attempted. No retries or later calls were used to manufacture successes. Report 27 API calls, not 30. Before this run, development used 21 further calls; total across those evaluations was 48.

See [EVALUATION.md](../EVALUATION.md) for the comparison protocol, nine development cases, first-seen caveat, unsupported-quote mismatch and spurious unsupported disclosure. Oracle replay must never be presented as AI parsing accuracy.

[Release browser/API checks](../RELEASE_QA.md) and [four original audit regressions](live-audit-regressions.v4.json) are later release checks, outside the frozen30-case evaluation above.
