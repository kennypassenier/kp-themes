# Changelog

## 2.0.0 — unreleased

**The words on screen changed from Dutch to English.** That is the whole
breaking change, and `STRINGS_NL` is the one-line undo. See MIGRATION.md.

Correction KT5. Every user-visible string in the package was written into
the component that renders it, in Dutch, with no way for a consumer to
pass a different one. The fault is not the language — a hardcoded English
string is the same defect — it is that there was no door. JobTracker had
adopted only the components that carry no text at all, which is what the
defect looks like from outside.

### One dictionary

`js/strings.js` holds all 72 keys with English defaults, frozen. Keys that
vary take arguments — `tableRowsFiltered(shown, total)`, `removeNamed(name)`,
`wizardStep(at, of)` — so a consumer can reorder for their own grammar
instead of concatenating ours.

`STRINGS_NL` exports the Dutch that used to be the default, for kyu,
almanac and kp-soft.

### Three ways in, nearest wins

A `strings` prop on any component, a `StringsProvider` from
`hooks/use-strings.jsx` for a subtree, or `setStrings()` globally for the
framework-free channel. Every override is partial. A consumer who does
nothing gets English.

### The screen-reader half

The announcements are the part of this that matters most, because they
fail silently and only for the people who cannot see that they failed. A
copied value announced `` `${value} gekopieerd` ``; the DataTable
announced its filtered row count in Dutch into an `aria-live` region.
Both now come from the dictionary, and the gate does not know they are
special: they are strings.

### `js/contrast.js` is public

The WCAG primitives moved out of `gates/colour.mjs` so a consumer measures
a ratio with the same code our gate measures it with, rather than a second
opinion. `gates/colour.mjs` re-exports from it, unchanged for anyone
importing it there.

### The gate

`npm run check:strings` reads our source and refuses a user-visible
literal that does not come from the dictionary — the same shape as the
layer gate. It matches sinks rather than shapes: where a literal _goes_
(`textContent`, `placeholder`, `setAttribute('aria-label', …)`, JSX
attributes and text nodes, and a bare literal inside a JSX expression),
not what it looks like.

Drilled red in all four of those shapes before it was trusted. It passed
the fourth on the first attempt — the sr-only case, which is the one KT5
exists about — and was fixed. The drills are frozen in
`gates/gates.test.mjs` so the exemptions cannot widen back over them.

## 1.2.0 — 2026-09-04

Twenty-two components, in both channels. Kenny asked for a DataTable and
"top of the line forms", then went through
<https://github.com/brillout/awesome-react-components> with me and rated
the rest.

### The two that were asked for

**DataTable** — sorting, global filtering, pagination, row selection, an
empty state, and a narrow layout where each row becomes a card carrying
its column names. Measured against TanStack Table's feature list, which
is what "best in 2026" means. Deliberately without virtualisation,
in-cell editing or export: that is a grid, a different product, and the
decision is recorded rather than forgotten.

The features were the easy part. `aria-sort` lands on the sorted column
and nowhere else, the row count after a filter is announced, a number
column sorts as numbers, and the header checkbox goes indeterminate on a
partial selection — because a box reading "checked" while one of three
rows is selected is a lie.

**Forms** — the browser already validates; what it does not do is put the
message where a screen reader will read it, gather the errors, or move
focus to them. The summary takes focus rather than merely appearing,
`aria-describedby` is appended to rather than replaced, and validation
reports on blur. Telling someone their email is invalid while they type
the third character is technically true and practically hostile.

### The rest of the round

Combobox and tag input on a shared listbox engine, with virtual focus.
Command palette and shortcut sheet, together, because a palette without
discoverability is a secret. Tree, drag-to-reorder and split pane — all
keyboard-first, no drag library. Date picker, file upload, step wizard.
Empty states that know the difference between "nothing yet" and "nothing
matched", optimistic actions with undo, status parts, a copyable value
and a diff view.

A movable grid layout where every gesture has a keyboard equivalent and
the keyboard one is what the tests drive.

And a colour picker that reports the WCAG contrast ratio of the chosen
colour against the current theme's background, using the same function
the contrast gate uses. That is the one thing a colour picker inside a
theme system can do that a general-purpose one cannot — and a picker that
shows a colour without saying whether anyone can read it is how the
unreadable colours got in.

### What the suites found

Every one of these was found by a test or by the showcase, not by review:

- The two channels disagreed about what a choice is: Enter took `banaan`
  in one and `Banaan` in the other, because the framework-free half
  conflated an option's label with its value.
- Two command palettes on one page both answered Ctrl+K and stacked two
  modal dialogs.
- The React palette kept the old query when opened any way other than the
  shortcut, while the other channel had already cleared it.
- The React form gathered a summary and left the FIELDS unmarked — no
  `aria-invalid`, no per-field message, no blur validation. Four
  assertions failed at once.
- Reorder moved focus with a document-wide query and landed in the other
  channel's list.
- And the showcase found, within a minute, that the combobox input
  overflowed its wrapper by 10 px: at 320 px that pushed the page
  sideways and DI11 went red on all eleven themes. Every browser test had
  been green; the fixture pages were not narrow enough to notice.

### Also

`js/contrast.js` is new and public: the colour primitives moved out of
`gates/`, which is the package's own tooling, so a consumer gets the same
contrast measurement rather than a second opinion.

418 browser tests in Chromium and Firefox, 25 unit tests, 59 export paths.

---

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
