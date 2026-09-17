# Laurels and platforms: four redesign directions

**Decided (scope-93, scope-94):** direction B, Wreaths, in shade-light only; the platform badges carry a glyph and an "Available on" line. Archived.

Kenny rejected `catalogue/media.html#laurels` in shade-light (2026-09-15): "Well, this just looks ugly, redo these completely from the
ground up." Demo: [`demo.html`](demo.html) (36183 bytes, `wc -c`), in the catalogue under "Research to look at". It opens in
shade-light; pastel and dark are one click away.

**What the pieces are for.** `.kp-laurels` and `.kp-platforms` came from the concept demo [S46] and are in its inventory
(`showcase/concept-demo.json` checks for `class="kp-laurels"`). Laurels are the "proof" row under a hero: figures, awards or press
("412 days without a lost-time injury"). Platforms are the "available on / works with" row. The markup is
`<ul class="kp-laurels"><li><b>value</b> source</li>` and `<div class="kp-platforms"><span>name</span>`.

**Why shade-light looks wrong today** (read from `css/shade-light-register.css` and `css/components.css`). `.kp-laurels b` is
`display: block`, so the accent dot (`li::before`) sits alone on the first line. The pill `border-radius: 999px` goes around two lines of
text, so the round ends crowd the words. The platforms are four monospace words with no label. All 22 registers style `.kp-laurels`
(73 selectors) and `.kp-platforms` (41), per grep.

## Real-world patterns

| Pattern                        | What it is for                                                   | Reference                                                                                                                                                                                                                                                                                                                                                                | What the package can reuse                                                                  | Build cost | Recommendation           |
| ------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ---------- | ------------------------ |
| Stats band                     | A few large figures, each with a short caption                   | [Tailwind Plus stats sections](https://tailwindcss.com/plus/ui-blocks/marketing/sections/stats-sections)                                                                                                                                                                                                                                                                 | Current markup as is; display face, `--border-strong`                                       | small      | **A**: take it           |
| Festival laurels, award badges | A named honour framed by a wreath; the badge links to its source | [Sundance laurel usage (PDF)](https://www.sundance.org/wp-content/uploads/2023/10/Sundance-Film-Festival-Official-Selection-Laurels.pdf), [FilmFreeway laurels](https://filmfreeway.com/help/article/16063/how-do-i-create-custom-laurel-images-for-my-film-festival), [G2 badges](https://sell.g2.com/quick-start-guides/strengthen-trust/learn-how-to-leverage-badges) | A drawn branch as a CSS mask in `--primary`; no image files                                 | medium     | **B**: an opt-in variant |
| App store download badges      | "Get it on / Available on" call to action per platform           | [Apple marketing guidelines](https://developer.apple.com/app-store/marketing/guidelines), [Google Play badge guidelines](https://partnermarketinghub.withgoogle.com/brands/google-play/visual-identity/badge-guidelines/?folder=65714)                                                                                                                                   | The inverted plate (`--foreground` ground); a consumer's official badge must stay unaltered | medium     | B's platforms            |
| Logo cloud, "as featured in"   | Customer, partner or press names in a greyscale grid             | [Tailwind Plus logo clouds](https://tailwindcss.com/plus/ui-blocks/marketing/sections/logo-clouds), [NN/g on social proof](https://www.nngroup.com/videos/social-proof-ux/)                                                                                                                                                                                              | 1px hairline grid from `--border`; muted until hover                                        | small      | **C**                    |
| Spec ledger                    | Label, dotted leader, value: facts read as a list                | Print spec sheets; package's own `.kp-spec` and `.kp-card`                                                                                                                                                                                                                                                                                                               | `.kp-card`, `order` on the `<b>`, mono tabular figures                                      | small      | **D**                    |

## The four directions in the demo

All four are mock rules (`lr-`) on the package's own classes. Each one first resets the registers, so it is drawn only from tokens and
looks the same way in every theme.

| Direction                     | Laurels                                                                 | Platforms                                                 | Markup change                                  | Trade-off                                                                  |
| ----------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------- |
| A · Figures (stat band)       | Large figure in the display face, caption under it, rule at each column | One line: small label, names with dots drawn between them | none; an optional `<b>` label in the platforms | Quiet, fits every theme; weak for awards that are words and not figures    |
| B · Wreaths and store badges  | Claim centred between two mirrored branches                             | Inverted badges with a glyph and "Available on"           | glyph and `<small>` per platform               | Most literal and festive; loud; the branches must never outweigh the value |
| C · Proof strip and name wall | One ruled band: caption, then one-line claims between hairlines         | Equal cells in a hairline grid, names as wordmarks        | a caption element beside the list and the wall | Best for press names and logos; the claims are small                       |
| D · Ledger card               | Inside `.kp-card`: source, dotted leader, value right-aligned           | Card foot on `--muted` with ticks                         | a title element in the card                    | Very readable; a card look, which competes with other cards on a hero      |

## Recommendation

Take **A** as the new base look in `css/components.css`, and make shade-light's register use it with no additions. A keeps the
markup the concept inventory checks. Its figure is the loudest thing in each item by construction, which is what the catalogue's
"Look at" asks for. It stacks cleanly at 16rem, and it reads well in shade-light, pastel and dark without any per-theme work. That
means the other 21 registers could drop their laurel rules instead of each answering them. Offer **B** as an opt-in modifier
(`.kp-laurels--wreath`) for awards and press; it needs one mask image and no image files. Keep C and D as recipes for the user guide,
not classes. Measured on the demo in Firefox: no console errors in shade-light, pastel and dark, and the theme switcher passes through
`applyTheme`.

**Open questions for Kenny.** (1) Should A replace the base look for every theme, or only for shade-light? Either way, a released
theme changes its look, so this is a version bump. (2) Is the optional platforms label (`<b>Reads from</b>`) worth adding to the
concept inventory? (3) Should B's wreath exist at all, or does it feel too much like a film poster for these apps?
