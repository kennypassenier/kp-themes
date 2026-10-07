// research/families-applied: what the family picks DO (Kenny, 2026-10-07
// 01:32, after the families verdicts: "toon al eens wat je met deze
// bevindingen kan doen vooraleer ik verder ga").
//
// Per theme and family, the picture Kenny picked (one component's) is
// translated onto every other component of the theme, the way the anodising
// bath was translated onto every titanium loading element
// (research/titanium-loading). Each component is shown twice, side by side:
// "Today", its own decided pick, embedded exactly as research/families does
// (`../character-<c>/demo.html?embed=<aspect>&theme=<theme>`), and "Speaking
// the family", the same embed with this folder's sheets for the theme
// injected (base.css and <theme>.css) and its parts marked by speak.js. The
// character demos and css/ are not touched.
//
// A review-kit demo in aspect mode: per theme one step per family, one
// option, "Apply to the package" (↑), or None of these with a note (↓).
import { THEMES } from '../../js/theme-registry.js';
import { THEMES_HERE, REJECTED, PICTURES, WHERE, CANNOT } from './pictures.js';
import { speak, SIMULATE } from './speak.js';

/** The character demos, with the name a card shows. */
const COMPONENTS = [
    { id: 'meter', label: 'Meter' },
    { id: 'chart', label: 'Time chart' },
    { id: 'calendar', label: 'Month heatmap' },
    { id: 'graph', label: 'Network graph' },
    { id: 'trend', label: 'Trend tile' },
    { id: 'columns', label: 'Key-figure strip' },
    { id: 'tiles', label: 'Dashboard tiles' },
    { id: 'kpi', label: 'Key figure' },
    { id: 'menu', label: 'Menu button' },
    { id: 'state', label: 'State word' },
    { id: 'header', label: 'Page header' },
    { id: 'busy', label: 'Busy table' },
    { id: 'drawer', label: 'Drawer and tour' },
];
const LABEL_OF = Object.fromEntries(COMPONENTS.map((c) => [c.id, c.label]));

/**
 * The families: per component, the embed that shows it in the family's
 * moment. `aspects` are the components' own aspects for the family (the same
 * table as research/families); `extra` are components without one that can
 * still take the picture, embedded in another aspect that shows the moment
 * (`point` plays the pointer, `loop` presses the demo's buttons again,
 * `simulate` runs speak.js's SIMULATE in both frames). The rest is in
 * pictures.js's CANNOT, shown as a card that says why.
 * @typedef {{ aspect: string, loop?: boolean, point?: boolean }} Embed
 * @type {{ id: string, label: string, loop: boolean, point?: string[], aspects: Record<string, string>, extra?: Record<string, Embed> }[]}
 */
const FAMILIES = [
    {
        id: 'loading',
        label: 'While loading',
        loop: false,
        aspects: {
            meter: 'loading',
            chart: 'loading',
            calendar: 'loading',
            graph: 'loading',
            trend: 'loading',
            columns: 'loading',
            tiles: 'loading',
            kpi: 'loading',
            menu: 'loading',
            busy: 'loading',
        },
    },
    {
        id: 'arrival',
        label: 'How it arrives',
        loop: true,
        aspects: {
            meter: 'arrival',
            chart: 'arrival',
            calendar: 'arrival',
            graph: 'arrival',
            trend: 'arrival',
            columns: 'arrival',
            tiles: 'arrival',
            menu: 'open',
            header: 'menu',
            busy: 'arrival',
            drawer: 'openclose',
        },
        extra: { kpi: { aspect: 'shape', loop: true }, state: { aspect: 'shape', loop: true } },
    },
    {
        id: 'live',
        label: 'A live update',
        loop: true,
        aspects: { chart: 'update', graph: 'live', trend: 'live', columns: 'live', tiles: 'live', kpi: 'live', state: 'change' },
        extra: { meter: { aspect: 'arrival' }, calendar: { aspect: 'tone', loop: true }, busy: { aspect: 'point' } },
    },
    {
        id: 'hover',
        label: 'Hover, focus, press',
        loop: false,
        point: ['calendar', 'kpi', 'menu', 'header'],
        aspects: { calendar: 'select', graph: 'focus', tiles: 'hover', kpi: 'interactive', menu: 'interact', header: 'interactive' },
        extra: {
            chart: { aspect: 'shape', point: true },
            trend: { aspect: 'shape', point: true },
            // Not 'shape': its own button for that aspect alone would stop the played pointer.
            state: { aspect: 'point', point: true },
            drawer: { aspect: 'openclose', point: true },
        },
    },
    {
        id: 'tone',
        label: 'The tone',
        loop: false,
        aspects: { meter: 'tone', calendar: 'tone', trend: 'tone', columns: 'tone', tiles: 'tone', kpi: 'tone', menu: 'tone', state: 'tone' },
        extra: { chart: { aspect: 'tip' }, busy: { aspect: 'failure' } },
    },
    {
        id: 'shape',
        label: 'The shape',
        loop: false,
        aspects: Object.fromEntries(COMPONENTS.map(({ id }) => [id, 'shape'])),
    },
];

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const theme = () => {
    const t = document.documentElement.getAttribute('data-theme') || 'formal';
    return THEMES_HERE.includes(t) ? t : 'formal';
};
const pictureOf = (/** @type {string} */ t, /** @type {string} */ family) => (REJECTED[t] === family ? null : PICTURES[t]?.[family] || null);

