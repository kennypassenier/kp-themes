// research/sidenav-minor: writes the six frame pages and look.html from one
// description of the options, so the demo has one source.
//
//   node research/sidenav-minor/build.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOOKS, OPTIONS } from './options.mjs';

const here = dirname(fileURLToPath(import.meta.url));

/** @param {string} text */
const esc = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

/**
 * One row of the panel.
 * @param {{ icon: string, label: string, badge?: string, current?: boolean, action?: { glyph: string, name: string } }} row
 */
function item(row) {
    const link = `<a class="kp-sidenav__link" href="#mn-main"${row.current ? ' aria-current="page"' : ''}><span class="kp-sidenav__icon" aria-hidden="true">${row.icon}</span><span class="kp-sidenav__label">${row.label}</span>${row.badge ? `<span class="kp-sidenav__badge">${row.badge}</span>` : ''}</a>`;
    if (!row.action) return `<li>${link}</li>`;
    return `<li class="kp-sidenav__row">${link}<button type="button" class="kp-icon-button kp-sidenav__action" aria-label="${esc(row.action.name)}"><span aria-hidden="true">${row.action.glyph}</span></button></li>`;
}

/** @param {boolean} withActions */
function list(withActions) {
    const act = (/** @type {string} */ name, /** @type {string} */ glyph = '⋯') => (withActions ? { glyph, name: `More about ${name}` } : undefined);
    return [
        item({ icon: '◎', label: 'Overview', action: act('Overview') }),
        item({ icon: '▤', label: 'Line 2', badge: '2', current: true, action: act('Line 2') }),
        item({ icon: '!', label: 'Alarms', badge: '14', action: act('Alarms') }),
        '<li><hr class="kp-sidenav__divider" /></li>',
        `<li class="kp-sidenav__category" data-kp-sidenav-expanded>
                        <button type="button" class="kp-sidenav__category-toggle"><span class="kp-sidenav__icon" aria-hidden="true">≋</span><span class="kp-sidenav__label">Readings</span></button>
                        <div class="kp-sidenav__submenu">
                            <ul class="kp-sidenav__list">
                                <li><a class="kp-sidenav__link" href="#mn-main"><span class="kp-sidenav__label">Pressure</span></a></li>
                                <li><a class="kp-sidenav__link" href="#mn-main"><span class="kp-sidenav__label">Flow rate</span></a></li>
                            </ul>
                        </div>
                    </li>`,
        item({ icon: '⚙', label: 'Maintenance' }),
        item({ icon: '◷', label: 'Rota' }),
    ]
        .map((row) => `                    ${row}`)
        .join('\n');
}

/**
 * One frame page: an app page with its side navigation.
 * @param {typeof OPTIONS[number]} option
 */
function frame(option) {
    const attrs = [
        'class="kp-sidenav"',
        'id="mn-nav"',
        'aria-label="North site sections"',
        'data-kp-sidenav-mode="push"',
        'data-kp-sidenav-content="#mn-main"',
        'data-kp-sidenav-backdrop="false"',
        'data-kp-sidenav-shortcut="Control+b"',
        'data-kp-sidenav-over-below',
        ...option.attrs,
    ].join(' ');
    const style = option.style ? ` style="${option.style}"` : '';
    const lead = option.leadFrame ? `\n                <p class="mn-said" role="status"></p>` : '';
    return `<!doctype html>
<!-- Written by research/sidenav-minor/build.mjs; edit options.mjs and build.mjs, not this file. -->
<html lang="en" data-theme="formal">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>North site · ${esc(option.title)}</title>
        <link rel="stylesheet" href="../../css/fonts.css" />
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <link rel="stylesheet" href="../../css/layout.css" />
        <link rel="stylesheet" href="../../css/utilities.css" />
        <link rel="stylesheet" href="../../css/formal-register.css" data-kp-register="formal" />
        <link rel="stylesheet" href="frame.css" />
    </head>
    <body class="mn-body" data-play-scenes="${option.scenes}"${option.extra ? ` data-play-extra="${option.extra}"` : ''}>
        <div class="kp-sidenav__launcher">
            <button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="mn-nav"></button>
        </div>
        <div class="kp-sidenav__tab">
            <button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="mn-nav"></button>
        </div>
        <nav ${attrs}${style}>
            <div class="kp-sidenav__header"><p class="kp-sidenav__title">North site</p></div>
            <div class="kp-sidenav__scroll">
                <ul class="kp-sidenav__list">
${list(option.actions === true)}
                </ul>
            </div>
            <div class="kp-sidenav__footer"><span class="kp-sidenav__label">Signed in as the night shift</span></div>
        </nav>
        <main class="mn-main" id="mn-main">
            <header class="kp-page-header" data-kp-sidenav-launcher-room>
                <div class="kp-page-header__inner">
                    <div>
                        <h1 class="kp-page-header__title">Line 2</h1>
                        <p class="kp-page-header__description">${esc(option.blurb)}</p>${lead}
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
            <div class="mn-cards">
                <section class="kp-card" aria-labelledby="mn-h-handover">
                    <div class="kp-card__header"><h2 class="kp-card__title" id="mn-h-handover">Handover</h2></div>
                    <div class="kp-card__body">
                        <p>The pressure dropped from 3.2 to 1.1 bar between 02:10 and 02:40. Pump house 3 was switched to the reserve pump at 02:52.</p>
                    </div>
                </section>
                <section class="kp-card" aria-labelledby="mn-h-next">
                    <div class="kp-card__header"><h2 class="kp-card__title" id="mn-h-next">Next shift</h2></div>
                    <div class="kp-card__body">
                        <p>The day shift checks the seal first, then the valve V-12.</p>
                    </div>
                </section>
            </div>
        </main>
        <p class="mn-scene" aria-hidden="true"></p>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="frame.js"></script>
        <script type="module" src="play.js"></script>
    </body>
</html>
`;
}

