// The examples of the side navigation page, before the minor options (gates/site/descriptors/sidenav.mjs adds those).

/** @type {import('./types.mjs').Example[]} */
export const SIDENAV_EXAMPLES = [
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
];
