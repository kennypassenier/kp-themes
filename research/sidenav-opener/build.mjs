// research/sidenav-opener: writes the eight frame pages and demo.html from one
// description, so the demo has one source.
//
//   node research/sidenav-opener/build.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/** @param {string} text */
const esc = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

/** How each theme's own opening reads, for the look-at lines (the theme's dialog effect, the close its reverse). */
const MOTION = {
    formal: 'The panel is ruled in where it stands and ruled away again.',
    light: 'The panel comes out of a glare and goes back into it.',
    dark: 'The panel is laid in by a bright line that crosses it, and the line takes it away again.',
    cyberpunk: 'The panel glitches in and out in three jumps.',
    synthwave: 'The panel is uncovered from its foot behind a glowing beam, and covered again.',
    pastel: 'The panel is stuck on like a sticker and peeled off again.',
    terminal: 'The panel is printed line by line and cleared again.',
    forest: 'The panel grows out of its edge and shrinks back.',
    blueprint: 'The panel is traced in ink lines and untraced again.',
    solstice: 'The panel is kindled from the middle of its foot and sinks back.',
    brutalism: 'The panel drops on its hard shadow and is lifted off again.',
    deco: 'The panel arrives as a gilded plate and leaves the same way.',
    phantom: 'The panel is thrown on in three cuts and snatched away again.',
    grotesk: 'The panel falls in like the dialog and rises out again.',
    nostromo: 'The panel is scanned in by a beam and scanned out again.',
    titanium: 'The panel is cut open from the top and cut shut again.',
};

/**
 * The four scenes. `attrs` is what the panel carries besides the opener.
 * @type {{ id: string, name: string, heading: string, how: string, attrs: string[], phone?: boolean, }[]}
 */
const SCENES = [
    {
        id: 'over',
        name: 'Over the page',
        heading: 'An over panel opens from the launcher or from the edge tab.',
        how: 'data-kp-sidenav-mode="over" with data-kp-sidenav-backdrop="false", data-kp-sidenav-opener="launcher" on the left window and "tab" on the right.',
        attrs: ['data-kp-sidenav-mode="over"', 'data-kp-sidenav-backdrop="false"'],
    },
    {
        id: 'push',
        name: 'Pushing the page',
        heading: 'A push panel opens from the launcher or from the edge tab.',
        how: 'data-kp-sidenav-mode="push" with data-kp-sidenav-content, opener "launcher" on the left and "tab" on the right.',
        attrs: ['data-kp-sidenav-mode="push"', 'data-kp-sidenav-content="#so-main"'],
    },
    {
        id: 'reserve',
        name: 'Push with a gutter',
        heading: 'A push panel that keeps a gutter opens from the launcher or from the edge tab.',
        how: 'The same with data-kp-sidenav-reserve: the page keeps the panel’s room whether it is open or not.',
        attrs: ['data-kp-sidenav-mode="push"', 'data-kp-sidenav-content="#so-main"', 'data-kp-sidenav-reserve'],
    },
    {
        id: 'phone',
        name: 'On a phone',
        heading: 'On a phone the panel lies over the page, opened from the launcher or from the edge tab.',
        how: 'data-kp-sidenav-over-below holds the panel as an over panel at this width; the opener is chosen the same way.',
        attrs: ['data-kp-sidenav-mode="push"', 'data-kp-sidenav-content="#so-main"', 'data-kp-sidenav-over-below'],
        phone: true,
    },
];

const OPENERS = /** @type {const} */ (['launcher', 'tab']);

const LIST = `                    <li><a class="kp-sidenav__link" href="#so-main"><span class="kp-sidenav__icon" aria-hidden="true">◎</span><span class="kp-sidenav__label">Overview</span></a></li>
                    <li><a class="kp-sidenav__link" href="#so-main" aria-current="page"><span class="kp-sidenav__icon" aria-hidden="true">▤</span><span class="kp-sidenav__label">Line 2</span><span class="kp-sidenav__badge">2</span></a></li>
                    <li><a class="kp-sidenav__link" href="#so-main"><span class="kp-sidenav__icon" aria-hidden="true">!</span><span class="kp-sidenav__label">Alarms</span><span class="kp-sidenav__badge">14</span></a></li>
                    <li><hr class="kp-sidenav__divider" /></li>
                    <li><a class="kp-sidenav__link" href="#so-main"><span class="kp-sidenav__icon" aria-hidden="true">⚙</span><span class="kp-sidenav__label">Maintenance</span></a></li>
                    <li><a class="kp-sidenav__link" href="#so-main"><span class="kp-sidenav__icon" aria-hidden="true">◷</span><span class="kp-sidenav__label">Rota</span></a></li>`;

