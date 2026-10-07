# What the family picks do

Kenny, 2026-10-07 01:32, after the families verdicts (research/families/VERDICTS.md): "toon al eens wat je met deze bevindingen
kan doen vooraleer ik verder ga".

## What

Per theme and family, the picture Kenny picked (one component's decided pick) translated onto every other component of the theme,
the way the anodising bath was translated onto every titanium loading element (research/titanium-loading). Every component twice,
side by side: **Today**, its own decided pick, and **Speaking the family**, the same component drawn in the picked picture. The
picture itself comes first, unchanged. Ten themes: the eight approved in full (formal, light, dark, synthwave, pastel, terminal,
high-contrast, sepia), and cyberpunk and forest without the family Kenny did not approve (cyberpunk's live update, forest's
loading), six families each.

## Why

Before Kenny judges the remaining nine themes' families, he sees what a pick does to a whole theme: whether the picked picture
really carries over, component by component, or only works where it was drawn.

## How

- `demo.html`, `demo.css`, `demo.js`: the page, a review-kit demo in aspect mode (`research/_review/review.js`); per theme one
  step per family with one option, **Apply to the package** (↑), or None of these with a note (↓). The answer per theme and
  family lands in the kit's answer as `<family> = Apply to the package`, or as not approved with the note. A family Kenny did
  not approve is settled (`fixed`) and not asked.
- Both frames of a pair are the component's own character demo, embedded as research/families does
  (`../character-<c>/demo.html?embed=<aspect>&theme=<theme>`, with `loop` and `point` where the families page uses them); a
  component without the family's aspect is embedded in the aspect that shows the moment (`extra` in `demo.js`).
- The right-hand frame gets two sheets of this folder as one `<style>`, before the embed starts: `base.css` (theme-independent:
  it stills the component's own picture of the family where the theme's takes its place, places what the speaker adds, names
  a part's tone) and `<theme>.css` (the ten pictures, one section per family). Every rule there outweighs the character demos
  by specificity (`:not(#fa)`), never `!important` on a motion (one colour rule in high-contrast.css is the exception), so the kit's restart of a motion still works.
- `speak.js` marks, in the right-hand frame, the parts of each component a family's picture lands on (`data-fa-surface`,
  `-arrive`, `-live`, `-point`, `-tone`, `-shape`, with `<span data-fa-pic>` and `<span data-fa-decor>` layers where a
  picture needs one), and keeps them marked while the demo redraws. It also plays, in both frames, what a component does not
  do by itself but the family asks of it (a meter's share moving with a new reading, a table cell taking one).
- `pictures.js` holds the words: per theme and family the picture's source, name, idea and what every component keeps of it;
  per family and component where it lands; and the components that cannot take a family, with the reason, shown on their card
  in place of a pair.
- Nothing in `css/` or the character demos changes: this is a proposal. Approved families move into the registers at the port.
