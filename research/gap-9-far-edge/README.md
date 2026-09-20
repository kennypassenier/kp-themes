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

**Not measured here:** frame timing. The two earlier attempts were judged by
eye, and so is this one. If it still reads rough, the next step is a frame
record of both panels in the same run, which is the only way to say whether
the panel drops frames or the eye is comparing it with the near edge.
