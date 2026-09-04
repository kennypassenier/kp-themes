# Test plan — kp-themes

What is tested, where, and what is deliberately not. Written at Phase 7,
after an audit that laid `FEATURES.md` next to the actual tests and asked
of each one whether its assertion could ever fail.

## The suites

| Suite | Runs in | Reads | Covers |
| --- | --- | --- | --- |
| `gates/gates.test.mjs` | Node's built-in runner | the token source and the authored stylesheets | the gate functions themselves: theme discovery, token parity, the flash threshold, reduced-motion guards, state visibility, badge plates, layer discipline |
| `gates/check-*.mjs` | Node, on every commit and in CI | both the token source and the generated stylesheet | contrast, the design invariants, motion, layers, and whether the generated files still match their source |
| `tests/*.spec.mjs` | Chromium **and** Firefox, in CI | a real browser | behaviour: the picker in both channels, the component contracts, keyboard operation of the overlays, reflow and text spacing, the printed page, the effects |

The split is Kenny's decision H1: the fast gates block a commit, the
browser tests block a merge. A gate slow enough to be worked around is not
a gate.

## What a gate must be able to do

**Fail.** Every check in this project has been shown red on a deliberately
injected violation before being trusted, and those drills are recorded in
`docs/REALIZATION_PLAN.md`. The Phase 7 audit found the reason that rule
exists: a check for the visited link had been written, reported as built,
and never ran once — it guarded on a token that is derived rather than
declared, so its condition was false for all seven themes on every run. It
sat green beside the real checks. It now reads the generated stylesheet,
and it has been red.

**Say what it did not check.** A run that reports "35 checks, all passing"
answers the wrong question if nobody asked whether those were the right
35. The contrast gate refuses a colour token that appears in neither a
pair list nor an exemption list with a stated reason; the motion gate
prints the animations it skipped and why; the compliance table prints
`not gated` rather than `pass` for anything nothing measures.

## Proven in which environment

AR15 pins the baseline at modern Chrome and Firefox. Until Phase 7 the
browser suite ran in Chromium alone, which made a green run evidence about
Chromium (standing rule 35). It runs in both now, and
`tests/baseline.spec.mjs` asserts by name the four platform features this
package leans on — `<dialog>`, popover, anchor positioning, relative
colour syntax — plus the fact that an anchored menu actually lands under
its trigger, because a feature query proves the property parses and not
that the layout happened.

Everything here is runtime-verified on Linux, in both browsers. The
package ships no platform-specific code, so there is no build-verified
target awaiting a checklist.

## Not covered, by decision

_This section is filled in from the Phase 7 gate. An accepted gap is a
choice with a reason, written down; a silent hole is neither._

- **`BootSequence` has no test.** It is the one effect that needs the
  optional `motion` peer, which this package does not install — testing it
  means adding a dependency for a component that renders nothing outside
  cyberpunk. The other three effects are tested, including the promise
  that matters most: outside cyberpunk, and for anyone who asked for less
  motion, the text is simply the text.
