# research/list-action-1031: a trailing action column in the list of rows

Kenny chose on 2026-10-31 ("list-action: Eigen vak toevoegen") to give `.kp-list` its own place for a row's action instead of Medicine
Cabinet putting its "I took one" button in the stepper cell (`medicine-cabinet/web/js/pages/symptoms-rows.js`). Built in
`css/components/list-row.css`: `.kp-listrow__action` in a fifth named column `[action] auto` at the end of the grid, every row a subgrid so
the actions line up, an empty cell in a row without one, its own full line under the 40rem card break. The track exists only in a list that
holds an action, so a list without one keeps the four approved tracks.

**Round 1** (one section, `list-action`, formal only): the Symptoms results for a headache in the app's own shape (three "I took one"
buttons, one "Scheduled", one row without an action) and one Cabinet row with a stepper and a switch. Controls: the card's data states,
"No action in any row" (the cells taken out, the list back to four columns), and the stage at a phone's 390 px. The names, counts and times
are mock.

**Generated** by `node research/list-action-1031/build.mjs` (edit the builder, never the page).
