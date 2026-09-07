// The ten example pages [TH98, TH99, TH109, AR19, AR23].
//
// One descriptor per page, and every page is a TREE rather than a string,
// because TH98 asks for each page in both channels. A string can only be
// framework-free; a tree is rendered twice — as the markup a server
// writes (renderHTML, below, which gates/generate-examples.mjs commits
// under examples/) and as React elements built from real components
// (showcase/examples-react.jsx). Ten pages written by hand in two
// channels would be twenty artefacts that drift apart on the first edit.
//
// The pages exist to prove the layout layer carries a real screen. They
// are built out of css/layout.css, css/utilities.css and the component
// classes and NOTHING ELSE: no page-local stylesheet, no style attribute
// (TH109), no per-page glue. That is the round's exit criterion for the
// layout layer, and it is checked by gates/check-inline-styles.mjs rather
// than promised here.
//
// A component node (a capitalised tag) is expanded here into the markup
// the React component renders, so both channels write the same class
// names and roles. That mirroring is not trusted either: the AR20
// comparison in tests/examples.spec.mjs walks both documents element by
// element and fails when an adapter drifts from its component.

import { getStrings } from '../js/strings.js';

/**
 * @typedef {{ tag: string, props: Record<string, any>, children: Child[] }} Node
 * @typedef {Node | string | number | null | undefined | false} Child
 */

/**
 * Build a node. Children are flattened, so a helper may return a list.
 *
 * @param {string} tag
 * @param {Record<string, any>} [props]
 * @param {...Child | Child[]} children
 * @returns {Node}
 */
export function el(tag, props = {}, ...children) {
    return { tag, props, children: flatten(children) };
}

/**
 * @param {Array<Child | Child[]>} children
 * @returns {Child[]}
 */
function flatten(children) {
    /** @type {Child[]} */
    const out = [];
    for (const child of children) {
        if (Array.isArray(child)) out.push(...flatten(child));
        else if (child !== null && child !== undefined && child !== false && child !== '') out.push(child);
    }
    return out;
}

/** @param {...(string | false | undefined | null)} parts */
const cx = (...parts) => parts.filter(Boolean).join(' ');

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'hr', 'img', 'input', 'link', 'meta', 'source', 'wbr']);

/** A tag that starts with a capital is a component, not an element. */
/** @param {string} tag */
export const isComponent = (tag) => /^[A-Z]/.test(tag);

const s = getStrings();

/** The alert label each flavour carries, from the dictionary [KT5]. */
const ALERT_LABEL = { success: s.alertSuccess, warning: s.alertWarning, info: s.alertInfo, destructive: s.alertError };

/**
 * What each component node becomes in the framework-free channel.
 *
 * Every one of these mirrors the class names and roles its React
 * counterpart writes — see the file it names. The React channel does not
 * use this table at all; it renders the component itself.
 *
 * @type {Record<string, (props: Record<string, any>, children: Child[]) => Child | Child[]>}
 */
