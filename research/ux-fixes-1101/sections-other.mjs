// research/ux-fixes-1101: the five sections about fields, lists, disabled reasons and the uptime strip. Same shape as sections-tables.mjs.
import { doseList, medicineList, outOfStock, publishForm, uptimeRow } from './parts.mjs';
import { group, label, log, width } from './controls.mjs';

const ITEM = 'your answer to the review of the apps, 2026-11-01';

export const OTHER_SECTIONS = [
    {
        id: 'required',
        title: 'A required field is red only after it is left or a send is tried',
        topic: 'fields',
        topicTitle: 'Required fields',
        item: `${ITEM}: &ldquo;required-early: Na verlaten of verzenden&rdquo;`,
        asked:
            'kyu&rsquo;s JSON field opened red with &ldquo;Empty&rdquo; before anything was typed. Now a field is red only after you leave it or press send.',
        h2: 'Publish a message: topic, payload and days',
        intro:
            'kyu&rsquo;s Publish form: it opens clean; the control shows it after leaving the payload and after Publish.',
        expected: [
            '<b>Fresh</b>: no red, no error line anywhere.',
            '<b>After leaving the payload</b>: only the payload is red, with its sentence.',
            '<b>After Publish</b>: every empty required field shows what is missing.',
        ],
        look: 'Check the fresh form carries no red at all.',
        controls: group('Form', 'rform', [['fresh', 'Fresh', true], ['left', 'After leaving the payload'], ['sent', 'After Publish']], 'required-component') + width('required-component'),
        component: `<div id="pg-publish-stage"></div><template id="pg-publish-tpl">${publishForm('pg-publish')}</template>${log('pg-req-log')}`,
    },
    {
        id: 'action-list',
        title: 'In a narrow action list the buttons are one full-width row, the primary first',
        topic: 'lists',
        topicTitle: 'Lists with actions',
        item: `${ITEM}: &ldquo;action-list-narrow: Eén rij, hoofdknop eerst&rdquo;`,
        asked:
            'At 390 px a dose row in Medicine Cabinet stacked Skip above Take, centred and word-wide, and the primary was the second target. This changes a look you approved on 2026-10-05, so both are shown; the earlier one stays as <code>data-kp-actions-narrow="stack"</code>.',
        h2: 'Doses today: Skip and Take',
        intro: 'Three doses at a phone&rsquo;s 390 px, once as it was and once as it is now.',
        expected: [
            '<b>Now</b>: under the name and time the buttons stand in <b>one row, full width, Take first</b> (filled), then Skip; each label on one line.',
            '<b>Before</b>: one button per line, centred, Skip above Take.',
            '<b>Full width</b>: the wider list is unchanged in both: the buttons stand on the shared columns at the end of the row.',
        ],
        look: 'Check the row shares the width evenly enough that no label is cut, and the primary&rsquo;s fill reads as the first thing to press.',
        controls: width('action-list-component', true),
        component: `${label('Now: one row, the primary first')}${doseList('pg-a-now')}${label('Before: one button per line')}${doseList('pg-a-before', 'data-kp-actions-narrow="stack"')}`,
    },
    {
        id: 'disabled-reason',
        title: 'On a touch screen a disabled button says why under it',
        topic: 'disabled-reason',
        topicTitle: 'A disabled control says why',
        item: `${ITEM}: &ldquo;disabled-touch: Onder de knop&rdquo;`,
        asked:
            'Medicine Cabinet&rsquo;s out-of-stock &ldquo;I took one&rdquo; gave its reason in a tooltip, which a finger cannot reach. On touch it is now printed under the button.',
        h2: 'Cetirizine: nothing left',
        intro:
            'A touch screen does this by itself; the switch turns the line on for a mouse (<code>data-kp-reason-line="always"</code>).',
        expected: [
            '<b>Mouse</b>: the reason is a tooltip; nothing under the button.',
            '<b>Touch</b>: the reason stands under the button; the button keeps its place.',
        ],
        look: 'Check the line is readable beside the button and does not look like a second control.',
        controls: group('Pointer', 'pointer-reason', [['mouse', 'Mouse (tooltip)', true], ['touch', 'Touch (under the button)']], 'disabled-reason-component') + width('disabled-reason-component', true),
        component: `${outOfStock('pg-d-list')}`,
    },
    {
        id: 'uptime',
        title: 'On a touch screen a tap on an uptime row opens its list',
        topic: 'uptime',
        topicTitle: 'The uptime strip',
        item: `${ITEM}: &ldquo;uptime-touch: Rij aantikken&rdquo;`,
        asked:
            'http-switchboard&rsquo;s uptime cells are tiny and hover cards cannot be reached by touch. On touch a tap on the row opens the nearest cell&rsquo;s list.',
        h2: 'Last 48 hours of two profiles',
        intro:
            'Two profiles, one cell per hour (sample data). A touch screen does this by itself; the switch makes a click do the same (<code>data-kp-uptime-row-tap</code>).',
        expected: [
            '<b>Mouse</b>: pointing at a cell shows its card; a click opens nothing.',
            '<b>Touch</b>: a click <b>between or beside</b> cells opens the nearest hour&rsquo;s list. A second click or Escape closes it.',
        ],
        look: 'Check the opened list sits under its cell and reads clearly.',
        controls: group('Pointer', 'pointer-uptime', [['mouse', 'Mouse (hover card only)', true], ['touch', 'Touch (tap the row)']], 'uptime-component') + width('uptime-component', true),
        component: `${uptimeRow('pg-u-jelly', 'jellyfin')}${uptimeRow('pg-u-ha', 'home-assistant')}${log('pg-u-log')}`,
    },
    {
        id: 'list-head',
        title: 'The list’s column head carries the switch label once',
        topic: 'lists',
        topicTitle: 'Lists with actions',
        item: `${ITEM}: &ldquo;docs-guidance: Docs en kop-label&rdquo;`,
        asked:
            'Every row of Medicine Cabinet&rsquo;s Cabinet list repeated the word &ldquo;Active&rdquo; beside its switch. A first row <code>.kp-listrow--head</code> names the columns once and the rows drop the word.',
        h2: 'Cabinet: four medicines',
        intro: 'The list with its column head and as it was. At a phone&rsquo;s width the head is not drawn and every row says &ldquo;Active&rdquo; again.',
        expected: [
            '<b>With a column head</b>: Medicine, Status, Stock and <b>Active</b> stand over their columns; the switches have no word beside them.',
            '<b>Without (before)</b>: the word beside every switch.',
            '<b>Phone, 390 px</b>: the cards as before; each switch has its word.',
        ],
        look: 'Check the head&rsquo;s words stand exactly over their columns and look like a head, not like a row.',
        controls: group('Head', 'head', [['head', 'With a column head (now)', true], ['none', 'Without (before)']], 'list-head-component') + width('list-head-component'),
        component: `<div id="pg-l-head">${medicineList('pg-l-with', true)}</div><div id="pg-l-plain" hidden>${medicineList('pg-l-without', false)}</div>`,
    },
];
