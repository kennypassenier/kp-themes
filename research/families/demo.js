// Every component's pick, family by family, per theme (Kenny, 2026-10-06
// 23:52: "Misschien helpt het om alle bestaande laadschermen per thema te
// tonen, zodat ik dan bij andere thema's ook kan kiezen welke de beste zijn
// of eventueel nog eentje laten bijmaken. Hetzelfde doen we dan per familie
// van animaties of keuzes").
//
// A review-kit demo in aspect mode: one section, one choice per family
// (loading first), whose options are the components that have that family.
// Each option's card holds the component's own demo in a frame, embedded by
// the kit (`../character-<c>/demo.html?embed=<aspect>&theme=<theme>`, see
// research/_review/review.js, "Embed mode"): only its combination of the
// picks, its own buttons for the aspect pressed. Kenny flips through a
// theme's loading pictures in the dialog and picks the one the whole theme
// should speak, theme by theme.
import { THEMES } from '../../js/theme-registry.js';
import { SIGNATURES } from './signatures.js';

/** The character demos, in the order they were built, with the name a card shows. */
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

/**
 * The families, and per component the demo's own aspect id for it: the one
 * table that knows the demos call the same thing by different names. `loop`
 * presses the demo's buttons again whenever its motion has ended (an
 * arrival, a live update); a loading picture loops by itself, a tone and a
 * shape are a state.
 * shape are a state. `point` plays the pointer: a script cannot hover, so the
 * kit copies the demo's hover, focus and press rules onto attributes and walks
 * them over the preview's parts, and the card says which part is in which
 * state. Tiles has a Pointed at button of its own, and the graph's "focus" is
 * a standing state (a picked node, a hidden kind) its own toggles show; the
 * card names the buttons pressed.
 * @type {{ id: string, label: string, about: string, loop: boolean, point?: string[], aspects: Record<string, string> }[]}
 */
const FAMILIES = [
    {
        id: 'loading',
        label: 'While loading',
        about: 'the loading picture',
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
        about: 'the arrival (or the opening)',
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
    },
    {
        id: 'live',
        label: 'A live update',
        about: 'the live update',
        loop: true,
        aspects: { chart: 'update', graph: 'live', trend: 'live', columns: 'live', tiles: 'live', kpi: 'live', state: 'change' },
    },
    {
        id: 'hover',
        label: 'Hover, focus, press',
        about: 'the hover, focus and press',
        loop: false,
        point: ['calendar', 'kpi', 'menu', 'header'],
        aspects: { calendar: 'select', graph: 'focus', tiles: 'hover', kpi: 'interactive', menu: 'interact', header: 'interactive' },
    },
    {
        id: 'tone',
        label: 'The tone',
        about: 'the tone',
        loop: false,
        aspects: { meter: 'tone', calendar: 'tone', trend: 'tone', columns: 'tone', tiles: 'tone', kpi: 'tone', menu: 'tone', state: 'tone' },
    },
    {
        id: 'shape',
        label: 'The shape',
        about: 'the shape',
        loop: false,
        aspects: Object.fromEntries(COMPONENTS.map(({ id }) => [id, 'shape'])),
    },
];

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));
const theme = () => document.documentElement.getAttribute('data-theme') ?? 'formal';

/**
 * A family's options, in a fixed order: the components first, as they always
 * were (their option values and places are what a stored pick refers to), then
 * the package's signature elements of that family (signatures.js, drawn by
 * signature.html), those every theme draws before those only some do.
 * @typedef {{ id: string, label: string, aspect: string, how: string, signature?: import('./signatures.js').Signature }} Member
 * @param {typeof FAMILIES[number]} family
 * @returns {Member[]}
 */
const membersOf = (family) => [
    ...COMPONENTS.filter(({ id }) => family.aspects[id]).map(({ id, label }) => ({
        id,
        label,
        aspect: family.aspects[id],
        how: [family.loop && 'loop', family.point?.includes(id) && 'point'].filter(Boolean).join(' '),
    })),
    ...SIGNATURES.filter((s) => s.family === family.id)
        .sort((a, b) => Number(Boolean(a.themes)) - Number(Boolean(b.themes)))
        .map((signature) => ({
            id: signature.id,
            label: signature.label,
            aspect: family.id,
            how: [family.loop && 'loop', signature.how].filter(Boolean).join(' '),
            signature,
        })),
];
/** Whether a theme's register draws this option at all (a signature may be limited to some). */
const drawnIn = (/** @type {Member} */ member, /** @type {string} */ t) => !member.signature?.themes || member.signature.themes.includes(t);

