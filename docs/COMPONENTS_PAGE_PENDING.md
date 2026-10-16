# What the components page still has to show

The site's component pages (`site/components/*.html`, every component with its
code examples) are brought up to date in one pass, on Kenny's go, once every
open review is approved (Kenny, 2026-10-13: "nadat alles approved is, vraag je
aan mij of je onze pagina waar al onze componenten staan (met codevoorbeelden)
mag updaten met alles wat nieuws is en alle nieuwe opties").

Every session that adds or changes a component, an option, an attribute or a
token adds a line here in the same commit. The pass works down the list, gives
each line its example and its option row, and empties the list.

## Waiting

(The pass of 2026-10-16, on Kenny's go "components-page: Nu bijwerken", brought every line that stood here onto its page: the toast's `pause`,
`linger`, `close` and `sticky`; the step list, the week agenda, the run timeline (days, series, legend, busy card, the end-edge label), the segmented
control, the list toolbar, the key line, the action tile, the status rows, the facet list (with its pattern), the heat grid (with `data-kp-heat-latest`),
the matrix and the bar cell; the diff hunk header; the menu button's `--kp-menu-anchor-x`; the navigation bar's fold, keep, separator and bottom tab
bar; the live button; the hover card; the data table's click multi-sort, `data-kp-sort-value`, `data-kp-filter-value`, `data-kp-group-always` and the busy
card; and the sentence that the toasts and the back-to-top control rise by the tab bar. Examples that wait for data carry their page's own part as an
example `script`, run live and printed under the markup. Not on a page, because it is a catalogue block and not a components-page line: the tab bar's
own block in the review catalogue, still listed in `catalogue/coverage.json`. The pass of 2026-10-15 brought the date picker's `data-kp-date-format`,
the key-figure label wrap and the side navigation's `data-kp-sidenav-opener`; the pass of 2026-10-14 every line before them.)

- `.kp-idmark` / `.kp-idmark-group` / `.kp-idmark-name` (new component, js/idmark.js, kpadopt4-data): `data-kp-idmark="<name>"`, `data-kp-idmark-hue="free"`, `data-kp-idmark-set` (no colour shared while one is free), `--xs` `--sm` `--lg` `--xl` `--round` `--pattern` `--glyph`, `aria-current` / `data-kp-idmark-selected`, empty name, loading as `.kp-idmark.kp-skeleton.kp-skeleton--block`, `.kp-idmark-group__more`, `.kp-idmark-group--sm`; `idmarkFor`, `idmarkLetters`, `idmarkColours`, `setIdmark`, `attachIdmarks`; string `idmarkUnknown`; tokens `--kp-idmark-size`, `-radius`, `-tint`, `-colour`, `-ink`, `-overlap`, `-gap`. Needs its own page (2026-10-16, research/kpadopt4-data).
- `.kp-stackbar` (new component, js/stackbar.js, kpadopt4-data): `setStackbar(el, { parts, total, title, summary, format, restLabel, other, marks, legend, state, message, label })`, `stackbarParts`, `shareText`, `attachStackbars` (JSON in `data-kp-stackbar`), event `kp-stackbar-pick` `{ key, part }`; `--sm` `--lg`; strings `stackbarRest`, `-Other`, `-Part`, `-Over`, `-Label`, `-Loading`, `-Empty`, `-Error`; tokens `--kp-stackbar-height`, `-gap`, `-radius`, `-legend-min`, `-colour`. Needs its own page.
- `.kp-bullets` (new component, js/bullets.js, kpadopt4-data): `setBullets(el, { rows, threshold, max, bad, format, sort, state, message, emptyTitle, emptyText, loadingRows, loadingWords })`, `bulletTone`, `attachBullets`, events `kp-bullets-pick` `{ key }`, `kp-bullets-retry`; strings `bulletsLoading`, `-Empty`, `-Error`, `-Retry`, `-Unknown`, `-ValueText`; tokens `--kp-bullets-gap`, `-bar-min`, `-bar-height`. Belongs beside the meter.
- `.kp-kv` (new, CSS only, kpadopt4-data): `dl.kp-kv > .kp-kv__row > dt + dd`, `--lines`, `--stack`, `--columns`, `.kp-kv__none`, `.kp-kv__wait`, row `data-kp-state="error"`, `data-kp-changed`; tokens `--kp-kv-label-max`, `-gap`, `-line-pad`, `-skeleton`, glyph `--kp-glyph-changed`. Needs its own page.
- `.kp-formrows` / `.kp-formrow` (new, CSS only, kpadopt4-data): parts `__label` (with `small`), `__control`, `__aside`, `__lock`; `.kp-formrows--lines`, `.kp-formrow--top`, `--wide`, `data-kp-changed`, `data-kp-state="error"`, `data-kp-locked`; tokens `--kp-formrow-label-max`, `-gap`, `-line-pad`, `-input-max`. Belongs on the form page.
- `.kp-code` (new component, js/code.js, kpadopt4-data): `data-kp-code` with `-title`, `-language`, `-size`, `-lines`, `-wrap`, `-max`, `-layout`, `-state`, or `setCode(el, { text, title, language, size, lines, wrap, maxLines, layout, copy, truncated, state, message, loadingWords })`, `prettyJson`, `attachCodes`, `CODE_COPIED_MS`; events `kp-code-copy`, `kp-code-copy-failed`, `kp-code-wrap`, `kp-code-layout`, `kp-code-fold`; strings `codeLabel`, `codeWrap`, `codePretty`, `codeRaw`, `codeFormat`, `codeShowAll`, `codeShowLess`, `codeLines`, `codeEmpty`, `codeBinary`, `codeTruncated`, `codeLoading`, `codeError`, `codeCopiedAnnouncement`; tokens `--kp-code-bg`, `-key`, `-size`, `-max-lines`, `-min-lines`, `-gutter`. Needs its own page.
- Page header option (kpadopt4-data): `.kp-page-header__heading` > `.kp-page-header__lead` + `.kp-page-header__line` (title, a badge, `.kp-ago.kp-page-header__meta`). Belongs on the page header page.
- `[data-kp-tick]` (js/tick.js, kpadopt4-data): `tickTo(el, text?, { from, duration })`, `parseTick`, `attachTicks`, `TICK_MS`, knob `--kp-tick` (600; 0 = none), `data-kp-tick-state`, event `kp-tick` `{ value }`. Belongs on the count page.
