// The rest of the side navigation page's examples, before the minor options (gates/site/descriptors/sidenav-examples.mjs holds the first).

/** @type {import('./types.mjs').Example[]} */
export const SIDENAV_EXAMPLES_2 = [
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
];
