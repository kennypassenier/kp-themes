# Component ideas for later

Ideas Kenny marked "Later" so they are not lost. `docs/FUTURE_THEMES.md` holds theme ideas and `docs/MINI_ROUNDS.md`
holds measurements and mini-rounds; a component idea that is approved but not yet built waits here, one section each,
until it is built (then it moves to the CHANGELOG) or dropped (then the section says so and why).

## nudge-card

**Marked "Later" by Kenny on 2026-10-16 19:32**, in the same answer that approved the seven components of
`research/kpadopt4/`.

One calm prompt a day that asks for a small input and goes away by itself: a single card, not a toast and not a
notification, that says one thing ("How did today go?"), offers one or two answers, and dismisses itself once answered
or once its day is over. For the Life project (the AuDHD system), where input stops coming back when a page nags: Kenny
prefers nudges over notifications, one at a time, never piling up.

What it would need from the package: a card with one question and its answers as package buttons, a quiet arrival in
the theme's own motion, a self-dismiss after the answer or at a set time (with the way out named, KT6), a memory of
what was answered (js/remember.js), exact wording from the dictionary, and no badge or counter that grows.

## notification-log

**Marked "Later" by Kenny on 2026-10-16 19:32.** The same idea as the notiflog project parked on 2026-09-15.

A log of the toasts a person missed: every toast the page showed, kept in a list that can be opened later, newest
first, with its time (dd/mm/yyyy HH:MM), its tone as a word and a shape as well as a colour, and its action if it had
one. The list reads like the package's log (`.kp-log`) and opens from a button with an exact count of what was not
seen, never "9+".

What it would need from the package: a hook in `toast()` (js/overlays.js) that hands each toast to a store, a cap on
how many are kept (no ballooning: a fixed number or a number of days), a panel or drawer that lists them, and a way to
clear them.
