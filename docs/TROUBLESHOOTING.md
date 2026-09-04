# Troubleshooting

Symptom first, then where to look. This replaces the debugging guide and
the operations runbook the procedure asks for: there is no server here, no
database and no process to restart, so a runbook of numbered recovery
procedures would describe something that does not exist. What a consumer
of a stylesheet actually hits is "it looks wrong" and "the gate says no",
and that is what this covers.

---

## On the page

### The page flashes the wrong theme before settling

The no-flash snippet is missing, or it runs after the stylesheet. It has
to be inline in `<head>`, before the `<link>` — a module import arrives
too late to prevent the flash it exists to prevent. See the user guide's
first section.

### Everything is the default theme, whatever is stored

Check `document.documentElement.dataset.theme` in the console. If it is
empty, nothing is applying the theme: either the snippet is absent or the
picker module never loaded. If it says `formal` while `localStorage` says
something else, the stored value is not one of the seven names — the
picker corrects an unknown value rather than putting it on the document.

```js
localStorage.getItem('theme'); // must be one of the seven
```

### One picker updates, another does not

Both pickers must be attached. `attachThemePickers()` runs on import and
marks each container it touched with `data-kp-theme-attached="1"`; a
container without that attribute was added to the page after the module
ran. Call `attachThemePickers(container)` yourself after inserting it.

### The choice is not remembered

Watch for `[data-kp-theme-status]` becoming visible: that is the package
saying the browser refused to store it — private mode, blocked storage, a
full quota. The theme still applies; only the remembering failed. If the
element is missing from your markup, the message has nowhere to go.

### A button does nothing on the first click

That is the confirmation, working. A destructive button with
`data-kp-confirm` arms on the first click — it changes its label to your
phrase and sets `data-kp-armed="true"` — and acts on the second. It
disarms after a few seconds, or when it loses focus.

### A destructive button is disabled and I did not disable it

Look in the console for `[kp-themes DI10]`. A destructive button must
offer an undo or a confirmation; one offering neither is reported and
disarmed rather than left able to delete something. Add `confirm="…"` or
`onUndo`, or in markup `data-kp-confirm` or `data-kp-undo`.

### A badge is marked with `data-kp-contract-error="DI4"`

It carries a semantic colour and no words. Put the status in the badge as
text, or add an element with an accessible name — an `aria-hidden` icon
carries nothing.

### A menu appears at the top-left instead of under its trigger

Anchor positioning did not apply. The trigger needs `anchor-name` and the
popover needs a matching `position-anchor`; both are set by the React
`DropdownMenu` and must be set by hand in the framework-free channel. If
they are set and it still happens, the browser is older than the baseline
— `tests/baseline.spec.mjs` names the four features this package needs.

### The tokens change but the page does not

Not a defect in the package, and the reason is worth knowing before you go
looking for one. Reported by kp-soft on 2026-09-04 while driving a theme
switch from a browser pane that was not compositing frames: the custom
properties were already correct, and `getComputedStyle(document.body)`
kept returning the *previous* theme's background indefinitely.

The body carries a cross-fade between themes, and a transition does not
advance in a page that renders no frames. Nothing is stuck; the animation
simply never runs. Setting `transition: none` on the body produced the
right colour immediately.

So: when a measurement says the tokens moved and the paint did not, check
whether the thing doing the measuring is actually rendering.

### Colours look right but the scrollbars are light on a dark theme

`color-scheme` is not reaching the browser. `css/themes.css` carries
`:root { color-scheme: var(--color-scheme) }`; if you vendored an older
copy, that rule may predate 2026-09-04, when it was found missing.

### An effect keeps animating for someone who asked for less motion

The effects read `prefers-reduced-motion` through a subscribing hook and
stop within the same session. If yours does not, you are on a copy from
before that fix — the components used to read the setting once at mount.

## When a gate says no

Every gate names the theme, the token and the number. The messages below
are quoted from the code, so you can search for them. Fix the token, not
the gate. If you are convinced the gate is wrong, that is a mini-round,
not a config edit.

| It says | It means | Where to look |
| --- | --- | --- |
| `foreground on background = 3.42 (need >= 4.5)` | text on a surface is not readable | the two tokens it names, in that theme's `tokens.json` |
| `--input on --card is 2.10, under the 3.0 floor of SC 1.4.11` | a control's boundary disappears into its surface | DI1: raise the boundary, not the surface |
| `--primary-active is only 4.9 from --primary (need >= 10)` | pressing the control changes nothing anyone can see | the base colour is near the edge of the space; the derivation gives up chroma first, so this means even that was not enough |
| `--z is measured by nothing` | a new token belongs to no pair list | add it to a pair list, or to `EXEMPT` with the reason — the message says so too |
| `fx-flicker makes 5.5 opposing luminance changes per second over 1100ms` | it is over the flash threshold, and that harms people | retime the keyframes or lengthen the duration |
| `transition sits outside a prefers-reduced-motion guard (DI7)` | it moves for someone who asked for stillness | wrap it in `@media (prefers-reduced-motion: no-preference)` |
| `hsl(…) is a colour written outside the token layer` | a colour is spelled out where a token should be | `var(--token)`, or `hsl(from var(--token) h s l / alpha)` if it needs transparency |
| `css/themes.css does not match its source` | someone edited the generated file | edit `themes/<name>/tokens.json`, then `npm run generate` |
| `The compliance table no longer matches what the gates measure` | the table and the gates disagree | `node gates/compliance.mjs` |
| `theme discovery broke: expected 7, found 6` | a theme is in `order.json` but not in the stylesheet, or the reverse | regenerate, then look at the name |

## Working on the package itself

```bash
npm ci                    # a fresh clone needs nothing else
npm run generate          # rewrite the generated files from the sources
npm run gates             # everything that blocks a commit, under a second
npm run test:browser      # Chromium and Firefox; blocks a merge, not a commit
node gates/compliance.mjs # rewrite the table in DESIGN_INVARIANTS.md
```

The git hooks are local config a clone cannot carry. Activate them once:

```bash
git config core.hooksPath .githooks
```

### The pre-commit hook blocks something that is not a commit

A known defect in the shared procedure's hook, recorded as PROC-H1: it
decides a command is a commit by looking for the words in the command
text, so writing a document that quotes an example commit message trips
it. It fails closed, so it is noise rather than a hole. It belongs to the
procedure repository, not here.

### A gate is green and you do not trust it

Break something on purpose and check that it goes red. That is not
paranoia — it is the rule every gate here was built under, and it caught a
check that had never run once.
