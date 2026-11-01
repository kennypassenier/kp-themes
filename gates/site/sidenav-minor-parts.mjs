// The pieces the side navigation's minor-option examples are written from: a row, the panel, the launcher and tab, the page beside it.

/**
 * One row of the panel.
 * @param {string} href
 * @param {string} icon
 * @param {string} label
 * @param {{ current?: boolean, badge?: string, action?: boolean }} [o]
 */
export function row(href, icon, label, o = {}) {
    const link = `<a class="kp-sidenav__link" href="${href}"${o.current ? ' aria-current="page"' : ''}><span class="kp-sidenav__icon" aria-hidden="true">${icon}</span><span class="kp-sidenav__label">${label}</span>${o.badge ? `<span class="kp-sidenav__badge">${o.badge}</span>` : ''}</a>`;
    if (!o.action) return `<li>${link}</li>`;
    return `<li class="kp-sidenav__row">${link}<button type="button" class="kp-icon-button kp-sidenav__action" aria-label="More about ${label}"><span aria-hidden="true">⋯</span></button></li>`;
}

/**
 * The panel every example wears.
 * @param {{ id: string, main: string, attrs?: string, action?: boolean, rest?: boolean }} o
 */
export function panel(o) {
    const a = o.action === true;
    const rest =
        o.rest === false
            ? ''
            : `
<li><hr class="kp-sidenav__divider"></li>
<li class="kp-sidenav__category" data-kp-sidenav-expanded>
<button type="button" class="kp-sidenav__category-toggle"><span class="kp-sidenav__icon" aria-hidden="true">≋</span><span class="kp-sidenav__label">Readings</span></button>
<div class="kp-sidenav__submenu">
<ul class="kp-sidenav__list">
<li><a class="kp-sidenav__link" href="#${o.main}"><span class="kp-sidenav__label">Pressure</span></a></li>
<li><a class="kp-sidenav__link" href="#${o.main}"><span class="kp-sidenav__label">Flow rate</span></a></li>
</ul>
</div>
</li>
${row(`#${o.main}`, '⚙', 'Maintenance')}
${row(`#${o.main}`, '◷', 'Rota')}`;
    return `<nav class="kp-sidenav" id="${o.id}" aria-label="North site sections"${o.attrs ? ` ${o.attrs}` : ''}>
<div class="kp-sidenav__header"><p class="kp-sidenav__title">North site</p></div>
<div class="kp-sidenav__scroll">
<ul class="kp-sidenav__list">
${row(`#${o.main}`, '◎', 'Overview', { action: a })}
${row(`#${o.main}`, '▤', 'Line 2', { current: true, badge: '2', action: a })}
${row(`#${o.main}`, '!', 'Alarms', { badge: '14', action: a })}${rest}
</ul>
</div>
<div class="kp-sidenav__footer"><span class="kp-sidenav__label">Signed in as the night shift</span></div>
</nav>`;
}

/** The launcher: a box at the window's start corner that holds the panel's toggler. */
export const launcher = (/** @type {string} */ id) => `<div class="kp-sidenav__launcher">
<button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="${id}"></button>
</div>`;

/** The edge tab: a box that rides on the far edge of a sliding panel and holds the panel's toggler. */
export const tab = (/** @type {string} */ id) => `<div class="kp-sidenav__tab">
<button type="button" class="kp-icon-button" data-kp-sidenav-toggle aria-controls="${id}"></button>
</div>`;

/**
 * The page beside the panel: a header, two figures, two cards.
 * @param {string} id
 * @param {string} text
 * @param {string} [extra] more markup under the cards
 */
export function page(id, text, extra = '') {
    return `<main id="${id}">
<header class="kp-page-header" data-kp-sidenav-launcher-room>
<h1 class="kp-page-header__title">Line 2</h1>
<p class="kp-page-header__description">${text}</p>
</header>
<div class="kp-kpis" role="group" aria-label="Line 2 at a glance">
<div class="kp-kpi"><span class="kp-kpi__label">Pressure now</span><span class="kp-kpi__value">1.1<small>bar</small></span><span class="kp-kpi__trend">3.2 bar at 02:10</span></div>
<div class="kp-kpi" data-kp-tone="warning"><span class="kp-kpi__label">Open incidents</span><span class="kp-kpi__value">2</span><span class="kp-kpi__trend">1 new since 02:40</span></div>
</div>
<section class="kp-card" aria-labelledby="${id}-h">
<div class="kp-card__header"><h2 class="kp-card__title" id="${id}-h">Handover</h2></div>
<div class="kp-card__body"><p>The pressure dropped from 3.2 to 1.1 bar between 02:10 and 02:40. Pump house 3 was switched to the reserve pump at 02:52.</p></div>
</section>${extra}
</main>`;
}

/** The attributes every push example shares: a push panel moving the page, the keyboard shortcut, a step to an over panel in a narrow box. */
export const PUSH = (/** @type {string} */ main) => `data-kp-sidenav-mode="push" data-kp-sidenav-content="#${main}" data-kp-sidenav-backdrop="false" data-kp-sidenav-shortcut="Control+b" data-kp-sidenav-over-below`;

/** The attributes every over example shares. */
export const OVER = 'data-kp-sidenav-mode="over"';

export const FRAME = { height: '32rem' };
