// What the showcase shows [L5, AR14].
//
// One list, rendered seven times on the showcase and once per theme on the
// bare fixtures. Milestones L6 to L8 add entries here rather than editing
// two pages, which is the only reason this is data instead of markup.
//
// Every specimen is framework-free HTML: the showcase is the page where a
// consumer without npm can see what they are getting, and a page that
// needed a bundle to render would answer a different question.
//
// The React channel is therefore not on this page. It cannot be: mounting
// it needs a bundle, and this package has no build step (T5). The
// side-by-side comparison of the two channels lives where a bundle is
// available — tests/fixtures/picker.html, built by the Playwright setup —
// and it is asserted rather than eyeballed: the same five behaviours are
// driven against both mounts in the same document.

/**
 * @typedef {object} Specimen
 * @property {string} id     stable, used as an anchor and in test selectors
 * @property {string} title  shown above the specimen
 * @property {string} note   one line saying what a reader should look at
 * @property {(theme: string) => string} html
 */

const STATUSES = ['draft', 'sent', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'];

const SURFACES = [
    ['background', 'foreground'],
    ['card', 'card-foreground'],
    ['popover', 'popover-foreground'],
    ['primary', 'primary-foreground'],
    ['secondary', 'secondary-foreground'],
    ['muted', 'muted-foreground'],
    ['accent', 'accent-foreground'],
    ['destructive', 'destructive-foreground'],
    ['success', 'success-foreground'],
    ['warning', 'warning-foreground'],
    ['info', 'info-foreground'],
];

/** @type {Specimen[]} */
export const SPECIMENS = [
    {
        id: 'surfaces',
        title: 'Surfaces and their ink',
        note: 'Every pair here is in the contrast gate. If one looks wrong, the gate is wrong too.',
        html: () =>
            `<div class="sc-grid">${SURFACES.map(
                ([bg, fg]) => `<div class="sc-chip" style="background: var(--${bg}); color: var(--${fg});"><code>--${bg}</code><span>Aa</span></div>`,
            ).join('')}</div>`,
    },
    {
        id: 'states',
        title: 'Interaction states',
        note: 'Hover, active and disabled are derived, not authored — half a step, two steps, and a step and a half the other way.',
        html: () =>
            `<div class="sc-grid">${['primary', 'secondary', 'accent', 'destructive']
                .map(
                    (s) =>
                        `<div class="sc-states"><code>--${s}</code>${['', '-hover', '-active', '-disabled']
                            .map(
                                (state) =>
                                    `<span class="sc-chip" style="background: var(--${s}${state}); color: var(--${s}-foreground);">${state || 'base'}</span>`,
                            )
                            .join('')}</div>`,
                )
                .join('')}</div>`,
    },
    {
        id: 'status',
        title: 'Status badges',
        note: 'Colour is never the only carrier: each badge says what it is [DI4].',
        html: () =>
            `<div class="sc-row">${STATUSES.map(
                (s) => `<span class="sc-badge" style="background: var(--status-${s}); color: var(--status-${s}-foreground);">${s}</span>`,
            ).join('')}</div>`,
    },
    {
        id: 'focus',
        title: 'Focus ring',
        note: 'Tab into these. The ring is two rings, and one of them contrasts with whatever it lands on [DI2].',
        html: () =>
            `<div class="sc-row">` +
            `<button type="button" class="sc-button">Op de pagina</button>` +
            `<button type="button" class="sc-button sc-on-primary">Op primary</button>` +
            `<button type="button" class="sc-button sc-on-destructive">Op destructive</button>` +
            `</div>`,
    },
    {
        id: 'picker',
        title: 'Theme picker, framework-free',
        note: 'The markup a server writes; one module attaches the behaviour. Changing it here changes the whole page.',
        html: () => `<div data-kp-theme-picker class="sc-picker"></div><p data-kp-theme-status hidden></p>`,
    },
    {
        id: 'text',
        title: 'Body text',
        note: 'Forced text spacing must not clip this, and it must not need sideways scrolling at 320 px [DI11].',
        html: () =>
            `<p class="sc-text">De zeven thema's delen dezelfde tokens en dezelfde regels; wat verschilt is de kleur, ` +
            `het contrast en de textuur. <a href="#surfaces">Een link</a> hoort leesbaar te zijn in elk thema — ook in ` +
            `terminal, waar de standaardkleur van de browser tegen het fosforgroen vloekt.</p>`,
    },
];
