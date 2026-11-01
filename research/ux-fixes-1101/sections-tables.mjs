// research/ux-fixes-1101: the three sections about the data table. What is asked, the heading and one sentence, what to expect, what
// to look at, the controls and the component; demo.js wires the controls by the section's own elements.
import { DEAD_LETTERS_EMPTY, TOPICS, topicsTable } from './parts.mjs';
import { group, label, log, width } from './controls.mjs';

const ITEM = 'your answer to the review of the apps, 2026-11-01';

export const TABLE_SECTIONS = [
    {
        id: 'filters',
        title: 'The data table’s Filters open over the table, with a label on every input',
        topic: 'tables',
        topicTitle: 'The data table',
        item: `${ITEM}: &ldquo;table-filters: Popover met labels&rdquo;`,
        asked:
            'kyu&rsquo;s Topics table opened its Filters as a panel inside the table that pushed everything below it down by 95 px, and the Min and Max boxes of the message count had no name. The panel is now a popover under its button; every input has a visible label.',
        h2: 'Topics: filter on messages, last seen and state',
        intro:
            'kyu&rsquo;s Topics (sample data). Press <b>Filters</b>: the panel opens under the button, over the table. The line under the table does not move; the line under it says where it stood before and after.',
        expected: [
            '<b>Popover</b>: the panel hangs under the Filters button, over the table&rsquo;s rows; <b>the line under the table stays at the same height</b> (the readout under the table says so in pixels). Escape or a press outside closes it.',
            '<b>Labels</b>: State, Messages (<b>Min</b> and <b>Max</b>) and Last seen (<b>From</b> and <b>To</b>) each have their own words over the box. Type a Min of 100 and the rows narrow.',
            '<b>Inline (before)</b>: the older panel, in the flow: the line under the table moves down when it opens. It stays as the choice <code>data-kp-filters="inline"</code>.',
        ],
        look: 'Formal is a paper plate: the panel is a plate with the theme&rsquo;s border and opaque ground, never see-through over the rows. Check the labels are as readable as the table text and nothing touches an edge.',
        controls:
            group('Panel', 'fpanel', [['popover', 'Popover (now)', true], ['inline', 'Inline (before)']], 'filters-component') +
            group('Filters', 'fopen', [['closed', 'Closed', true], ['open', 'Open']], 'filters-component') +
            width('filters-component'),
        component: `${label('Topics')}<div id="pg-f-popover">${topicsTable({ id: 'pg-f-pop', filters: true })}</div>
        <div id="pg-f-inline" hidden>${topicsTable({ id: 'pg-f-inl', filters: true, attrs: 'data-kp-filters="inline"' })}</div>
        <p class="pg-under" id="pg-f-under">The line under the table.</p>${log('pg-f-log')}`,
    },
    {
        id: 'states',
        title: 'An empty or failed table is only its plate',
        topic: 'tables',
        topicTitle: 'The data table',
        item: `${ITEM}: &ldquo;table-states: Opnemen&rdquo;`,
        asked:
            'An empty table kept about 550 px of blank body with only &ldquo;Showing 0 of 0&rdquo;, and a failed one stood inside the full table chrome (&ldquo;Not sorted.&rdquo;). Now the plate fills the table&rsquo;s footprint and the count line, the pager and the sort summary leave. A pager with one page hides.',
        h2: 'Dead letters: rows, none, or could not be read',
        intro:
            'kyu&rsquo;s Dead letters table (sample data). Switch it to <b>Empty</b> and <b>Failed</b> and back: the plate takes the height the rows had and nothing around the table moves.',
        expected: [
            '<b>Empty</b>: the package&rsquo;s empty plate, centred, as high as the table was; <b>no &ldquo;Showing 0 of 0&rdquo;</b>, no pager, no sort line. The search stays so a search can be cleared.',
            '<b>Failed</b>: the failed plate with Try again replaces the footprint; the same chrome is gone. Press Try again: the rows come back.',
            '<b>Rows</b>: nine rows fit on one page, so <b>no pager</b> is drawn; the line says &ldquo;Showing 1–9 of 9&rdquo;. A page size of 5 (press Pager) brings it back with two pages.',
        ],
        look: 'Formal&rsquo;s plates are quiet paper with a heading-size line: check the heading is centred in the table&rsquo;s old footprint and the Try again button has a normal size.',
        controls:
            group('Table', 'tstate', [['rows', 'Rows', true], ['empty', 'Empty'], ['failed', 'Failed']], 'states-component') +
            group('Pager', 'tpager', [['none', 'Nine rows, one page', true], ['two', 'Five a page']], 'states-component') +
            width('states-component'),
        component: `${label('Dead letters')}${topicsTable({ id: 'pg-s-table', rows: TOPICS, empty: DEAD_LETTERS_EMPTY })}${log('pg-s-log')}`,
    },
    {
        id: 'row-actions',
        title: 'A row’s actions: one primary button and a row menu',
        topic: 'tables',
        topicTitle: 'The data table',
        item: `${ITEM}: &ldquo;table-rows: Eén actie + menu&rdquo;`,
        asked:
            'On a phone kyu&rsquo;s Topics rows stacked three full-width 28 px buttons with Delete in the middle. <code>data-kp-row-actions="menu"</code> keeps one primary action on the row and puts the others in a row menu, also in the phone cards.',
        h2: 'Topics: Open, and a menu for Purge and Delete',
        intro:
            'kyu&rsquo;s Topics rows with their three actions, as the app writes them. The page needs only the one attribute.',
        expected: [
            '<b>Row menu</b>: each row shows <b>Open</b> and a <b>⋯</b> button; the menu holds Purge and, last and in red, Delete. Open the menu and press Purge: the line under the table says what was pressed (the same buttons, their listeners kept).',
            '<b>Phone, 390 px</b>: each card ends in one line: Open fills it, with the ⋯ button beside it, both 44 px high; no stack of small buttons.',
            '<b>Stacked buttons (before)</b>: the earlier look, for comparison.',
        ],
        look: 'Check the menu button is the same family as the buttons beside it, the menu opens under it as the theme&rsquo;s own plate, and Delete is the one red entry.',
        controls:
            group('Row actions', 'ractions', [['menu', 'Row menu (now)', true], ['stack', 'Stacked buttons (before)']], 'row-actions-component') +
            width('row-actions-component'),
        component: `${label('Topics')}<div id="pg-r-menu">${topicsTable({ id: 'pg-r-tbl', actions: true, attrs: 'data-kp-row-actions="menu"' })}</div>
        <div id="pg-r-stack" hidden>${topicsTable({ id: 'pg-r-old', actions: true })}</div>${log('pg-r-log')}`,
    },
];
