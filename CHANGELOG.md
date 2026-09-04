# Changelog

## 1.1.0 — 2026-09-04

Types, and the promise that a version does not move under you.

**Everything here came from a consumer, on the day 1.0.0 shipped.**
JobTracker adopted it and could not: the package carried no type
declarations at all — no `types`, no `typings`, not one `.d.ts` — while
the README, the user guide and the ecosystem entry all promised a `Theme`
type. Their own code was clean; all seven errors were in ours.

### The package ships types

A `.d.ts` beside every entry point, generated from the JSDoc sources and
held in step by a gate, the same contract as the stylesheets and the Home
Assistant themes. `index.d.ts` is published too, which it would not have
been: `files` named `index.js` as a file rather than a directory, so the
main entry point would have arrived without types a second time. The gate
found that before the release did.

### `Theme` is the eleven names, not `string`

It was `@typedef {string} Theme`, which meant the type promised something
it did not deliver: `applyTheme('formeel')` type-checked and then fell
back to `formal` at runtime. It is the generated union now.

Only the OUTPUTS narrowed. What a function accepts stayed lenient —
`storeTheme` and `initializeTheme` still take a plain string — because
narrowing an input breaks a consumer that reads a theme out of config or a
database, which is what JobTracker and kp-soft both do. Narrowing a return
value cannot break anyone. Use `isTheme()` to narrow a string you hold.

That change is why this is 1.1.0 rather than 1.0.1.

### One real defect, found by a stricter compiler

`tabs[index].focus()` in the tab-list keyboard handler had no guard. Under
`noUncheckedIndexedAccess` it is a type error; in a browser it is a thrown
`TypeError` that stops the key handler on an out-of-range index.

### A gate that checks what a consumer gets

`npm run check:types` type-checks OUR sources with OUR resolution — bundler,
`noUncheckedIndexedAccess` off — and could never have seen this. The new
gate packs the tarball and asserts that every published entry point carries
a declaration inside it.

It does not pretend to be a consumer's type checker. Two attempts to build
that could not fail — the first fell back to the `.js` beside the missing
`.d.ts`, the second because TypeScript 7 infers types from a dependency's
JSDoc where JobTracker's compiler does not — and a check that cannot fail
is the one thing this project has a rule against.

### Documentation that matched the decisions

The README still documented an npm setting and a Tailwind `@source` as
requirements after both were struck, and still pinned `#v0.1.1`. It now
says what this package is: a source, with one promise.

**A released version of a theme never changes.** The token values of `dark`
at v1.0.0 are its values at v1.0.0 forever; any change raises the version,
including a correction of a value that is plainly wrong. Pin one and stop
thinking about it. Every release carries a version number, a provenance
line and `SHA256SUMS`, and that is the whole of what a consumer can rely on
mechanically.

Also: how to keep another framework's theme flag in step using the theme
event, without a second list of which themes are dark — two consumers were
found keeping one, and both had it wrong. And why a theme switch can look
stuck in a browser that renders no frames.

---

## 1.0.0 — 2026-09-04

The first release of kp-themes as its own thing. v0.1.1 was the
extraction from kp-soft: seven palettes, a React hook, a switcher, and
one contrast check. This is a package.

**It is a breaking release, and the breaks are worth the price.** They are
listed with what each becomes in [MIGRATION.md](MIGRATION.md); the short
version is that a copy of every theme's colours used to live in
JavaScript, and it is gone.

### Two channels, sharing one state

React for a consumer with a build step, and framework-free — CSS classes
plus a `<script type="module">` that attaches behaviour to markup your own
server wrote. They render the same class names and share the same state,
so a page can mix them and nothing betrays which is which.

That state lives on the document rather than in a React module, which is
what makes it possible: a plain `<script>` cannot reach a React closure,
so two pickers on one page would each have set the theme correctly and
each failed to update the other's mark. A change from either is announced
as one DOM event, and a choice made in another tab arrives on the same
one.

### Eleven themes

The seven that came from kp-soft — formal, light, dark, cyberpunk,
pastel, terminal, topo — and four that fill gaps the set had:

- **high-contrast** — black on white with one signal yellow. The only
  theme here whose reason is not taste.
- **sepia** — warm parchment and brown ink, no cool hue in the reading
  surface. The restful one.
- **blueprint** — cyan on Prussian blue, ruled like a technical drawing.
  Topo is a map; this is the drawing of a thing that does not exist yet.
- **solstice** — warm dark: charcoal, amber and rust, for the reader who
  finds dark clinical and cyberpunk loud.

Each has an anatomy document saying what it is, what is load-bearing, and
what it deliberately does not do. Colour choices come from those
documents rather than from taste.

### A theme is complete now

Links, visited links, text selection, code, kbd, mark, blockquote, list
markers, placeholders, invalid fields, the checkbox tick, and a print
stylesheet. Before this, a consumer who took the palette and wrote
ordinary HTML got a themed page with browser-default holes in it — the
browser's own link blue scored 1.99 against the dark theme's background,
where 4.5 is the floor.

Eighteen components in both channels: button, badge, table, alert, form
field, card, navigation bar, and the eleven overlays. Two of their
contracts are enforced rather than documented — a destructive action must
offer an undo or a confirmation, and a badge whose colour means something
must also say what it means.

### Motion is part of a theme's character

`--fx-duration`, `--fx-ease` and `--fx-lift` were declared by every theme
and used by nothing. Every transition reads them now: terminal steps
rather than eases, because a character display jumps; pastel overshoots;
formal, sepia and high-contrast do not move things at all. Each theme has
at most one gesture of its own, and two have none on purpose.

### Home Assistant

`ha/kp-*.yaml` is the same eleven themes as Home Assistant themes,
generated from the same token sources, so a dashboard and a web page mean
the same thing by "primary". Where card-mod is installed they carry the
theme's timing too.

### Eleven gates, and a rule about them

Contrast, the design invariants, the flash threshold, reduced-motion
guards, token parity, layer discipline, the type check, and whether the
generated files still match their sources — all in Node, all under a
second, all blocking a commit. A behaviour suite of 182 tests runs in
Chromium and Firefox.

Every one of them has been shown red on a deliberately injected violation
before being trusted, because one check in this project was written,
reported as built, and never ran once.

### What they found

Not theory. Each of these was live in the code:

- `fx-flicker` made 5.5 opposing luminance changes per second where
  SC 2.3.1 allows three.
- The focus ring measured 1.00 — identical luminance — against a primary
  button in three themes.
- `--color-scheme` was declared by every theme and applied by nothing, so
  the browser drew light scrollbars over every dark theme.
- 42 colour literals duplicated tokens, three of which had already
  drifted from the token they came from.
- The pressed state was invisible in cyberpunk and terminal.
- `--chart-4` in pastel sat at 2.20 against the page where 3.0 is the
  floor: a chart series nobody could see.
- The whole framework-free channel was missing from the published
  package, found by the first field test.
- Both typefaces a theme declares were applied almost nowhere, so a
  vendored copy rendered in Times New Roman.

### Also

MIT licence. Checksums beside the release tag, because kyu and almanac
vendor the stylesheet and have no npm to verify anything for them. A
showcase at <https://kennypassenier.github.io/kp-themes/> showing all
eleven themes and everything in them.

---

## 0.1.1 — 2026-09-02

Extraction from kp-soft at commit `2983abb`: the seven themes, the
registers, the cyberpunk effects, the theme hook and switcher, the
contrast check, and the seven status-colour tokens JobTracker needed.
