# Scope — kp-themes

> **DRAFT — not approved.** These statements were drafted on 2026-09-03
> as the Phase 0 activity of the dev procedure. Each one is an item in
> the Phase 0 approval gate (Correct · Adjust · Drop) and none of them
> binds anything until Kenny has answered that form. The gate is being
> run in a Claude Desktop session so the form renders as a widget.

Sources this draft is built on: `HANDOFF.md`, `docs/REQUESTS_FROM_CONSUMERS.md`
(written by the JobTracker session on 2026-09-03, every claim measured),
and the T17 decision that created this package.

## Goal

**S1.** kp-themes is the single home of the house theme system: the seven
themes (formal, light, dark, cyberpunk, pastel, terminal, topo) as
reusable design tokens, published as `@kp-soft/themes`, consumable by any
surface — React apps, framework-free server-rendered HTML, and later a
TUI or GUI — without each consumer re-deriving the same behaviour.

## In scope

**S2 · A framework-free picker.** Alongside the CSS token layer, the
contrast gate and the React `useTheme` / `ThemeSwitcher`, the package
ships a framework-free version of the same picker behaviour: same
`localStorage` key, same `data-theme` toggle, same derivation of the
`dark` class, no build step required.

Measured: the Almanac and kyu sessions each rebuilt this by hand in
vanilla JavaScript on 2026-09-03, within an hour of each other, because
their dashboards are server-rendered HTML from a Rust binary with
Bootstrap 5 — no npm, no bundler, no React. kyu shipped its version in
2.2.0.

**S3 · The contrast gate must reach every consumer.** T17 promised "each
consumer's contrast gate running on the bump"; today
`scripts/check-contrast.mjs` runs only in this repository. Closing that
gap belongs to this project, not to each consumer separately.

Measured in JobTracker on 2026-09-03: no contrast check exists anywhere
in its gate chain, so a new kp-themes tag would land there unverified.

**S4 · Theme anatomy.** A "theme" in this project has five layers, and a
consumer need not use them all:

| Layer      | Where it lives                          |
| ---------- | --------------------------------------- |
| Palette    | `css/themes.css` (CSS custom properties) |
| Register   | `css/cyberpunk-register.css` (shadcn `data-slot` decoration) |
| Typography | a per-theme webfont via Bunny Fonts     |
| Motion     | the cyberpunk `fx/` components          |
| Gates      | `scripts/check-contrast.mjs`            |

A consumer using only the palette and the gate — JobTracker today — is
using the theme correctly, not partially. Measured: JobTracker emits no
`data-slot` attributes at all, so most of the 336-line register is inert
there while the theme itself is complete.

## Non-goals

**S5 · TUI and GUI surfaces are not built in this pass.** They stay
acknowledged future scope (Kenny widened the project that way on
2026-09-02), but no consumer has asked for them yet, and building ahead
of a real consumer is the mirror image of the drift this package exists
to stop.

**S6 · Consumer-specific bridge code stays with the consumer.** kyu's
`data-bs-theme` toggle for Bootstrap and its `static/theme-bridge.css`
are framework-specific and do not belong in the package. What is shared
is the core contract of the framework-free picker (the markup shape, the
dark-class derivation); a consumer hangs its own bridge off a documented
hook rather than kp-themes knowing about Bootstrap.

**S7 · The package does not chase every vendoring choice.** Almanac and
kyu vendor a copy of `themes.css` into a compiled binary. kp-themes
guarantees the gate and a provenance marker are available to run against
such a copy; it does not track whether those consumers actually refresh
it. That residual risk is recorded, not owned.

## Hard constraints

- Node 26 (`.nvmrc`), `engines: node >=26 <27`.
- Public GitHub repository — decided via JobTracker correction C1: a
  private git dependency cannot be fetched from CI or an image build.
- Consumers need `allow-git=all` in their `.npmrc`; `root` covers only
  the root package, not a workspace package.
- Tailwind consumers must declare the package as a `@source`.
- All artefact text in English; the framework-free surface (S2) must work
  without a bundler.

## Success criteria

**S9 · One source of truth for the theme list.** After this round the
list of seven themes exists in exactly one place — `THEME_META`, or the
DOM equivalent for the framework-free picker. No picker implementation
carries its own hardcoded list of dark themes.

This is the bug both consumers nearly shipped: both were about to
hardcode the dark set, and kyu had the wrong count (four instead of the
actual three: `dark`, `cyberpunk`, `terminal`).

**S10 · A version bump triggers a contrast check that reaches every
current consumer** — JobTracker through npm and CI, and the vendoring
consumers Almanac and kyu through a mechanism that works against a copied
CSS file rather than an installed package.

## Open questions carried into Phase 1 and 2

From `docs/REQUESTS_FROM_CONSUMERS.md` §3, not yet decided:

- The version-following mechanism is unproven: JobTracker pins
  `github:kennypassenier/kp-themes#v0.1.1` with Dependabot configured, but
  no kp-themes bump PR has ever been observed because there has been no
  tag since v0.1.1.
- The register's dependency on shadcn markup deserves a README line: the
  cyberpunk theme is correct without the register.
- Three themes carry their own typeface (formal → Fraunces, cyberpunk →
  Chakra Petch, terminal → Share Tech Mono). Without the Bunny Fonts link
  they fall back silently, and cyberpunk in particular reads as
  half-applied. A vendoring consumer cannot discover this from
  `themes.css` alone.
