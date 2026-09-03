# Requests from consumers (2026-09-03)

Three projects consume these themes now, and two of them ran into the
same wall on the same day. This file records what they asked for, with
what was measured rather than assumed, so a kp-themes session can decide
what belongs in the package and what does not.

Raised by the JobTracker session (💼, `~/Projects/JobTracker`), at
Kenny's instruction, so he can coordinate the answer from here.

## 1 · Three consumers are building the same picker, separately

**Measured on 2026-09-03:** the Almanac session (📅) and the kyu session
(📬) each asked JobTracker, within about an hour of each other, how the
theme picker stores its choice — and each is now rebuilding
`components/theme-switcher.jsx` by hand in vanilla JavaScript. Both have
the same reason: their dashboards are server-rendered HTML from a Rust
binary with Bootstrap 5, no npm, no bundler, no React. So the shipped
switcher and `hooks/use-theme.js` are unusable for them, while the
*behaviour* is exactly what Kenny asked both of them to copy: "dezelfde
theme picker en dezelfde manier om de keuze in de browser op te slaan".

That behaviour is small and already precisely defined by this package:

- `localStorage` key `theme`, value one of the seven theme names
- `document.documentElement.dataset.theme = <name>`
- `classList.toggle('dark', THEMES.filter(t => THEME_META[t].dark).includes(theme))`
- default `formal`; precedence `preferred` > localStorage > fallback > `formal`
- swatch `linear-gradient(135deg, ${THEME_META[t].bg} 50%, ${THEME_META[t].primary} 50%)`

Both sessions had already reconstructed most of it from the source, and
both got a detail wrong before asking: kyu assumed **four** dark themes
(there are three: `dark`, `cyberpunk`, `terminal`), and both were about
to hardcode that list rather than derive it from `THEME_META`. That is
the failure mode a hand-copy has: it is right on the day it is written
and silently wrong after the eighth theme is added.

**The suggestion, not a decision:** ship a framework-free picker from
this package — one small `.js` file and the CSS it needs, no build step,
usable from a `<script>` tag — so the behaviour is written once. React
consumers keep `ThemeSwitcher`; everyone else drops in the plain one.
The alternative (each consumer keeps its own copy) is what is happening
right now, and it costs three implementations that will drift.

Whoever picks this up: talk to `almanac-1b` and `kyu-8a` first — they are
mid-build and know exactly which parts they had to invent.

## 2 · The contrast gate does not reach the consumers

`scripts/check-contrast.mjs` here covers all seven themes including the
seven `--status-*` pairs, and it is a real gate — but it only ever runs
**in this repository**. T17, the decision that created this package,
promised something else: *"each consumer's contrast gate running on the
bump"*. Measured in JobTracker on 2026-09-03: no contrast check runs in
its gate chain, so a new kp-themes tag would land there unverified. The
same will be true — worse — for Almanac and kyu, which are vendoring a
copy of `themes.css` into a binary, where a stale copy has nothing at all
watching it.

JobTracker's Phase 7 hardening recorded this as a real gap. Kenny's
instruction was to raise the concern here rather than paper over it in
one consumer.

Two shapes worth weighing:

1. **The package exports the gate.** Consumers run
   `npx @kp-soft/themes check-contrast` (or copy one script) against the
   CSS they actually ship, in their own CI. Works for a vendored copy
   too, which is the case that needs it most.
2. **The package guarantees it at release.** The gate runs here before a
   tag, and consumers trust the tag. Cheaper, but it does not catch a
   consumer that overrides a token — and it does nothing for a vendored
   copy that never gets updated.

They are not exclusive; (1) is what T17 actually promised.

## 3 · Smaller findings from the same measurements

- **The version-following mechanism is unproven.** JobTracker pins
  `github:kennypassenier/kp-themes#v0.1.1` and has Dependabot configured,
  but in six bump PRs there has never been a kp-themes one — there has
  been no new tag since v0.1.1, so nothing is wrong, but "Dependabot
  follows a git tag" is still an assumption nobody has watched happen. It
  is queued as an open measurement in JobTracker (correction C1,
  measurement 3). A consumer without npm has no mechanism at all beyond a
  provenance comment above the copied file.
- **`css/cyberpunk-register.css` mostly needs shadcn markup.** Of its 336
  lines, eight target `data-slot` attributes and several target `.fx-notch`
  and `.microlabel`, which belong to the React `fx/` components.
  JobTracker imports the register and emits **no** `data-slot` attributes
  at all, so a good part of it is inert there; what does apply is the
  generic `input` and `textarea` styling. Worth saying out loud in the
  README: the cyberpunk theme is correct without the register (all colours
  live in `themes.css`); the register adds decoration that needs the
  markup.
- **Three themes carry their own typeface** (`formal` → Fraunces,
  `cyberpunk` → Chakra Petch, `terminal` → Share Tech Mono, which also
  sets `--font-sans` to monospace). Without the Bunny Fonts link from the
  README those fall back and cyberpunk in particular looks half-finished.
  A vendoring consumer will not discover this from `themes.css` alone —
  it deserves a line next to the vendoring instructions, not only in the
  install section.
