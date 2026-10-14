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

(The pass of 2026-10-14 brought every line before this onto its component page.)

- **Side navigation, minor options 1 to 4 (2026-10-14, research/sidenav-minor).** `data-kp-sidenav-cancelable`:
  `kp-sidenav-toggle` and `kp-sidenav-slim` fire before the change, cancelable, with `detail.reason`
  (`toggler`, `escape`, `backdrop`, `shortcut`, `api`); a prevented one leaves the state and fires
  `SIDENAV_PREVENTED_EVENT` (`kp-sidenav-prevented`).
- `data-kp-sidenav-resizable` with `data-kp-sidenav-min-width` and `-max-width`: the `.kp-sidenav__resizer`
  separator on the edge that faces the content (`SIDENAV_RESIZER`, pointer and keys, `aria-valuenow`), writing
  `--kp-sidenav-width`, kept with `data-kp-remember`; string `resizeSidebar`; token `--kp-sidenav-resizer-size`.
- `data-kp-sidenav-backdrop="static"`: the backdrop shows, a click does not close; the panel is pulled back and let go
  on the theme's own time and curve (`data-kp-sidenav-refused`, `--kp-sidenav-refuse-travel`, `-duration`, `-ease`,
  terminal sets `--kp-sidenav-refuse-ease`).
- `data-kp-sidenav-close-on-backdrop="false"`: a click on the backdrop does nothing, sibling of `close-on-esc`.
- **Side navigation, narrow-screen width (2026-10-14, research/sidenav-minor).** `--kp-sidenav-width-narrow`: the panel's width
  while `data-kp-sidenav-narrow` is on it (below the `data-kp-sidenav-over-below` step); falls back to `--kp-sidenav-width`.
- **Side navigation, floating variant (2026-10-14, research/sidenav-minor).** `data-kp-sidenav-variant="floating"`: panel detached
  from the edge (`--kp-sidenav-float-inset`, `-radius`, `-edge`, `-shadow`, `-ink`; the module reads `--kp-sidenav-room` and `-lead`).
- **Side navigation, inset variant (2026-10-14, research/sidenav-minor).** `data-kp-sidenav-variant="inset"`: flush panel, the content a
  rounded card (`--kp-sidenav-inset-gap`, `-radius`, `-edge`; the module marks the content `data-kp-sidenav-inset`).
- **Side navigation, peek strip (2026-10-14, research/sidenav-minor).** `--kp-sidenav-peek` (0.75rem): a thin `.kp-sidenav__peek` strip
  stays at the edge while the panel is shut (`--kp-sidenav-peek-surface`); push keeps its room, over lies over the page by that width.
- **Side navigation, density presets (2026-10-14, research/sidenav-minor).** `data-kp-sidenav-density="compact|comfortable"`: sets only
  `--kp-sidenav-link-padding-block`, `-link-size`, `-icon-size` and `-pad` (rows 29 / 37 / 45 px).
- **Side navigation, action beside an item (2026-10-14, research/sidenav-minor).** `.kp-sidenav__row` (the list item) holding a link and a
  `.kp-icon-button.kp-sidenav__action` as siblings; `--kp-sidenav-action-size` (2rem), `--kp-sidenav-action-gap` (0.25rem); own focus ring, hides in the rail.
- React `Sidenav`: every window-edge and minor option is a prop (`reserve`, `shortcut`, `initialFocus`, `hoverDelay`, `slimBelow`, `railTips`, `flyout`, `inert`, `cancelable`, `closeOnBackdrop`, `backdrop="static"`, `resizable`/`minWidth`/`maxWidth`, `variant`, `density`), the four events are `onSidenavToggle`/`Slim`/`Mode`/`Prevented`; the launcher and edge-tab boxes stay plain markup (`.kp-sidenav__launcher`, `.kp-sidenav__tab`) around a `SidenavToggle`: the Side navigation page's React column and option table.
