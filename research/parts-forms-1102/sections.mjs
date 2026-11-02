// research/parts-forms-1102: the sections of the review page, one per part Kenny approved on 02/11/2026 00:41, in the order the
// review walks them; round 2 keeps only the one he sent back.
import { categories, deliveries, formsLine, group, meals, medicineForm, retries, width } from './markup.mjs';

const ITEM = 'your approval of 02/11/2026 00:41';

const ALL_SECTIONS = [
    {
        id: 'chip-filter',
        title: 'Chips that filter a data table, each with its exact count',
        topic: 'chip-filter',
        topicTitle: 'The chip filter',
        item: `${ITEM}, chip-filter (Almanac gap 11)`,
        asked:
            'Almanac wired its status chips to the table by hand and mirrored the table back into them. The chips now name the table and its column (<code>data-kp-filter-for</code>, <code>data-kp-filter-column</code>); the package filters, counts and keeps both in step.',
        h2: 'Almanac, deliveries of the last day',
        intro: 'Twelve deliveries to the family calendars. The chips were not written by the page: they are made from the Status column, with All first.',
        expected: [
            'Four chips: <b>All 12 · Delivered 7 · Retrying 3 · Failed 2</b>. Press <b>Failed</b>: the table shows its two rows and the line above it says so; All brings every row back.',
            '<b>Rows</b>: &ldquo;Two more failures&rdquo; adds two rows: Failed reads 4 and All 14 at once; &ldquo;One delivered&rdquo; turns a retry into Delivered: Retrying 2, Delivered 8. A chosen chip keeps filtering while the counts move.',
            '<b>Mode</b>: &ldquo;Several at once&rdquo; makes it a toggle group (Failed and Retrying together); the table follows.',
            'Phone: the chips wrap on whole words, the table turns into cards, the counts stay.',
        ],
        look: 'Check that every count is the exact number of rows it would show, that the counts follow a change at once, and that the chosen chip and the table never disagree.',
        controls:
            group('Rows', 'delivery-rows', [['base', 'As loaded', true], ['more', 'Two more failures'], ['delivered', 'One delivered']], 'chip-filter-component') +
            group('Mode', 'delivery-mode', [['single', 'One at a time', true], ['multi', 'Several at once']], 'chip-filter-component') +
            width('chip-filter-component'),
        component: deliveries(),
    },
    {
        id: 'add-row',
        title: 'An add row: under the table’s columns, or one line in a form',
        topic: 'add-row',
        topicTitle: 'The add row',
        item: `${ITEM}, add-row (Kitchen’s inline add row and row label; Medicine Cabinet gap 30)`,
        asked:
            'Kitchen typed new meals in a grid of its own above the table whose columns did not follow the table&rsquo;s; Medicine Cabinet laid a name, a unit and Add on a grid by hand. Both are the add row now (<code>data-kp-addrow</code>), on the kit form. A field&rsquo;s error has an icon and a role, and a row can be named apart from its key (<code>data-kp-row-label</code>).',
        h2: 'Kitchen, what I ate today; Medicine Cabinet, forms',
        intro: 'Type a dish and press Enter. The page answers after a short wait, so the busy Add shows. The second part is a line in a form grid.',
        expected: [
            '<b>Table</b>: the Dish, Meal and Portions fields stand exactly under their columns, Add under the last (actions) column. Enter with a dish adds it to the table, empties the row and puts the cursor back in Dish.',
            'Add with Dish empty: the summary above the row names the field, the field says why with a round &ldquo;!&rdquo; before the words.',
            '<b>Page answers &ldquo;Refuses&rdquo;</b>: the line under the row says &ldquo;You already logged Pasta pesto for dinner.&rdquo;; what you typed stays.',
            '<b>Row label</b>: press a Portions value and change it: the line under the table names the dish (&ldquo;Pasta pesto&rdquo;), not the row&rsquo;s id.',
            '<b>Forms line</b>: name and unit side by side with Add; a refusal stands under them. Phone: the table&rsquo;s add row becomes a card with labels, Add the full width.',
        ],
        look: 'Check that each field starts on its column&rsquo;s edge at full width, that the busy Add and the refusal look like the kit form&rsquo;s, and that the line never names an id.',
        controls: group('Page answers', 'meal-answer', [['adds', 'Adds', true], ['refuses', 'Refuses']], 'add-row-component') + width('add-row-component'),
        component: `${meals()}${formsLine()}`,
    },
    {
        id: 'unsaved-adapter',
        title: 'The unsaved bar counts chips, row editors and weekday pickers',
        topic: 'unsaved-adapter',
        topicTitle: 'Unsaved changes',
        item: `${ITEM}, unsaved-adapter (Medicine Cabinet gap 24)`,
        asked:
            'Medicine Cabinet kept hidden mirror fields so the unsaved bar would see its chips, its times and its days. A control now says what it holds in <code>data-kp-track-value</code>; the package&rsquo;s chips, row editor and weekday picker keep it themselves, and Discard and Undo write it back. Leaving can hand the link to an app&rsquo;s router.',
        h2: 'Medicine Cabinet, Ibuprofen 400',
        intro: 'No mirror fields: the form&rsquo;s chips, its times (a row editor) and their days are counted by the bar in the header.',
        expected: [
            'Press <b>Capsule</b>: the bar says &ldquo;1 change&rdquo;; its list reads &ldquo;Form · Tablet → Capsule&rdquo;. Press Tablet again: back to no changes.',
            'Add a time or change a day: &ldquo;When to take it&rdquo; counts as one change, whatever you changed in it.',
            '<b>Discard</b>: the chips, the days and the rows go back as they were (an added time leaves); <b>Undo</b> in the toast brings your changes back.',
            'With a change, press <b>Back to the cabinet</b>: the package asks; Leave hands the link to the app&rsquo;s router (the line under the form says so) instead of loading a page.',
        ],
        look: 'Check that each custom control counts as one change with readable words in the list, and that Discard and Undo put every control back exactly.',
        controls: width('unsaved-adapter-component'),
        component: medicineForm(),
    },
    {
        id: 'segmented-menu',
        title: 'A chip with its own menu, renamed in place',
        topic: 'segmented-menu',
        topicTitle: 'Chip menus',
        item: `${ITEM}, segmented-menu (Medicine Cabinet gap 23)`,
        asked:
            'Medicine Cabinet&rsquo;s category chips each filter and each need a ⋯ menu; the app laid chip and menu side by side by hand. A chip now takes a menu right after it, and Rename turns the chip into a field.',
        h2: 'Medicine Cabinet, categories',
        intro: 'Each category but All has its ⋯ menu with Rename and Delete; under them, the fourteen medicines they filter.',
        expected: [
            '<b>Round 2</b>: in the review window the open menu shrank to an empty 10 px strip as soon as the window got shorter (you saw it as closing on hover). The menu capped its height at the window&rsquo;s height less 12rem, which is below zero in a window 177 px tall. That cap now never goes under the menu&rsquo;s own rows, so the menu opens whole under its ⋯ and stays whole while you hover or walk it with the arrows (measured in Firefox at 1280 and 390 px: 2 entries, 73 px tall after opening, after hovering each entry and after the arrow key; Rename closes it and gives the field). Every package menu gets the same floor; in a normal window nothing changes. New in this round: the cabinet the chips filter stands under them, so you see a pick and a rename land.',
            'Each chip and its ⋯ read as one pill split by a hair line; choosing a chip filters the cabinet (Allergy: its two medicines), the counts are the package&rsquo;s.',
            'Open a chip&rsquo;s ⋯ and pick <b>Rename</b> (or press F2 on the chip): the chip becomes a field as wide as it was, its name selected. Enter saves, Escape cancels; the focus comes back to the chip. A saved name also shows in the cabinet&rsquo;s Category column, and the chip keeps filtering.',
            '<b>Page answers &ldquo;Refuses&rdquo;</b>: Enter says &ldquo;A category called … already exists.&rdquo; under the field, which stays open; nothing around it moves.',
            'Tab reaches the chosen chip, then its ⋯, then leaves the group; Shift+F10 on a chip opens its menu.',
        ],
        look: 'Check that chip and menu read as one control, that the field sits exactly where the chip stood, and that a refusal is plain without shifting the other chips.',
        controls:
            group('Page answers', 'cat-answer', [['accepts', 'Accepts', true], ['refuses', 'Refuses']], 'segmented-menu-component') +
            group('State', 'cat-state', [['rest', 'At rest', true], ['menu', 'Menu open'], ['rename', 'Renaming'], ['refused', 'Refused']], 'segmented-menu-component') +
            width('segmented-menu-component'),
        component: categories(),
    },
    {
        id: 'run-notes',
        title: 'A note per next time, and the tries left on a timeline lane',
        topic: 'run-notes',
        topicTitle: 'Run notes',
        item: `${ITEM}, run-notes (Almanac gaps 4 and 6)`,
        asked:
            'Almanac had no place to say &ldquo;1 try left&rdquo;: the next times carried only a conflict mark, and a timeline lane only its name. A row now takes a free note (<code>{ at, note }</code>) and a lane its tries left (<code>tries</code>).',
        h2: 'Almanac, a delivery that failed',
        intro: 'The next three tries of one failed delivery, then the last six hours of deliveries, one lane per calendar.',
        expected: [
            'Next tries: each row has its time, how far away it is and a note in plain words, &ldquo;2 tries left&rdquo;, &ldquo;1 try left&rdquo;, &ldquo;Last try&rdquo;, in one column.',
            'Timeline: each lane&rsquo;s name ends with a mark: <b>Huishouden</b> &ldquo;2 tries left&rdquo; (plain), <b>School</b> &ldquo;1 try left&rdquo; (warning), <b>Sport</b> &ldquo;No tries left&rdquo; (red); <b>Werk</b> has none.',
            '<b>Notes</b>: &ldquo;Off&rdquo; gives the approved list (three columns, no note column) and lanes without marks.',
        ],
        look: 'Check that the notes line up in one column, that each mark reads at a glance beside its lane name, and that a long lane name wraps before its mark is pushed out.',
        controls: group('Notes', 'run-notes', [['on', 'On', true], ['off', 'Off']], 'run-notes-component') + width('run-notes-component'),
        component: retries(),
    },
];

// Round 2 (Kenny, 2026-11-02 01:12 UTC): only the section he sent back; the four approved ones leave the page (DEMO_RULES ch. 6).
export const SECTIONS = ALL_SECTIONS.filter((section) => section.id === 'segmented-menu');
