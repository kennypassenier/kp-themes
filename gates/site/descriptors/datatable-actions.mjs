// The data table page's example of the actions column and the card threshold [mc-1030], kept apart so datatable.mjs stays one page long.

/** @type {import('./types.mjs').Example} */
export const actionsColumnExample = {
    title: 'An actions column, and cards only when it is really narrow',
    why: '`data-kp-col="actions"` on a header makes its column a fixed track as wide as its buttons that never wraps; the buttons go in `.kp-table__actions`, a row of equal columns, so Edit and Delete have one width in every row. `data-kp-cards-at="30rem"` keeps the table a table down to 30rem of its own width instead of the 40rem the cards answer to (it can lower the width, not raise it): a short table in a dialog stays a table on a tablet. In a card the actions cell loses its label and its buttons stand in a row across the card.',
    markup: `
<div class="kp-datatable" data-kp-datatable data-kp-cards data-kp-cards-at="30rem">
<div class="kp-table-wrap">
<table class="kp-table">
<caption>Forms of medicine</caption>
<thead><tr>
<th scope="col" data-kp-sort="text">Form</th>
<th scope="col" data-kp-sort="number">Medicines</th>
<th scope="col" data-kp-col="actions">Actions</th>
</tr></thead>
<tbody>
<tr data-kp-row-key="tablet"><td>Tablet</td><td class="kp-numeric">12</td><td><div class="kp-table__actions"><button type="button" class="kp-button kp-button--sm">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--destructive">Delete</button></div></td></tr>
<tr data-kp-row-key="capsule"><td>Capsule</td><td class="kp-numeric">7</td><td><div class="kp-table__actions"><button type="button" class="kp-button kp-button--sm">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--destructive">Delete</button></div></td></tr>
<tr data-kp-row-key="syrup"><td>Syrup</td><td class="kp-numeric">3</td><td><div class="kp-table__actions"><button type="button" class="kp-button kp-button--sm">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--destructive">Delete</button></div></td></tr>
<tr data-kp-row-key="nasal-spray"><td>Nasal spray</td><td class="kp-numeric">1</td><td><div class="kp-table__actions"><button type="button" class="kp-button kp-button--sm">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--destructive">Delete</button></div></td></tr>
<tr data-kp-row-key="cream"><td>Cream</td><td class="kp-numeric">0</td><td><div class="kp-table__actions"><button type="button" class="kp-button kp-button--sm">Edit</button><button type="button" class="kp-button kp-button--sm kp-button--destructive">Delete</button></div></td></tr>
</tbody>
</table>
</div>
</div>
`,
};
