# The utility API

115 single-purpose classes in `@layer kp.utilities`, the last layer, so a
utility beats a component's own value without `!important` (AR17). They
are generated from `gates/generate-utilities.mjs`; **this list is written
by hand**, and `gates/check-utilities.mjs` lays the two beside each other
in both directions. A list generated from the same source could not
disagree with the stylesheet, so it would measure nothing.

An entry in this document is a name written **with its leading dot**
inside backticks, as `.kp-p-md`. A name written without the dot, as
`kp-grid`, is a reference to something that lives elsewhere and is not
read as an entry.

Import it beside the tokens:

```html
<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/themes.css" />
<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/layout.css" />
<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/utilities.css" />
```

There are **no breakpoint variants**. A `.kp-p-md@md` family multiplies
this list by the number of breakpoints, and each variant would need its
own line here and its own test. Responsive work is done by the layout
containers, which use container queries (TH96).

The scale steps are `0`, `xs`, `sm`, `md`, `lg`, `xl` and `2xl`. Every
step but `0` reads the theme's own `--kp-space-*` token, so a theme that
retunes its scale moves every utility with it.

---

## Spacing

Logical properties throughout, so they follow the writing direction.

| Class          | Property              |
| -------------- | --------------------- |
| `.kp-p-0` … `.kp-p-2xl` | `padding` |
| `.kp-px-0` … `.kp-px-2xl` | `padding-inline` |
| `.kp-py-0` … `.kp-py-2xl` | `padding-block` |
| `.kp-m-0` … `.kp-m-2xl` | `margin` |
| `.kp-mt-0` … `.kp-mt-2xl` | `margin-block-start` |
| `.kp-mb-0` … `.kp-mb-2xl` | `margin-block-end` |
| `.kp-mx-auto` | `margin-inline: auto` |

Written out, the seven steps of each family are:

- `.kp-p-0`, `.kp-p-xs`, `.kp-p-sm`, `.kp-p-md`, `.kp-p-lg`, `.kp-p-xl`, `.kp-p-2xl`
- `.kp-px-0`, `.kp-px-xs`, `.kp-px-sm`, `.kp-px-md`, `.kp-px-lg`, `.kp-px-xl`, `.kp-px-2xl`
- `.kp-py-0`, `.kp-py-xs`, `.kp-py-sm`, `.kp-py-md`, `.kp-py-lg`, `.kp-py-xl`, `.kp-py-2xl`
- `.kp-m-0`, `.kp-m-xs`, `.kp-m-sm`, `.kp-m-md`, `.kp-m-lg`, `.kp-m-xl`, `.kp-m-2xl`
- `.kp-mt-0`, `.kp-mt-xs`, `.kp-mt-sm`, `.kp-mt-md`, `.kp-mt-lg`, `.kp-mt-xl`, `.kp-mt-2xl`
- `.kp-mb-0`, `.kp-mb-xs`, `.kp-mb-sm`, `.kp-mb-md`, `.kp-mb-lg`, `.kp-mb-xl`, `.kp-mb-2xl`

## Gap

For a flex or grid container. Inert on anything else, which is why the
family is separate from the padding family rather than folded into it.

- `.kp-gap-0`, `.kp-gap-xs`, `.kp-gap-sm`, `.kp-gap-md`, `.kp-gap-lg`, `.kp-gap-xl`, `.kp-gap-2xl` — `gap`
- `.kp-gap-x-0`, `.kp-gap-x-xs`, `.kp-gap-x-sm`, `.kp-gap-x-md`, `.kp-gap-x-lg`, `.kp-gap-x-xl`, `.kp-gap-x-2xl` — `column-gap`
- `.kp-gap-y-0`, `.kp-gap-y-xs`, `.kp-gap-y-sm`, `.kp-gap-y-md`, `.kp-gap-y-lg`, `.kp-gap-y-xl`, `.kp-gap-y-2xl` — `row-gap`

## Display

`.kp-d-grid` carries the `d-` prefix because `kp-grid` is already the
dashboard grid component. The collision gate is what found that.

| Class | Value |
| ----- | ----- |
| `.kp-d-block` | `block` |
| `.kp-d-inline` | `inline` |
| `.kp-d-inline-block` | `inline-block` |
| `.kp-d-flex` | `flex` |
| `.kp-d-inline-flex` | `inline-flex` |
| `.kp-d-grid` | `grid` |
| `.kp-d-none` | `none` |

