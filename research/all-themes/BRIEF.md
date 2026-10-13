# Brief for one theme: close = open reversed, and the theme's own effect on every part that opens

Repository: `/home/kenny/Projects/kp-themes-wt/focus-motion` (a git worktree; work only here, never `cd` to `~/Projects/kp-themes`).
You change ONLY `css/<theme>-register.css` for the theme(s) you are given, plus a short "Applied 2026-10-13" note at the
end of `themes/<theme>/CHARACTER.md`, plus your report. Other agents edit the other themes' registers at the same time.

Never: edit `css/components.css`, `js/*`, `research/_review/*`, another theme's register, `forest` or `cyberpunk`
(both approved and finished); run `git` write commands (no add/commit/stash/checkout); run the npm test scripts,
Playwright test suites or Chromium. Firefox only. Do not call any `mcp__hearthbot__` tool. Do not install packages.

## Read first

- `docs/THEME_LESSONS.md` (all of it; 19-27, 31, 36-38 and 41 are about exactly this work).
- `themes/<theme>/CHARACTER.md`: the theme's grammar (its open motion, its signature effect, its timing). The theme
  keeps its OWN open motion, signature effect and timing values; you only make the mechanism right and make the theme's
  existing effect reach the parts that lack it.
- How forest and cyberpunk solved the same things: `grep -n -- "--kp-leave-state\|--kp-arrive-unseen\|--kp-leave-fold\|--kp-tour-dim\|--kp-calendar-busy-leave\|--kp-nav-close-time\|group-folding" css/forest-register.css css/cyberpunk-register.css`
  and the palette / phone bar rules in css/cyberpunk-register.css (search "palette", "kp-nav__links").

## Measure (Firefox; every script takes the theme from KP_THEME)

From `research/all-themes/_audit/`:
- `KP_THEME=<t> node pairs-meter.mjs --theme <t> --engine firefox [--only id,id]` : every open/close pair; a pair passes when
  the close lasts as long as the open and is its frames in reverse. Output also lists which animations run.
- `KP_THEME=<t> node identity.mjs --engine firefox [--only id,id]` then `node identity-summary.mjs <t>` : per part, which
  animation runs on open and on close (OWN = the theme's own, FADE = the package's bare fade, NONE = nothing).
- `KP_THEME=<t> node tab-paint.mjs` : focus must stay visible on every Tab stop (only "Review in a dialog" and "Copy
  answer" may read NOMARK). Run it once at the end.
Current results before you start: `out/<t>/pairs.txt`, `out/<t>/identity.txt`, `out/pairs-matrix.txt`.
Ignore: `wizard-step`, `empty-state`, `tabs-panel` (state changes, not pairs; known meter limits) and pairs that fail
the same way in forest (`calendar-busy` 95-113 %, `phone-bar` 10 %).

## What to fix, in this order

1. **Leaves and arrivals (lesson 19, 23, 24, 37).** In the theme's root block set the mechanism tokens:
   `--kp-leave-state: leave; --kp-arrive-unseen: skip; --kp-leave-fold-grow: 1; --kp-leave-fold-start: 0;`
   Fixes alert-close (open 0 ms), table-busy / upload-file (close 0 ms), toast (T). Where the calendar busy layer leaves
   at once, `--kp-calendar-busy-leave: hold` (cyberpunk) and give the layer the theme's leave.
2. **Tree branch (lesson 26).** The rule that keeps a shutting group drawn:
   `[data-theme='<t>'] .kp-tree [role='treeitem'][aria-expanded='false'] > [role='group'][data-kp-group-folding], ... + [role='group'][data-kp-group-folding] { display: block; }`
   (copy forest's two selectors).
3. **Tour (lesson 11, 22).** The page dim and ring close by default over forest's 1000 ms. Set
   `--kp-tour-dim-close: 0 0 0 0 transparent; --kp-tour-dim-time: <the tour card's open time>;
   --kp-tour-dim-close-ease: <the open curve reversed>` and, if the dim opens later than the card or shorter, the delay
   (`--kp-tour-dim-close-delay`) so that its close is its open mirrored inside the card's time. Measure: `--only tour`.
4. **The theme's own effect on every part that opens (lesson 38).** Palette (a bare FADE in most themes: give it the
   theme's dialog entrance, as cyberpunk did with `:is(.kp-palette, .kp-shortcuts)`), date picker panel and combobox list
   (NONE in many themes: give them the theme's popover/menu entrance), menus and popovers where NONE, the alarm where its
   close differs from its open. The close must be the open reversed (`[data-kp-closing]` / `[data-kp-reversing]` / the
   package's `playClose` read your keyframes: follow what the theme's existing dialog and popover rules already do).
5. **Navbar opening and closing** (in scope: coordinator, 2026-10-12): the hover dropdown (`bar-equipment`, it closes with
   no animation in Firefox: lesson 36, set `--kp-nav-close-time` to the theme's close time), the mega menu and the phone
   bar (`phone-bar`, toggle + links) open with the theme's own effect and close as its reverse. Only the navbar's motion;
   its layout, shape and font stay as they are.
6. Sidenav pairs that read 20-70 % off: look at lesson 31 (a clip that cuts the content on the close); fix if it is the
   mechanism, report if it is not.

## Rule for anything new

If the theme's CHARACTER.md does not decide the motion for a part (common for the navbar, the palette, the date picker),
apply the motion the theme already uses for the nearest part (its dialog for the palette, its popover/menu for the date
picker, the combobox and the navbar dropdown) and list it in the report under **Deviations for Kenny** (part, what it does
now, which existing rule it borrows). Never invent a new effect silently. Keep each theme's timing values.

## Report

Write `research/all-themes/reports/<theme>.md` (English): for each fix the part, the cause, what you changed (selector),
and before/after numbers (pairs row: open/close ms and worst %; identity: OWN/FADE/NONE). Then **Deviations for Kenny**,
then **Still failing** with the reason. Last line: the measured wall time of your measurement runs.
Your final message to me: the report path(s) and one line per theme (pairs passing before → after).
