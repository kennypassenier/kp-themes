// research/ux-touch-1101, round 2: the one section Kenny did not approve in round 1 (docs-nav). The other three (board-phone,
// secret-reveal, touch-targets) are decided and live in git history and _previous/ (DEMO_RULES ch. 6).
import { docsPhone, group, log } from './markup.mjs';

const ITEM = 'your answer of 01/11/2026';

export const SECTIONS = [
    {
        id: 'docs-nav',
        title: 'The documentation on a phone folds its navigation',
        topic: 'docs',
        topicTitle: 'The documentation site',
        item: `${ITEM}, docs-phone-nav: fold`,
        asked:
            'Round 2: the first window showed a 404, because the review copy carries no documentation. It now loads the published documentation. At 390 px every page of the documentation drew the whole side navigation first, so a page&rsquo;s own text started about 5194 px down. On a phone the navigation now folds behind a menu button, as <code>.kp-sidenav</code> does for apps.',
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