/**
 * One frame page: an app page whose markup holds both openers, and a panel that chooses.
 * @param {(typeof SCENES)[number]} scene
 * @param {'launcher' | 'tab'} opener
 */
function frame(scene, opener) {
    const attrs = [
        'class="kp-sidenav"',
        'id="so-nav"',
        'aria-label="North site sections"',
        ...scene.attrs,
        `data-kp-sidenav-opener="${opener}"`,
        'data-kp-sidenav-shortcut="Control+b"',
    ].join(' ');
    return `<!doctype html>
<!-- Written by research/sidenav-opener/build.mjs; edit build.mjs, not this file. -->
<html lang="en" data-theme="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>North site · ${esc(scene.name)} · ${opener}</title>
        <link rel="stylesheet" href="../../css/fonts.css" />
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <link rel="stylesheet" href="../../css/layout.css" />
        <link rel="stylesheet" href="../../css/utilities.css" />
        <link rel="stylesheet" href="../../css/formal-register.css" data-kp-register="formal" />
        <link rel="stylesheet" href="frame.css" />
    </head>
    <body class="so-body">
        <div class="kp-sidenav__launcher">
            <button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="so-nav"></button>
        </div>
        <div class="kp-sidenav__tab">
            <button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="so-nav"></button>
        </div>
        <nav ${attrs}>
            <div class="kp-sidenav__header"><p class="kp-sidenav__title">North site</p></div>
            <div class="kp-sidenav__scroll">
                <ul class="kp-sidenav__list">
${LIST}
                </ul>
            </div>
            <div class="kp-sidenav__footer"><span class="kp-sidenav__label">Signed in as the night shift</span></div>
        </nav>
        <main class="so-main" id="so-main">
            <header class="kp-page-header" data-kp-sidenav-launcher-room>
                <div class="kp-page-header__inner">
                    <div>
                        <h1 class="kp-page-header__title">Line 2</h1>
                        <p class="kp-page-header__description">Opener: ${opener}.</p>
                    </div>
                </div>
            </header>
            <div class="kp-kpis" role="group" aria-label="Line 2 at a glance">
                <div class="kp-kpi">
                    <span class="kp-kpi__label">Pressure now</span>
                    <span class="kp-kpi__value">1.1<small>bar</small></span>
                    <span class="kp-kpi__trend">3.2 bar at 02:10</span>
                </div>
                <div class="kp-kpi" data-kp-tone="warning">
                    <span class="kp-kpi__label">Open incidents</span>
                    <span class="kp-kpi__value">2</span>
                    <span class="kp-kpi__trend">1 new since 02:40</span>
                </div>
            </div>
            <div class="so-cards">
                <section class="kp-card" aria-labelledby="so-h-handover">
                    <div class="kp-card__header"><h2 class="kp-card__title" id="so-h-handover">Handover</h2></div>
                    <div class="kp-card__body">
                        <p>The pressure dropped from 3.2 to 1.1 bar between 02:10 and 02:40. Pump house 3 was switched to the reserve pump at 02:52.</p>
                    </div>
                </section>
                <section class="kp-card" aria-labelledby="so-h-next">
                    <div class="kp-card__header"><h2 class="kp-card__title" id="so-h-next">Next shift</h2></div>
                    <div class="kp-card__body">
                        <p>The day shift checks the seal first, then the valve V-12.</p>
                    </div>
                </section>
            </div>
        </main>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="frame.js"></script>
        <script type="module" src="frame-play.js"></script>
    </body>
</html>
`;
}

/**
 * The look-at line for one theme and one scene.
 * @param {string} theme
 * @param {(typeof SCENES)[number]} scene
 */
