// Page descriptor for the "sidenav" documentation page [AR19]; the shape is pinned in ./types.mjs.

import { SIDENAV_MINOR_EXAMPLES, SIDENAV_MINOR_VARIANTS } from '../sidenav-minor.mjs';

/** @type {import('./types.mjs').Descriptor} */
export const sidenavDescriptor = {
        id: 'sidenav',
        title: 'Side navigation',
        group: 'Navigation',
        classes: ['kp-sidenav'],
        exports: ['Sidenav', 'SidenavToggle', 'SidenavSlimToggle'],
        aliases: ['sidenav', 'remember'],
        intro: 'A navigation that stands beside the content instead of above it. Three modes — beside the page, over it, or pushing it aside — a slim rail that keeps the icons and drops the words, categories that fold, and either edge.',
        whenToUse:
            'For an application with more places than a bar can hold, or a hierarchy two levels deep. Not for the five links every page can reach — that is the bar at the top. Not as a drawer for content: a panel that slides in carrying a form is a dialog, and it wants a dialog’s focus handling and a dialog’s dismissal.',
        examples: [
            {
                title: 'The React channel',
                why: 'Added 2026-09-12 (`sidenav-react`). The component renders the markup and the knobs; js/sidenav.js — attached by js/auto.js — does the behaviour, exactly as it does for the framework-free channel. Every data attribute the module reads is a prop, and one left out keeps the module\u2019s own default rather than restating it. The way out of the opened state is the handle: `sidenavOf(ref.current)`. This example uses the default mode on purpose: `over` slides the panel off-canvas until something opens it, so on a static page it would render as a sliver — which is exactly what it did before someone looked.',
                markup: `
<nav class="kp-sidenav" id="nav" aria-label="Sections">
    <div class="kp-sidenav__header"><p class="kp-sidenav__title">Sections</p></div>
    <div class="kp-sidenav__scroll">
        <ul class="kp-sidenav__list">
            <li><a class="kp-sidenav__link" href="#overview" aria-current="page"><span class="kp-sidenav__label">Overview</span></a></li>
            <li><a class="kp-sidenav__link" href="#reports"><span class="kp-sidenav__label">Reports</span></a></li>
            <li><a class="kp-sidenav__link" href="#settings"><span class="kp-sidenav__label">Settings</span></a></li>
        </ul>
    </div>
</nav>
`,
                react: `
<Sidenav
    id="nav"
    label="Sections"
    title="Sections"
    items={[
        { label: 'Overview', href: '#overview', current: true },
        { label: 'Reports', href: '#reports' },
        { label: 'Settings', href: '#settings' },
    ]}
/>
`,
            },
            {
                title: 'Beside the page',
                why: 'The default mode is the one that is simply there: a column in the flow, no JavaScript needed to see it. The current page carries aria-current, which is what a screen reader announces and what every theme hangs its own mark on.',
                markup: `
<nav class="kp-sidenav" aria-label="Sections">
<div class="kp-sidenav__header"><p class="kp-sidenav__title">Reports</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#sidenav" aria-current="page"><span class="kp-sidenav__label">Daily</span></a></li>
<li><a class="kp-sidenav__link" href="#example"><span class="kp-sidenav__label">Weekly</span><span class="kp-sidenav__badge">12</span></a></li>
</ul>
</div>
</nav>
`,
            },
            {
                title: 'A rail that collapses from its own toggle',
                why: 'Added at scope-48, with the application shell (examples/app-shell.html). data-kp-sidenav-slim allows the rail; a button with data-kp-sidenav-slim-toggle, pointed at the panel by aria-controls, collapses it to its icons and gives the words back — no script of your own. The module keeps aria-expanded on the button, and a button whose only content is an aria-hidden glyph gets its accessible name from the strings, changing with the state. The labels leave the eye and stay in the accessibility tree, so every link in the collapsed rail keeps its name. The button is not replaced, so the focus stays on it.',
                markup: `
<nav class="kp-sidenav" id="rail" aria-label="Invoices" data-kp-sidenav-slim>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#sidenav" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">All invoices</span></a></li>
<li><a class="kp-sidenav__link" href="#example"><span class="kp-sidenav__icon" aria-hidden="true">!</span><span class="kp-sidenav__label">Overdue</span></a></li>
</ul>
</div>
<div class="kp-sidenav__footer">
<button type="button" class="kp-sidenav__link" data-kp-sidenav-slim-toggle aria-controls="rail"><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-hide>«</span><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-show>»</span></button>
</div>
</nav>
`,
                react: `
<Sidenav
    id="rail"
    label="Invoices"
    slim
    items={[
        { label: 'All invoices', href: '#all', icon: '▤', current: true },
        { label: 'Overdue', href: '#overdue', icon: '!' },
    ]}
    footer={
        <SidenavSlimToggle controls="rail" className="kp-sidenav__link">
            <span className="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-hide>«</span>
            <span className="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-show>»</span>
        </SidenavSlimToggle>
    }
/>
`,
            },
            {
                title: 'A navigation that remembers what the reader folded',
                why: 'Kenny, 2026-09-16: a group he closed and then clicked a link in must still be closed on the page the link led to. data-kp-remember on the panel turns that on, and the name is the element\u2019s — two navigations on one page with different names keep separate state, and two with the SAME name are a fault the module reports rather than a memory they share. A group with a data-kp-remember of its own keeps its state under that name; without one it is known by the words in its toggle. The same attribute is read by the accordion, the tree, the split pane and the data table; docs/USER_GUIDE.md has the whole table.',
                markup: `
<nav class="kp-sidenav" id="kept-nav" aria-label="Sections" data-kp-remember="main-nav">
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li class="kp-sidenav__category" data-kp-sidenav-expanded data-kp-remember="components">
<button type="button" class="kp-sidenav__category-toggle"><span class="kp-sidenav__label">Components</span></button>
<div class="kp-sidenav__submenu">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#sidenav"><span class="kp-sidenav__label">Side navigation</span></a></li>
</ul>
</div>
</li>
</ul>
</div>
</nav>
`,
            },
            {
                title: 'Over the page, with a toggler',
                why: 'data-kp-sidenav-mode="over" puts the panel above the content with a backdrop, a focus trap and Escape. The toggler names the panel it drives, and keeps a place above both so it never disappears under what it opened.',
                markup: `
<button type="button" class="kp-sidenav__toggle" data-kp-sidenav-toggle aria-controls="app-nav">Menu</button>
<nav class="kp-sidenav" id="app-nav" data-kp-sidenav-mode="over" aria-label="Sections">
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#sidenav"><span class="kp-sidenav__label">Daily</span></a></li>
</ul>
</div>
</nav>
`,
            },
            {
                title: 'From the window edge: a launcher, and the page pushed aside',
                why: 'Added 2026-10-13 (research/sidenav-edge). The launcher is a box fixed at the window\'s start corner; the toggler inside it is empty, so the module draws the three bars (.kp-sidenav__bars) and names it from the strings. data-kp-sidenav-mode="push" with data-kp-sidenav-content moves the named element by the panel\'s width, on the panel\'s own slide timing, so closing is the opening played backwards. data-kp-sidenav-launcher-room keeps the page header clear of the launcher, and the shortcut is Control+B (⌘B on a Mac; the togglers get aria-keyshortcuts). data-kp-sidenav-over-below turns the panel into an over panel in a window narrower than 40rem: see it on a narrow screen. The example runs in a window of its own, because a fixed launcher would otherwise take over this page.',
                frame: { height: '24rem' },
                markup: `
<div class="kp-sidenav__launcher">
<button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="push-nav"></button>
</div>
<nav class="kp-sidenav" id="push-nav" aria-label="Sections" data-kp-sidenav-mode="push" data-kp-sidenav-content="#push-main" data-kp-sidenav-backdrop="false" data-kp-sidenav-over-below data-kp-sidenav-shortcut="Control+b">
<div class="kp-sidenav__header"><p class="kp-sidenav__title">North site</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#push-main"><span class="kp-sidenav__icon" aria-hidden="true">◎</span><span class="kp-sidenav__label">Overview</span></a></li>
<li><a class="kp-sidenav__link" href="#push-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span><span class="kp-sidenav__badge">2</span></a></li>
<li><a class="kp-sidenav__link" href="#push-main"><span class="kp-sidenav__icon" aria-hidden="true">!</span><span class="kp-sidenav__label">Alarms</span><span class="kp-sidenav__badge">14</span></a></li>
</ul>
</div>
</nav>
<main id="push-main">
<header class="kp-page-header" data-kp-sidenav-launcher-room>
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">The navigation slides in from the window edge and pushes this page aside by its own width; closing slides it back and the page follows. Control+B (⌘B on a Mac) does the same.</p>
</header>
</main>
`,
            },
            {
                title: 'A reserved gutter: the panel covers nothing',
                why: 'data-kp-sidenav-reserve on a push panel keeps the content\'s margin as wide as the panel whether the panel is open or not, so opening moves nothing and hides nothing. data-kp-sidenav-open="true" starts it open. While data-kp-sidenav-over-below has made the panel an over panel in a narrow window the reserve gives way, since there is no room to reserve.',
                frame: { height: '24rem' },
                markup: `
<div class="kp-sidenav__launcher">
<button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="gutter-nav"></button>
</div>
<nav class="kp-sidenav" id="gutter-nav" aria-label="Sections" data-kp-sidenav-mode="push" data-kp-sidenav-reserve data-kp-sidenav-content="#gutter-main" data-kp-sidenav-backdrop="false" data-kp-sidenav-over-below data-kp-sidenav-open="true" data-kp-sidenav-shortcut="Control+b">
<div class="kp-sidenav__header"><p class="kp-sidenav__title">North site</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#gutter-main"><span class="kp-sidenav__icon" aria-hidden="true">◎</span><span class="kp-sidenav__label">Overview</span></a></li>
<li><a class="kp-sidenav__link" href="#gutter-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span><span class="kp-sidenav__badge">2</span></a></li>
<li><a class="kp-sidenav__link" href="#gutter-main"><span class="kp-sidenav__icon" aria-hidden="true">!</span><span class="kp-sidenav__label">Alarms</span><span class="kp-sidenav__badge">14</span></a></li>
</ul>
</div>
</nav>
<main id="gutter-main">
<header class="kp-page-header" data-kp-sidenav-launcher-room>
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">This page always keeps a margin as wide as the navigation, so the navigation opens into that space and covers nothing. In a reserved gutter the launcher stands in the gutter.</p>
</header>
</main>
`,
            },
            {
                title: 'Over the page, from the window edge, without a backdrop',
                why: 'data-kp-sidenav-mode="over" with data-kp-sidenav-backdrop="false" slides the panel over the content and leaves the page visible and in place. data-kp-sidenav-initial-focus is a selector inside the panel for where the focus lands on opening, used in every mode. A closed over or push panel is inert (data-kp-sidenav-inert, on by default), so it is out of the tab order while it is away.',
                frame: { height: '24rem' },
                markup: `
<div class="kp-sidenav__launcher">
<button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="over-nav"></button>
</div>
<div class="kp-sidenav__tab">
<button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="over-nav"></button>
</div>
<nav class="kp-sidenav" id="over-nav" aria-label="Sections" data-kp-sidenav-mode="over" data-kp-sidenav-backdrop="false" data-kp-sidenav-initial-focus="[aria-current='page']" data-kp-sidenav-shortcut="Control+b">
<div class="kp-sidenav__header"><p class="kp-sidenav__title">North site</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#over-main"><span class="kp-sidenav__icon" aria-hidden="true">◎</span><span class="kp-sidenav__label">Overview</span></a></li>
<li><a class="kp-sidenav__link" href="#over-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span><span class="kp-sidenav__badge">2</span></a></li>
<li><a class="kp-sidenav__link" href="#over-main"><span class="kp-sidenav__icon" aria-hidden="true">!</span><span class="kp-sidenav__label">Alarms</span><span class="kp-sidenav__badge">14</span></a></li>
</ul>
</div>
</nav>
<main id="over-main">
<header class="kp-page-header" data-kp-sidenav-launcher-room>
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">The navigation slides over this page and moves nothing. There is no backdrop here, so the page stays in view; the focus lands on the current page when the panel opens and returns to the launcher when it has closed.</p>
</header>
</main>
`,
            },
            {
                title: 'A push panel on the end edge',
                why: 'data-kp-sidenav-side="end" puts the panel on the other edge, logically (the left in a right-to-left page). With data-kp-sidenav-content it is the content\'s end margin that makes room, so the page is pushed toward the start. The edge tab rides on the panel\'s far edge and is the only toggler here.',
                frame: { height: '22rem' },
                markup: `
<div class="kp-sidenav__tab">
<button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="end-nav"></button>
</div>
<nav class="kp-sidenav" id="end-nav" aria-label="Sections" data-kp-sidenav-mode="push" data-kp-sidenav-side="end" data-kp-sidenav-content="#end-main" data-kp-sidenav-backdrop="false">
<div class="kp-sidenav__header"><p class="kp-sidenav__title">North site</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#end-main"><span class="kp-sidenav__icon" aria-hidden="true">◎</span><span class="kp-sidenav__label">Overview</span></a></li>
<li><a class="kp-sidenav__link" href="#end-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span><span class="kp-sidenav__badge">2</span></a></li>
<li><a class="kp-sidenav__link" href="#end-main"><span class="kp-sidenav__icon" aria-hidden="true">!</span><span class="kp-sidenav__label">Alarms</span><span class="kp-sidenav__badge">14</span></a></li>
</ul>
</div>
</nav>
<main id="end-main">
<header class="kp-page-header">
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">A push panel on the end edge moves the content away from the end, not the start: the page keeps its start and gives up its end margin to the panel.</p>
</header>
</main>
`,
            },
            {
                title: 'A collapsed rail: tips, flyouts and a width that collapses it',
                why: 'In the collapsed rail each item shows its label as the package\'s tooltip, on hover and on focus (data-kp-sidenav-rail-tips, on by default), and a group opens beside the rail as a floating panel with the theme\'s popover effect (data-kp-sidenav-flyout, on by default): after the pointer rests, on a press, or from the keyboard (Enter or the arrow away from the edge goes in, Escape or the arrow back folds it). The module writes data-kp-sidenav-flown on the group while it floats. data-kp-sidenav-slim-below="60rem" collapses the rail in a box that wide or narrower, and wider again it is what the reader left it.',
                frame: { height: '24rem' },
                markup: `
<div class="kp-shell">
<div class="kp-shell__body">
<nav class="kp-sidenav" id="rail-nav" aria-label="Sections" data-kp-sidenav-slim data-kp-sidenav-slim-collapsed data-kp-sidenav-slim-below="60rem">
<div class="kp-sidenav__header"><p class="kp-sidenav__title" data-kp-sidenav-slim-hide>North site</p><p class="kp-sidenav__title" data-kp-sidenav-slim-show aria-hidden="true">N</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#rail-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span></a></li>
<li class="kp-sidenav__category">
<button type="button" class="kp-sidenav__category-toggle"><span class="kp-sidenav__icon" aria-hidden="true">≋</span><span class="kp-sidenav__label">Readings</span></button>
<div class="kp-sidenav__submenu">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#rail-main"><span class="kp-sidenav__label">Pressure</span></a></li>
<li><a class="kp-sidenav__link" href="#rail-main"><span class="kp-sidenav__label">Flow rate</span></a></li>
</ul>
</div>
</li>
</ul>
</div>
<div class="kp-sidenav__footer">
<button type="button" class="kp-sidenav__link" data-kp-sidenav-slim-toggle aria-controls="rail-nav"><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-hide>«</span><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-show>»</span></button>
</div>
</nav>
<main class="kp-flex-1" id="rail-main">
<header class="kp-page-header">
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">Point at an icon, or tab to it: its name shows beside the rail. Point at Readings and the group opens beside the rail. The button at the foot widens the rail; in a window 60rem wide or narrower it collapses by itself.</p>
</header>
</main>
</div>
</div>
`,
            },
            {
                title: 'A rail that widens under a resting pointer',
                why: 'data-kp-sidenav-expand-on-hover gives the words back while the pointer is over the rail; data-kp-sidenav-hover-delay is how long it must rest first, in milliseconds (default 150), so a pointer crossing the rail does not flap it. The rail also widens while the focus is inside it. The module writes data-kp-sidenav-peek on the panel: open while it is wide, then leaving while it narrows.',
                frame: { height: '24rem' },
                markup: `
<div class="kp-shell">
<div class="kp-shell__body">
<nav class="kp-sidenav" id="peek-nav" aria-label="Sections" data-kp-sidenav-slim data-kp-sidenav-slim-collapsed data-kp-sidenav-expand-on-hover data-kp-sidenav-hover-delay="150">
<div class="kp-sidenav__header"><p class="kp-sidenav__title" data-kp-sidenav-slim-hide>North site</p><p class="kp-sidenav__title" data-kp-sidenav-slim-show aria-hidden="true">N</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#peek-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span></a></li>
<li class="kp-sidenav__category">
<button type="button" class="kp-sidenav__category-toggle"><span class="kp-sidenav__icon" aria-hidden="true">≋</span><span class="kp-sidenav__label">Readings</span></button>
<div class="kp-sidenav__submenu">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#peek-main"><span class="kp-sidenav__label">Pressure</span></a></li>
<li><a class="kp-sidenav__link" href="#peek-main"><span class="kp-sidenav__label">Flow rate</span></a></li>
</ul>
</div>
</li>
</ul>
</div>
<div class="kp-sidenav__footer">
<button type="button" class="kp-sidenav__link" data-kp-sidenav-slim-toggle aria-controls="peek-nav"><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-hide>«</span><span class="kp-sidenav__icon" aria-hidden="true" data-kp-sidenav-slim-show>»</span></button>
</div>
</nav>
<main class="kp-flex-1" id="peek-main">
<header class="kp-page-header">
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">The rail widens when the pointer rests on it for 150 ms, or while the focus is inside it, and narrows when both have gone. Its words stay while it narrows, so the narrowing is the widening backwards.</p>
</header>
</main>
</div>
</div>
`,
            },
            ...SIDENAV_MINOR_EXAMPLES,
        ],
        variants: [
            { name: 'data-kp-sidenav-mode', what: 'side (the default, in the flow), over (above the content, with a backdrop) or push (fixed, and the content named by data-kp-sidenav-content moves over).' },
            { name: 'data-kp-sidenav-content', what: 'On a push or over panel: a selector for the page element the panel offsets. A push moves it by the panel\u2019s width (its start margin, or its end margin for a panel on the end edge); the module writes data-kp-sidenav-shift on it.' },
            { name: 'data-kp-sidenav-over-below', what: 'A length, or empty for 40rem: in a box narrower than that a push panel becomes an over panel, and the reserve gives way. A launcher is never hidden by it; any other toggler (an edge tab included) is shown only while the panel is narrow, so a panel with over-below takes a launcher, not a tab. data-kp-sidenav-narrow is written while it has.' },
            { name: 'data-kp-sidenav-reserve', what: 'On a push or over panel with data-kp-sidenav-content: the content keeps the panel\u2019s width whether the panel is open or not, a gutter the panel opens into, so it covers nothing. Off by default. Not while data-kp-sidenav-over-below has made the panel an over panel on a narrow screen.' },
            { name: '.kp-sidenav__launcher', what: 'A box fixed at the window\u2019s start corner holding the panel\u2019s toggler (a .kp-icon-button with data-kp-sidenav-toggle and aria-controls): the same place at every width and in every state, above the panel. An empty toggler gets the package\u2019s three bars (.kp-sidenav__bars) and its accessible name from the strings. The module marks the panel data-kp-sidenav-launched, which starts its header beside the launcher (or its first row below it), and marks the box data-kp-sidenav-lit from the opening\u2019s first frame to the closing\u2019s last, the accent plate.' },
            { name: '.kp-sidenav__bars', what: 'The three bars drawn in an empty toggler inside the launcher; a toggler with words or an icon of its own gets none.' },
            { name: 'data-kp-sidenav-launched', what: 'Written on the panel while a launcher drives it: the header starts beside the launcher. Read it, do not set it.' },
            { name: 'data-kp-sidenav-lit', what: 'Written on the launcher box from the opening\u2019s first frame to the closing\u2019s last: the accent plate. Read it, do not set it.' },
            { name: 'data-kp-sidenav-launcher-room', what: 'On a page element in the launcher\u2019s corner (the page header): keeps the launcher\u2019s width free at its start, except in a reserved gutter, where the launcher stands in the gutter.' },
            { name: 'data-kp-sidenav-opener', what: 'On an over or push panel, which opener the page shows: launcher (the fixed .kp-sidenav__launcher), tab (the .kp-sidenav__tab on the panel\u2019s edge) or both. Absent or any other value is tab, the default; a page with no tab for the panel keeps its launcher, so a panel is never left without an opener. The box the choice turns off is not drawn, is out of the tab order and the accessibility tree and is absent from the first frame, and the header\u2019s room for the launcher is given back. A side panel and the collapsed rail ignore it. React: opener.' },
            { name: 'data-kp-sidenav-opener-off / -on', what: 'Written by the module on an opener box (launcher or tab) the choice turns off, or keeps. Read them, do not set them.' },
            { name: '.kp-sidenav__tab', what: 'The edge tab: a box holding a toggler (a .kp-icon-button with data-kp-sidenav-toggle and aria-controls) that rides on the far edge of a panel that slides (over, push), halfway down, and sits at the window\u2019s edge while the panel is away; it moves on the panel\u2019s own timing and works beside the launcher. An empty toggler gets a grip (.kp-sidenav__grip), which has no state to change.' },
            { name: 'data-kp-sidenav-inert', what: 'A closed panel that slides away is inert, out of the tab order and the accessibility tree, from the closing\u2019s last frame to the opening\u2019s first. On by default; false leaves a closed panel reachable.' },
            { name: 'data-kp-sidenav-rail-tips', what: 'In the collapsed rail each item shows its label as the package\u2019s tooltip on hover and on focus, beside the rail and inside the window; it leaves as it came. On by default; false turns it off.' },
            { name: 'data-kp-sidenav-slim-below', what: 'On a rail (data-kp-sidenav-slim): the width of the panel\u2019s box at and below which the rail collapses to its icons, a length, or 40rem when empty. Wider again it is what the reader left it; the step\u2019s collapse is never remembered as the reader\u2019s. data-kp-sidenav-over-below, which takes a length too, is its sibling for the variant.' },
            { name: 'data-kp-sidenav-flyout', what: 'In the collapsed rail a group opens beside the rail as a floating panel, in the top layer, with the theme\u2019s popover opening and its close as that opening backwards: after the pointer rests 150 ms, on a press, or from the keyboard (Enter or the arrow away from the edge goes into it; Escape or the arrow back folds it and returns to its heading when the close is over). Placed beside the rail and turned to stay in the window. On by default; false keeps groups folding in place. data-kp-sidenav-flown is written on the group while it floats.' },
            { name: 'data-kp-sidenav-flown', what: 'Written on a .kp-sidenav__category while its group floats beside the collapsed rail. Read it, do not set it.' },
            { name: 'data-kp-sidenav-shortcut', what: 'A key chord that opens and closes the panel from anywhere but a text field, such as Control+b. Control (or Mod) is the platform\u2019s command key: Meta (\u2318) on a Mac. The togglers get aria-keyshortcuts. Off by default.' },
            { name: 'data-kp-sidenav-initial-focus', what: 'A selector, inside the panel, for where the focus lands when the panel opens. Without it an over panel focuses its first stop and the others leave the focus where it is; named, it is used in every mode, and the focus goes back to the opener when the panel has closed.' },
            { name: 'data-kp-sidenav-hover-delay', what: 'On a rail with data-kp-sidenav-expand-on-hover: how long the pointer rests, in milliseconds, before the rail widens (default 150). The rail also widens while the focus is inside it. The module writes data-kp-sidenav-peek (open, then leaving while it narrows); a page without the module widens on plain hover.' },
            { name: 'data-kp-sidenav-peek', what: 'Written on a rail with data-kp-sidenav-expand-on-hover: open while the rail is wide for a resting pointer or the focus, then leaving while it narrows with its words still showing. Read it, do not set it.' },
            { name: 'data-kp-sidenav-shift', what: 'Written by the module on the content a panel offsets: open, closed, or reserved for a gutter. A push moves on the panel\u2019s own slide timing, which the module copies onto the content for each change, so the content travels with the theme\u2019s slide and comes back on its reverse; a register that draws the move itself wins.' },
            { name: 'data-kp-sidenav-position', what: 'fixed or absolute. Absolute puts the panel inside a positioned box rather than against the window, which is what a page with two of them needs.' },
            { name: 'data-kp-sidenav-side', what: 'end puts the panel on the other edge, logically: in a right-to-left page that is the left, and it still slides out of the side it came from.' },
            { name: 'data-kp-sidenav-slim', what: 'Allows the rail. With data-kp-sidenav-slim-collapsed it starts collapsed; data-kp-sidenav-expand-on-hover gives the words back while the pointer is over it.' },
            { name: 'data-kp-sidenav-slim-toggle', what: 'On a button, collapses the rail to its icons and expands it again. aria-controls names the panel; without it the button drives every rail on the page, the way data-kp-sidenav-toggle does. The module keeps aria-expanded on it, and names a button that has no words of its own.' },
            { name: 'data-kp-sidenav-slim-hide', what: 'On an element inside, hides it in the rail; data-kp-sidenav-slim-show is its other half, so a wordmark can become a monogram instead of only disappearing.' },
            { name: 'data-kp-sidenav-accordion', what: 'One category open at a time. Without it they are independent.' },
            { name: 'data-kp-sidenav-backdrop', what: 'false takes the backdrop away in over mode; data-kp-sidenav-backdrop-class puts your own class on it.' },
            { name: 'data-kp-sidenav-close-on-esc', what: 'false keeps Escape from closing it. data-kp-sidenav-focus-trap="false" lets the focus leave; data-kp-sidenav-lock-scroll holds the page still while it is open.' },
            { name: 'data-kp-remember', what: 'A name. Name the panel and its folded groups, its open state and its rail survive a reload; name a .kp-sidenav__category as well and that group keeps its state under its own name. The same attribute is what the accordion, the tree, the split pane and the data table remember by — one mechanism, js/remember.js, and the key it composes is kp-remember:<component>:<name>:<slot>. Leave it off and this package writes nothing into your storage.' },
            { name: 'data-kp-sidenav-remember', what: 'The older spelling of data-kp-remember, still read. New markup uses data-kp-remember.' },
            { name: 'kp-remember-clash', what: 'On the element refused a memory because another element of the same component already answers to that name: `{ name, component, other }`. It keeps its markup default and writes nothing; the first one to attach owns the key.' },
            { name: '--kp-sidenav-inset-block', what: 'Where a covering panel starts and ends, one value or two. A page that keeps its own bar says `3rem 0` and the panel begins under it instead of sliding beneath it.' },
            { name: 'never sideways', what: 'The panel clips its own horizontal overflow and a long label ends in an ellipsis, so a count or a badge at the end of a row is never pushed out of reach. A navigation you have to scroll sideways is one you cannot read.' },
            { name: '.kp-sidenav__scroll', what: 'The part that scrolls. The header and the footer do not, so a long navigation in a short window keeps its title and its account row in view.' },
            { name: '.kp-sidenav__category', what: 'A heading that folds, with .kp-sidenav__category-toggle and .kp-sidenav__submenu inside it. The open height is a grid track, so it animates without anything measuring it.' },
            ...SIDENAV_MINOR_VARIANTS,
            { name: 'pastel', what: 'In pastel an over or push panel draws its own plate and pass and lands on it; a panel on the end edge swings from its top-end corner. Widths and groups move on the landing held at its value, so a size never passes it, and the panel closes as it opened, backwards. The launcher and the rows are pastel’s buttons.' },
        ],
        accessibility: [
            'Built in — over mode traps the focus while it covers the page, moves the focus in on open, and gives it back to the toggler on close.',
            'Built in — the focus goes back to the opener when the panel has closed, not at the start of the close.',
            'Built in — a shut over or push panel is inert, out of the tab order and the accessibility tree; a shortcut puts aria-keyshortcuts on the togglers, and an empty launcher toggler gets an accessible name.',
            'Built in — the current page carries aria-current, so it is announced and not only drawn.',
            'Built in — the toggler says whether it is expanded and which panel it controls.',
            'Built in — a collapsed rail keeps every label in the accessibility tree, and the slim toggle keeps the focus while the rail changes.',
            'Yours — give the nav element a name; a page with a bar and a side navigation has two of them.',
            'Yours — put a label in every link. A rail of bare icons reads as a column of nothing.',
        ],
    };
