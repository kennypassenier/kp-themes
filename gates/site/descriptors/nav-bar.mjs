// Page descriptor for the "nav-bar" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const navBarDescriptor = {
        id: 'nav-bar',
        title: 'Navigation bar',
        group: 'Navigation',
        classes: ['kp-nav', 'kp-nav-wrap', 'kp-tabbar'],
        exports: ['NavBar'],
        intro: 'The bar across the top of an application: a brand, a row of links, and room at the end for whatever the page keeps there. The current page is marked by weight and by a thicker underline, not by colour alone.',
        whenToUse:
            'For the handful of places every page of an application can reach. Not for a deep hierarchy — that is a sidebar with a tree, or a breadcrumb saying where you are. Not for actions: a bar of buttons pretending to be navigation confuses the browser’s own history.',
        examples: [
            {
                title: 'A brand and three links',
                why: 'The current page carries the current-page marking, which is what a screen reader announces, and the weight and underline are what everyone else sees. The wrapper is what the narrow rule measures: a container query styles a container’s contents, never the container itself, and the rule that changes is the bar’s own padding. NavBar renders it for you.',
                markup: `
<div class="kp-nav-wrap">
<nav class="kp-nav" aria-label="Main">
<a class="kp-nav__brand" href="#nav-bar">kp</a>
<ul class="kp-nav__links">
<li><a class="kp-nav__link" href="#nav-bar" aria-current="page">Overview</a></li>
<li><a class="kp-nav__link" href="#example">Applications</a></li>
<li><a class="kp-nav__link" href="#variants">Settings</a></li>
</ul>
</nav>
</div>
`,
            },
            {
                title: 'A mega menu',
                why: 'Press Equipment: a panel of grouped links opens under the bar and spans its width, in up to four columns. It is a disclosure — a button with `aria-expanded` — rather than a dropdown that opens on hover, so a touch or keyboard reader opens it on purpose; Escape closes it and puts the focus back on the button, a click outside closes it, and only one panel is open at a time. The groups are plain lists under headings, not a menu, because these are places to go. In React, a link with `groups` renders the same.',
                markup: `
<div class="kp-nav-wrap">
<nav class="kp-nav" aria-label="Main, with a mega menu">
<a class="kp-nav__brand" href="#nav-bar">kp</a>
<ul class="kp-nav__links">
<li><a class="kp-nav__link" href="#nav-bar">Overview</a></li>
<li>
<button type="button" class="kp-nav__link kp-nav__disclosure" data-kp-nav-disclosure>Equipment</button>
<div class="kp-nav__menu kp-nav__menu--wide">
<div class="kp-nav__group"><h3 class="kp-nav__menu-heading">Pumps</h3><ul><li><a href="#example">Main line pumps</a></li><li><a href="#example">Booster sets</a></li></ul></div>
<div class="kp-nav__group"><h3 class="kp-nav__menu-heading">Valves</h3><ul><li><a href="#example">Gate valves</a></li><li><a href="#example">Check valves</a></li></ul></div>
<div class="kp-nav__group"><h3 class="kp-nav__menu-heading">Sensors</h3><ul><li><a href="#example">Flow meters</a></li></ul></div>
</div>
</li>
</ul>
</nav>
</div>
`,
                react: `
<NavBar
    brand="kp"
    label="Main, with a mega menu"
    links={[
        { href: '#nav-bar', label: 'Overview' },
        {
            href: '#equipment',
            label: 'Equipment',
            groups: [
                { label: 'Pumps', links: [{ href: '#example', label: 'Main line pumps' }, { href: '#example', label: 'Booster sets' }] },
                { label: 'Valves', links: [{ href: '#example', label: 'Gate valves' }, { href: '#example', label: 'Check valves' }] },
                { label: 'Sensors', links: [{ href: '#example', label: 'Flow meters' }] },
            ],
        },
    ]}
    headingLevel={3}
/>
`,
            },
            {
                title: 'A bar that folds what does not fit, with a separator',
                why: '`data-kp-nav-fold` on the nav folds only the links that do not fit, from the end, behind a More menu (the menu button’s own: its keys, its placement, its theme); a link that is folded stays in its list item, out of the flow and the focus order, and its menu entry clicks the real link. `data-kp-nav-keep` on an item keeps it in the bar wherever it is. `li.kp-nav__sep` is a rule between two groups of links: it stands only between shown links, and the More menu draws it as its own separator. Drag the corner of the box to narrow the bar.',
                markup: `
<div style="inline-size: 28rem; max-inline-size: 100%; overflow: hidden; resize: horizontal; border: 1px dashed var(--border); padding: 0.25rem">
<div class="kp-nav-wrap">
<nav class="kp-nav" data-kp-nav-fold aria-label="Main, folding">
<span class="kp-nav__brand">kp</span>
<ul class="kp-nav__links">
<li><a class="kp-nav__link" href="#nav-bar" aria-current="page">Overview</a></li>
<li><a class="kp-nav__link" href="#example">Backups</a></li>
<li class="kp-nav__sep" aria-hidden="true"></li>
<li><a class="kp-nav__link" href="#variants">Network</a></li>
<li><a class="kp-nav__link" href="#variants">Applications</a></li>
<li data-kp-nav-keep><a class="kp-nav__link" href="#variants">Alerts</a></li>
<li class="kp-nav__sep" aria-hidden="true"></li>
<li><a class="kp-nav__link" href="#variants">Settings</a></li>
</ul>
</nav>
</div>
</div>
`,
            },
            {
                title: 'A bottom tab bar, with a count on one tab',
                why: 'On a phone the bar sits at the bottom of the window; here `kp-tabbar--static` leaves it in the flow and `kp-tabbar--always` shows it at every width, so it can be looked at. The icon, the label and the optional `.kp-badge` count are the tab’s; the More tab opens a drawer through `data-kp-dialog`. `setTabbarBadge`, `setTabbarCurrent` and `setTabbarBusy` change a tab from the page: press the buttons below.',
                markup: `
<nav class="kp-tabbar kp-tabbar--always kp-tabbar--static" id="doc-tabbar" aria-label="Areas">
<a class="kp-tabbar__tab" href="#home" data-kp-tab="home" aria-current="page"><span class="kp-tabbar__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3z" /><path d="M14 3h7v7h-7z" /><path d="M3 14h7v7H3z" /><path d="M14 14h7v7h-7z" /></svg></span><span class="kp-tabbar__label">Home</span></a>
<a class="kp-tabbar__tab" href="#inbox" data-kp-tab="inbox"><span class="kp-tabbar__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h4l2 3h4l2-3h4" /><path d="M5 5h14l1 8v6H4v-6z" /></svg></span><span class="kp-tabbar__label">Needs you</span><span class="kp-badge kp-tabbar__badge">3</span></a>
<a class="kp-tabbar__tab" href="#activity" data-kp-tab="activity"><span class="kp-tabbar__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l3-7 4 14 3-7h4" /></svg></span><span class="kp-tabbar__label">Activity</span></a>
<button type="button" class="kp-tabbar__tab kp-tabbar__tab--more" data-kp-dialog="doc-tabbar-more"><span class="kp-tabbar__icon kp-tabbar__icon--more" aria-hidden="true"></span><span class="kp-tabbar__label">More</span></button>
</nav>
<dialog class="kp-drawer kp-dialog" id="doc-tabbar-more" aria-labelledby="doc-tabbar-more-title">
<header class="kp-drawer__head">
<h2 class="kp-dialog__title" id="doc-tabbar-more-title">More</h2>
<button type="button" class="kp-icon-button kp-dialog__close" data-kp-dialog-close aria-label="Close">×</button>
<p class="kp-drawer__desc">The areas you need less often.</p>
</header>
<div class="kp-drawer__body">
<div class="kp-menu kp-menu--rich" role="group" aria-label="More">
<a class="kp-menu__item" href="#backups"><span class="kp-menu__label">Backups</span><span class="kp-menu__hint">Snapshots, restores and the nightly run</span></a>
<a class="kp-menu__item" href="#system"><span class="kp-menu__label">System</span><span class="kp-menu__hint">The host, its disks and updates</span></a>
</div>
</div>
</dialog>
<div class="kp-row kp-gap-sm kp-mt-sm">
<button type="button" class="kp-button kp-button--sm" data-doc-tab="badge">Count 1534</button>
<button type="button" class="kp-button kp-button--sm" data-doc-tab="current">Current: Activity</button>
<button type="button" class="kp-button kp-button--sm" data-doc-tab="busy">Busy</button>
</div>
`,
                script: `
import { attachTabbars, setTabbarBadge, setTabbarBusy, setTabbarCurrent } from '@kp-soft/themes/js/tabbar';

const bar = document.getElementById('doc-tabbar');
attachTabbars(bar.parentElement);
const tab = (id) => bar.querySelector('[data-kp-tab="' + id + '"]');
const actions = {
    badge: () => setTabbarBadge(tab('inbox'), 1534),
    current: () => setTabbarCurrent(bar, 'activity'),
    busy: () => {
        setTabbarBusy(tab('activity'), true);
        setTimeout(() => setTabbarBusy(tab('activity'), false), 2500);
    },
};
for (const button of document.querySelectorAll('[data-doc-tab]')) {
    button.addEventListener('click', () => actions[button.dataset.docTab]());
}
`,
            },
        ],
        variants: [
            { name: 'data-kp-nav-fold', what: 'Opt-in on the nav: the links that do not fit are folded from the end behind a More menu (`attachNavFolds`; `NavBar` takes `fold`). The bar stays one row before and after, the fit is measured at the links’ natural widths so it cannot oscillate, and below the bar’s own phone breakpoint, with a toggle present, it stands down.' },
            { name: 'data-kp-nav-keep', what: 'On a list item: it stays in the bar wherever it is, and the fold takes the others.' },
            { name: 'kp-nav-fold', what: 'Fired on the nav, bubbling, when the folded set changes: `{ folded, items }`. `planFold()` is the arithmetic on its own, `foldNav()` folds one bar.' },
            { name: 'fold marks', what: 'Written by the script: `data-kp-nav-fold-ready` once the bar is fitted, `data-kp-nav-folding` while anything is folded, `data-kp-nav-folded` on each folded item, `data-kp-nav-more-current` when the current page is behind More (and `aria-current` on its button) and `data-kp-nav-more-alert` when a `.kp-badge` count is (a dot on the button, announced).' },
            { name: '--kp-nav-more-dot', what: 'The colour of the dot on the More button when a count is behind it. A list item with a dropdown or a mega menu becomes a named group in the More menu: its heading, then its links.' },
            { name: 'navMore / navMoreMenu / navMoreAlert / navMoreUnavailable', what: 'The More button’s words in the dictionary: its label, the menu’s name, the alert announcement and the entry of a link that cannot be followed.' },
            { name: '.kp-nav__sep', what: '`<li class="kp-nav__sep" aria-hidden="true">`: a rule between two groups of links, never a target. A separator stands only between two links that are shown, so none dangles before More or at the start; in the More menu the links after it start a group below the menu’s own `.kp-menu__separator` (`data-kp-nav-sep`). `planSeparators()` and `NAV_SEP` are the arithmetic. Its inset and colour are knobs.' },
            { name: '.kp-tabbar', what: 'The bottom tab bar for phone widths: a `nav` of `.kp-tabbar__tab` links (an icon and a label each, a `.kp-badge` count on the one that needs the reader) and a More tab that opens a drawer through `data-kp-dialog`. It publishes its height on the root while it is on the screen, so a toast and the back-to-top control clear it; `setTabbarBadge`, `setTabbarCurrent` and `setTabbarBusy` change a tab from the page.' },
            { name: '.kp-nav__brand', what: 'The name at the leading edge, in bold. As a link it keeps its look and takes the page’s ordinary link underline, which is what says it is one.' },
            { name: '--kp-nav-close-time', what: 'For a theme that plays a close for the phone panel or a hover dropdown (cyberpunk): its length. The module holds the panel or the item open for that long while the close plays, then lets go. Unset, the phone panel closes after the theme\u2019s fold time, or 300 ms; the dropdowns close at once.' },
            { name: '.kp-nav__links', what: 'The row itself. It wraps rather than scrolling, so a narrow window gets two rows instead of a hidden third link.' },
            { name: '.kp-nav-wrap', what: 'The box the bar measures itself against. In a narrow one the bar takes a smaller inset, and the width that decides is the wrapper’s rather than the window’s.' },
            { name: '.kp-nav-wrap--sticky', what: 'The shrinking header: the bar sticks to the top of the box that scrolls it, and once that box has scrolled further than the bar is tall (or `data-kp-nav-sticky-after` pixels, if more) js/auto.js sets `data-kp-nav-compact` and the bar lowers its block padding (the knobs table names how far), gliding only when the reader has not asked for less motion. The module hands the bar’s height to the scrolling box’s scroll padding, so anchors and focused elements land below the bar; a scroll offset the page sets itself still wins. In React it is the `sticky` prop, with `stickyAfter`.' },
            { name: '.kp-tabbar modifiers', what: 'The bar shows below 40rem of window; `kp-tabbar--wide` below 60rem, where a dashboard’s top bar has no room for its links either; `kp-tabbar--always` at every width; `kp-tabbar--static` leaves it in the flow instead of fixed to the window’s bottom edge.' },
            { name: '.kp-tabbar parts', what: '`.kp-tabbar__tab` (a link or a button), `__icon` (`__icon--more` is the More tab’s), `__label` and `__badge`, the `.kp-badge` count on the tab that needs the reader. `setTabbarBadge(tab, count)` writes every digit of the count (never `99+`), hidden at 0 or null; `setTabbarCurrent(bar, id)` moves `aria-current` to the tab with that `data-kp-tab`; `setTabbarBusy(tab, busy)` puts one tab to wait.' },
            { name: '--kp-tabbar-height', what: 'Written on the root by `js/tabbar.js` while the bar is on the screen (0px when it is not): the page keeps its last line, a toast and the back-to-top control clear of it. The bar’s own sizes (tab height, icon, padding, text size, the safe-area inset, its time and layer) are in the knobs below.' },
            { name: 'current page', what: 'Weight and a thicker underline, with the state on the link so it is announced as well as drawn.' },
            { name: '.kp-nav__search', what: 'The slot at the bar’s far end for the command palette’s trigger — a `.kp-nav__search-trigger` button with `data-kp-palette-open`, which reads as a quiet search box and prints the palette’s key. The command palette page shows it working; in React it is the `search` prop, filled with a PaletteTrigger.' },
            { name: 'data-kp-nav-menu-open', what: 'On a list item with a `.kp-nav__menu`: that dropdown is shown open, exactly where hover and focus open it. For a page that shows it open, or a script that opens it on a press; taking the attribute away closes it again.' },
            { name: 'data-kp-nav-menu-end', what: 'Written by the module on a dropdown whose item has no room for it towards the window’s end: the panel hangs from the item’s end edge instead, so it stays inside the window. Measured as it opens and when the window changes size; nothing to write by hand.' },
            { name: '.kp-nav__menu--wide', what: 'The mega menu’s panel: a `.kp-nav__menu` that spans the bar in up to four columns of `.kp-nav__group`, each a `.kp-nav__menu-heading` over a plain list. Shown while its button says it is expanded; the minimum column width and the gap are knobs.' },
            { name: 'data-kp-nav-disclosure', what: 'The button that opens a mega menu’s panel, beside it in the same item; give it `kp-nav__link kp-nav__disclosure` so it reads as one of the bar’s links with a caret that turns while open. The module writes `aria-expanded` and `aria-controls`.' },
            { name: 'pastel', what: 'In pastel a hover dropdown and the mega menu hang in their holder, whose ::after draws the pass by anchor positioning; the phone panel draws its own plate and pass. Each lands on its pass and closes as that backwards, and the module holds it open for the close (560 ms in pastel).' },
        ],
        accessibility: [
            'Built in — the current page is marked in three ways at once: weight, an underline and the attribute that says so out loud.',
            'Built in — the bar wraps at narrow widths rather than pushing the page sideways.',
            'Built in — a sticky bar hands its height to the scrolling box’s scroll padding, so a skip link, an anchor or a Tab never lands underneath it.',
            'Built in — a dropdown near the window’s end opens towards the other side rather than past the edge.',
            'Built in — a mega menu opens on a press, not on hover; Escape closes it and returns the focus to its button, and the focus leaving it or a click outside closes it too.',
            'Yours — give the nav element a name; a page with two of them is otherwise “navigation” twice.',
            'Yours — use links, and give the reader a skip link past the bar.',
            'Yours — keep the list short. A bar that wraps to three rows on a laptop is a menu.',
        ],
    };
