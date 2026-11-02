// research/medgaps-1102: the two sections of the review page, one per visible change from Medicine Cabinet's gaps (25 and 27),
// in the order the review walks them. Gap 29 (the tab bar's More drawer) changed no look and has no section.
import { group, medicinesTable, stockList, width } from './markup.mjs';

export const SECTIONS = [
    {
        id: 'popover-panel',
        title: 'A popover that holds a form: room inside, and its end edge under the button',
        topic: 'popover',
        topicTitle: 'The popover',
        item: 'Medicine Cabinet gap 25',
        asked:
            'Medicine Cabinet&rsquo;s &ldquo;Add stock&rdquo; popover put its sentence 5 px from the plate&rsquo;s border, and from a button at the end of a row it opened toward the end. Two opt-in classes: <code>kp-popover--panel</code> gives the plate room inside (12 px, knob <code>--kp-popover-panel-padding</code>) and its own width (up to 22rem); <code>kp-popover--end</code> lines its end edge up with the button&rsquo;s. The plain plate stays the default for menus.',
        h2: 'Medicine Cabinet, stock',
        intro: 'Three medicines with what is left. Add stock opens a small form under its button: how many packs, and Add.',
        expected: [
            'Press <b>Add stock</b> on Ibuprofen (or Open): the form hangs 4 px under the button, its right edge on the button&rsquo;s right edge, the sentence 13 px from the border on every side. Escape or a press outside closes it.',
            '<b>Look</b>: &ldquo;Plain plate (as before)&rdquo; puts the sentence 5 px from the border, the field and Add tight against it. <b>Edge</b>: &ldquo;Start edge (default)&rdquo; starts the form at the button&rsquo;s left edge; at a row&rsquo;s end it flips back so it never leaves the screen.',
            'Add with 3 packs: the line under the list says &ldquo;3 packs added to Ibuprofen 400 mg&rdquo; and the form closes. <b>Phone</b>: the form stays whole on the screen, 8 px or more from each side.',
        ],
        look: 'Formal: the raised plate with its fine border; check that no text touches the border and that the form stands under its own button.',
        controls:
            group('Look', 'stock-look', [['panel', 'Panel (new)', true], ['plain', 'Plain plate (as before)']], 'popover-panel-component') +
            group('Edge', 'stock-edge', [['end', 'End edge (new knob)', true], ['start', 'Start edge (default)']], 'popover-panel-component') +
            group('Open', 'stock-open', [['ibuprofen', 'Open the first form']], 'popover-panel-component') +
            width('popover-panel-component'),
        component: stockList(),
    },
    {
        id: 'keep-focused-row',
        title: 'A refresh keeps the row you are typing in',
        topic: 'datatable',
        topicTitle: 'The data table',
        item: 'Medicine Cabinet gap 27',
        asked:
            'Medicine Cabinet redraws its table&rsquo;s rows when the data changes; a redraw took the row under the stock field you were typing in, so the app skipped every refresh while a field had the focus. With <code>data-kp-keep-focused-row</code> on the table, the row that holds the focus stays, with its field, what you typed, the caret and the focus; every other row is redrawn. Off by default.',
        h2: 'Medicine Cabinet, medicines',
        intro: 'Five medicines with how many were taken today and the stock. The page asks for fresh rows every 3 seconds once Refresh runs.',
        expected: [
            'Set <b>Refresh</b> to &ldquo;Every 3 s&rdquo;: the line under the table counts the refreshes and &ldquo;Taken today&rdquo; moves. Click a Stock field and type: the row stays with what you typed and the caret where it was; the line says the row was kept; the other rows go on changing.',
            'Leave the field (Tab or a click elsewhere): what you typed is saved, and the next refresh draws that row fresh too. <b>Keep the focused row</b> &ldquo;Off (as before)&rdquo;: the next refresh takes the field away while you type and the focus is lost.',
            '<b>Phone</b>: the rows are cards and the same holds. Refresh is paused when the page opens.',
        ],
        look: 'Formal: the plain table and its fields; check that the field you type in never blinks, loses a letter or loses the focus while the other rows change.',
        controls:
            group('Refresh', 'meds-refresh', [['paused', 'Paused', true], ['live', 'Every 3 s']], 'keep-focused-row-component') +
            group('Keep the focused row', 'meds-keep', [['on', 'On (new)', true], ['off', 'Off (as before)']], 'keep-focused-row-component') +
            width('keep-focused-row-component'),
        component: medicinesTable(),
    },
];