/** The embed of one component in one family's moment; null when it has none. */
function embedOf(/** @type {typeof FAMILIES[number]} */ family, /** @type {string} */ component) {
    const own = family.aspects[component];
    if (own) return { aspect: own, loop: family.loop, point: Boolean(family.point?.includes(component)) };
    const extra = family.extra?.[component];
    return extra ? { aspect: extra.aspect, loop: Boolean(extra.loop), point: Boolean(extra.point) } : null;
}

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="families-applied"]'));

/* ------------------------------------------------- the review kit's text */

section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        FAMILIES.map((family) => ({
            id: family.id,
            label: family.label,
            // A family Kenny did not approve in a theme is settled: not asked again.
            fixed: Object.fromEntries(
                Object.entries(REJECTED)
                    .filter(([, f]) => f === family.id)
                    .map(([t]) => [t, true]),
            ),
            options: [
                {
                    value: 'apply',
                    label: 'Apply to the package',
                    hints: Object.fromEntries(
                        THEMES_HERE.filter((t) => pictureOf(t, family.id)).map((t) => {
                            const p = /** @type {NonNullable<ReturnType<typeof pictureOf>>} */ (pictureOf(t, family.id));
                            return [t, `${LABEL_OF[p.from]}'s "${p.name}" on every other component: ${p.keeps}`];
                        }),
                    ),
                },
            ],
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
for (const name of THEMES_HERE) {
    const p = document.createElement('p');
    p.setAttribute('data-for', name);
    p.textContent =
        `${LABEL[name]}: each family's picked picture, translated onto every other component. Left is today, right speaks the family. ` +
        'Scroll through the whole family, then ↑ Apply to the package, or ↓ None of these with what should change.';
    look.append(p);
}

/* ------------------------------------------------------------ the frames */

/** The speed every frame plays at, pressed on the demo's own speed button. */
let speed = '1';
/** @type {Map<Window, HTMLElement>} */
const cardOf = new Map();

/** @param {string} component @param {{ aspect: string, loop?: boolean, point?: boolean }} how */
const srcOf = (component, how) =>
    `../character-${component}/demo.html?${new URLSearchParams({
        embed: how.aspect,
        theme: theme(),
        speed,
        ...(how.loop ? { loop: '1' } : {}),
        ...(how.point ? { point: '1' } : {}),
    })}`;

/** The sheets of the "after" side, fetched once per theme. @type {Map<string, Promise<string>>} */
const sheets = new Map();
const sheetOf = (/** @type {string} */ t) => {
    if (!sheets.has(t))
        sheets.set(
            t,
            Promise.all(['base.css', `${t}.css`].map((file) => fetch(new URL(file, import.meta.url)).then((r) => (r.ok ? r.text() : '')))).then(
                (parts) => parts.join('\n'),
            ),
        );
    return /** @type {Promise<string>} */ (sheets.get(t));
};
// Fetched before any frame loads, so the sheet is in place before the
// embed's own start (the played pointer reads the sheets once, on start).
for (const t of THEMES_HERE) void sheetOf(t);
/** @type {Map<string, string>} */
const sheetText = new Map();
for (const t of THEMES_HERE) void sheetOf(t).then((text) => sheetText.set(t, text));

/**
 * Prepares a frame the moment its document exists: the "after" side gets
 * the theme's sheet and the speaker, both sides their simulation. The style
 * goes in as text, before the embed's start reads the sheets.
 * @param {HTMLIFrameElement} frame
 */
function prepare(frame) {
    const doc = frame.contentDocument;
    if (!doc?.documentElement || doc.URL === 'about:blank' || doc.documentElement.hasAttribute('data-fa-ready')) return;
    doc.documentElement.setAttribute('data-fa-ready', '');
    const card = /** @type {HTMLElement} */ (frame.closest('[data-fa-pair]'));
    const family = card.getAttribute('data-fa-family') || '';
    const component = card.getAttribute('data-fa-component') || '';
    const t = theme();
    if (frame.hasAttribute('data-fa-after')) {
        const style = doc.createElement('style');
        style.setAttribute('data-fa-sheet', t);
        style.textContent = sheetText.get(t) || '';
        if (!style.textContent) void sheetOf(t).then((text) => (style.textContent = text));
        (doc.head || doc.documentElement).append(style);
        const go = () => speak(doc, family, component);
        if (doc.body) go();
        else doc.addEventListener('DOMContentLoaded', go, { once: true });
    }
    const sim = SIMULATE[family]?.[component];
    if (sim) {
        const run = () => sim(doc);
        if (doc.readyState === 'complete') run();
        else frame.contentWindow?.addEventListener('load', run, { once: true });
    }
}

/**
 * Prepares every frame's new document as early as it exists: when its pair
 * comes on screen, and also when the review dialog moves the section into
 * its stage (a moved frame loads again). The embed reads the page's sheets
 * once, on its start, so the sheet has to be in before that.
 */
function scanFrames() {
    for (const frame of /** @type {NodeListOf<HTMLIFrameElement>} */ (section.querySelectorAll('iframe[data-fa-on]'))) {
        const doc = frame.contentDocument;
        if (!doc?.documentElement || doc.documentElement.hasAttribute('data-fa-ready')) continue;
        if (doc.URL === new URL(frame.dataset.src || '', location.href).href) prepare(frame);
    }
}
setInterval(scanFrames, 20);

/** A frame loads only while its pair is on screen (or about to be): two dozen demos at once are heavy. */
const watch = new IntersectionObserver(
    (entries) => {
        for (const { target, isIntersecting } of entries) {
            for (const frame of /** @type {NodeListOf<HTMLIFrameElement>} */ (target.querySelectorAll('iframe'))) {
                if (isIntersecting) {
                    if (frame.getAttribute('src') !== frame.dataset.src) frame.setAttribute('src', frame.dataset.src || '');
                    frame.toggleAttribute('data-fa-on', true);
                } else if (frame.hasAttribute('data-fa-on')) {
                    frame.removeAttribute('data-fa-on');
                    frame.setAttribute('src', 'about:blank');
                }
            }
        }
    },
    { rootMargin: '300px' },
);

/** One side of a pair: its words and its frame. @param {'today' | 'after' | 'source'} side */
function sideOf(side, /** @type {string} */ component, /** @type {string} */ title) {
    const figure = document.createElement('figure');
    figure.className = 'fa-side';
    figure.setAttribute('data-fa-side', side);
    const caption = document.createElement('figcaption');
    caption.className = 'fa-side__label';
    caption.innerHTML = '<b></b> <span data-fa-told></span>';
    /** @type {HTMLElement} */ (caption.querySelector('b')).textContent =
        side === 'today' ? 'Today' : side === 'after' ? 'Speaking the family' : 'The picture';
    const frame = document.createElement('iframe');
    frame.className = 'fa-side__frame';
    frame.title = `${LABEL_OF[component]}: ${title}`;
    if (side === 'after') frame.setAttribute('data-fa-after', '');
    frame.addEventListener('load', () => {
        if (frame.contentWindow) cardOf.set(frame.contentWindow, figure);
        prepare(frame);
    });
    figure.append(caption, frame);
    return figure;
}

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-fa-rows]'));
for (const family of FAMILIES) {
    const box = document.createElement('div');
    box.className = 'fa-family';
    box.setAttribute('data-fa-aspect', family.id);
    // The one option of the step: everything the family does in this theme.
    const cell = document.createElement('div');
    cell.className = 'fa-cell';
    cell.setAttribute('data-fa-option', '1');
    const head = document.createElement('header');
    head.className = 'fa-family__head';
    head.innerHTML = `<h3></h3><p class="fa-family__idea"><b data-fa-picture></b> <span data-fa-idea></span></p><p class="fa-family__keeps" data-fa-keeps></p>`;
    /** @type {HTMLElement} */ (head.querySelector('h3')).textContent = family.label;
    cell.append(head);

    // The source: the picked component's own demo, as it is today.
    const source = document.createElement('article');
    source.className = 'fa-source';
    source.setAttribute('data-fa-pair', 'source');
    source.setAttribute('data-fa-family', family.id);
    cell.append(source);

    const list = document.createElement('div');
    list.className = 'fa-pairs';
    list.setAttribute('data-fa-pairs', '');
    cell.append(list);
    box.append(cell);
    rows.append(box);
}

/** The cards of one family in the current theme: the source, then every other component. */
function buildFamily(/** @type {typeof FAMILIES[number]} */ family) {
    const box = /** @type {HTMLElement} */ (rows.querySelector(`[data-fa-aspect="${family.id}"]`));
    const t = theme();
    const picture = pictureOf(t, family.id);
    const source = /** @type {HTMLElement} */ (box.querySelector('.fa-source'));
    const list = /** @type {HTMLElement} */ (box.querySelector('[data-fa-pairs]'));
    for (const frame of box.querySelectorAll('iframe')) watch.unobserve(/** @type {Element} */ (frame.closest('[data-fa-pair]')));
    source.replaceChildren();
    list.replaceChildren();
    /** @type {HTMLElement} */ (box.querySelector('[data-fa-picture]')).textContent = picture ? `${LABEL_OF[picture.from]} · ${picture.name}.` : '';
    /** @type {HTMLElement} */ (box.querySelector('[data-fa-idea]')).textContent = picture
        ? picture.idea
        : `Not approved in ${LABEL[t]}: this family is not applied here (see research/families/VERDICTS.md).`;
    /** @type {HTMLElement} */ (box.querySelector('[data-fa-keeps]')).textContent = picture
        ? `What every component keeps of it: ${picture.keeps}`
        : '';
    box.toggleAttribute('data-fa-none', !picture);
    if (!picture) return;

    const sourceEmbed = /** @type {Embed} */ (embedOf(family, picture.from));
    source.setAttribute('data-fa-component', picture.from);
    const sourceHead = document.createElement('p');
    sourceHead.className = 'fa-pair__head';
    sourceHead.innerHTML = '<b></b> <span></span>';
    /** @type {HTMLElement} */ (sourceHead.querySelector('b')).textContent = `${LABEL_OF[picture.from]}, the picture itself`;
    /** @type {HTMLElement} */ (sourceHead.querySelector('span')).textContent = '(today, unchanged: what the others translate)';
    const sourceSide = sideOf('source', picture.from, picture.name);
    /** @type {HTMLIFrameElement} */ (sourceSide.querySelector('iframe')).dataset.src = srcOf(picture.from, sourceEmbed);
    source.append(sourceHead, sourceSide);
    watch.observe(source);

    for (const { id, label } of COMPONENTS) {
        if (id === picture.from) continue;
        const how = embedOf(family, id);
        const why = picture.cannot?.[id] || CANNOT[family.id]?.[id] || (!how ? 'This component has no moment of this family.' : '');
        const pair = document.createElement('article');
        pair.className = 'fa-pair';
        pair.setAttribute('data-fa-pair', id);
        pair.setAttribute('data-fa-family', family.id);
        pair.setAttribute('data-fa-component', id);
        const headLine = document.createElement('p');
        headLine.className = 'fa-pair__head';
        headLine.innerHTML = '<b></b> <span></span>';
        /** @type {HTMLElement} */ (headLine.querySelector('b')).textContent = label;
        /** @type {HTMLElement} */ (headLine.querySelector('span')).textContent = why
            ? 'Left as it is.'
            : picture.notes?.[id] || WHERE[family.id]?.[id] || '';
        pair.append(headLine);
        const sides = document.createElement('div');
        sides.className = 'fa-pair__sides';
        if (why || !how) {
            pair.toggleAttribute('data-fa-cannot', true);
            const note = document.createElement('p');
            note.className = 'fa-pair__cannot';
            note.textContent = why;
            sides.append(note);
            pair.append(sides);
            list.append(pair);
            continue;
        }
        const today = sideOf('today', id, `${family.label}, today`);
        const after = sideOf('after', id, `${family.label}, speaking ${picture.name}`);
        /** @type {HTMLIFrameElement} */ (today.querySelector('iframe')).dataset.src = srcOf(id, how);
        /** @type {HTMLIFrameElement} */ (after.querySelector('iframe')).dataset.src = srcOf(id, how);
        sides.append(today, after);
        pair.append(sides);
        list.append(pair);
        watch.observe(pair);
    }
}

// What a frame tells: its height (both sides of a pair take the taller), the
// picked option's name.
addEventListener('message', (event) => {
    const data = event.data || {};
    if (event.origin !== location.origin || data.type !== 'rv-embed') return;
    const side = cardOf.get(/** @type {Window} */ (event.source));
    if (!side) return;
    const frame = /** @type {HTMLIFrameElement} */ (side.querySelector('iframe'));
    if (data.height) frame.dataset.faHeight = String(Math.min(Math.max(data.height, 96), 1400));
    const pair = side.closest('[data-fa-pair]');
    const frames = /** @type {HTMLIFrameElement[]} */ ([...(pair?.querySelectorAll('iframe') || [])]);
    const tallest = Math.max(...frames.map((f) => Number(f.dataset.faHeight || 0)));
    if (tallest) for (const f of frames) f.style.blockSize = `${tallest}px`;
    const told = /** @type {HTMLElement} */ (side.querySelector('[data-fa-told]'));
    if (data.name !== undefined && side.getAttribute('data-fa-side') !== 'after') told.textContent = data.name ? `· ${data.name}` : '';
    if (side.getAttribute('data-fa-side') === 'after') {
        const p = pictureOf(theme(), pair?.getAttribute('data-fa-family') || '');
        told.textContent = p ? `· ${p.name}` : '';
    }
});

const frames = () => /** @type {HTMLIFrameElement[]} */ ([...section.querySelectorAll('iframe[data-fa-on]')]);
const tellFrames = (/** @type {object} */ message) => {
    for (const frame of frames()) frame.contentWindow?.postMessage(message, location.origin);
};
section.querySelector('[data-fa-replay]')?.addEventListener('click', () => tellFrames({ type: 'rv-embed-replay' }));
for (const button of section.querySelectorAll('[data-fa-speed]'))
    button.addEventListener('click', () => {
        speed = button.getAttribute('data-fa-speed') || '1';
        for (const b of section.querySelectorAll('[data-fa-speed]')) b.setAttribute('aria-pressed', String(b === button));
        tellFrames({ type: 'rv-embed-speed', value: speed });
        for (const frame of section.querySelectorAll('iframe')) {
            const url = new URL(/** @type {HTMLIFrameElement} */ (frame).dataset.src || '', location.href);
            url.searchParams.set('speed', speed);
            /** @type {HTMLIFrameElement} */ (frame).dataset.src = `${url.pathname.replace(/^.*\/research\//, '../')}${url.search}`;
        }
    });

/** Builds every family for the current theme. */
function repoint() {
    for (const family of FAMILIES) buildFamily(family);
    for (const el of document.querySelectorAll('[data-fa-theme-name]')) el.textContent = LABEL[theme()] || theme();
}
repoint();
// The dialog walks the themes by switching the page's theme: every card follows.
let shown = theme();
new MutationObserver(() => {
    if (theme() === shown) return;
    shown = theme();
    repoint();
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// The kit last, once the choices above are written.
await import('../_review/review.js');