## Flex and grid alignment

Both box models read these properties, so they work on a grid container
as well.

| Class | Property and value |
| ----- | ------------------ |
| `.kp-items-start` | `align-items: flex-start` |
| `.kp-items-center` | `align-items: center` |
| `.kp-items-end` | `align-items: flex-end` |
| `.kp-items-stretch` | `align-items: stretch` |
| `.kp-items-baseline` | `align-items: baseline` |
| `.kp-justify-start` | `justify-content: flex-start` |
| `.kp-justify-center` | `justify-content: center` |
| `.kp-justify-end` | `justify-content: flex-end` |
| `.kp-justify-between` | `justify-content: space-between` |
| `.kp-justify-around` | `justify-content: space-around` |
| `.kp-flex-row` | `flex-direction: row` |
| `.kp-flex-column` | `flex-direction: column` |
| `.kp-flex-wrap` | `flex-wrap: wrap` |
| `.kp-flex-nowrap` | `flex-wrap: nowrap` |
| `.kp-flex-1` | `flex: 1 1 0%` |
| `.kp-flex-auto` | `flex: 1 1 auto` |
| `.kp-flex-none` | `flex: 0 0 auto` |
| `.kp-self-start` | `align-self: flex-start` |
| `.kp-self-center` | `align-self: center` |
| `.kp-self-end` | `align-self: flex-end` |
| `.kp-self-stretch` | `align-self: stretch` |

## Text

There is **no font-size family**. The typography scale is not a token
yet, and the three knobs that look like one disagree about their own
default: `--kp-text-sm` falls back to `0.8125rem` in twenty rules and to
`0.875rem` in five. Declaring it would move one of those groups.
That is R0-TYPO, quarantined at R0 and still open; the font-size
family waits for it.

Text alignment, the muted colour, the mono face, the prose measure and
the code block are **layout classes** (TH91), not utilities:
`kp-text-end`, `kp-text-center`, `kp-text-muted`, `kp-prose`,
`kp-mono` and `kp-code-block` are documented with the layout layer.

| Class | Property and value |
| ----- | ------------------ |
| `.kp-fw-normal` | `font-weight: 400` |
| `.kp-fw-medium` | `font-weight: 500` |
| `.kp-fw-semibold` | `font-weight: 600` |
| `.kp-fw-bold` | `font-weight: 700` |
| `.kp-tt-upper` | `text-transform: uppercase` |
| `.kp-tt-lower` | `text-transform: lowercase` |
| `.kp-tt-capitalize` | `text-transform: capitalize` |
| `.kp-text-nowrap` | `white-space: nowrap` |
| `.kp-text-balance` | `text-wrap: balance` |
| `.kp-text-pretty` | `text-wrap: pretty` |
| `.kp-lh-tight` | `line-height: 1.25` |
| `.kp-lh-normal` | `line-height: 1.5` |
| `.kp-lh-loose` | `line-height: 1.75` |

## Width and height

The three measures read the same knobs the layout containers do, so
retuning `--kp-prose-max` moves `kp-prose` and `.kp-max-w-prose`
together.

| Class | Property and value |
| ----- | ------------------ |
| `.kp-w-full` | `inline-size: 100%` |
| `.kp-w-auto` | `inline-size: auto` |
| `.kp-w-min` | `inline-size: min-content` |
| `.kp-w-max` | `inline-size: max-content` |
| `.kp-w-fit` | `inline-size: fit-content` |
| `.kp-max-w-prose` | `max-inline-size: var(--kp-prose-max, 65ch)` |
| `.kp-max-w-center` | `max-inline-size: var(--kp-center-max, 28rem)` |
| `.kp-max-w-page` | `max-inline-size: var(--kp-page-max, 64rem)` |
| `.kp-h-full` | `block-size: 100%` |
| `.kp-h-auto` | `block-size: auto` |

---

## What every one of these is configurable with

A utility that reads the scale needs no second knob: the token is the
knob. A utility that sets a fixed keyword carries one anyway, so a
consumer can retune it without overriding the class (KT6):
`--kp-d-flex`, `--kp-fw-bold`, `--kp-lh-tight` and their siblings.

## The name is a promise

Every class here falls under the same semver promise as the component
classes (AR23): renaming one is a major version. The documentation
site's own chrome keeps the `sc-` prefix, so the site can restyle itself
without touching this contract.
