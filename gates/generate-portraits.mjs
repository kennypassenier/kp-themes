// Writes one portrait page per theme with a signature [scope-97].
//
// `themes/<theme>/signature.json` is the source; `research/theme-portraits/
// <theme>.html` is what this writes. Generated rather than filled in at
// runtime for two reasons. The catalogue reads a block's markup as written
// (catalogue/catalogue.js fetches the page) to hash it, so a page rendered
// from a fetched file would hash a skeleton and a verdict would not follow a
// change to the data; and a page that is written out can be diffed and held
// by `--check`, the way the example pages and the site are. The page and its
// data cannot drift: `npm run gates` refuses a page that no longer matches.
//
// Each page is fixed to its theme and carries the nine sections of scope-97
// as `.cat-block`s, each with a Look-at text and a stage, so the catalogue's
// judging panel, hash and prompt work on it as on any research demo. Motion is
// shown twice, like catalogue/page-effects.html: live copies outside the
// stage with a replay button each (research/theme-portraits/portrait.js), and
// the verbs at rest inside it.
//
// Usage:
//   node gates/generate-portraits.mjs           write the pages
//   node gates/generate-portraits.mjs --check   exit 1 if any would change

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { readSignature, signedThemes } from './signature.mjs';

const OUT = new URL('../research/theme-portraits/', import.meta.url);

/** The nine sections, in Kenny's order [scope-97]. */
export const SECTIONS = [
    { id: 'idea', title: 'Idea' },
    { id: 'colour', title: 'Colour in its role' },
    { id: 'type', title: 'Type' },
    { id: 'shape', title: 'Shape' },
    { id: 'surfaces', title: 'Surfaces' },
    { id: 'motion', title: 'Motion' },
    { id: 'ornaments', title: 'Ornaments' },
    { id: 'voice', title: 'Voice' },
    { id: 'recipe', title: 'Recipe for a new component' },
];

export const VERBS = ['enter', 'leave', 'press', 'hover', 'load', 'attention'];

/** @param {unknown} text */
const esc = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[/** @type {'&'} */ (c)]);

/** @param {string} theme */
const label = (theme) => theme.charAt(0).toUpperCase() + theme.slice(1);

/* ------------------------------------------------------------ snippets */

/**
 * The live snippets a signature names by `example`. Real package markup only,
 * the markup the catalogue pages use; ids are made unique per page.
 */
let uid = 0;
const id = (/** @type {string} */ base) => `pt-${base}-${++uid}`;

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
function stageSnippet(name) {
    if (name === null) return '<p class="cat-note">Drawn over the whole page, not in a box of its own: look at the page itself.</p>';
    const make = SNIPPETS[name];
    if (!make) throw new Error(`signature example "${name}" has no snippet in gates/generate-portraits.mjs`);
    return REVEALING.has(name) ? `<div data-cat-effect="rest"><template>${make()}</template></div>` : make();
}

/** @param {any[] | undefined} proof */
function proofs(proof) {
    if (!proof?.length) return '';
    const items = proof.map((p) => {
        const what = p.selector ?? (p.keyframes ? `@keyframes ${p.keyframes}` : (p.property ?? `--${p.token}`));
        return `<li><code>${esc(p.file)}</code> <code>${esc(what)}</code></li>`;
    });
    return `<details class="pt-proof"><summary>Proof</summary><ul>${items.join('')}</ul></details>`;
}

/* ------------------------------------------------------------ sections */

/** @param {any} s */
function idea(s) {
    const bearing = s.loadBearing.map((/** @type {any} */ b) => `<li><p>${esc(b.claim)}</p>${proofs(b.proof)}</li>`).join('\n');
    return {
        look: `<b>Look at:</b> the idea is at most three sentences, and the list under it is what may not move. Read each claim against the rest of this page: every later section should be explainable from these lines, and a claim that nothing below shows is a claim to strike. Each claim carries its proof, the token, selector or keyframes in ${esc(s.theme)}'s own files that make it true.`,
        stage: `<div class="pt-idea"><p class="kp-prose kp-lede">${esc(s.idea)}</p><ol class="pt-bearing">\n${bearing}\n</ol></div>`,
    };
}

