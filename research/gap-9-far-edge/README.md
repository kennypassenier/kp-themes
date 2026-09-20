# gap-9 — the panel at the far edge

`research/gap-9-far-edge/demo.html` puts the two side by side: the panel as
it is today and the panel with the same transition the near edge already
has. Both open from the right; the theme picker at the top changes the
register under them, because the timing and the easing are the theme's.

## What the code says today

`css/components.css`:

```css
@media (prefers-reduced-motion: no-preference) {
    .kp-sidenav {
        transition: translate var(--kp-sidenav-duration, var(--fx-duration, 220ms)) var(--kp-sidenav-ease, var(--fx-ease, ease));
    }

    /* Except from the far edge … Recorded as gap-9. */
    .kp-sidenav[data-kp-sidenav-side='end'] {
        transition: none;
    }
}
```

So the near edge slides and the far edge appears. Kenny, 2026-09-11, after
two attempts at it: _"die is nog altijd fucked up. Maar voorlopig laten we
het er gewoon uit"_.

## What the demo changes

One rule, and nothing else on the page:

```css
.as-proposed .kp-sidenav[data-kp-sidenav-side='end'] {
    transition: translate var(--kp-sidenav-duration, var(--fx-duration, 220ms)) var(--kp-sidenav-ease, var(--fx-ease, ease));
}
```

## What to look at

- Does the right-hand panel travel, or does it still stutter? The two
  earlier attempts both read as rough — first on the bare `ease` fallback,
  then on the theme's own timing with the backdrop fading beside it.
- Does it differ per theme? pastel overshoots by design and terminal steps;
  if the roughness is one register's, that is a different fault from a
  general one.
- The backdrop fades on its own timing. If the two read as one movement,
  the pair is right; if they read as two, the backdrop is the thing to fix
  rather than the panel.

## Measured, 2026-09-20

Kenny asked for the frames before deciding, because the eye had been wrong
about this twice. Firefox, the demo page, the panel's own `translate` read
once per animation frame from the click until it stopped, after letting the
closing transition finish first:

| theme                   | declared | frames that moved | over   | worst gap |
| ----------------------- | -------- | ----------------- | ------ | --------- |
| formal                  | 180 ms   | 11                | 166 ms | 17 ms     |
| dark                    | 220 ms   | 14                | 216 ms | 17 ms     |
| cyberpunk               | 180 ms   | 12                | 182 ms | 18 ms     |
| pastel                  | 220 ms   | 15                | 232 ms | 18 ms     |
| nostromo                | 160 ms   | 10                | 150 ms | 18 ms     |
| terminal                | 90 ms    | 2                 | 51 ms  | 51 ms     |
| all six, as it is today | —        | 0                 | 0 ms   | —         |

So: **no dropped frames.** Five of the six run at one frame every 17 to
18 ms, which is 60 Hz with nothing missed, and the movement lasts as long
as the register says it should.

The sixth is not a fault either. terminal declares
`--fx-ease: steps(2, end)` over 90 ms, so two steps is exactly what it
asked for — the 51 ms gap is the step, not a dropped frame. pastel's
`cubic-bezier(0.34, 1.56, 0.64, 1)` overshoots by design, which is why its
movement runs 232 ms against a declared 220.

The first harness read 50 ms and 4 frames for dark and had to be thrown
away: it opened the panel while the closing transition was still running
and measured the remainder. Written down because the number looked
plausible enough to report.

**Still not measured:** what it looks like beside the near edge on Kenny's
own screen. The frames say the movement is whole; whether the two edges
read as one gesture is his eye's to say.

## Decided, 2026-09-20

Kenny, on the measurement: **"Zo invoeren"**. The exception is out of
`css/components.css`; the far edge transitions its own `translate` on the
register's duration and easing, like every other side.
`tests/sidenav.spec.mjs` holds it: the panel's computed
`transition-property` names `translate` and its duration is not `0s`. Red
against the code that carried the exception, green after it went.

This page keeps both behaviours side by side — the left panel now carries
the override — so the thing that was removed is still there to look at.
