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
        id: 'links',
        title: 'Links and selection',
        note: 'The browser default scores 1.99 on dark, 2.09 on cyberpunk, 2.06 on terminal. These are the theme\u2019s own [TH31].',
        html: () =>
            `<p class="sc-text">Een <a href="#surfaces">gewone link</a>, een <a href="#already-visited-anchor">bezochte link</a> ` +
            `en gewone tekst naast elkaar. Selecteer deze zin om de selectiekleur te zien.</p>`,
    },
    {
        id: 'typography',
        title: 'Ordinary text elements',
        note: 'code, kbd, mark, blockquote, hr and list markers \u2014 the elements a page gets for free and a theme usually forgets [TH32].',
        html: () =>
            `<p class="sc-text">Inline <code>--background</code>, een toets <kbd>Ctrl</kbd>, en <mark>gemarkeerde tekst</mark>.</p>` +
            `<pre><code>npm run gates</code></pre>` +
            `<blockquote>Een thema moet compleet zijn.</blockquote>` +
            `<ul><li>Eerste punt</li><li>Tweede punt</li></ul><hr />`,
    },
    {
        id: 'data',
        title: 'Showing data',
        note: 'A long URL wraps instead of widening the page; digits line up between rows [TH33].',
        html: () =>
            `<p class="sc-url kp-url">https://voorbeeld.example/een/heel/lang/pad/dat-anders-de-pagina-breder-maakt?met=query&amp;en=meer</p>` +
            `<p class="kp-id">a3f9-2b71-0c4d-8e15</p>` +
            `<p class="kp-masked">\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4417</p>` +
            `<p class="kp-numeric">1.284,50 &middot; 998,00 &middot; 12,75</p>` +
            `<p class="kp-timestamp">2026-09-04 14:07</p>` +
            `<p class="kp-truncate">Deze zin wordt afgekapt met een ellips zodra de kolom smaller is dan de tekst zelf, in plaats van de rij hoger te maken.</p>` +
            `<div class="kp-empty">Nog geen sollicitaties.</div>`,
    },
    {
        id: 'browser',
        title: 'The browser\u2019s own hooks',
        note: 'Checkbox, placeholder, invalid and disabled \u2014 surfaces a stylesheet cannot repaint, only point at [TH34].',
        html: () =>
            `<div class="sc-row">` +
            `<label><input type="checkbox" checked /> aangevinkt</label>` +
            `<input type="text" placeholder="placeholder" />` +
            `<input type="email" value="geen-adres" required />` +
            `<button type="button" class="sc-button" disabled>uitgeschakeld</button>` +
            `</div>`,
    },
    {
        id: 'shell',
        title: 'The page shell',
        note: 'Tab here to see the skip link appear. Print this page to see the print rules [TH36].',
        html: () =>
            `<a class="kp-skip-link" href="#surfaces">Naar de inhoud</a>` +
            `<div class="kp-error"><h1>404</h1><p>Deze pagina bestaat niet.</p></div>` +
            `<footer class="kp-footer">kp-themes \u00b7 zeven thema\u2019s, \u00e9\u00e9n set tokens</footer>`,
    },
    {
        id: 'text',
        title: 'Body text',
        note: 'Forced text spacing must not clip this, and it must not need sideways scrolling at 320 px [DI11].',
        html: () =>
            `<p class="sc-text">De zeven thema's delen dezelfde tokens en dezelfde regels; wat verschilt is de kleur, ` +
            `het contrast en de textuur. <a href="#surfaces">Een link</a> is leesbaar in elk thema — ook in terminal, waar het ` +
            `blauw van de browser tegen het fosforgroen vloekte.</p>`,
    },
];