const TO_MARKUP = {
    // components/nav-bar.jsx: the skip link first, then the wrapper the
    // narrow rule measures [TH104, AR24], then the nav. The skip link
    // stays outside the wrapper, as it does in the component: it is the
    // first focusable thing on the page and belongs to the page.
    NavBar: (p, kids) => [
        el('a', { class: 'kp-skip-link', href: p.skipTo ?? '#main' }, s.skipToContent),
        el(
            'div',
            { class: 'kp-nav-wrap' },
            el(
                'nav',
                { class: 'kp-nav', 'aria-label': s.mainNavigation },
                p.brand !== undefined ? el('span', { class: 'kp-nav__brand' }, p.brand) : null,
                el(
                    'ul',
                    { class: 'kp-nav__links' },
                    (p.links ?? []).map((/** @type {Record<string, any>} */ link) =>
                        el(
                            'li',
                            {},
                            el(
                                'a',
                                {
                                    class: 'kp-nav__link',
                                    href: link.href,
                                    'aria-current': link.current ? 'page' : undefined,
                                    // The register's hover glitch reads a copy of the label [TH117].
                                    'data-kp-text': typeof link.label === 'string' ? link.label : undefined,
                                    'aria-haspopup': Array.isArray(link.links) && link.links.length > 0 ? 'true' : undefined,
                                },
                                link.label,
                            ),
                            Array.isArray(link.links) && link.links.length > 0
                                ? el(
                                      'ul',
                                      { class: 'kp-nav__menu' },
                                      link.links.map((/** @type {Record<string, any>} */ child) =>
                                          el('li', {}, el('a', { href: child.href }, child.label)),
                                      ),
                                  )
                                : null,
                        ),
                    ),
                ),
                kids,
            ),
        ),
    ],

    // components/button.jsx.
    //
    // Every `data-` prop is forwarded rather than listed. The list was an
    // allowlist, and an allowlist drops in silence: the wizard example's
    // Back and Next asked for `data-kp-wizard-back` and
    // `data-kp-wizard-next`, neither was named here, and the buttons came
    // out bare -- so the page carried the wizard's own hooks and its two
    // controls carried nothing [2026-09-07]. `check-examples-wired.mjs`
    // now compares what a descriptor asks for against what it produces,
    // for every component, so the next allowlist says so instead.
    Button: (p, kids) =>
        el(
            'button',
            {
                ...Object.fromEntries(Object.entries(p).filter(([key]) => key.startsWith('data-'))),
                type: p.type ?? 'button',
                class: cx('kp-button', p.variant && p.variant !== 'default' ? `kp-button--${p.variant}` : undefined, p.class),
                'data-kp-destructive': p.variant === 'destructive' ? '' : undefined,
                'data-kp-confirm': p.confirm,
                'aria-busy': p['aria-busy'],
            },
            kids,
        ),

    // components/badge.jsx. No `status`: a coloured plate is written as an
    // inline style in the framework-free channel and TH109 forbids one on
    // these pages. Recorded as R5-BADGE in docs/MINI_ROUNDS.md.
    Badge: (p, kids) => el('span', { class: cx('kp-badge', p.class), 'data-example': p['data-example'] }, kids),

    // components/alert.jsx.
    Alert: (p, kids) =>
        el(
            'div',
            {
                class: cx('kp-alert', p.flavour ? `kp-alert--${p.flavour}` : undefined, p.class),
                role: p.flavour === 'destructive' ? 'alert' : 'status',
                'data-kp-semantic': p.flavour ? '' : undefined,
                'data-example': p['data-example'],
            },
            el(
                'span',
                { class: 'kp-alert__body' },
                p.flavour ? el('span', { class: 'kp-alert__label' }, `${ALERT_LABEL[/** @type {keyof typeof ALERT_LABEL} */ (p.flavour)]}: `) : null,
                kids,
            ),
        ),

    // components/card.jsx.
    Card: (p, kids) =>
        el(
            'div',
            {
                class: cx('kp-card', p.class),
                'data-slot': 'card',
                // Every `data-` prop is forwarded, as the Button renderer does:
                // the concept dossier carries data-kp-reveal and data-kp-label.
                ...Object.fromEntries(Object.entries(p).filter(([key]) => key.startsWith('data-'))),
            },
            p.title !== undefined || p.actions !== undefined
                ? el(
                      'div',
                      { class: 'kp-card__header' },
                      p.title !== undefined ? el(`h${p.headingLevel ?? 3}`, { class: 'kp-card__title' }, p.title) : null,
                      p.actions !== undefined ? el('div', { class: 'kp-card__actions' }, p.actions) : null,
                  )
                : null,
            el('div', { class: 'kp-card__body' }, kids),
            p.footer !== undefined ? el('div', { class: 'kp-card__footer' }, p.footer) : null,
        ),

    // components/field.jsx. The id is given rather than generated: React
    // would use useId() and the two channels would disagree on a value
    // that is not the point.
    Field: (p) => {
        const helpId = `${p.id}-help`;
        const errorId = `${p.id}-error`;
        const described = [p.help !== undefined && helpId, p.error !== undefined && errorId].filter(Boolean).join(' ') || undefined;
        return el(
            'div',
            { class: cx('kp-field', p.error !== undefined ? 'kp-field--invalid' : undefined, p.class) },
            el(
                'label',
                { class: 'kp-field__label', for: p.id },
                p.label,
                p.required ? el('span', { class: 'kp-field__required' }, s.formRequired) : null,
            ),
            el('input', {
                id: p.id,
                class: 'kp-field__input',
                type: p.type ?? 'text',
                name: p.name,
                value: p.value,
                placeholder: p.placeholder,
                autocomplete: p.autocomplete,
                'aria-describedby': described,
                'aria-invalid': p.error !== undefined ? 'true' : undefined,
                required: p.required ? '' : undefined,
            }),
            p.help !== undefined ? el('span', { class: 'kp-field__help', id: helpId }, p.help) : null,
            p.error !== undefined ? el('span', { class: 'kp-field__error', id: errorId }, p.error) : null,
        );
    },

    // components/table.jsx, with the scrolling wrapper it defaults to.
    Table: (p) => {
        /** @param {any} column */
        const spec = (column) => (typeof column === 'string' ? { label: column } : column);
        return el(
            'div',
            { class: 'kp-table-wrap' },
            el(
                'table',
                { class: 'kp-table' },
                p.caption !== undefined ? el('caption', {}, p.caption) : null,
                el(
                    'thead',
                    {},
                    el(
                        'tr',
                        {},
                        p.columns.map((/** @type {any} */ column) => el('th', { scope: 'col', class: spec(column).className }, spec(column).label)),
                    ),
                ),
                el(
                    'tbody',
                    {},
                    p.rows.map((/** @type {any[]} */ row) =>
                        el(
                            'tr',
                            {},
                            row.map((cell, index) => el('td', { class: spec(p.columns[index]).className }, cell)),
                        ),
                    ),
                ),
            ),
        );
    },
};

/**
 * Turn a tree into plain-element nodes: every component node replaced by
 * the markup its React counterpart renders.
 *
 * @param {Child[]} children
 * @returns {Child[]}
 */
