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
 * @property {boolean} [fixturesOnly]  shown on the bare per-theme pages, not on the seven-block showcase
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
        // Bare fixtures only. On the seven-block showcase a picker inside
        // a block reads as broken: the click works, but the block keeps
        // its own theme on purpose, so nothing visible happens where the
        // eye is looking. One picker in the header instead [S1].
        fixturesOnly: true,
        html: () => `<div data-kp-theme-picker class="sc-picker"></div><p data-kp-theme-status hidden></p>`,
    },
    {
        id: 'buttons',
        title: 'Button, every variant and state',
        note: 'Hover, active and disabled are derived; a destructive button must carry an undo or a confirmation [TH1, DI10].',
        html: () =>
            `<div class="sc-row">` +
            ['', '--primary', '--destructive', '--ghost']
                .map(
                    (v) =>
                        `<button type="button" class="kp-button ${v ? 'kp-button' + v : ''}"${v === '--destructive' ? ' data-kp-destructive data-kp-confirm="Zeker?"' : ''}>${v ? v.slice(2) : 'default'}</button>`,
                )
                .join('') +
            ['', '--primary', '--destructive', '--ghost']
                .map((v) => `<button type="button" class="kp-button ${v ? 'kp-button' + v : ''}" disabled>uit</button>`)
                .join('') +
            `</div>`,
    },
    {
        id: 'badges',
        title: 'Badge',
        note: 'Seven statuses, each of which says what it is — the colour is the second channel, never the only one [TH2, DI4].',
        html: () =>
            `<div class="sc-row">${STATUSES.map(
                (s) =>
                    `<span class="kp-badge" data-kp-semantic data-status="${s}" style="background: var(--status-${s}); color: var(--status-${s}-foreground);">${s}</span>`,
            ).join('')}</div>`,
    },
    {
        id: 'alerts',
        title: 'Alert',
        note: 'Four flavours, each naming itself. An alert is a message, so it has no hover or active state [TH4].',
        html: () =>
            ['success', 'warning', 'info', 'destructive']
                .map(
                    (f) =>
                        `<div class="kp-alert kp-alert--${f}" role="status" data-kp-semantic><span><span class="kp-alert__label">${f}: </span>Een bericht in deze smaak.</span></div>`,
                )
                .join(''),
    },
    {
        id: 'field',
        title: 'Form field',
        note: 'Label, help text, and an error that is words rather than a red border [TH5, DI4].',
        html: (theme) =>
            `<div class="kp-field"><label class="kp-field__label" for="${theme}-f1">E-mail</label>` +
            `<input class="kp-field__input" id="${theme}-f1" type="email" placeholder="naam@voorbeeld.be" aria-describedby="${theme}-h1" />` +
            `<span class="kp-field__help" id="${theme}-h1">We sturen niets door.</span></div>` +
            `<div class="kp-field kp-field--invalid"><label class="kp-field__label" for="${theme}-f2">E-mail</label>` +
            `<input class="kp-field__input" id="${theme}-f2" type="email" value="geen-adres" aria-invalid="true" aria-describedby="${theme}-e2" />` +
            `<span class="kp-field__error" id="${theme}-e2">Vul een geldig adres in.</span></div>`,
    },
    {
        id: 'card',
        title: 'Card',
        note: 'A raised surface is never darker than the one below it [DI6].',
        html: () =>
            `<div class="kp-card" data-slot="card"><h3 class="kp-card__title">Sollicitatie</h3>` +
            `<p class="kp-card__body">Twee regels tekst op de kaartkleur, met de bijhorende inkt.</p></div>`,
    },
    {
        id: 'table',
        title: 'Table',
        note: 'Wide tables scroll inside their own box; the page does not scroll sideways [TH3, DI11].',
        html: () =>
            `<div class="kp-table-wrap"><table class="kp-table"><thead><tr><th scope="col">Bedrijf</th><th scope="col">Status</th>` +
            `<th scope="col">Bedrag</th></tr></thead><tbody>` +
            `<tr><td>Voorbeeld NV</td><td><span class="kp-badge" data-kp-semantic data-status="interview" style="background: var(--status-interview); color: var(--status-interview-foreground);">interview</span></td><td class="kp-numeric">1.284,50</td></tr>` +
            `<tr><td>Tweede BV</td><td><span class="kp-badge" data-kp-semantic data-status="offer" style="background: var(--status-offer); color: var(--status-offer-foreground);">aanbod</span></td><td class="kp-numeric">998,00</td></tr>` +
            `</tbody></table></div>`,
    },
    {
        id: 'nav',
        title: 'Navigation bar',
        note: 'The current page is marked by weight and aria-current, not by colour alone [TH7, DI4].',
        html: () =>
            `<nav class="kp-nav" aria-label="Voorbeeldnavigatie"><span class="kp-nav__brand">kp</span>` +
            `<ul class="kp-nav__links"><li><a class="kp-nav__link" href="#surfaces" aria-current="page">Overzicht</a></li>` +
            `<li><a class="kp-nav__link" href="#status">Statussen</a></li></ul></nav>`,
    },
    {
        id: 'overlays',
        title: 'Overlays',
        note: 'Dialog, menu, tabs and accordion get their keyboard behaviour from the platform: focus trap, Escape, focus return [TH35].',
        html: (theme) =>
            `<div class="sc-row">` +
            `<button type="button" class="kp-button" data-kp-dialog="${theme}-dialog">Dialoog</button>` +
            `<button type="button" class="kp-button" popovertarget="${theme}-menu" style="anchor-name: --${theme}-menu">Menu</button>` +
            `</div>` +
            `<dialog class="kp-dialog" id="${theme}-dialog"><h2 class="kp-dialog__title">Bevestigen</h2>` +
            `<p>Escape sluit deze dialoog en zet de focus terug op de knop.</p>` +
            `<div class="kp-dialog__actions"><button type="button" class="kp-button" data-kp-dialog-close>Sluiten</button></div></dialog>` +
            `<div popover="auto" id="${theme}-menu" class="kp-popover" style="position-anchor: --${theme}-menu">` +
            `<ul class="kp-menu"><li><button type="button" class="kp-menu__item">Bewerken</button></li>` +
            `<li><button type="button" class="kp-menu__item">Archiveren</button></li></ul></div>` +
            `<div class="kp-tabs"><div class="kp-tabs__list" role="tablist">` +
            `<button type="button" class="kp-tab" role="tab" id="${theme}-t0" aria-controls="${theme}-p0" aria-selected="true">Overzicht</button>` +
            `<button type="button" class="kp-tab" role="tab" id="${theme}-t1" aria-controls="${theme}-p1" aria-selected="false">Details</button></div>` +
            `<div class="kp-tabs__panel" role="tabpanel" id="${theme}-p0" aria-labelledby="${theme}-t0">Het eerste paneel.</div>` +
            `<div class="kp-tabs__panel" role="tabpanel" id="${theme}-p1" aria-labelledby="${theme}-t1" hidden>Het tweede paneel.</div></div>` +
            `<div class="kp-accordion"><details class="kp-accordion__item"><summary class="kp-accordion__summary">Een vraag</summary>` +
            `<div class="kp-accordion__body">Een antwoord.</div></details></div>` +
            `<div class="kp-toast" style="position: static; margin-top: 0.5rem;">Een toast, hier stilgezet om hem te kunnen bekijken.</div>`,
    },
    {
        id: 'wayfinding',
        title: 'Breadcrumb, pagination, progress, spinner, skeleton',
        note: 'The current page is never marked by colour alone; the spinner and the skeleton stop moving under reduced motion [TH35, DI4, DI7].',
        html: () =>
            `<nav class="kp-breadcrumb" aria-label="Kruimelpad"><ol><li><a href="#surfaces">Start</a></li>` +
            `<li><a href="#status">Sollicitaties</a></li><li><span aria-current="page">Detail</span></li></ol></nav>` +
            `<nav class="kp-pagination" aria-label="Paginering"><ul><li><a href="#surfaces">1</a></li>` +
            `<li><a href="#surfaces" aria-current="page">2</a></li><li><a href="#surfaces">3</a></li></ul></nav>` +
            `<progress class="kp-progress" value="40" max="100" aria-label="Voortgang"></progress>` +
            `<div class="sc-row"><span class="kp-spinner" role="status" aria-label="Bezig"></span>` +
            `<span aria-hidden="true"><span class="kp-skeleton" style="width: 12rem"></span></span></div>`,
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
        id: 'combobox',
        title: 'Combobox and tag input',
        note: 'Arrow down: the highlight moves and aria-activedescendant follows it. Type to filter — the count is announced [TH39, TH41].',
        html: (theme) =>
            `<div class="kp-combobox" data-kp-combobox>` +
            `<label class="kp-field__label" for="${theme}-fruit">Fruit</label>` +
            `<input class="kp-combobox__input" id="${theme}-fruit" type="text" role="combobox" autocomplete="off" ` +
            `aria-expanded="false" aria-controls="${theme}-fruit-list" placeholder="Kies of typ\u2026" />` +
            `<ul class="kp-combobox__list" id="${theme}-fruit-list" role="listbox" hidden>` +
            ['Appel', 'Banaan', 'Citroen', 'Druif']
                .map((f) => `<li class="kp-combobox__option" role="option" data-kp-option data-value="${f.toLowerCase()}">${f}</li>`)
                .join('') +
            `</ul><p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p></div>` +
            `<div class="kp-combobox" data-kp-combobox data-kp-tags>` +
            `<label class="kp-field__label" for="${theme}-labels">Labels</label>` +
            `<ul class="kp-tag-list" data-kp-tag-list></ul>` +
            `<input class="kp-combobox__input" id="${theme}-labels" type="text" role="combobox" autocomplete="off" ` +
            `aria-expanded="false" aria-controls="${theme}-labels-list" />` +
            `<ul class="kp-combobox__list" id="${theme}-labels-list" role="listbox" hidden>` +
            ['Urgent', 'Bug', 'Idee']
                .map((f) => `<li class="kp-combobox__option" role="option" data-kp-option data-value="${f.toLowerCase()}">${f}</li>`)
                .join('') +
            `</ul><p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p></div>`,
    },
    {
        id: 'datatable',
        title: 'DataTable',
        note: 'Sort a column, filter, page. At 320 px each row becomes a card carrying its column names [TH37].',
        html: (theme) =>
            `<div class="kp-datatable" data-kp-datatable data-kp-cards data-kp-page-size="3">` +
            `<div class="kp-datatable__bar"><input class="kp-datatable__search" type="search" data-kp-datatable-search ` +
            `aria-label="Zoeken in de tabel" placeholder="Zoeken\u2026" /></div>` +
            `<div class="kp-table-wrap"><table class="kp-table"><thead><tr>` +
            `<th scope="col"><input type="checkbox" data-kp-select-all aria-label="Alle zichtbare rijen selecteren" /></th>` +
            `<th scope="col" data-kp-sort="text">Klant</th><th scope="col" data-kp-sort="number">Bedrag</th>` +
            `<th scope="col" data-kp-sort="date">Datum</th></tr></thead><tbody>` +
            [
                ['Acme', '100', '2026-03-01'],
                ['Bakker', '20', '2026-01-12'],
                ['Cerise', '1.284,50', '2026-09-04'],
                ['Delta', '7', '2025-11-30'],
            ]
                .map(
                    ([klant, bedrag, datum], i) =>
                        `<tr data-kp-row-key="${theme}-${i}">` +
                        `<td data-label=""><input type="checkbox" data-kp-select-row aria-label="Rij ${klant} selecteren" /></td>` +
                        `<td data-label="Klant">${klant}</td><td data-label="Bedrag" class="kp-numeric">${bedrag}</td>` +
                        `<td data-label="Datum" class="kp-timestamp">${datum}</td></tr>`,
                )
                .join('') +
            `</tbody></table></div>` +
            `<div class="kp-empty" data-kp-datatable-empty hidden>Niets gevonden.</div>` +
            `<div class="kp-datatable__bar"><p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>` +
            `<div class="kp-datatable__pager" data-kp-datatable-pager></div></div></div>`,
    },
    {
        id: 'dates',
        title: 'Date picker',
        note: 'Type a date and the calendar never has to open. Or open it: arrows by day, PageUp/Down by month [TH43].',
        html: (theme) =>
            `<div class="kp-datepicker" data-kp-datepicker>` +
            `<div class="kp-field"><label class="kp-field__label" for="${theme}-van">Van</label>` +
            `<input class="kp-field__input" id="${theme}-van" type="text" inputmode="numeric" placeholder="dd-mm-jjjj" data-kp-date-input /></div>` +
            `<button type="button" class="kp-button kp-button--ghost" data-kp-date-open aria-label="Kalender openen">Kalender</button>` +
            `<div class="kp-datepicker__panel" data-kp-date-panel hidden></div></div>`,
    },
    {
        id: 'structure',
        title: 'Tree, reorder and split',
        note: 'All three are keyboard-first: arrows walk the tree, move an item, and resize the panes [TH45, TH46, TH55].',
        html: () =>
            `<ul class="kp-tree" role="tree" data-kp-tree>` +
            `<li role="treeitem" aria-expanded="false">Map een<ul role="group"><li role="treeitem">Kind een</li></ul></li>` +
            `<li role="treeitem">Zaak twee</li></ul>` +
            `<ul class="kp-reorder" data-kp-reorder>` +
            `<li data-kp-item="a"><button type="button" data-kp-handle aria-label="Verplaats A">\u283f</button> A</li>` +
            `<li data-kp-item="b"><button type="button" data-kp-handle aria-label="Verplaats B">\u283f</button> B</li></ul>` +
            `<div class="kp-split" data-kp-split><div class="kp-split__pane">Links</div>` +
            `<div class="kp-split__separator" role="separator" tabindex="0" aria-orientation="vertical" aria-valuemin="10" ` +
            `aria-valuemax="90" aria-valuenow="50" aria-label="Panelen verdelen"></div>` +
            `<div class="kp-split__pane">Rechts</div></div>`,
    },
    {
        id: 'patterns',
        title: 'Status, diff and copy',
        note: 'A health dot is never the only carrier; the diff sign has its own column so it survives without colour [TH52, TH53, TH54].',
        html: (theme) =>
            `<span class="kp-health" data-state="ok"><span class="kp-health__dot" aria-hidden="true"></span> In orde</span> ` +
            `<span class="kp-health" data-state="warn"><span class="kp-health__dot" aria-hidden="true"></span> Let op</span> ` +
            `<span class="kp-health" data-state="down"><span class="kp-health__dot" aria-hidden="true"></span> Onbereikbaar</span>` +
            `<ol class="kp-timeline">` +
            `<li class="kp-timeline__item"><span class="kp-timeline__marker" aria-hidden="true"></span>` +
            `<span><time class="kp-timeline__when">2026-09-04 14:07</time>Versie 1.1.0 uitgebracht</span></li>` +
            `<li class="kp-timeline__item"><span class="kp-timeline__marker" aria-hidden="true"></span>` +
            `<span><time class="kp-timeline__when">2026-09-04 12:27</time>Versie 1.0.0 uitgebracht</span></li></ol>` +
            `<span class="kp-copyable"><span class="kp-copyable__value" id="${theme}-token">a3f9-2b71</span>` +
            `<button type="button" class="kp-button kp-button--ghost kp-copyable__button" data-kp-copy="${theme}-token">Kopi\u00ebren</button></span>` +
            `<pre class="kp-diff">` +
            `<span class="kp-diff__line" data-kind="same"><span class="kp-diff__number">1</span><span class="kp-diff__sign"> </span><span>--background: 0 0% 100%;</span></span>` +
            `<span class="kp-diff__line" data-kind="removed"><span class="kp-diff__number">2</span><span class="kp-diff__sign">-</span><span>--primary: 220 90% 56%;</span></span>` +
            `<span class="kp-diff__line" data-kind="added"><span class="kp-diff__number">2</span><span class="kp-diff__sign">+</span><span>--primary: 220 90% 48%;</span></span>` +
            `</pre>`,
    },
    {
        id: 'colour',
        title: 'Colour picker',
        note: 'The number is the point: the same WCAG ratio the contrast gate uses, against THIS theme\u2019s background [TH57].',
        html: (theme) =>
            `<div class="kp-colorpicker" data-kp-colorpicker data-kp-against="--background">` +
            `<label class="kp-field__label" for="${theme}-ch">Tint</label>` +
            `<input id="${theme}-ch" type="range" data-kp-channel="h" min="0" max="360" value="220" />` +
            `<label class="kp-field__label" for="${theme}-cs">Verzadiging</label>` +
            `<input id="${theme}-cs" type="range" data-kp-channel="s" min="0" max="100" value="90" />` +
            `<label class="kp-field__label" for="${theme}-cl">Helderheid</label>` +
            `<input id="${theme}-cl" type="range" data-kp-channel="l" min="0" max="100" value="56" />` +
            `<span class="kp-colorpicker__swatch" data-kp-swatch aria-hidden="true"></span>` +
            `<output class="kp-colorpicker__value" data-kp-colorpicker-value></output>` +
            `<p class="kp-colorpicker__contrast" data-kp-colorpicker-contrast role="status" aria-live="polite"></p></div>`,
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
