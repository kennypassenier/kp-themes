<!-- Copied from kp-soft on 2026-09-02 at commit 2983abb; kp-themes is the home of the house themes from now on -->

# Theming — how it works and how to change it without breaking it

Written for a future maintainer working WITHOUT an assistant. Everything
here is deliberately boring: plain CSS custom properties, one TypeScript
record, and three automated gates that tell you when you missed a spot.

## The mental model

A theme is **one block of CSS custom properties** in
`resources/css/app.css`, keyed on `[data-theme='name']`. Roughly thirty
tokens: background, foreground, card, primary, borders, five chart
colours, a sidebar set, a radius and optionally a display font. Every
component in the app is written against the *token names* (`bg-card`,
`text-muted-foreground`), never against literal colours — that is the
whole trick. Nothing else in the codebase knows what "cyberpunk" looks
like.

On top of the palette sits an optional **register layer**: each theme
may declare `--fx-texture` (+ size and opacity), which one shared
`body::after` rule renders as a full-viewport texture — graph paper for
light, a starfield for dark, scanlines for terminal. A theme that
declares nothing renders nothing. All of this is plain CSS; there is no
JavaScript anywhere in how a theme looks.

## Adding a theme = two edits

1. **`resources/css/app.css`** — copy an existing `[data-theme='x']`
   block, rename it, change the colours. Optionally add an
   `--fx-texture` block next to the other register blocks.
2. **`resources/js/hooks/use-appearance.tsx`** — add one line to
   `THEME_META` (label, dark yes/no, three preview colours).

That is genuinely all. The theme switcher, the settings previews, the
`/themas` showcase page and the dark-class handling all derive from
`THEME_META`; the contrast checker discovers themes by scanning the CSS
for `[data-theme]` blocks; the server-side validation list in
`routes/settings.php` is the one manual list left, and a test fails
loudly when it drifts (see below).

## The safety nets (you cannot silently break a theme)

| Gate | Catches |
|---|---|
| `scripts/check-contrast.mjs` (pre-commit + CI) | any colour pair in ANY theme dropping under WCAG AA. Discovers themes from the CSS itself, so a new theme is checked from its first commit. |
| TypeScript (`tsc`, pre-commit + CI) | a `THEME_META` entry with a missing field, or code referencing a theme that does not exist. |
| `tests/Feature/ThemeSyncTest.php` | the server-side validation list or the client record drifting from the stylesheet. |

So the workflow is: edit boldly, run `git commit`, and read what the
gates say. A theme that commits is a theme that works.

## Things that look magic but are not

- **The `[data-theme]` alias re-declaration block** in app.css: Tailwind
  v4 resolves `var()` where a property is *declared*, so the
  `--color-*` aliases must be re-declared on `[data-theme]` for nested
  theme scopes (the showcase page) to work. It is one static block; you
  never need to touch it. The comment above it explains the trap.
- **Fonts**: loaded in `resources/views/app.blade.php` from Bunny Fonts.
  A theme wanting its own display face sets `--theme-font-display`
  (see formal/terminal); add the family to the blade link tag.
- **Member choice vs section default**: `useTheme()` in
  use-appearance.tsx. Precedence: member's saved theme > guest's local
  choice > section default from the server. On save failure the UI
  reverts — never "fix" that by removing the revert.

## Taste rules that keep it looking professional

These are conventions, not enforced — but they are why it looks sharp:

- Texture opacity stays at or under ~6%; the register layer must be
  *felt*, not seen. When in doubt, halve it.
- A theme changes tokens, never component markup. The moment a
  component needs `if (theme === ...)`, stop: model it as a token
  instead (that is what `--fx-*` and `--theme-font-display` are).
- Every surface pair you introduce must appear in
  `scripts/check-contrast.mjs` PAIRS so the gate owns it.