export function expand(children) {
    /** @type {Child[]} */
    const out = [];
    for (const child of children) {
        if (child === null || child === undefined || child === false) continue;
        if (typeof child === 'string' || typeof child === 'number') {
            out.push(child);
            continue;
        }
        if (isComponent(child.tag)) {
            const build = TO_MARKUP[child.tag];
            if (!build) throw new Error(`No framework-free markup for <${child.tag}>`);
            out.push(...expand(flatten([build(child.props, child.children)])));
            continue;
        }
        out.push({ tag: child.tag, props: child.props, children: expand(child.children) });
    }
    return out;
}

/** @param {string} value */
const escapeText = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/** @param {string} value */
const escapeAttr = (value) => escapeText(value).replaceAll('"', '&quot;');

/**
 * Render expanded nodes as HTML.
 *
 * @param {Child[]} children
 * @param {number} [indent]
 * @returns {string}
 */
export function renderHTML(children, indent = 0) {
    const pad = ' '.repeat(indent);
    /** @type {string[]} */
    const lines = [];
    for (const child of expand(children)) {
        if (child === null || child === undefined || child === false) continue;
        if (typeof child === 'string' || typeof child === 'number') {
            lines.push(`${pad}${escapeText(String(child))}`);
            continue;
        }
        /** @type {string[]} */
        const attrs = [];
        for (const [key, value] of Object.entries(child.props)) {
            if (value === undefined || value === null || value === false) continue;
            attrs.push(value === '' ? ` ${key}` : ` ${key}="${escapeAttr(String(value))}"`);
        }
        const open = `<${child.tag}${attrs.join('')}>`;
        if (VOID_TAGS.has(child.tag)) {
            lines.push(`${pad}${open}`);
            continue;
        }
        const inner = renderHTML(child.children, indent + 4);
        if (inner === '') lines.push(`${pad}${open}</${child.tag}>`);
        else if (child.children.length === 1 && typeof child.children[0] !== 'object') lines.push(`${pad}${open}${inner.trim()}</${child.tag}>`);
        else lines.push(`${pad}${open}\n${inner}\n${pad}</${child.tag}>`);
    }
    return lines.join('\n');
}

// ── The pages ───────────────────────────────────────────────────────────
//
// The copy is example copy: the words on a demonstration screen, not the
// package's own interface text. Everything the PACKAGE renders — the skip
// link, the nav's accessible name, an alert's flavour label, the word
// "required" — comes from js/strings.js above (KT5).

const LINKS = [
    { href: '#overview', label: 'Overview', current: true },
    { href: '#invoices', label: 'Invoices' },
    { href: '#reports', label: 'Reports' },
    { href: '#settings', label: 'Settings' },
];

/**
 * The page chassis every example shares: the nav, the skip target and one
 * stack to hang the blocks off.
 *
 * @param {{links?: Array<Record<string, any>>, navChildren?: Child[]}} options
 * @param {...Child | Child[]} blocks
 * @returns {Child[]}
 */
function shell({ links = LINKS, navChildren = [] }, ...blocks) {
    return [
        el('NavBar', { brand: 'Northwind', links }, navChildren),
        el('main', { id: 'main', class: 'kp-page', tabindex: '-1' }, el('div', { class: 'kp-stack' }, flatten(blocks))),
    ];
}

/** A 70-character value with no place to break — the chassis-rs shape. */
const LONG_VALUE = 'f3a9c1e7b25d48a06c9f1e3b7d5a2c8046e1b9f3a7c5d2e80b41f6a3c9d7e2504a71c6';

/**
 * @typedef {object} Example
 * @property {string} id
 * @property {string} title
 * @property {string} note      one line: what this page is here to show
 * @property {string[]} probes  selectors both channels must render
 * @property {Child[]} body
 */

