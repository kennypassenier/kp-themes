# research/sidenav-minor

Six small options for the window-edge side navigation, off by default (Kenny's "minor options" round,
2026-10-14; the survey is research/sidenav-edge/OTHER-LIBRARIES.md).

| Option | Attribute or token |
| --- | --- |
| Width on a narrow screen | `--kp-sidenav-width-narrow` |
| Floating variant | `data-kp-sidenav-variant="floating"` |
| Inset variant | `data-kp-sidenav-variant="inset"` |
| Peek strip | `--kp-sidenav-peek` |
| Density presets | `data-kp-sidenav-density="compact\|comfortable"` |
| Action beside an item | `.kp-sidenav__row` + `.kp-sidenav__action` |

- `look.html` is the demo (one section per option, every window plays by itself). `build.mjs` writes it and the frame pages
  (`narrow.html`, `floating.html`, `inset.html`, `peek.html`, `density.html`, `action.html`) from `options.mjs`; `play.js` plays a
  frame, `frame.js` and `frame.css` dress it, `look.js` and `look.css` dress the page.
- `baseline.mjs` is the no-change proof: Firefox, every theme, both motion preferences, shut and open, every computed property of
  the previous demo's pages (research/sidenav-edge), captured before and after, then `diff`.
- `shut-leak.mjs`, `shut-state.mjs`, `mid.mjs` and `shots.mjs` are the checks and the photographs behind docs/THEME_LESSONS.md
  lessons 56 to 58. Not tests; no gate runs them.
