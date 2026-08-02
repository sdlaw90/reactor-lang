# 2026-08-02 — Framework upgrade: Next 14 → 16, React 18 → 19, Node 24, ESLint flat config

_Folds into the **3.3.0** release entry (internal-only — no user-facing behaviour change intended)._

## User-facing
- None intended. The route table is byte-for-byte identical before and after (53 routes, zero
  static→dynamic flips), so there is no change to what renders, what prerenders, or what runs
  as a Vercel function.

## Internal

### Why now
Next 14 went EOL 26 Oct 2025 — no security backports. React 18 and ESLint 8 are on the same
trajectory. The app was carrying none of the patterns that make a Next 15/16 upgrade expensive
(no `cookies()`/`headers()`/`draftMode`, no middleware, no custom webpack config, no
`next/image`, no `next/font`, no `@supabase/ssr` cookie layer), so the cost was hours, not days.
Deferring only makes the eventual jump worse.

### Dependency bumps
| Package | Before | After |
| --- | --- | --- |
| `next` | 14.2.35 | 16.2.12 |
| `react` / `react-dom` | 18.3.1 | 19.2.8 |
| `eslint` | ^8.57.1 | ^9.39.5 |
| `eslint-config-next` | ^14.2.35 | 16.2.12 |
| `lucide-react` | ^0.383.0 | ^1.28.0 |
| `@supabase/supabase-js` | ^2.45.4 | ^2.111.0 |
| `@playwright/test` | ^1.61.1 | ^1.62.1 |
| `globals` | — | ^17.9.0 (new, for the flat ESLint config) |

`engines.node` added as `>=20.9.0` (Next 16's hard floor). `.nvmrc` added, pinned to `24`.

### Async request APIs (the only code change)
Next 16 removes synchronous access to `params`. All seven `[trackId]` pages are client
components that destructured `params` from props; each now takes `props` and unwraps with
React's `use()`:

```js
export default function PlayPage(props) {
  const params = use(props.params);
```

Nothing downstream changed — the local `params` binding keeps its name, so the diff is three
lines per file. Affected: `learn`, `play`, `grammar`, `placement`, `script`, `listen`, `speak`.

### Turbopack
`next build` uses Turbopack by default in 16. The repo has no custom webpack config and no
plugin that injects one, so this needed no opt-out and no `--webpack` flag. Build time in a
clean container: ~36s.

### `next lint` → ESLint CLI
`next lint` is removed in Next 16 and `next build` no longer runs linting. Replaced with:
- `.eslintrc.json` deleted; `eslint.config.mjs` added (flat config).
- `eslint-config-next@16` ships a **native** flat config array — imported directly from
  `eslint-config-next/core-web-vitals`. Do **not** wrap it in `@eslint/eslintrc`'s `FlatCompat`;
  that path throws `TypeError: Converting circular structure to JSON` on the react plugin.
- `env: { browser, node, es2022 }` has no flat-config equivalent, so `globals` supplies them
  under `languageOptions.globals` (required to keep `no-undef: error` meaningful).
- Scripts: `"lint": "eslint ."`, plus a new `"lint:fix"`.
- `docs/**` added to `ignores` — `docs/variant-expansion/pipeline/wf_depth.js` is a standalone
  pipeline script and was the source of all 6 `no-undef` errors.

### Known lint debt (deliberately not fixed here)
`eslint-config-next@16` pulls `eslint-plugin-react-hooks@^7` (was `^4.5.0`), which adds React
Compiler-era rules that fire on long-standing code. Three are pinned to `warn` with a comment
in `eslint.config.mjs` so `npm run lint` exits clean:
- `react-hooks/set-state-in-effect` — 28 occurrences
- `react-hooks/preserve-manual-memoization` — 2
- `react-hooks/immutability` — 1

None are caused by this upgrade; all predate it. Current state: **0 errors, 72 warnings**.
Cleaning them up is its own task and should not ride with a framework bump.

### CI
`node-version: 22` → `24` in all five `actions/setup-node` steps across `e2e-tests.yml` and
`supabase-migrations.yml`. Node 22 entered maintenance in Oct 2025 and loses security support
30 Apr 2027; Node 24 is the active LTS through 30 Apr 2028.

### Verification performed
- `npm ci` from a wiped `node_modules` against the regenerated lockfile — clean.
- `npm run build` — compiles in ~36s, 47/47 static pages generated, TypeScript check passes.
- `npm run lint` — 0 errors.
- Runtime smoke test against `next start`: all seven `[trackId]` routes plus `/`, `/auth`,
  `/dashboard`, `/help`, `/settings` return 200 with no client-side exception markers.
- **A/B against a Next 14 baseline build of the same commit**: route table identical, and
  unknown-track behaviour identical on every section.

### Pre-existing bug surfaced during testing (NOT fixed here)
`/play/<unknown-track>` returns **500** — `getTrack()` returns `null` and something reads
`.bank` off it before the "Unknown track" guard at line 461 can render. Confirmed identical on
the Next 14 baseline, so this is not a regression, but it means any stale or mistyped `/play/`
URL hard-errors in production. The other six sections handle a null track correctly (200 +
"Unknown track"). Worth a one-line guard in its own commit.

### Not verified
The Playwright E2E suite was not run — it needs live Supabase credentials and a real account,
which the verification container doesn't have. Run `npm run test:e2e` locally, or let the
CI workflow cover it on push.
