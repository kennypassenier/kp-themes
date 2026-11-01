// research/ux-touch-1101: the four sections of the review page, one per visible change, in the order the review walks them.
import { beforeAfter, board, docsPhone, group, log, secretBefore, secretNow, touchData, touchForm, width } from './markup.mjs';

const ITEM = 'your answer of 01/11/2026';

export const SECTIONS = [
    {
        id: 'board-phone',
        title: 'A board on a phone: one lane under a switcher',
        topic: 'board',
        topicTitle: 'The board',
        item: `${ITEM}, board-phone: one column with a switcher`,
        asked:
            'On a phone each lane took 85% of the width and the board scrolled sideways; you rejected that. Under 40rem of its own width the board now shows one lane, with a switcher above it that names every lane and its exact count.',
        h2: 'Weekly review, the Boards page',
        intro: 'Four lanes as the Habits app has them: Inbox, Doing (at most 2), Waiting and Done. The cards are the app&rsquo;s task rows (mock titles).',
        expected: [
            '<b>Phone</b>: one row of four buttons, &ldquo;Inbox 4 · Doing 2 / 2 · Waiting 1 · Done 7&rdquo;, the name over its count; under it only the chosen lane&rsquo;s cards. Nothing scrolls sideways.',
            'Press a lane&rsquo;s button (or Tab to the switcher and use ← →) and its cards replace the others.',
            '<b>Move to</b>: open a card&rsquo;s ⋯ menu (or right-click it, or Shift+F10): &ldquo;Move to&rdquo; lists the other lanes with what they hold. Pick one: the card leaves this lane, the counts change at once, the line under the board says where it went, and the lane you were in stays on screen.',
            'Move a card into Doing: it reads 3 / 2 and its count turns red (over the limit); nothing is refused.',
            '<b>Full width</b>: the lanes stand side by side and drag as approved; the menus carry Move to as well.',
        ],
        look: 'Check that the four buttons fit one row at 390 px with every count readable, that the chosen lane is plain to see, and that a move from the menu never leaves you in another lane.',
        controls: width('board-phone-component'),
        component: `${board('pg-board')}${log('pg-board-log')}`,
        phone: true,
    },
    {
        id: 'secret-reveal',
        title: 'A secret field keeps its height when it is revealed',
        topic: 'secret',
        topicTitle: 'The secret field',
        item: `${ITEM}, secret-reveal: a fixed height`,
        asked:
            'In kyu, Reveal grew the field and added a &ldquo;Hides in 10 s&rdquo; line, so everything below jumped 61 px and jumped back when it hid. The field now keeps one height and the countdown stands inside the value&rsquo;s box.',
        h2: 'kyu&rsquo;s API token',
        intro: 'The token shows for 10 seconds; the drain under the value runs out with the countdown. The dashed row under the field is the next row of a form.',
        expected: [
            '<b>Before</b> (held still in its shown state): the countdown on a line under the buttons.',
            '<b>New</b>: press Reveal. The token and &ldquo;Hides in 10 s&rdquo; stand inside the value&rsquo;s box, the drain along its foot; the dashed row does not move. The line under it says how far the row moved: 0 px.',
            'The token never runs under the countdown: it stops before it, and a longer value scrolls inside the box.',
            '<b>Wrap</b>: a long value wraps in a box of fixed height (two lines) and scrolls inside it; the row below stays put.',
        ],
        look: 'Check that the countdown reads as part of the field, not as a second value, and that nothing under the field moves when it shows and hides.',
        controls: group('Value', 'secret-wrap', [['line', 'One line', true], ['wrap', 'Wrap, two lines']], 'secret-reveal-component') + width('secret-reveal-component', false),
        component: beforeAfter(secretBefore(), `${secretNow('pg-secret')}${log('pg-secret-log')}`),
        phone: false,
    },
    {
        id: 'touch-targets',
        title: 'On a touch screen every small part is a fingertip wide',
        topic: 'touch',
        topicTitle: 'Touch targets',
        item: `${ITEM}, touch-targets: invisibly bigger; dialog-close: the ✕ stays, 44 px`,
        asked:
            'The apps counted up to 340 targets under 44 px on a phone. Under a touch screen every small part now takes a 44 px hit area that you cannot see; only text fields and selects stand taller, because a field cannot carry an invisible area.',
        h2: 'Medicine Cabinet, on a phone',
        intro: 'Chips, a switch, a check box, radios, a quantity, a text field, a select, a time field, an uptime row, name links in a table and a list, and a dialog&rsquo;s ✕. A mouse cannot be a finger, so the switch makes this stage behave as a touch screen does (<code>data-kp-touch</code>).',
        expected: [
            '<b>Mouse</b>: every part as approved.',
            '<b>Touch</b>: the parts look the same; text fields, the select and the time field stand 44 px tall. The line under the stage counts the targets whose hit area is under 44 px.',
            '<b>Show hit areas</b>: each invisible area is tinted, so you can see it is at least 44 by 44 px around its part (uptime cells only in height: a tap on the row opens the nearest hour).',
            'The ✕ of the dialog keeps its place and look; its hit area is 44 px.',
        ],
        look: 'Check that Touch changes nothing you can see except the fields&rsquo; height, and that the tinted areas do not swallow a neighbour&rsquo;s text.',
        controls:
            group('Pointer', 'pointer', [['mouse', 'Mouse', true], ['touch', 'Touch']], 'touch-targets-component') +
            group('Hit areas', 'hits', [['off', 'Hidden', true], ['on', 'Show hit areas']], 'touch-targets-component') +
            width('touch-targets-component'),
        component: `${touchForm('pg-t')}${touchData('pg-t')}${log('pg-touch-log')}`,
        phone: true,
    },
    {
        id: 'docs-nav',
        title: 'The documentation on a phone folds its navigation',
        topic: 'docs',
        topicTitle: 'The documentation site',
        item: `${ITEM}, docs-phone-nav: fold`,
        asked:
            'At 390 px every page of the documentation drew the whole side navigation first, so a page&rsquo;s own text started about 5194 px down. On a phone the navigation now folds behind a menu button, as <code>.kp-sidenav</code> does for apps.',
        h2: 'The Badge page, 390 px wide',
        intro: 'The page itself, in a window of a phone&rsquo;s width. Wider than 40rem the navigation is the column it always was.',
        expected: [
            '<b>Closed</b>: a menu button top left and the theme button top right on one row; the page&rsquo;s title right under them.',
            '<b>Open</b>: the navigation slides in from the left over the page, the theme&rsquo;s own panel, no dimmed backdrop. Escape or the button closes it and the focus goes back to the button.',
            'The line under the window says where the page&rsquo;s text starts.',
        ],
        look: 'Check that the menu button is easy to find and that the opened panel reads as the theme&rsquo;s own navigation.',
        controls: group('Menu', 'docs-menu', [['closed', 'Closed', true], ['open', 'Open']], 'docs-nav-component'),
        component: `${docsPhone('pg-docs')}${log('pg-docs-log')}`,
        phone: false,
    },
];