/** @param {any} s */
function colour(s) {
    const cards = s.colourRoles
        .map(
            (/** @type {any} */ r) => `<article class="pt-card" data-pt-role="${esc(r.token)}">
<div class="pt-swatch" data-pt-token="${esc(r.token)}"></div>
<h3 class="pt-card__name">${esc(r.role)}</h3>
<p class="pt-card__token"><code>--${esc(r.token)}</code></p>
<dl class="pt-dl"><dt>Use</dt><dd>${esc(r.use)}</dd><dt>Never</dt><dd>${esc(r.never)}</dd></dl>
<div class="pt-example">${stageSnippet(r.example)}</div>
${proofs(r.proof)}
</article>`,
        )
        .join('\n');
    return {
        look: `<b>Look at:</b> ${s.colourRoles.length} roles, each a swatch of its token as the page resolves it, what the role may carry, what it may never carry, and a live component using it. The swatch and the component must show the same colour. Then read across the cards: a colour that appears in a component under a role it is told never to take is a finding. Roles in ${esc(s.theme)}: ${s.colourRoles.map((/** @type {any} */ r) => esc(r.role)).join(', ')}.`,
        stage: `<div class="pt-grid">\n${cards}\n</div>`,
    };
}

/** @param {any} s */
function type(s) {
    const cards = s.type
        .map(
            (/** @type {any} */ t) => `<article class="pt-card pt-card--wide">
<h3 class="pt-card__name">${esc(t.role)}</h3>
<p class="pt-specimen" data-pt-font="${esc(t.font)}" data-pt-case="${esc(t.case)}">Readings signed 0123</p>
<dl class="pt-dl"><dt>Face</dt><dd><code>--${esc(t.font)}</code>${t.scale ? `, size <code>--${esc(t.scale)}</code>` : ''}</dd><dt>Case</dt><dd>${esc(t.case)}</dd>${t.tracking ? `<dt>Tracking</dt><dd>${esc(t.tracking)}</dd>` : ''}${t.weight ? `<dt>Weight</dt><dd>${esc(t.weight)}</dd>` : ''}</dl>
<p>${esc(t.description)}</p>
<div class="pt-example">${stageSnippet(t.example)}</div>
${proofs(t.proof)}
</article>`,
        )
        .join('\n');
    return {
        look: `<b>Look at:</b> each role twice: a specimen line in the face and case the signature names, and the real component that uses it. The two must agree on face, case and tracking; where the component differs, the signature is wrong or the register is. Sizes come from the package (option B); a theme keeps face, case and spacing.`,
        stage: `<div class="pt-grid">\n${cards}\n</div>`,
    };
}

/** @param {any} s */
function shape(s) {
    const parts = ['radius', 'borders', 'shadows', 'signature']
        .map(
            (key) => `<article class="pt-card pt-card--wide">
<h3 class="pt-card__name">${label(key)}</h3>
<p>${esc(s.shape[key].description)}</p>
<div class="pt-example">${stageSnippet(s.shape[key].example)}</div>
${proofs(s.shape[key].proof)}
</article>`,
        )
        .join('\n');
    return {
        look: `<b>Look at:</b> the corners, the edges and what floats. Radius, borders, shadows, and last the one shape this theme is recognised by. Every example is the component as it ships; check that its corner, edge and shadow are the ones the sentence above it describes, at this zoom and at 200 %.`,
        stage: `<div class="pt-grid">\n${parts}\n</div>`,
    };
}

/** @param {any} s */
function surfaces(s) {
    const blocks = s.surfaces
        .map((/** @type {any} */ surface) => {
            const inner = `<p class="microlabel">${esc(surface.name)} · --${esc(surface.ground)}</p><p class="kp-prose">${esc(surface.description)}</p><div class="kp-card" data-slot="card"><div class="kp-card__header"><h3 class="kp-card__title">A card on the ${esc(surface.name)}</h3></div><div class="kp-card__body"><p>Ink: --${esc(surface.ink)}.</p></div></div><div class="kp-row"><button type="button" class="kp-button kp-button--primary">Primary</button><button type="button" class="kp-button kp-button--ghost">Ghost</button></div>`;
            const wrapped =
                surface.name === 'footer'
                    ? `<footer class="kp-footer"><div class="kp-stack">${inner}</div></footer>`
                    : `<section class="kp-section kp-stack" data-kp-surface="${esc(surface.name)}">${inner}</section>`;
            return `<div class="pt-surface">${wrapped}${proofs(surface.proof)}</div>`;
        })
        .join('\n');
    return {
        look: `<b>Look at:</b> each ground with the same card and the same two buttons on it. On every ground the card must read as raised in this theme's own way, the primary button must be the loudest thing, and no text may sink into its ground. The hero remaps the tokens (AR38): a button on the hero is not the button on the app surface, and should not look like it.`,
        stage: `<div class="pt-surfaces">\n${blocks}\n</div>`,
    };
}

