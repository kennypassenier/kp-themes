# research/review-kit-v2: the review dialog, v2, the component first

Kenny, 2026-10-18 15:15, 15:17 and 15:26: the dialog wasted space, he wants the component to be the main thing on screen, and he wants proposals to
optimise the whole approval process, each shown in a demo. Formal only (`data-review-themes="formal"`), one section per option of the
dialog, in two topics. Every section shows the real dialog live (research/kpadopt56-choose opened at its first step, in a frame at a real window
size, scaled to the room), with the option switched by the section's own controls (This option, Window, The other options). The only question
is the default (a choice set; the kit adds "Remove this option"); nothing is required. A frame never takes a pointer or a Tab, so no verdict can be
filed on the part from this page, its storage is in memory (`rv-preview.js`, seeded by `?rvopt=`), and it keeps its own theme (`?rv-preview`).

Four sets of options, 17 sections in five topics: the dialog's layout (research/_review/review.js `UI_OPTIONS`), the remaining line and Continue
(rv-progress.js), the key helpers (rv-keys.js: legend, undo, rejected so far, bulk approve) and the flow (flow.js, reasons.js: after the last step,
Tonight, its order, reason chips). An entry of `options.json` has `kind: "ui"` (switched by `?rvui=`) or `kind: "store"` (the module's own storage key
and the values for on and off, seeded through `?rvopt=`), optionally its own `page` (the Agenda), `open: false` (the page is not the dialog), `reveal` (what to bring
into view) and `actions` (clicks and keys the preview performs so the option shows). The default of each is the one the module ships; the layout
options are off in the live parts until you choose.

**Generated** from `options.json` by `node research/review-kit-v2/build.mjs`; add an entry (the id the kit knows the option by, see
`registerUiOption` in research/_review/README.md) and rebuild, and a new option appears as a section. The round id is kept across rebuilds.
