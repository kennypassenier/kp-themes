# Three faster ways to judge a demo

Kenny, 2026-10-06 14:56: "En er moet een beter manier zijn om dit allemaal te
beoordelen, nu is het nog altijd veel rondklikken en op knoppen die state
veranderen klikken etc, doe een paar pogingen om iets beters te vinden qua UI
en snelheid."

Three prototypes of the review surface, each on the real open rounds of
research/character-trend and research/character-graph (loaded in iframes and
driven from here; the demos and research/_review are unchanged). Every pick is
written to the same storage key the review dialog uses, so an answer given
here is a real answer.

- `autoplay.html`: one theme × aspect per screen, every option a big card
  playing its own motion; 1–6 or a click picks, N is "None of these" with a
  note, the next screen follows by itself.
- `flip.html`: one option at a time on a large stage; ←/→ flip with the motion
  restarting; Space or Enter picks.
- `sheet.html`: one aspect across all open themes at once, every option
  playing; ↑/↓ moves between themes, 1–6 picks.

P pauses, S cycles the speed. `js/engine.js` holds the shared part (finding
the open aspects from `data-review-choices`, focusing a row, playing the
aspect's controls from `data-review-plays`, storage and the answer text).