/** Each demo's decided picks, key per aspect per theme (research/character-<c>/decided.json). */
const decided = Object.fromEntries(
    await Promise.all(
        COMPONENTS.map(async ({ id }) => {
            try {
                const response = await fetch(`../character-${id}/decided.json`);
                return [id, response.ok ? (await response.json()).picks || {} : {}];
            } catch {
                return [id, {}];
            }
        }),
    ),
);
const keyOf = (/** @type {string} */ component, /** @type {string} */ aspect, /** @type {string} */ t) => decided[component]?.[t]?.[aspect] ?? '';

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="families"]'));

/* ------------------------------------------------- the review kit's text */

// Read by the kit when it loads, which is after this module: one choice per
// family, one option per component, the picked key as each theme's hint.
section.setAttribute(
    'data-review-choices',
    JSON.stringify(
        FAMILIES.map((family) => ({
            id: family.id,
            label: family.label,
            options: membersOf(family).map((member) => ({
                value: member.id,
                label: member.label,
                // A signature only some registers draw has hints for those
                // themes alone, so the dialog drops it from the others.
                hints: Object.fromEntries(
                    THEMES.filter(({ name }) => drawnIn(member, name)).map(({ name }) => {
                        if (member.signature) return [name, `The package's own element: ${member.signature.about}, as ${LABEL[name]} draws it.`];
                        const key = keyOf(member.id, member.aspect, name);
                        return [name, `The ${member.label.toLowerCase()}'s ${family.about}${key ? `, key ${key}` : ''}.`];
                    }),
                ),
            })),
        })),
    ),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
for (const { name } of THEMES) {
    const p = document.createElement('p');
    p.setAttribute('data-for', name);
    p.textContent =
        `Every component's pick in ${LABEL[name]}, one family at a time. Pick the component whose picture the whole theme should speak; ` +
        'None of these with a note when none should, or when a new one should be made.';
    look.append(p);
}

/* ------------------------------------------------------------ the cards */

/** The speed every frame plays at, pressed on the demo's own speed button. */
let speed = '1';
/** @type {Map<Window, HTMLElement>} */
const cardOf = new Map();

/** A card's frame: the component's own demo, or for a signature element the package's own drawing (signature.html). */
const srcOf = (/** @type {string} */ component, /** @type {string} */ aspect, /** @type {string} */ how, element = '') =>
    `${element ? 'signature.html' : `../character-${component}/demo.html`}?${new URLSearchParams({
        ...(element ? { element } : {}),
        embed: aspect,
        theme: theme(),
        speed,
        ...(how.includes('loop') ? { loop: '1' } : {}),
        ...(how.includes('point') ? { point: '1' } : {}),
    })}`;

/** A frame loads only while its card is on screen (or about to be): thirteen demos at once are heavy. */
const watch = new IntersectionObserver(
    (entries) => {
        for (const { target, isIntersecting } of entries) {
            const frame = /** @type {HTMLIFrameElement} */ (target.querySelector('iframe'));
            if (isIntersecting) {
                if (frame.getAttribute('src') !== frame.dataset.src) frame.setAttribute('src', frame.dataset.src || '');
                frame.toggleAttribute('data-fm-on', true);
            } else if (frame.hasAttribute('data-fm-on')) {
                frame.removeAttribute('data-fm-on');
                frame.setAttribute('src', 'about:blank');
            }
        }
    },
    { rootMargin: '200px' },
);

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-fm-rows]'));
for (const family of FAMILIES) {
    const box = document.createElement('div');
    box.className = 'fm-family';
    box.setAttribute('data-fm-aspect', family.id);
    const head = document.createElement('div');
    head.className = 'fm-family__head';
    const h3 = document.createElement('h3');
    h3.textContent = family.label;
    const note = document.createElement('p');
    const members = membersOf(family);
    const signatures = members.filter((m) => m.signature).length;
    note.textContent =
        `${members.length - signatures} components, each with its own pick of ${family.about} in this theme` +
        (signatures ? `, then the package's own signature ${signatures === 1 ? 'element' : 'elements'} of this family (kp.signature).` : '.');
    head.append(h3, note);
    const grid = document.createElement('div');
    grid.className = 'fm-grid';
    members.forEach(({ id, label, aspect, how, signature }, at) => {
        const card = document.createElement('figure');
        card.className = 'fm-card';
        card.setAttribute('data-fm-option', String(at + 1));
        card.setAttribute('data-fm-component', id);
        card.setAttribute('data-fm-family-aspect', aspect);
        card.setAttribute('data-fm-how', how);
        if (signature) {
            card.setAttribute('data-fm-signature', signature.element);
            if (signature.themes) card.setAttribute('data-fm-themes', signature.themes.join(' '));
        }
        const caption = document.createElement('figcaption');
        caption.className = 'fm-card__label';
        caption.innerHTML = '<b></b> <span data-fm-name></span> <code data-fm-key></code><small data-fm-told hidden></small>';
        /** @type {HTMLElement} */ (caption.querySelector('b')).textContent = label;
        const frame = document.createElement('iframe');
        frame.className = 'fm-card__frame';
        frame.title = `${label}: ${signature ? signature.name : family.about}`;
        frame.dataset.src = srcOf(id, aspect, how, signature?.element);
        card.append(caption, frame);
        grid.append(card);
        watch.observe(card);
        frame.addEventListener('load', () => {
            if (frame.contentWindow) cardOf.set(frame.contentWindow, card);
        });
        paintCaption(card);
    });
    box.append(head, grid);
    rows.append(box);
}