for (const option of OPTIONS) {
    writeFileSync(join(here, `${option.id}.html`), frame(option));
}

// look.html: the review page, one section per option.
/** @param {typeof OPTIONS[number]} option */
function section(option, number) {
    const lines = LOOKS[option.id];
    const looks = Object.entries(lines)
        .map(([theme, text]) => `                    <p data-for="${theme}">${esc(text)}</p>`)
        .join('\n');
    const frames = option.windows
        .map(
            (w) =>
                `                    <figure class="mn-fig">\n                        <iframe class="mn-window${w.phone ? ' mn-window--phone' : ''}" src="${w.src}" title="${esc(w.title)}"></iframe>\n                        <figcaption>${esc(w.caption)} <b data-mn-now></b></figcaption>\n                    </figure>`,
        )
        .join('\n');
    return `            <section class="mn-sec" id="${option.id}" data-review-item="${option.id}" data-review-title="${number} · ${esc(option.heading)}" data-review-components="sidenav" aria-labelledby="h-${option.id}">
                <div class="mn-sec__head">
                    <p class="mn-num">${number} · ${esc(option.name)}</p>
                    <h2 id="h-${option.id}">${esc(option.heading)}</h2>
                    <p class="mn-how">${esc(option.how)}</p>
                </div>
                <div class="mn-look" data-review-look>
${looks}
                </div>
                <div class="mn-windows mn-windows--${option.windows.length}">
${frames}
                </div>
            </section>`;
}

const page = `<!doctype html>
<!-- Written by research/sidenav-minor/build.mjs; edit options.mjs and build.mjs, not this file. -->
<html lang="en" data-theme="formal" data-cat-theme="formal" data-review="sidenav-minor-look">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kp-themes: the side navigation, six small options</title>
        <link rel="stylesheet" href="../../css/fonts.css" />
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <link rel="stylesheet" href="../../css/layout.css" />
        <link rel="stylesheet" href="../../css/utilities.css" />
        <link rel="stylesheet" href="../../css/formal-register.css" data-kp-register="formal" />
        <link rel="stylesheet" href="look.css" />
    </head>
    <body>
        <main class="mn-page">
            <header class="mn-intro">
                <h1>The side navigation: six small options</h1>
                <p>
                    Six options for the window-edge side navigation, each one attribute or one token and off by default. Every window below plays by itself: the panel opens
                    and closes on a loop and shows itself pushing the page, keeping a gutter and lying over it. The toggle shows and hides only the panel: nothing dims
                    and nothing to the right of it covers the page. Each theme keeps its own opening and closing, the close being the opening backwards.
                    Judge them in the review dialog ("Review in a dialog" at the top), one theme at a time.
                </p>
                <p class="mn-motion" data-mn-motion hidden>
                    <b>Your system asks for reduced motion</b>, so the panels appear and disappear without their effects. Turn it off to judge the movement.
                </p>
            </header>
${OPTIONS.map((option, index) => section(option, index + 1)).join('\n\n')}
        </main>
        <script type="module" src="../../js/auto.js"></script>
        <script type="module" src="look.js"></script>
        <script type="module" src="../_review/review.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
    </body>
</html>
`;
writeFileSync(join(here, 'look.html'), page);
console.log(`wrote ${OPTIONS.length} frames and look.html`);
