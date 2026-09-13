# Navigation alternatives — research note

What this is: a one-page survey of the navigation patterns that are common
alternatives to a plain top bar, measured against what `@kp-soft/themes`
already ships. The demo beside it (`demo.html`) shows the current `.kp-nav`
first and then every alternative as a working mock, each with its opened
state visible. Nothing here is a decision; it is the material for one.

## What the package has today (checked 2026-09-13)

| Thing                                                                                                                                                                               | Where                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `.kp-nav-wrap` (container `kp-nav`), `.kp-nav`, `__brand`, `__brand-tag`, `__links`, `__link`, `__toggle`                                                                           | `css/components.css` lines 1101–1260                      |
| `.kp-nav__menu` — a dropdown under a link, opens on `:hover` and `:focus-within`, `display:none` when closed, optional caption via `data-kp-menu-label`                             | `css/components.css` lines 1329–1388                      |
| Narrow collapse at a **40rem container** width when a `.kp-nav__toggle` is present; the open dropdown becomes an in-flow nested list                                                | `css/components.css` lines 1219–1249                      |
| `attachNavToggles()` — writes `aria-expanded`, `aria-controls`, `data-kp-nav-open`, closes on Escape and outside click, fires `kp-nav-toggle`                                       | `js/components.js` line 512                               |
| `.kp-sidenav` with modes `side` / `over` / `push`, a **slim rail** (`data-kp-sidenav-slim`, 4.5rem, `expand-on-hover`), categories with accordion, backdrop, focus trap, `remember` | `css/components.css` lines 1527–1858, `js/sidenav.js`     |
| `.kp-tabs__list` / `.kp-tab` / `.kp-tabs__panel` with `attachTabs()` (arrow keys, automatic or manual activation)                                                                   | `css/components.css` line 2048, `js/overlays.js` line 127 |
| `.kp-breadcrumb` with the `--kp-glyph-breadcrumb` separator knob                                                                                                                    | `css/components.css` line 2078                            |
| `.kp-palette` — a `<dialog>` command palette on `Ctrl/⌘+K`, combobox + listbox, groups, `data-kp-keys`, `kp-palette-run` event; the `?` shortcut sheet beside it                    | `css/components.css` line 2521, `js/palette.js`           |
| `.kp-popover`, `.kp-menu`, `.kp-menu__item` (the user menu in `examples/app-shell.html`)                                                                                            | `css/components.css` lines 1921–1975                      |
| `.kp-sidebar` layout (aside + main that wraps when narrow), `.kp-skip-link`, `.kp-sr-only`                                                                                          | `css/layout.css` line 93, `css/components.css`            |

Two facts shape every row below. First, the dropdown opens on hover and
focus-within, not on click, and carries no `aria-expanded`; that is the
disclosure pattern without the disclosure button. Second, the command
palette already exists, so "command palette as navigation" is a markup
exercise, not a component.

## The table

Build cost is relative to this package: **small** = markup plus a few
rules and no new module; **medium** = a new CSS block and a small JS
addition or an option on an existing module; **large** = a new module with
its own keyboard model and tests.