/**
 * The card's words: the component, the picked option's name (told by its
 * frame) and the decided key; under them, what the played pointer is on, or a
 * warning when the frame shows another key than the decided one.
 * @param {HTMLElement} card
 */
function paintCaption(card, told = /** @type {{ name?: string, key?: string, pointer?: string, played?: string[] } | null} */ (null)) {
    const component = card.getAttribute('data-fm-component') || '';
    const aspect = card.getAttribute('data-fm-family-aspect') || '';
    const name = /** @type {HTMLElement} */ (card.querySelector('[data-fm-name]'));
    const key = /** @type {HTMLElement} */ (card.querySelector('[data-fm-key]'));
    if (told?.name !== undefined) name.textContent = told.name ? `· ${told.name}` : '';
    else if (!told) name.textContent = '';
    const decidedKey = keyOf(component, aspect, theme());
    key.textContent = decidedKey || told?.key || '';
    const line = /** @type {HTMLElement} */ (card.querySelector('[data-fm-told]'));
    const wrong = Boolean(told?.key && decidedKey && told.key !== decidedKey);
    card.toggleAttribute('data-fm-wrong', wrong);
    line.textContent = wrong
        ? `Shows key ${told?.key}, not the decided ${decidedKey}`
        : told?.pointer
          ? `Pointer, played: ${told.pointer}`
          : told?.played?.length
            ? `Pressed: ${told.played.join(', ')}`
            : '';
    line.hidden = !line.textContent;
}

// What a frame tells: its height, the picked option's name and key.
addEventListener('message', (event) => {
    const data = event.data || {};
    if (event.origin !== location.origin || data.type !== 'rv-embed') return;
    const card = cardOf.get(/** @type {Window} */ (event.source));
    if (!card) return;
    const frame = /** @type {HTMLIFrameElement} */ (card.querySelector('iframe'));
    card.toggleAttribute('data-fm-missing', data.found === false);
    if (data.height) frame.style.blockSize = `${Math.min(Math.max(data.height, 96), 1400)}px`;
    paintCaption(card, data);
});

const frames = () => /** @type {HTMLIFrameElement[]} */ ([...section.querySelectorAll('iframe[data-fm-on]')]);
const tellFrames = (/** @type {object} */ message) => {
    for (const frame of frames()) frame.contentWindow?.postMessage(message, location.origin);
};

section.querySelector('[data-fm-replay]')?.addEventListener('click', () => tellFrames({ type: 'rv-embed-replay' }));
for (const button of section.querySelectorAll('[data-fm-speed]'))
    button.addEventListener('click', () => {
        speed = button.getAttribute('data-fm-speed') || '1';
        for (const b of section.querySelectorAll('[data-fm-speed]')) b.setAttribute('aria-pressed', String(b === button));
        tellFrames({ type: 'rv-embed-speed', value: speed });
        repoint(false);
    });

/** Points every card at the current theme and speed; `reload` loads the frames on screen again. */
function repoint(reload = true) {
    for (const card of section.querySelectorAll('.fm-card')) {
        const frame = /** @type {HTMLIFrameElement} */ (card.querySelector('iframe'));
        frame.dataset.src = srcOf(
            card.getAttribute('data-fm-component') || '',
            card.getAttribute('data-fm-family-aspect') || '',
            card.getAttribute('data-fm-how') || '',
            card.getAttribute('data-fm-signature') || '',
        );
        // A signature this theme's register does not draw is set aside (an
        // attribute of its own: the dialog's flip owns `hidden`).
        const only = card.getAttribute('data-fm-themes');
        card.toggleAttribute('data-fm-absent', Boolean(only && !only.split(' ').includes(theme())));
        if (reload && frame.hasAttribute('data-fm-on')) frame.setAttribute('src', frame.dataset.src);
        if (reload) paintCaption(/** @type {HTMLElement} */ (card));
    }
    for (const el of document.querySelectorAll('[data-fm-theme-name]')) el.textContent = LABEL[theme()] || theme();
}
repoint(false);
// The dialog walks the themes by switching the page's theme: every card follows.
new MutationObserver(() => repoint()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// The kit last, once the choices above are written: the decided picks are
// fetched first, so a module of its own would read the section too early.
await import('../_review/review.js');