/** @param {any} s */
function motion(s) {
    const flicker = s.motion.flicker;
    const live = VERBS.map((verb) => {
        const v = s.motion.verbs[verb];
        const status = v.open ? '<span class="kp-badge" data-kp-semantic data-status="screening">Open</span>' : '';
        const demo = v.demo
            ? `<div class="cat-live__bar"><span class="cat-note">Live · ${verb}</span>${status}<button type="button" class="kp-button kp-button--sm" data-pt-replay>Replay ${verb}</button></div>
<div data-pt-live data-pt-kind="${esc(v.demo.kind)}" data-pt-example="${esc(v.demo.example)}"><template>${SNIPPETS[v.demo.example]()}</template></div>`
            : `<div class="cat-live__bar"><span class="cat-note">Live · ${verb}</span>${status}</div><p class="cat-note">Nothing to replay: this theme has no answer yet.</p>`;
        const note = v.open ? `<p class="cat-note"><b>Proposal, not fact:</b> ${esc(v.proposal)}</p>` : '';
        return `<div class="cat-live pt-live" data-pt-verb="${verb}"${v.open ? ' data-pt-open' : ''}>${demo}${note}</div>`;
    }).join('\n');
    const rows = VERBS.map((verb) => {
        const v = s.motion.verbs[verb];
        const answer = v.open
            ? `<span class="kp-badge" data-kp-semantic data-status="screening">Open</span> ${esc(v.description)}`
            : esc(v.description);
        return `<tr data-pt-verb-row="${verb}"><th scope="row">${verb}</th><td>${answer}${v.note ? `<br /><span class="pt-muted">${esc(v.note)}</span>` : ''}${proofs(v.proof)}</td><td>${esc(v.duration)}</td><td>${esc(v.easing)}</td><td>${esc(v.reducedMotion)}</td></tr>`;
    }).join('\n');
    const opens = VERBS.filter((verb) => s.motion.verbs[verb].open);
    return {
        look: `<b>Look at:</b> first the live copies above the stage. Each verb has a <b>Replay</b> button that plays the register's own rule on a real component: hover and press are the register's <code>:hover</code> and <code>:active</code> rules applied by the page, not a copy of them. Then switch <b>Reduced motion</b> on and replay each again: what is left must be exactly the column "Reduced motion" in the table. Flicker in ${esc(s.theme)}: <b>${flicker.allowed ? 'allowed' : 'not allowed'}</b>, ${esc(flicker.reason)} ${opens.length ? `Marked open, a proposal rather than a fact: ${opens.join(', ')}.` : 'Every verb has an answer.'}`,
        live: `<div class="cat-live"><div class="cat-live__bar"><span class="cat-note">For every copy below</span><button type="button" class="kp-button kp-button--sm" data-pt-reduce aria-pressed="false">Reduced motion: off</button></div><p class="cat-note" data-pt-reduce-note>Follows your system setting until you press it; the page rewrites its own motion guards, so the stylesheets decide what remains.</p></div>\n${live}`,
        stage: `<p class="pt-flicker" data-pt-flicker="${flicker.allowed ? 'allowed' : 'not-allowed'}"><b>Flicker ${flicker.allowed ? 'allowed' : 'not allowed'}.</b> ${esc(flicker.reason)}</p>${proofs(flicker.proof)}
<div class="pt-scroll"><table class="kp-table"><thead><tr><th scope="col">Verb</th><th scope="col">How this theme answers</th><th scope="col">Duration</th><th scope="col">Easing</th><th scope="col">Reduced motion</th></tr></thead><tbody>
${rows}
</tbody></table></div>`,
    };
}

/** @param {any} s */
function ornaments(s) {
    const cards = s.ornaments
        .map(
            (/** @type {any} */ o) => `<article class="pt-card pt-card--wide">
<h3 class="pt-card__name">${esc(o.name)}</h3>
<p class="pt-muted">${esc(o.where)}</p>
<p>${esc(o.description)}</p>
<div class="pt-example">${stageSnippet(o.example)}</div>
${proofs(o.proof)}
</article>`,
        )
        .join('\n');
    return {
        look: `<b>Look at:</b> the ornaments drawn live: ${s.ornaments.map((/** @type {any} */ o) => esc(o.name)).join(', ')}. Each must look like the sentence beside it, and none may compete with the content it decorates. An ornament a new component could reuse is the first thing to reach for in the recipe.`,
        stage: `<div class="pt-grid">\n${cards}\n</div>`,
    };
}