| Pattern                                 | What it is for                                                                                                                                                                                                                                              | Reference                                                                                                                                                                                                                                                                                              | Reuse from the package                                                                                                                                                                                                                                                                                                                         | Cost   | Recommendation                                                                                                                                                                                 |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mega menu**                           | One top-level item opens a wide panel with grouped second-level links, so a deep site is browsable from the bar. NN/g: pays off at roughly 30+ pages and many second-level options; three to four columns; beyond that, choice overload.                    | [NN/g, Mega menus work well](https://www.nngroup.com/articles/mega-menus-work-well/) · [Radix Navigation Menu](https://www.radix-ui.com/primitives/docs/components/navigation-menu) · [APG disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) | `.kp-nav` and `__links` as is; the panel is `.kp-nav__menu` widened (`min-width` → `inline-size: 100%` of the bar, a grid inside). Needs a **click-to-open button** with `aria-expanded` — today's `:hover` opening cannot carry a panel this size. `attachNavToggles` is the model for the JS.                                                | medium | **Build second**: a `.kp-nav__menu--wide` modifier plus a `data-kp-nav-disclosure` button, so the register that styles `.kp-nav__menu` (KT14 requires one) styles this too.                    |
| **Collapsible sidebar / rail**          | Persistent left navigation for an application with 5–15 destinations and sections; the rail keeps icons when collapsed. Carbon: the left panel is secondary navigation under a persistent header. M3: rail for medium and larger windows, 3–7 destinations. | [Carbon UI shell left panel](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/) · [M3 navigation rail](https://m3.material.io/components/navigation-rail/guidelines) · [Atlassian side navigation](https://atlassian.design/components/navigation-system/side-nav-items)            | **Already shipped**: `.kp-sidenav` with `data-kp-sidenav-slim`, `expand-on-hover`, accordion categories, `sidenavOf(el).setSlim()`. What is missing is (a) a declared toggle attribute for the slim state — today only the JS handle sets it — and (b) an example page that puts `.kp-nav` and `.kp-sidenav` together as an application shell. | small  | **Build first** (as an example + a `data-kp-sidenav-slim-toggle`): the package has the component and no page shows it; `examples/app-shell.html` still fakes the aside with a card.            |
| **Command palette as navigation**       | Keyboard-first jumping between pages for people who know where they are going. GitHub scopes it to the current location; Linear and Vercel made `⌘K` the convention. It supplements, never replaces, a visible nav.                                         | [GitHub command palette](https://docs.github.com/en/get-started/accessibility/github-command-palette) · [cmdk](https://github.com/pacocoursey/cmdk) · [Maggie Appleton, Command K bars](https://maggieappleton.com/command-bar)                                                                        | **Already shipped**: `.kp-palette` with `data-kp-palette data-kp-hotkey="k"`; options carry `data-value`, the consumer listens for `kp-palette-run` and navigates. Missing: a visible affordance in the bar (a `⌘K` button that calls `palette(el).open()`), and an option that is a real `<a>` so it works without JS.                        | small  | **Build first** alongside the rail: a `.kp-nav__search` slot with the palette's trigger, and `data-kp-option` accepting an `href`.                                                             |
| **Tab bar as section navigation**       | A row of peer sections directly under the page title; GOV.UK's service navigation is exactly this: the service name plus a flat row of links, no dropdowns, current page marked. Right when a service has a few tasks and no single end-to-end journey.     | [GOV.UK service navigation](https://design-system.service.gov.uk/components/service-navigation/) · [DWP horizontal navigation](https://design-system.dwp.gov.uk/components/horizontal-navigation)                                                                                                      | `.kp-tabs__list` styling, but with **links** (`<a aria-current="page">`) rather than `role="tab"` buttons: sections are pages, not panels, so the tabs ARIA is wrong here. A second `.kp-nav` row under the first also works with no new CSS.                                                                                                  | small  | Worth a documented recipe, not a component: one modifier `.kp-nav--secondary` or a `.kp-tabs__list` of links.                                                                                  |
| **Sticky / shrinking header**           | Keeps the bar reachable on long pages; shrinking gives some of the height back. NN/g: sticky headers help when they are small and do not hide content or focus; `scroll-padding-top` keeps anchors and focused elements out from under it.                  | [NN/g, Sticky headers](https://www.nngroup.com/articles/sticky-headers/) · [Carbon UI shell header](https://carbondesignsystem.com/components/UI-shell-header/usage/)                                                                                                                                  | `.kp-nav-wrap { position: sticky; top: 0 }` — the wrapper already exists. The shrink is a `data-kp-nav-compact` attribute set by a `scroll` or `IntersectionObserver` sentinel; `--kp-nav-pad-block` is already the knob it would change.                                                                                                      | small  | Ship as a **modifier plus a knob** (`.kp-nav-wrap--sticky`, `--kp-nav-sticky-shrink`), guarded by `prefers-reduced-motion`; the sentinel JS is ten lines in `attachNavToggles`' neighbourhood. |
| **Bottom navigation on narrow screens** | 3–5 top-level destinations of equal weight within thumb reach on a phone. M3: navigation bar for compact windows, never more than five, persistent across screens.                                                                                          | [M3 navigation bar](https://m3.material.io/components/navigation-bar/guidelines) · [Apple HIG tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)                                                                                                                        | The same `<ul class="kp-nav__links">` markup rendered as a `position: fixed; bottom: 0` row under the 40rem container query, `aria-current="page"` as the marker. Costs a body padding so content is not covered, and it fights the current hamburger collapse — it is a **choice** between the two, per page.                                 | medium | Later: a consumer with a real mobile audience has not asked; the collapse toggle covers narrow screens today.                                                                                  |
| **Breadcrumb + rail**                   | The rail says which area you are in, the breadcrumb says where in its hierarchy; GOV.UK places the breadcrumb just before `<main>` so the skip link skips both. Right for admin tools with nested records.                                                  | [GOV.UK, Navigate a service](https://design-system.service.gov.uk/patterns/navigate-a-service/) · [Carbon UI shell](https://carbondesignsystem.com/components/UI-shell-header/usage/)                                                                                                                  | **Already shipped**: `.kp-breadcrumb` and `.kp-sidenav`; nothing new. The gap is a layout recipe: where the breadcrumb sits relative to the sidenav, and how `push` mode offsets it.                                                                                                                                                           | small  | Fold into the application-shell example with the rail; no component work.                                                                                                                      |

### Two sibling questions, briefly

| Pair                           | The distinction                                                                                                                                                                                                                                                                                                                                                          | Reference                                                                                                                                                                            | In this package                                                                                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tabs vs. segmented control** | Tabs answer "which panel of this page am I looking at" and are attached to their panels (`role="tab"`, one `tabpanel` each); a segmented control answers "which version of this view" — a single-choice setting (list vs. grid, day vs. week) that changes how the _same_ content renders, and is not attached to panels. Apple: 5–7 segments at most, fewer on a phone. | [Apple HIG, Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls) · [Mobbin glossary](https://mobbin.com/glossary/segmented-control) | Tabs exist. A segmented control is best built as a **radio group** (`fieldset` + `input type=radio` visually joined), which the package does not have; small to add, and it should stay a form control rather than a tab lookalike. |
| **Sidebar vs. rail**           | A sidebar carries labels, sections and badges and costs 15rem; a rail keeps 3–7 icon destinations at ~4.5rem and hands the labels to a tooltip or a hover expansion. M3 puts the rail on medium+ windows; Atlassian's new system collapses the sidebar rather than swapping to a rail.                                                                                   | [M3 navigation rail](https://m3.material.io/components/navigation-rail/guidelines) · [Atlassian navigation system](https://atlassian.design/components/navigation-system)            | Both exist in one component: `.kp-sidenav` is the sidebar, `data-kp-sidenav-slim-collapsed` is the rail. The rail needs icons, and the package ships type, not icons — a consumer supplies a glyph in `.kp-sidenav__icon`.          |

## Accessibility requirements, per pattern

- **Mega menu**: a `<button aria-expanded aria-controls>` per panel, never a link that also opens; the panel is plain lists with headings, not `role="menu"` (APG says menu roles are for application menus, and the disclosure pattern is right for site navigation). Escape closes and returns focus to the button; Tab walks through the panel's links; only one panel open at a time; the panel must not open on hover alone for touch and keyboard users. Registers that style `.kp-nav__menu` must style the wide panel too (KT14).
- **Sidebar / rail**: `<nav aria-label>`, `aria-current="page"` on the active link, categories as `<button aria-expanded>`; in the rail state every link keeps an accessible name (`.kp-sidenav__label` is hidden with `display:none` today, so a rail link with only an icon has **no name** unless the consumer adds `aria-label` — worth a gate or a note). `over` mode: focus trap, Escape, backdrop click, all of which `js/sidenav.js` does.
- **Command palette**: `role="combobox"` input with `aria-expanded`, `aria-controls`, `aria-activedescendant` over a `role="listbox"`; the `<dialog>` gives focus trap, Escape and focus return; a `role="status"` line announces the result count. All present in `.kp-palette`. Add: a visible trigger in the bar, because a hotkey alone is a secret.
- **Tab bar as navigation**: links with `aria-current="page"`, inside `<nav aria-label="Sections">`; **no** `role="tablist"`, because activating one loads a page. Wrap or scroll horizontally, never clip.
- **Sticky / shrinking header**: `scroll-padding-top` on `html` equal to the bar's height so anchors and Tab targets land below it; the shrink transition is under `prefers-reduced-motion`; the skip link stays first in the DOM; landmarks unchanged.
- **Bottom navigation**: a `<nav>` with links and `aria-current`; 44px targets; `padding-bottom` on the page plus `env(safe-area-inset-bottom)`; the bar must not cover the focused element (again `scroll-padding-bottom`).
- **Breadcrumb + rail**: `<nav aria-label="Breadcrumb">` with an `<ol>`, the last item `aria-current="page"`; placed before `<main>` so the skip link skips it.

## Findings from building the demo (checked in the browser, 2026-09-13)

1. **A rail link has no name.** With `data-kp-sidenav-slim-collapsed` the
   package hides `.kp-sidenav__label` with `display: none`
   (`css/components.css` line 1631), so a link whose only visible content is
   an icon has no accessible name. The demo's rails carry `aria-label` by
   hand; a package rail should keep the label in the accessibility tree
   (`.kp-sr-only` instead of `display: none`) or carry a tooltip.
2. **The registers do not read `--kp-nav-pad-block`.** `dark-register.css`
   line 458, `terminal-register.css` line 306 and `formal-register.css`
   line 187 each set `padding-block` on `.kp-nav` directly, so a compact
   state that only lowers the knob changes nothing under those registers.
   A sticky/shrinking modifier has to route the registers through the knob
   first, or set the padding itself.
3. **The dark register lifts the bar.** `dark-register.css` lines 449-453
   give `.kp-nav-wrap` `position: relative; z-index: var(--kp-z-nav, 30)`;
   terminal and formal do not. A page that stacks anything against the bar
   gets different answers per register — the demo isolates each frame to
   sidestep it. A mega-menu panel or a sticky bar would want that `--kp-z-nav`
   to exist in the base, not in one register.
4. **The slim rail has no declared toggle.** `OPTIONS` in `js/sidenav.js`
   lists `data-kp-sidenav-toggle` for open/close and nothing for slim; the
   only way to collapse is `sidenavOf(el).setSlim()`. The demo's button does
   exactly that.
5. **`js/auto.js` sets `data-kp-effects` itself** (`attachEffects`,
   `js/effects.js` line 528), so any page loading `auto.js` runs the
   registers' reveals — a demo cannot show the "at rest" chrome without
   `manageRoot: false`.

## Recommendation

Build, in this order:

1. **Application shell = `.kp-nav` + `.kp-sidenav` rail + `.kp-breadcrumb`** (small). Everything is already in the package; what is missing is the page that proves they compose — the current `examples/app-shell.html` fakes its aside with a card — and a declared `data-kp-sidenav-slim-toggle` so a consumer can collapse the rail without importing `sidenavOf` (finding 4). The rail-without-names gap (finding 1) is found by writing this page and is the one real accessibility fault in the list.
2. **Command palette as navigation** (small). `.kp-palette` exists; add a `.kp-nav__search` trigger slot in the bar and let an option be an `<a href>`, so the palette navigates without the consumer writing a `kp-palette-run` handler and works without JavaScript as a plain list.
3. **Mega menu** (medium). The one pattern that changes the bar's own behaviour: a click-opened, `aria-expanded` disclosure panel (`.kp-nav__menu--wide`) beside today's hover dropdown. It is the only item that needs a new keyboard model and therefore new tests, and KT14 means every register has to answer it — which is why it is third and not first.

The sticky/shrinking header is a small modifier worth adding whenever a consumer asks — but findings 2 and 3 come first, because a modifier built on the knob would do nothing under three registers; bottom navigation waits for a consumer with a phone audience; the section tab bar and the segmented control are recipes and a small form control respectively, not navigation work.

## Sources

- https://www.nngroup.com/articles/mega-menus-work-well/
- https://www.nngroup.com/articles/sticky-headers/
- https://www.radix-ui.com/primitives/docs/components/navigation-menu
- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
- https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
- https://carbondesignsystem.com/components/UI-shell-header/usage/
- https://carbondesignsystem.com/components/UI-shell-left-panel/usage/
- https://m3.material.io/components/navigation-rail/guidelines
- https://m3.material.io/components/navigation-bar/guidelines
- https://atlassian.design/components/navigation-system
- https://atlassian.design/components/navigation-system/side-nav-items
- https://design-system.service.gov.uk/components/service-navigation/
- https://design-system.service.gov.uk/patterns/navigate-a-service/
- https://design-system.dwp.gov.uk/components/horizontal-navigation
- https://docs.github.com/en/get-started/accessibility/github-command-palette
- https://github.com/pacocoursey/cmdk
- https://maggieappleton.com/command-bar
- https://developer.apple.com/design/human-interface-guidelines/segmented-controls
- https://developer.apple.com/design/human-interface-guidelines/tab-bars
- https://mobbin.com/glossary/segmented-control
- https://polaris-react.shopify.com/components/deprecated/navigation (Polaris's sidebar navigation is deprecated in favour of App Bridge; cited for the sidebar-first choice, not as a live reference)
