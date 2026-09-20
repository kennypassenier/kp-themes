# gap-10 — a theme inside a theme

**Measured 2026-09-20**, Firefox, `research/gap-10-nested-themes/demo.html`
with the catalogue's own `deps.css` (the tokens, the components and all
twenty-two registers in the package's cascade order).

## What works

One level deep, nesting is right. A pane carrying `data-theme="cyberpunk"`
inside a `formal` page gets cyberpunk's tokens _and_ cyberpunk's register:

|                  | outside (formal) | inside cyberpunk                                  |
| ---------------- | ---------------- | ------------------------------------------------- |
| `border-radius`  | 6px              | 0px                                               |
| `clip-path`      | none             | `polygon(0 0, 100% 0, 100% calc(100% - 14px), …)` |
| `font-family`    | Instrument Sans  | Rajdhani                                          |
| `letter-spacing` | normal           | 1.728px                                           |

## What does not

A third level. A pane carrying `data-theme="formal"` inside a
`data-theme="nostromo"` pane reads:

| property         | measured          | whose it is                            |
| ---------------- | ----------------- | -------------------------------------- |
| `border-radius`  | 6px               | formal's — tokens nest                 |
| background       | `rgb(34, 54, 89)` | formal's — tokens nest                 |
| `letter-spacing` | 1.56px            | **nostromo's** — the register leaks in |
| `font-family`    | ui-monospace      | **nostromo's** — the register leaks in |

Two themes on one button, decided property by property. The reason is the
shape of every register rule: `[data-theme='nostromo'] .kp-button` is a
descendant selector, so it matches that button too. The inner
`[data-theme='formal'] .kp-button` has the same specificity, so file order
decides rather than nesting depth.

## What would fix it

`@scope`, which is what it is for:

```css
@scope ([data-theme='nostromo']) to ([data-theme]) {
    .kp-button { … }
}
```

The rules apply inside the theme and stop at the first element that wears a
theme of its own. Without `@scope`, the same intent has to be repeated in
every selector as `:not([data-theme] *)`.

Either way it touches all 22 register files and every rule in them — on the
order of four thousand selectors. That is a mini-round with its own
measurement, not a repair to slip in beside something else.

## Why it matters, and to whom

The package documents that `data-theme` works on any element. Today that is
true for the colours and false for the shapes, and nothing says so. The
first page to hit it was the compare page, which puts two themed columns
beside each other — one level deep, so it is fine. Anything deeper (a themed
preview inside a themed settings pane, a widget gallery) gets two themes at
once.
