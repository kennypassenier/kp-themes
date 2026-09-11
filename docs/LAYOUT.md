# The layout layer

Twenty-three classes for the shape of a page, in `@layer kp.layout`. That
layer sits after `kp.components`, so adding a layout class to a component
that sets the same property itself wins, without `!important` (AR17).

They exist because a consumer measured the gap. The chassis kit wrote 71
lines of its own layout glue and 28 inline `style` attributes, and its
stylesheet header said in so many words that this was the layout the
package deliberately did not ship. These are that layout.

Import it beside the tokens:

```html
<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/themes.css" />
<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/components.css" />
<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/layout.css" />
```

Every value reads a `--kp-*` knob whose default is the theme's own
spacing scale, so a page or a theme retunes it without rewriting the
rule. Nothing here paints a colour that is not a token.

---

## Containers

**`.kp-page`** is the page itself: a measure to read within, centred,
with margins that shrink on a phone rather than stepping at a
breakpoint. Knobs: `--kp-page-max` (64rem), `--kp-page-pad`,
`--kp-page-pad-block`.

**`.kp-stack`** is vertical rhythm, and it is the fault this round
started from. Two fields and a button touched because a field has no
vertical margin and nothing above it supplied one. Knob:
`--kp-stack-gap`.

**`.kp-row`** is a row of controls that wraps rather than overflowing,
centred by default. Four modifiers change one thing each:
`.kp-row--end` aligns on the bottom edge, `.kp-row--start` on the top,
`.kp-row--between` pushes the ends apart, and `.kp-row--nowrap` refuses
to wrap. Knobs: `--kp-row-gap`, `--kp-row-align`.

**`.kp-autogrid`** is a grid that adds a column when there is room for
one, with no breakpoint anywhere. It keeps a little air on all four
sides so the first column's text never sits against the edge of whatever
it lands in (Kenny, 2026-09-08). Knobs: `--kp-autogrid-min` (16rem),
`--kp-autogrid-gap`, `--kp-autogrid-pad` (`--kp-space-sm`; set it to `0`
for a grid that should reach its container's edge).

**`.kp-sidebar`** with `.kp-sidebar__aside` and `.kp-sidebar__main` is
a sidebar that drops below its main column when the main column would
be narrower than half the track. Knobs: `--kp-sidebar-width` (16rem),
`--kp-sidebar-gap`, `--kp-sidebar-break` (50%).

Adding **`data-kp-sidebar`** makes that aside something a reader can put
away, and a **`.kp-sidebar__toggle`** button inside it is what does the
putting. It is opt-in on purpose: three example pages and the
documentation site's own chrome already use the plain two-column form,
and they keep it exactly as it was.

The state lives in `data-kp-sidebar-open`, which takes `true` or `false`
— and, when it is absent, lets the width decide. Wide, the aside is
there and the toggle takes it away; below the 40rem step the aside is
away and the toggle brings it back, over the main column rather than
shoving it down. **`.kp-sidebar--push`** is the other choice: the aside
takes its own row and the main column moves down to make room. Knobs for
the covering form: `--kp-sidebar-drawer` (`min(18rem, 85%)`),
`--kp-sidebar-layer` (40), `--kp-sidebar-surface` (`--card`),
`--kp-sidebar-edge`, `--kp-sidebar-pad`.

The drawer starts below the toggle rather than behind it, and the row it
clears is `--kp-sidebar-toggle-size` (2.25rem) — the package sets that
height, so it knows where the drawer begins. A taller button of your own
raises the token.

`js/components.js` exports `attachSidebars()`, which `js/auto.js` calls
for the whole page. It reads what the browser paints rather than the
attribute, so it agrees with the width instead of guessing at it; it
fires `kp-sidebar-toggle` with `{ open }`; and Escape or a click outside
closes the aside while it is covering the page. Remembering is off until
the page names a key in `data-kp-sidebar-remember`, because a package
that writes into a consumer's storage unasked has decided something that
was not its to decide.

**`.kp-section`** puts space above itself, except as the first child,
where the space would push the page down for no reason. Knob:
`--kp-section-gap`.

**`.kp-center`** caps a narrow measure and sits in the middle of
whatever holds it. Knob: `--kp-center-max` (28rem).

## Text and content

**`.kp-prose`** stops a run of text at a readable measure. Knob:
`--kp-prose-max` (65ch).

**`.kp-text-muted`** is exactly the theme's `--muted-foreground`, never
a lightened copy of the body colour.

**`.kp-text-end`** and **`.kp-text-center`** align text. They are the
reason the layer exists at all: a table cell sets its own alignment at
higher specificity, so before the cascade layers these two did nothing
inside a table.

**`.kp-mono`** is the package's own monospace face, through
`--kp-mono-face` onto `--font-mono`. Knob: `--kp-mono-size` (0.9em).

**`.kp-code-block`** is a block of code on a card, and it breaks a long
unbroken key rather than widening the page.

## State

**`[aria-busy='true']`** is the busy state made visible: the element
dims and the cursor becomes a progress cursor. It is an attribute
selector rather than a class because the attribute is what a screen
reader already reads, and a busy control that looks identical to an idle
one is the fault correction KT6 exists about. Knob:
`--kp-busy-opacity` (0.7).

---

## Staying put, and where an anchor lands

**`[data-kp-sticky]`** makes an element stay at the top while the page
scrolls. It is an attribute rather than a class because staying put is
something this element does on this page, not a kind of element. Knobs:
`--kp-sticky-top` (0), `--kp-sticky-layer` (30).

It has a partner. **`--kp-scroll-offset`** (0px) is how far an in-page
link stops short of the top, and a page that sticks something sets it to
the height of what it stuck. Without it the skip link every page carries
lands underneath the bar, and the person using that link is exactly the
person who cannot see that it did.

**`--kp-scroll-behavior`** (auto) turns on smooth scrolling. It is read
inside the reduced-motion guard, so `smooth` cannot survive a reader who
asked for less motion.

All three defaults change nothing: a page that does not ask gets what it
got before.

## The twenty-eight knobs

`--kp-page-max`, `--kp-page-pad`, `--kp-page-pad-block`,
`--kp-stack-gap`, `--kp-row-gap`, `--kp-row-align`, `--kp-autogrid-min`,
`--kp-autogrid-gap`, `--kp-autogrid-pad`, `--kp-sidebar-width`, `--kp-sidebar-gap`,
`--kp-sidebar-break`, `--kp-sidebar-drawer`, `--kp-sidebar-layer`,
`--kp-sidebar-surface`, `--kp-sidebar-edge`, `--kp-sidebar-pad`,
`--kp-sidebar-toggle-size`,
`--kp-section-gap`, `--kp-center-max`,
`--kp-prose-max`, `--kp-mono-face`, `--kp-mono-size`,
`--kp-busy-opacity`, `--kp-sticky-top`, `--kp-sticky-layer`,
`--kp-scroll-offset`, `--kp-scroll-behavior`.

## The name is a promise

Every class here falls under the same semver promise as the component
classes: renaming one is a major version.