/** @type {Example[]} */
export const EXAMPLES = [
    {
        id: 'app-shell',
        title: 'Application shell',
        note: 'A navigation bar, a side column that drops below when the room runs out, and a grid of tiles that picks its own column count.',
        probes: ['.kp-sidebar', '.kp-autogrid', '[popovertarget="user-menu"]'],
        body: shell(
            {
                navChildren: [
                    el(
                        'div',
                        { class: 'kp-mx-auto' },
                        el(
                            'button',
                            {
                                type: 'button',
                                class: 'kp-button kp-button--ghost',
                                popovertarget: 'user-menu',
                                style: 'anchor-name: --user-menu',
                            },
                            'Ada Lovelace',
                        ),
                        el(
                            'div',
                            { popover: 'auto', id: 'user-menu', class: 'kp-popover', style: 'position-anchor: --user-menu' },
                            el(
                                'ul',
                                { class: 'kp-menu' },
                                el('li', {}, el('button', { type: 'button', class: 'kp-menu__item' }, 'Profile')),
                                el('li', {}, el('button', { type: 'button', class: 'kp-menu__item' }, 'Sign out')),
                            ),
                        ),
                    ),
                ],
            },
            el('h1', {}, 'Overview'),
            el(
                'p',
                { class: 'kp-text-muted kp-prose' },
                'Everything on this page is laid out by the package: no page stylesheet, no style attribute except the two the popover anchor needs.',
            ),
            el(
                'div',
                { class: 'kp-sidebar' },
                el(
                    'aside',
                    { class: 'kp-sidebar__aside' },
                    el(
                        'Card',
                        { title: 'Sections' },
                        el(
                            'ul',
                            { class: 'kp-stack kp-gap-xs' },
                            el('li', {}, el('a', { href: '#overview' }, 'Overview')),
                            el('li', {}, el('a', { href: '#invoices' }, 'Invoices')),
                            el('li', {}, el('a', { href: '#reports' }, 'Reports')),
                        ),
                    ),
                ),
                el(
                    'div',
                    { class: 'kp-sidebar__main' },
                    el(
                        'div',
                        { class: 'kp-autogrid' },
                        el('Card', { title: 'Open invoices' }, el('p', { class: 'kp-mono' }, '128')),
                        el('Card', { title: 'Overdue' }, el('p', { class: 'kp-mono' }, '7')),
                        el('Card', { title: 'Paid this month' }, el('p', { class: 'kp-mono' }, '1284')),
                    ),
                ),
            ),
            el(
                'section',
                { class: 'kp-section kp-stack' },
                el('h2', {}, 'Latest activity'),
                el('Table', {
                    columns: ['When', 'What', 'Who'],
                    rows: [
                        ['09:14', 'Invoice 2026-0114 sent', 'Ada'],
                        ['08:02', 'Report generated', 'System'],
                    ],
                }),
            ),
        ),
    },
    {
        id: 'login',
        title: 'Sign in',
        note: 'A capped, centred column: the one-column form the layout layer exists to stop people hand-rolling.',
        probes: ['.kp-center', 'form.kp-stack', '.kp-alert'],
        body: shell(
            {},
            el(
                'div',
                { class: 'kp-center kp-stack' },
                el('h1', {}, 'Sign in'),
                el('Alert', { flavour: 'info' }, 'Your session expired. Sign in again to pick up where you left off.'),
                el(
                    'form',
                    { class: 'kp-stack' },
                    el('Field', { id: 'login-email', label: 'Email', type: 'email', autocomplete: 'username', required: true }),
                    el('Field', {
                        id: 'login-password',
                        label: 'Password',
                        type: 'password',
                        autocomplete: 'current-password',
                        required: true,
                        help: 'At least twelve characters.',
                    }),
                    el(
                        'div',
                        { class: 'kp-field kp-field--check' },
                        el('input', { class: 'kp-field__check', id: 'login-remember', type: 'checkbox' }),
                        el('label', { class: 'kp-field__label', for: 'login-remember' }, 'Keep me signed in'),
                    ),
                    el('Button', { variant: 'primary', type: 'submit', class: 'kp-w-full' }, 'Sign in'),
                ),
                el('p', { class: 'kp-text-muted' }, el('a', { href: '#reset' }, 'Forgotten your password?')),
            ),
        ),
    },
    {
        id: 'list-with-form',
        title: 'List with a filter form',
        note: 'The two shapes the chassis-rs report named: two fields with a button on one row, and a table cell holding a 70-character value.',
        probes: ['[data-example="filter-row"]', '[data-example="long-cell"]', '.kp-table-wrap'],
        body: shell(
            {},
            el('h1', {}, 'Invoices'),
            el(
                'form',
                { class: 'kp-row kp-row--end', 'data-example': 'filter-row' },
                el('Field', { id: 'filter-customer', label: 'Customer', placeholder: 'Any' }),
                el('Field', { id: 'filter-reference', label: 'Reference', placeholder: 'Any' }),
                el('Button', { variant: 'primary', type: 'submit' }, 'Filter'),
            ),
            el(
                'div',
                { class: 'kp-row kp-row--between' },
                el('p', { class: 'kp-text-muted' }, '3 invoices'),
                el('Button', { variant: 'ghost' }, 'Export'),
            ),
            el('Table', {
                columns: [
                    { label: 'Reference' },
                    { label: 'Customer' },
                    // MR-W4-1, Kenny's answer of 2026-09-07: the badge is not
                    // wrong, this column was too narrow. AR32's
                    // `overflow-wrap: anywhere` is what keeps a long value off
                    // the page's own scrollbar, and it breaks a word to do it
                    // -- measured here as `Overd` / `ue` inside the pill at
                    // 1100px. The repair is the column, not the component.
                    { label: 'Status', className: 'kp-text-nowrap' },
                    { label: 'Amount', className: 'kp-text-end kp-text-nowrap' },
                ],
                rows: [
                    [
                        el('code', { class: 'kp-mono', 'data-example': 'long-cell' }, LONG_VALUE),
                        'Acme Industrial Supplies Europe BV',
                        el('Badge', {}, 'Paid'),
                        '1 284,50',
                    ],
                    ['INV-2026-0114', 'Northwind Traders', el('Badge', {}, 'Sent'), '842,00'],
                    ['INV-2026-0115', 'Contoso', el('Badge', {}, 'Overdue'), '96,25'],
                ],
            }),
        ),
    },
    {
        id: 'settings',
        title: 'Settings',
        note: 'A side column of sections beside stacked cards, and a destructive action that carries its way back [DI10].',
        probes: ['.kp-sidebar__aside', '[data-example="danger"]', '[data-kp-confirm]'],
        body: shell(
            {},
            el('h1', {}, 'Settings'),
            el(
                'div',
                { class: 'kp-sidebar' },
                el(
                    'aside',
                    { class: 'kp-sidebar__aside' },
                    el(
                        'ul',
                        { class: 'kp-stack kp-gap-xs' },
                        el('li', {}, el('a', { href: '#profile' }, 'Profile')),
                        el('li', {}, el('a', { href: '#notifications' }, 'Notifications')),
                        el('li', {}, el('a', { href: '#danger' }, 'Danger zone')),
                    ),
                ),
                el(
                    'div',
                    { class: 'kp-sidebar__main kp-stack' },
                    el(
                        'Card',
                        { title: 'Profile' },
                        el(
                            'form',
                            { class: 'kp-stack' },
                            el('Field', { id: 'settings-name', label: 'Name', value: 'Ada Lovelace' }),
                            el('Field', { id: 'settings-email', label: 'Email', type: 'email', value: 'ada@example.org' }),
                            el('div', { class: 'kp-row kp-row--end' }, el('Button', { variant: 'primary', type: 'submit' }, 'Save')),
                        ),
                    ),
                    el(
                        'Card',
                        { title: 'Notifications' },
                        el(
                            'div',
                            { class: 'kp-stack' },
                            el(
                                'div',
                                { class: 'kp-field kp-field--check' },
                                el('input', { class: 'kp-field__check', id: 'settings-weekly', type: 'checkbox', checked: '' }),
                                el('label', { class: 'kp-field__label', for: 'settings-weekly' }, 'A weekly summary'),
                            ),
                            el(
                                'div',
                                { class: 'kp-field kp-field--check' },
                                el('input', { class: 'kp-field__check', id: 'settings-overdue', type: 'checkbox' }),
                                el('label', { class: 'kp-field__label', for: 'settings-overdue' }, 'Every overdue invoice'),
                            ),
                        ),
                    ),
                    el(
                        'Card',
                        { title: 'Danger zone', 'data-example': 'danger' },
                        el(
                            'div',
                            { class: 'kp-stack' },
                            el('p', {}, 'Closing the workspace removes every invoice in it. There is no way back once it is gone.'),
                            el(
                                'div',
                                { class: 'kp-row kp-row--end' },
                                el('Button', { variant: 'destructive', confirm: 'Really close it?' }, 'Close the workspace'),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    },
    {
        id: 'wizard',
        title: 'Wizard',
        note: 'Three steps, the current one named in words as well as in colour, and the two controls that move between them.',
        // The probes name what must be IN the markup, so they name the
        // hooks the module attaches to rather than `aria-current`, which
        // js/wizard.js writes at runtime.
        probes: ['[data-kp-wizard]', '[data-kp-step]', '[data-kp-wizard-next]'],
        body: shell(
            {},
            el('h1', {}, 'New project'),
            // This page drew a wizard without being one until 2026-09-07:
            // three badges, a form, and a `type="submit"` button labelled
            // Next. Pressing it submitted the form and reloaded the page --
            // a white flash and back to the start, which is what Kenny saw
            // on the published site. `js/auto.js` imports attachWizards and
            // there was nothing here for it to attach to. The markup below
            // is the shape js/wizard.js documents, so the page now is the
            // thing it shows.
            el(
                'div',
                { class: 'kp-wizard', 'data-kp-wizard': '', 'data-example': 'steps' },
                el(
                    'ol',
                    { class: 'kp-wizard__steps', 'data-kp-wizard-steps': '' },
                    el('li', { 'data-kp-step-label': '' }, 'Basics'),
                    el('li', { 'data-kp-step-label': '' }, 'Team'),
                    el('li', { 'data-kp-step-label': '' }, 'Review'),
                ),
                el(
                    'section',
                    { 'data-kp-step': '' },
                    el(
                        'Card',
                        { title: 'Basics' },
                        el('div', { class: 'kp-stack' }, el('Field', { id: 'wizard-name', label: 'Project name', value: 'Analytical Engine' })),
                    ),
                ),
                el(
                    'section',
                    { 'data-kp-step': '', hidden: true },
                    el(
                        'Card',
                        { title: 'Team' },
                        el(
                            'div',
                            { class: 'kp-stack' },
                            el('p', { class: 'kp-text-muted kp-prose' }, 'Everyone here can see the project. You can change this afterwards.'),
                            el('Field', { id: 'wizard-owner', label: 'Owner', value: 'Ada Lovelace' }),
                            el('Field', { id: 'wizard-invite', label: 'Invite by email', type: 'email', help: 'One address per line.' }),
                        ),
                    ),
                ),
                el(
                    'section',
                    { 'data-kp-step': '', hidden: true },
                    el(
                        'Card',
                        { title: 'Review' },
                        el('p', { class: 'kp-text-muted kp-prose' }, 'Nothing is created until you press Finish on this step.'),
                    ),
                ),
                el(
                    'div',
                    { class: 'kp-wizard__actions kp-row kp-row--between' },
                    el('Button', { type: 'button', 'data-kp-wizard-back': '' }, 'Back'),
                    el('Button', { variant: 'primary', type: 'button', 'data-kp-wizard-next': '' }, 'Next'),
                ),
            ),
        ),
    },
    {
        id: 'empty-and-error',
        title: 'Empty and error states',
        note: 'The two screens every list needs and nobody designs: nothing here yet, and something went wrong.',
        probes: ['[data-example="empty"]', '[data-example="error"]', '.kp-alert--destructive'],
        body: shell(
            {},
            el('h1', {}, 'Reports'),
            el(
                'section',
                { class: 'kp-section kp-stack kp-center kp-text-center', 'data-example': 'empty' },
                el('h2', {}, 'No reports yet'),
                el('p', { class: 'kp-text-muted' }, 'A report appears here as soon as a month has been closed.'),
                el('div', { class: 'kp-row kp-justify-center' }, el('Button', { variant: 'primary' }, 'Close this month')),
            ),
            el(
                'section',
                { class: 'kp-section kp-stack', 'data-example': 'error' },
                el('h2', {}, 'Last attempt'),
                el('Alert', { flavour: 'destructive' }, 'The report could not be built: the ledger service did not answer.'),
                el('div', { class: 'kp-row' }, el('Button', {}, 'Try again'), el('Button', { variant: 'ghost' }, 'Show the log')),
            ),
        ),
    },
    {
        id: 'hero',
        title: 'Hero',
        note: 'A marketing header: a balanced headline, a measure that stops before the page edge, and a row of calls to action that wraps.',
        probes: ['[data-example="hero"]', '.kp-text-balance', '.kp-autogrid'],
        body: shell(
            {},
            el(
                'section',
                { class: 'kp-section kp-stack kp-text-center', 'data-example': 'hero' },
                el('h1', { class: 'kp-text-balance' }, 'Invoices that look like the rest of your software'),
                el(
                    'p',
                    { class: 'kp-prose kp-mx-auto kp-text-muted' },
                    'One set of tokens, twenty-four themes, and the same components in every application you run. Nothing to configure on day one.',
                ),
                el(
                    'div',
                    { class: 'kp-row kp-justify-center' },
                    el('Button', { variant: 'primary' }, 'Start now'),
                    el('Button', { variant: 'ghost' }, 'Read the guide'),
                ),
            ),
            el(
                'section',
                { class: 'kp-section kp-stack' },
                el('h2', { class: 'kp-text-center' }, 'What you get'),
                el(
                    'div',
                    { class: 'kp-autogrid' },
                    el('Card', { title: 'Themes' }, el('p', {}, 'Twenty-four palettes that all clear WCAG AA, gated on every commit.')),
                    el('Card', { title: 'Components' }, el('p', {}, 'The same behaviour in React and in plain markup a server writes.')),
                    el('Card', { title: 'Layout' }, el('p', {}, 'Sixteen classes and a utility API, so a page needs no stylesheet of its own.')),
                ),
            ),
        ),
    },
    {
        id: 'pricing-and-testimonials',
        title: 'Pricing and testimonials',
        note: 'Cards of unequal length in one grid, and quotations that stay readable at every width.',
        probes: ['[data-example="pricing"]', 'blockquote', '.kp-card__footer'],
        body: shell(
            {},
            el('h1', { class: 'kp-text-center' }, 'Pricing'),
            el(
                'div',
                { class: 'kp-autogrid', 'data-example': 'pricing' },
                el(
                    'Card',
                    { title: 'Solo', footer: el('Button', { class: 'kp-w-full' }, 'Choose Solo') },
                    el(
                        'div',
                        { class: 'kp-stack' },
                        el('p', { class: 'kp-mono' }, '€ 0 / month'),
                        el(
                            'ul',
                            { class: 'kp-stack kp-gap-xs' },
                            el('li', {}, 'One workspace'),
                            el('li', {}, 'Fifty invoices a month'),
                            el('li', {}, 'Community support'),
                        ),
                    ),
                ),
                el(
                    'Card',
                    { title: 'Team', footer: el('Button', { variant: 'primary', class: 'kp-w-full' }, 'Choose Team') },
                    el(
                        'div',
                        { class: 'kp-stack' },
                        el('p', { class: 'kp-mono' }, '€ 24 / month'),
                        el(
                            'ul',
                            { class: 'kp-stack kp-gap-xs' },
                            el('li', {}, 'Ten workspaces'),
                            el('li', {}, 'Unlimited invoices'),
                            el('li', {}, 'Email support inside a working day'),
                            el('li', {}, 'Export to the ledger'),
                        ),
                    ),
                ),
                el(
                    'Card',
                    { title: 'Company', footer: el('Button', { class: 'kp-w-full' }, 'Talk to us') },
                    el(
                        'div',
                        { class: 'kp-stack' },
                        el('p', { class: 'kp-mono' }, 'On request'),
                        el('ul', { class: 'kp-stack kp-gap-xs' }, el('li', {}, 'Everything in Team'), el('li', {}, 'Single sign-on')),
                    ),
                ),
            ),
            el(
                'section',
                { class: 'kp-section kp-stack' },
                el('h2', { class: 'kp-text-center' }, 'What people say'),
                el(
                    'div',
                    { class: 'kp-autogrid' },
                    el(
                        'Card',
                        {},
                        el(
                            'blockquote',
                            { class: 'kp-prose' },
                            el('p', {}, 'We deleted seventy lines of layout glue the week we moved over, and the pages stopped drifting apart.'),
                            el('footer', { class: 'kp-text-muted' }, 'Maintainer, chassis-rs'),
                        ),
                    ),
                    el(
                        'Card',
                        {},
                        el(
                            'blockquote',
                            { class: 'kp-prose' },
                            el('p', {}, 'The theme picker was the part I expected to fight. It took an afternoon, including the dark variants.'),
                            el('footer', { class: 'kp-text-muted' }, 'Maintainer, JobTracker'),
                        ),
                    ),
                ),
            ),
        ),
    },
    {
        id: 'article',
        title: 'Article',
        note: 'Running text at a readable measure, with the two things that break a page: a long unbroken key and a wide table.',
        probes: ['article.kp-prose', '.kp-code-block', '.kp-table-wrap'],
        body: shell(
            {},
            el(
                'article',
                { class: 'kp-prose' },
                el('h1', {}, 'Why a shared theme package'),
                el('p', { class: 'kp-text-muted' }, 'Ada Lovelace · 6 September 2026 · 4 minutes'),
                el(
                    'p',
                    {},
                    'Four applications, four copies of the same palette, and four places to fix a colour that was wrong in all of them. That is where this package started.',
                ),
                el('h2', {}, 'One source, many consumers'),
                el(
                    'p',
                    {},
                    'A released version of a theme never changes. Any change to a theme raises the version, so a consumer that pins a version knows exactly what it is looking at.',
                ),
                el(
                    'ul',
                    {},
                    el('li', {}, 'Tokens, generated from one source per theme.'),
                    el('li', {}, 'Components, in two channels that behave the same.'),
                    el('li', {}, 'A layout layer, so a page needs no stylesheet of its own.'),
                ),
                el('blockquote', {}, el('p', {}, 'A gate slow enough to be worked around is not a gate.')),
                el('h2', {}, 'Pinning a version'),
                el('p', {}, 'The integrity value is the thing to copy, and it is long enough to break a page that does not expect it:'),
                el('pre', { class: 'kp-code-block' }, LONG_VALUE),
                el('h2', {}, 'What ships'),
                el('Table', {
                    columns: ['File', 'What it is'],
                    rows: [
                        ['css/themes.css', 'Every theme as custom properties'],
                        ['css/components.css', 'The component classes'],
                        ['css/layout.css', 'The layout layer'],
                        ['css/utilities.css', 'The generated utility API'],
                    ],
                }),
                el('p', {}, 'Copy the ones you need; the checksum file covers all of them.'),
            ),
        ),
    },
    {
        id: 'profile',
        title: 'Profile',
        note: 'A person beside their details: the side column carries the identity, the main column the facts and a form.',
        probes: ['[data-example="identity"]', '.kp-sidebar__main', '.kp-table'],
        body: shell(
            {},
            el('h1', {}, 'Ada Lovelace'),
            el(
                'div',
                { class: 'kp-sidebar' },
                el(
                    'aside',
                    { class: 'kp-sidebar__aside' },
                    el(
                        'Card',
                        { title: 'Ada Lovelace', 'data-example': 'identity' },
                        el(
                            'div',
                            { class: 'kp-stack' },
                            el('p', { class: 'kp-text-muted' }, 'Administrator · Amsterdam'),
                            el('div', { class: 'kp-row kp-gap-xs' }, el('Badge', {}, 'Administrator'), el('Badge', {}, 'Two-factor on')),
                            el('Button', { class: 'kp-w-full' }, 'Send a message'),
                        ),
                    ),
                ),
                el(
                    'div',
                    { class: 'kp-sidebar__main kp-stack' },
                    el(
                        'Card',
                        { title: 'Details' },
                        el('Table', {
                            columns: ['Field', 'Value'],
                            rows: [
                                ['Email', 'ada@example.org'],
                                ['Team', 'Ledger'],
                                ['Member since', '4 September 2026'],
                            ],
                        }),
                    ),
                    el(
                        'Card',
                        { title: 'Recent activity' },
                        el(
                            'ul',
                            { class: 'kp-stack kp-gap-xs' },
                            el('li', {}, 'Sent invoice 2026-0114'),
                            el('li', {}, 'Closed August'),
                            el('li', {}, 'Invited two people'),
                        ),
                    ),
                    el(
                        'Card',
                        { title: 'Change the display name' },
                        el(
                            'form',
                            { class: 'kp-row kp-row--end' },
                            el('Field', { id: 'profile-name', label: 'Display name', value: 'Ada Lovelace' }),
                            el('Button', { variant: 'primary', type: 'submit' }, 'Save'),
                        ),
                    ),
                ),
            ),
        ),
    },
    {
        // The concept demo [TH126, S46, AR42]: the standard page every new
        // theme is tried on before a token is written. It carries no
        // theme-specific markup — only the hooks of S45 — so the same
        // descriptor is the demo for cyberpunk today and for synthwave
        // next, and a theme that answers quietly shows exactly what quiet
        // means. `?theme=<name>` picks the theme for one load (js/auto.js).
        id: 'concept',
        title: 'Concept demo',
        note: 'The page every new theme is tried on: a navbar with a dropdown, a hero with a headline and an emphasised lede, a section rule, a form, a dossier card and a footer — written as meaning, answered by the theme.',
        probes: ['[data-kp-surface="hero"]', '[data-kp-reveal="headline"]', '[data-kp-surface="app"]'],
        body: shell(
            {
                links: [
                    { href: '#main', label: 'Signal', current: true },
                    {
                        href: '#dossier',
                        label: 'Dossier',
                        // A dropdown, so the navbar hook has something to open [TH117].
                        links: [
                            { href: '#dossier', label: 'Open files' },
                            { href: '#contact', label: 'Request access' },
                        ],
                    },
                    { href: '#contact', label: 'Contact' },
                ],
            },
            el(
                'section',
                { class: 'kp-section kp-stack', 'data-kp-surface': 'hero', 'data-example': 'concept-hero' },
                el('p', { class: 'kp-text-muted' }, 'Concept demo'),
                el('h1', { class: 'kp-text-balance', 'data-kp-reveal': 'headline' }, 'Meaning in the markup, expression in the theme'),
                el(
                    'p',
                    { class: 'kp-prose kp-text-muted' },
                    'One page, twenty-four answers. The theme decides what a headline does when it arrives, what an emphasis ',
                    el('mark', {}, 'looks like'),
                    ' and how a section ',
                    el('mark', {}, 'ends'),
                    ' — and the HTML never changes.',
                ),
                el(
                    'div',
                    { class: 'kp-row' },
                    el('Button', { variant: 'primary', 'data-kp-reveal': 'emphasis' }, 'Open the dossier'),
                    el('Button', { variant: 'ghost' }, 'Read the guide'),
                ),
            ),
            el('div', { 'data-kp-divider': '' }),
            el(
                'section',
                { class: 'kp-section kp-stack', 'data-kp-surface': 'app', id: 'contact', 'data-example': 'concept-app' },
                el('h2', { 'data-kp-reveal': 'rule' }, 'Leave a signal'),
                el(
                    'form',
                    { class: 'kp-form kp-stack', 'data-kp-form': '' },
                    el('Field', { id: 'concept-handle', label: 'Handle', name: 'handle', required: true, autocomplete: 'username' }),
                    el('Field', { id: 'concept-freq', label: 'Frequency', name: 'frequency', help: 'In megahertz.', placeholder: '101.9' }),
                    el(
                        'div',
                        { class: 'kp-row' },
                        el('Button', { type: 'submit', variant: 'primary' }, 'Transmit'),
                        el('Button', { variant: 'ghost', type: 'reset' }, 'Clear'),
                    ),
                ),
                el(
                    'div',
                    { class: 'kp-autogrid', id: 'dossier' },
                    el(
                        'Card',
                        { title: 'Dossier 07', 'data-kp-reveal': 'emphasis', 'data-kp-label': s.classified, 'data-example': 'concept-dossier' },
                        el(
                            'p',
                            {},
                            'Subject last seen at ',
                            el('mark', {}, 'the Afterlife'),
                            ', carrying a ',
                            el('mark', {}, 'shard of unknown origin'),
                            '. Status: ',
                            el('mark', {}, 'active'),
                            '.',
                        ),
                        el('Button', { variant: 'ghost', 'data-kp-reveal-trigger': '' }, 'Declassify'),
                    ),
                    el(
                        'Card',
                        { title: 'What this page proves' },
                        el('p', {}, 'Every element here is a hook or a component. Nothing on it belongs to one theme.'),
                    ),
                ),
            ),
            el('div', { 'data-kp-divider': '' }),
            el(
                'footer',
                { class: 'kp-footer' },
                el('p', { class: 'kp-text-muted' }, 'kp-themes — the concept demo. The same page under every theme.'),
            ),
        ),
    },
];

/**
 * Where a `style` attribute is allowed, and why [TH109].
 *
 * The list is deliberately about PROPERTIES rather than pages: an
 * exception that says "this page may have inline styles" stops being an
 * exception the moment somebody adds a second one. Every entry names the
 * page, the properties and the reason.
 */
export const INLINE_STYLE_EXCEPTIONS = [
    {
        page: 'app-shell',
        properties: ['anchor-name', 'position-anchor'],
        why:
            'CSS anchor positioning ties a popover to its trigger by NAME, and the name has to be unique per instance. ' +
            'A class cannot carry it: two menus on one page sharing a class would share an anchor name and the second ' +
            'popover would position itself against the first trigger. The package generates the pair itself wherever it ' +
            'writes the markup (js/theme-picker.js); a consumer writing the markup by hand has to write these two lines.',
    },
];
