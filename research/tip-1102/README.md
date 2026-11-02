# research/tip-1102: the reason of a disabled button, whole inside a table

Kitchen's gap (`~/Projects/kp-gaps/kitchen.md`, 01/11/2026, disabled reason): the reason of a disabled Delete was cut inside a
data table at 390 px in the card layout ("IN GEBRUIK DOOR 1 GERECHT EN 2 RECE…" cut at the card's edge) [tip-1102, kitchen-1101].

**Cause, measured in Firefox 153:** the tooltip was `position: fixed` with anchor positioning, but the table's scroll box
(`.kp-table-wrap`) is an inline-size container, and a container is the containing block of a fixed box; so the tooltip was
placed in, sized to and clipped by that box (at 1280 px it also ran under the next row: 39 of 49 sample points visible). The
tooltip also inherited `white-space: nowrap` from the button's cell and ran out of its plate on one line.

**Fix:** js/overlays/tooltips.js makes every tooltip it wires a manual popover (js/overlays/tooltip-layer.js) and shows and
hides it on the top layer with the tooltip; css/components/popover.css keeps the tooltip's own placement for it and lets a
tooltip wrap at its own width. `data-kp-tooltip-layer="inline"` on an anchor (or `layer: 'inline'`) keeps the old layer.

**Round 1** (one section, formal only): Kitchen's ingredient table with Garlic's Delete off, at full width and in a 390 px box
where the rows are cards. Reason shows the tooltip as a pointer does (the package's own `pointerenter`); Width sets the box.
The names and counts are mock.

**Generated** by `node research/tip-1102/build.mjs` (edit the builder or sections.mjs, never the page).