/** @param {any} s */
function voice(s) {
    const v = s.voice;
    return {
        look: `<b>Look at:</b> how ${esc(s.theme)} talks: its case, the small words and prefixes it puts in front of things, how it draws instead of using icons, and what it never does. The sample under the list is real markup; every rule in the list should be visible in it.`,
        stage: `<div class="pt-split"><dl class="pt-dl pt-dl--wide"><dt>Case</dt><dd>${esc(v.case)}</dd><dt>Labels</dt><dd><ul>${v.labels.map((/** @type {string} */ l) => `<li>${esc(l)}</li>`).join('')}</ul></dd><dt>Icons</dt><dd>${esc(v.icons)}</dd><dt>Never</dt><dd><ul>${v.neverDoes.map((/** @type {string} */ l) => `<li>${esc(l)}</li>`).join('')}</ul></dd></dl><div class="pt-example kp-stack">${stageSnippet(v.example)}</div></div>${proofs(v.proof)}`,
    };
}

/** @param {string} markup */
export function partsOf(markup) {
    const classes = new Set(
        [...markup.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter((c) => c.startsWith('kp-') || c === 'microlabel'),
    );
    const hooks = new Set([...markup.matchAll(/\s(data-kp-[a-z-]+)/g)].map((m) => m[1]));
    return { classes: [...classes].sort(), hooks: [...hooks].sort() };
}

/** @param {any} s */
function recipe(s) {
    const rows = s.recipe
        .map(
            (/** @type {any} */ r) =>
                `<tr${r.open ? ' data-pt-open' : ''}><th scope="row">${esc(r.situation)}</th><td>${r.verb ? esc(r.verb) : '—'}</td><td>${esc(r.answer)}${r.open ? `<br /><span class="kp-badge" data-kp-semantic data-status="screening">Open</span> <b>Proposal:</b> ${esc(r.proposal)}` : ''}${proofs(r.proof)}</td><td>${r.components.length ? r.components.map((/** @type {string} */ c) => `<code>.${esc(c)}</code>`).join(' ') : '—'}</td></tr>`,
        )
        .join('\n');
    const parts = partsOf(s.banner.markup);
    return {
        look: `<b>Look at:</b> the table is what a builder reads before drawing a new component in ${esc(s.theme)}: find the situation, take the answer and the components that already give it, and treat a row marked Open as a proposal to be approved, not a rule. Under it, the worked example: a new "banner that asks for attention", drawn only from parts that exist. It must read as ${esc(s.theme)} at a glance and as a request for attention without its colours.`,
        stage: `<div class="pt-scroll"><table class="kp-table"><thead><tr><th scope="col">Situation</th><th scope="col">Verb</th><th scope="col">How this theme answers</th><th scope="col">Existing components</th></tr></thead><tbody>
${rows}
</tbody></table></div>
<h3 class="pt-card__name pt-worked">Worked example: a banner that asks for attention</h3>
<p class="kp-prose">${esc(s.banner.description)}</p>
<div class="pt-banner" data-cat-effect="rest"><template>${s.banner.markup}</template></div>
<p class="pt-muted">Parts used: ${parts.classes.map((c) => `<code>.${esc(c)}</code>`).join(' ')}${parts.hooks.length ? `; hooks ${parts.hooks.map((h) => `<code>${esc(h)}</code>`).join(' ')}` : ''}.</p>`,
    };
}

const BUILDERS = { idea, colour, type, shape, surfaces, motion, ornaments, voice, recipe };

/* ---------------------------------------------------------------- page */

/**
 * @param {string} theme
 * @param {any} s the signature
 */
export function page(theme, s) {
    uid = 0;
    const tokens = new Set([...s.colourRoles.map((/** @type {any} */ r) => r.token)]);
    const fonts = new Set(s.type.map((/** @type {any} */ t) => t.font));
    const css = [
        ...[...tokens].map((t) => `            .pt-swatch[data-pt-token='${t}'] { background: var(--${t}); }`),
        ...[...fonts].map((f) => `            .pt-specimen[data-pt-font='${f}'] { font-family: var(--${f}); }`),
    ].join('\n');
    const blocks = SECTIONS.map(({ id: sectionId, title }, i) => {
        const built = /** @type {{ look: string, stage: string, live?: string }} */ (BUILDERS[/** @type {keyof typeof BUILDERS} */ (sectionId)](s));
        return `            <section class="cat-block" id="${sectionId}">
                <h2>${i + 1} · ${title}</h2>
                <div class="cat-look">${built.look}</div>
${built.live ? `${built.live}\n                <p class="cat-note">At rest</p>\n` : ''}                <div class="cat-stage cat-stage--block">
${built.stage}
                </div>
            </section>`;
    }).join('\n\n');
    return `<!doctype html>
<!-- generated by gates/generate-portraits.mjs from themes/${theme}/signature.json — do not edit -->
<html lang="en" data-theme="${theme}" data-cat-theme="${theme}" data-cat-theme-fixed>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Portrait: ${theme} · kp-themes research</title>
        <link rel="stylesheet" href="../../css/fonts.css" />
        <link rel="stylesheet" href="../../css/themes.css" />
        <link rel="stylesheet" href="../../css/components.css" />
        <link rel="stylesheet" href="../../css/layout.css" />
        <link rel="stylesheet" href="../../css/utilities.css" />
        <link rel="stylesheet" href="../../css/${theme}-register.css" />
        <link rel="stylesheet" href="../../catalogue/catalogue.css" />
        <link rel="stylesheet" href="./portrait.css" />
        <style>
${css}
        </style>
    </head>
    <body>
        <a class="kp-skip-link" href="#main">Skip to content</a>
        <header class="cat-bar">
            <a class="cat-bar__home" href="../../catalogue/index.html">kp-themes catalogue</a>
            <span class="cat-bar__spacer"></span>
            <button type="button" class="kp-button kp-button--ghost" data-cat-devtools>Devtools (Alt+D)</button>
        </header>
        <main id="main" class="cat-main cat-main--wide">
            <section class="kp-section kp-stack pt-masthead" data-kp-surface="hero">
                <p class="microlabel">Theme portrait · research pilot [scope-97]</p>
                <h1>Portrait: ${theme}</h1>
            </section>
            <p class="cat-intro">
                What makes ${label(theme)} ${label(theme)}, drawn on the package's real stylesheets and components and fixed to this theme. Every word, role
                and verb comes from <code>themes/${theme}/signature.json</code>, and every claim there cites the token, selector or keyframes that
                proves it; <code>tests/theme-portraits.spec.mjs</code> refuses a citation the stylesheet does not contain. Each of the nine sections
                is a block with its own verdict. A row or verb marked <b>Open</b> is a proposal for Kenny, not a fact about the theme.
            </p>
            <ul class="cat-toc">
${SECTIONS.map(({ id: sectionId, title }) => `                <li><a href="#${sectionId}">${title}</a></li>`).join('\n')}
            </ul>

${blocks}
        </main>

        <script type="module" src="../../js/auto.js"></script>
        <script src="../../catalogue/boot-check.js"></script>
        <script type="module" src="../../catalogue/catalogue.js"></script>
        <script type="module" src="./portrait.js"></script>
    </body>
</html>
`;
}

const pages = signedThemes().map((theme) => ({ file: `${theme}.html`, content: page(theme, readSignature(theme)) }));

if (process.argv.includes('--check')) {
    let stale = 0;
    for (const item of pages) {
        let current = '';
        try {
            current = readFileSync(new URL(item.file, OUT), 'utf8');
        } catch {
            current = '';
        }
        if (current !== item.content) {
            stale++;
            console.error(`research/theme-portraits/${item.file} does not match themes/${item.file.replace('.html', '')}/signature.json.`);
        }
    }
    const expected = new Set(pages.map((item) => item.file));
    for (const file of readdirSync(OUT).filter((name) => name.endsWith('.html'))) {
        if (!expected.has(file)) {
            stale++;
            console.error(`research/theme-portraits/${file} belongs to no signature.`);
        }
    }
    if (stale > 0) {
        console.error('Run `npm run generate:portraits` and commit the result.');
        process.exit(1);
    }
    console.log(`Portraits: ${pages.length} page(s) match their signatures.`);
    process.exit(0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    for (const item of pages) writeFileSync(new URL(item.file, OUT), item.content);
    console.log(`wrote ${pages.length} portrait page(s).`);
}
