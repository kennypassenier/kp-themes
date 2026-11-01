// The live snippets the theme portraits show (gates/generate-portraits.mjs): real package markup per signature example, ids unique per page.

/* ------------------------------------------------------------ snippets */

/**
 * The live snippets a signature names by `example`. Real package markup only,
 * the markup the catalogue pages use; ids are made unique per page.
 */
let uid = 0;

/** Start the ids again at 1, as each page does. */
export function resetIds() {
    uid = 0;
}
export const id = (/** @type {string} */ base) => `pt-${base}-${++uid}`;

/** Snippets that carry a reveal hook, and so are stamped at rest inside a stage. */
const REVEALING = new Set(['hero-headline', 'lede', 'rule', 'dossier', 'voice-marks']);

/** @type {Record<string, () => string>} */
export const SNIPPETS = {
    'button-primary': () => '<button type="button" class="kp-button kp-button--primary">Sign the handover</button>',
    'button-destructive': () => '<button type="button" class="kp-button kp-button--destructive">Delete the reading</button>',
    'button-mirror': () => '<button type="button" class="kp-button kp-button--primary kp-button--mirror">Acknowledge</button>',
    buttons: () =>
        '<div class="kp-row"><button type="button" class="kp-button kp-button--primary">Sign the handover</button><button type="button" class="kp-button kp-button--secondary">Save a draft</button><button type="button" class="kp-button kp-button--ghost">Cancel</button><button type="button" class="kp-button kp-button--destructive">Delete</button></div>',
    badges: () =>
        '<div class="kp-row"><span class="kp-badge">Plain</span><span class="kp-badge" data-kp-semantic data-status="draft">Draft</span><span class="kp-badge" data-kp-semantic data-status="offer">Offer</span><span class="kp-badge" data-kp-semantic data-status="rejected">Rejected</span></div><div class="kp-toast"><span class="kp-toast__body">Saved. The handover note is visible to the day shift.</span></div>',
    notches: () => {
        const input = id('notch');
        return `<div class="kp-row"><button type="button" class="kp-button kp-button--primary">Next</button><button type="button" class="kp-button kp-button--ghost" data-kp-direction="back">Previous</button><span class="kp-badge">Open</span></div><div class="kp-field"><label class="kp-field__label" for="${input}">Site</label><input class="kp-field__input" id="${input}" type="text" value="Pump house 4" /></div><div class="kp-alert" role="status"><span class="kp-alert__body">The export schedule changes to 02:00 from Monday.</span></div>`;
    },
    microlabel: () => '<p class="microlabel">Pump house 4 · night shift</p>',
    'text-body': () =>
        '<p class="kp-prose">Two pumps, one log, and a handover nobody has to chase. Readings are signed before the shift ends, and everything else can wait for the day shift.</p>',
    mono: () =>
        '<p class="kp-prose">Filed as <span class="kp-id">inc_4471_line2_manifold</span>, last read <span class="kp-timestamp">2026-09-13 02:10</span>.</p>',
    field: () => {
        const input = id('field');
        return `<div class="kp-field"><label class="kp-field__label" for="${input}">Incident reference</label><input class="kp-field__input" id="${input}" type="text" value="INC-4471" aria-describedby="${input}-help" /><span class="kp-field__help" id="${input}-help">Printed on the alarm panel, starting with INC-.</span></div>`;
    },
    card: () =>
        '<div class="kp-card" data-slot="card"><div class="kp-card__header"><h3 class="kp-card__title">Incident INC-4471</h3></div><div class="kp-card__body"><p>Pressure on line 2 dropped at 03:12 and recovered by 03:40.</p></div></div>',
    'surface-app': () =>
        '<section class="kp-section kp-stack" data-kp-surface="app"><p class="microlabel">App surface</p><p class="kp-prose">The working surface of the page.</p></section>',
    'surface-hero': () =>
        '<section class="kp-section kp-stack" data-kp-surface="hero"><p class="microlabel">Hero surface</p><p class="kp-prose">The opening surface of the page.</p></section>',
    'hero-alert': () =>
        '<section class="kp-section kp-stack" data-kp-surface="hero"><div class="kp-alert kp-alert--destructive" role="alert" data-kp-semantic><span class="kp-alert__icon" aria-hidden="true">✕</span><span class="kp-alert__body"><span class="kp-alert__label">Error: </span>Line 2 is locked out.</span></div></section>',
    'hero-headline': () =>
        '<section class="kp-section kp-stack" data-kp-surface="hero"><p class="microlabel">Pump house 4 · night shift</p><h1 class="kp-text-balance" data-kp-reveal="headline">Every reading signed.</h1></section>',
    lede: () =>
        '<section class="kp-section kp-stack" data-kp-surface="hero"><p class="kp-prose kp-lede">Two pumps, one log. <mark>Readings are signed</mark> before the shift ends. <mark>Alarms are acknowledged</mark> within the minute.</p></section>',
    rule: () =>
        '<section class="kp-section kp-stack" data-kp-surface="app"><h2 data-kp-reveal="rule">Sign the handover</h2><p class="kp-prose">Three readings are still open.</p></section>',
    heading: () =>
        '<section class="kp-section kp-stack" data-kp-surface="app"><h2>Sign the handover</h2><p class="kp-prose">Three readings are still open.</p></section>',
    dossier: () =>
        '<section class="kp-section kp-stack" data-kp-surface="app"><div class="kp-card" data-slot="card" data-kp-reveal="emphasis" data-kp-label="Sealed" data-kp-label-open="Cleared"><div class="kp-card__header"><h3 class="kp-card__title">Incident INC-4471</h3></div><div class="kp-card__body"><p>The pressure on line 2 dropped at <mark>03:12 on the night shift</mark>, the operator on duty was <mark>Bram De Smet</mark>, and the valve was replaced by <mark>the contractor on call</mark>.</p><div class="kp-row"><button data-kp-reveal-trigger type="button" class="kp-button kp-button--primary"><span class="kp-button__edge" aria-hidden="true"></span><span class="kp-button__label">Open the file</span></button></div></div></div></section>',
    divider: () =>
        '<div><section class="kp-section kp-stack" data-kp-surface="hero"><p class="microlabel">hero surface</p></section><div data-kp-divider></div><section class="kp-section kp-stack" data-kp-surface="app"><p class="microlabel">app surface</p></section><div data-kp-divider="alt"></div><footer class="kp-footer"><p class="microlabel">footer</p></footer></div>',
    marquee: () =>
        '<div class="kp-marquee" data-kp-marquee><span>Line 1 · 3.2 bar</span><span>Line 2 · locked out</span><span>Cold store · −18 °C</span><span>Next shift · 06:00</span></div>',
    voice: () => {
        const input = id('voice');
        return `<p class="microlabel">Pump house 4 · night shift</p><nav class="kp-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="#voice">Sites</a></li><li><a href="#voice">Pump house 4</a></li><li><span aria-current="page">Incident INC-4471</span></li></ol></nav><div class="kp-field kp-field--invalid"><label class="kp-field__label" for="${input}">Escalation email</label><input class="kp-field__input" id="${input}" type="email" value="night-shift@" aria-invalid="true" aria-describedby="${input}-error" /><span class="kp-field__error" id="${input}-error">Enter a whole address, like night-shift@example.org.</span></div><div class="kp-row"><span class="kp-badge" data-kp-semantic data-status="sent">Sent</span><button type="button" class="kp-button kp-button--primary">Sign the handover</button></div>`;
    },
    'nav-menu': () =>
        '<div class="kp-nav-wrap"><nav class="kp-nav" aria-label="Site operations"><a class="kp-nav__brand" href="#motion">Pump house 4</a><ul class="kp-nav__links"><li><a class="kp-nav__link" href="#motion">Overview</a></li><li data-pt-menu><a class="kp-nav__link" href="#motion" aria-haspopup="true">Readings</a><ul class="kp-nav__menu"><li><a href="#motion">Pressure</a></li><li><a href="#motion">Flow rate</a></li><li><a href="#motion">Pump cycles</a></li></ul></li><li><a class="kp-nav__link" href="#motion">Rota</a></li></ul></nav></div>',
    alarm: () =>
        '<div class="kp-alarm" data-kp-alarm-inline data-kp-alarm-mode="ack" inert><div class="kp-alarm__scan" aria-hidden="true"></div><div class="kp-alarm__bars" aria-hidden="true"></div><div class="kp-alarm__panel"><p class="kp-alarm__code">Security protocol 7 · lockout</p><div class="kp-alarm__title" role="heading" aria-level="3"><span class="kp-alarm__glyphs" data-text="Access denied">Access denied</span></div><p class="kp-alarm__detail">Three failed attempts on terminal 4.</p><div class="kp-alarm__actions"><button type="button" class="kp-button kp-alarm__ack">Acknowledge</button></div></div></div>',
};

/**
 * A snippet as it stands inside a stage: a revealing one is stamped at rest
 * by catalogue/demos.js, so a verdict never reads it mid-reveal.
 * @param {string | null} name
 */
export function stageSnippet(name) {
    if (name === null) return '<p class="cat-note">Drawn over the whole page, not in a box of its own: look at the page itself.</p>';
    const make = SNIPPETS[name];
    if (!make) throw new Error(`signature example "${name}" has no snippet in gates/generate-portraits.mjs`);
    return REVEALING.has(name) ? `<div data-cat-effect="rest"><template>${make()}</template></div>` : make();
}
