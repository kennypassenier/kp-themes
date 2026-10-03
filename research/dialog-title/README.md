# The dialog title: the theme's own, or the fixed size

Kenny, 2026-10-03, on the 9.0.0 build: nine themes' approved dialog designs set
their title's size, line height or block padding, which scope-87 refuses
(heading metrics are the package's, enforced by gates/box-metrics.test.mjs).
Asked whether the approved design or the fixed size wins, he answered "toon het
verschil op een demopagina".

`demo.html` shows each of the nine themes' dialog twice, standing still: left
as approved, right with the title at the package's metrics. It carries the
review kit; approving a theme takes the right one.

Round one (2026-10-03): the fixed size for all nine; grotesk not approved,
its red rule touched the letters. Round two shows grotesk with the rule
moved into its own space above the title.