function look(theme, scene) {
    const room =
        'Left, the launcher: the fixed hamburger at the window’s corner, the panel’s header starting beside it and the page title kept clear of it. Right, the edge tab: no launcher at all, the panel’s header starting at its own edge, the page title back at its own margin, and the tab standing on the window’s edge halfway down.';
    const press = 'Press "Play once": each window opens from its own opener only, and the close is the opening backwards.';
    const reserve = scene.id === 'reserve' ? ' The gutter holds the same room in both windows.' : '';
    return `In ${theme}, compare the two windows. ${room}${reserve} ${press} ${MOTION[/** @type {keyof typeof MOTION} */ (theme)]}`;
}

/**
 * @param {(typeof SCENES)[number]} scene
 * @param {number} number
 */
function section(scene, number) {
    const looks = Object.keys(MOTION)
        .map((theme) => `                    <p data-for="${theme}">${esc(look(theme, scene))}</p>`)
        .join('\n');
    const figures = OPENERS.map(
        (opener) =>
            `                    <figure class="so-fig">\n                        <iframe class="so-window${scene.phone ? ' so-window--phone' : ''}" src="${scene.id}-${opener}.html" title="${esc(scene.name)}, opener ${opener}"></iframe>\n                        <figcaption>data-kp-sidenav-opener="${opener}"</figcaption>\n                    </figure>`,
    ).join('\n');
    return `            <section class="so-sec" id="${scene.id}" data-review-item="${scene.id}" data-review-title="${number} · ${esc(scene.name)}" data-review-components="sidenav" aria-labelledby="h-${scene.id}">
                <div class="so-sec__head">
                    <p class="so-num">${number} · ${esc(scene.name)}</p>
                    <h2 id="h-${scene.id}">${esc(scene.heading)}</h2>
                    <p class="so-how">${esc(scene.how)}</p>
                </div>
                <div class="so-look" data-review-look>
${looks}
                </div>
                <div class="so-windows so-windows--2">
${figures}
                </div>
            </section>`;
}

const page = `<!doctype html>
<!-- Written by research/sidenav-opener/build.mjs; edit build.mjs, not this file. -->
<html lang="en" data-theme="formal" data-cat-theme="formal" data-review="sidenav-opener">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kp-themes: the side navigation chooses its opener</title>
        <link rel="stylesheet" href="../../css/fonts.css" />
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <link rel="stylesheet" href="../../css/layout.css" />
        <link rel="stylesheet" href="../../css/utilities.css" />
        <link rel="stylesheet" href="../../css/formal-register.css" data-kp-register="formal" />
        <link rel="stylesheet" href="demo.css" />
    </head>
    <body>
        <main class="so-page">
            <header class="so-intro">
                <h1>The side navigation chooses its opener</h1>
                <p>
                    One attribute on the panel, <code>data-kp-sidenav-opener="launcher" | "tab" | "both"</code>, says whether an over or a push panel
                    (with or without a gutter) is opened from the fixed launcher, from the edge tab, or from both, as it is today. The page below holds
                    both elements in every window; the left window asks for the launcher, the right one for the tab. The element that is not asked
                    for is not drawn and not reachable by keyboard, and the panel’s header and the page title take back the room kept for the
                    launcher. A side panel and the collapsed rail ignore the attribute. Nothing plays until "Play once" is pressed; each theme keeps
                    its own opening and closing, the close being the opening backwards. Judge them in the review dialog ("Review in a dialog" at the
                    top), one theme at a time.
                </p>
                <p class="so-motion" data-so-motion hidden>
                    <b>Your system asks for reduced motion</b>, so the panels appear and disappear without their effects. Turn it off to judge the movement.
                </p>
            </header>
${SCENES.map((scene, index) => section(scene, index + 1)).join('\n\n')}
        </main>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="demo.js"></script>
        <script type="module" src="rounds-page.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;

for (const scene of SCENES) for (const opener of OPENERS) writeFileSync(join(here, `${scene.id}-${opener}.html`), frame(scene, opener));
writeFileSync(join(here, 'demo.html'), page);
console.log(`wrote ${SCENES.length * OPENERS.length} frames and demo.html`);
