# research/chassis-storage: the chassis-rs kit page "Storage" on kp-themes 11.2.0

Formal only, four sections, one bundled review. Design: chassis-rs `docs/STORAGE_DESIGN.md` section 8. All figures are sample data in the shape of the
admin dashboard's storage (the figures Kenny gave, 2026-10-21); nothing reads a real service or the real clock.

- `storage.js`: the page, the two dialogs and the sample store as pure functions (data in, markup out).
- `demo.js`: renders each stage, feeds the share bar, the card and table states, and wires the controls and the two choices; it wraps the kit shell of `../chassis-kit-pages`.
- `page.css`: the budget card, the kinds' cells and the compositions of the clean-up and compact dialogs.
