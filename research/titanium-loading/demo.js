// research/titanium-loading: every loading element in titanium twice, from one
// markup each (the <template> in its section): "Today" as the package and
// the decided character demos draw it, "Anodising bath" with anodised.css.
// The page only clones, sets the decided picks and drives the speed; it adds
// no CSS to the left-hand side.

/** The decided titanium picks of each character (research/character-<name>/decided.json). */
const DECIDED = {
    busy: {
        prefix: 'bo',
        picks: {
            shape: 'r3-b-ti-shape-2',
            loading: '2',
            arrival: '2',
            failure: '1',
            phone: 'r3-b-ti-phone-1',
        },
    },
    calendar: {
        prefix: 'cl',
        picks: {
            shape: '1',
            loading: '1',
            arrival: '2',
            tone: '1',
            select: '1',
        },
    },
    chart: {
        prefix: 'cc',
        picks: {
            shape: 'a',
            loading: 'cutter',
            arrival: 'draw',
            update: 'none',
            events: 'r3-ti-ev-2',
            tip: 'a',
        },
    },
    columns: {
        prefix: 'cs',
        picks: {
            shape: '2',
            loading: '3',
            arrival: '3',
            tone: '1',
            live: '3',
        },
    },
    graph: {
        prefix: 'cg',
        picks: {
            shape: '2',
            loading: 'r3-tn-load-3',
            arrival: '1',
            focus: '2',
            live: '2',
        },
    },
    menu: {
        prefix: 'mb',
        picks: {
            shape: '3',
            loading: 'r2-tin-load-1',
            open: '2',
            tone: '1',
            interact: '3',
        },
    },
    tiles: {
        prefix: 'ti',
        picks: {
            shape: '1',
            loading: '2',
            arrival: '2',
            tone: '1',
            hover: '2',
            live: '3',
        },
    },
    trend: {
        prefix: 'ct',
        picks: {
            shape: '2',
            loading: '3',
            arrival: '2',
            tone: '3',
            live: '3',
        },
    },
    kpi: {
        prefix: 'kf',
        picks: {
            shape: 'r2-ti-shape-1',
            loading: 'r2-ti-load-1',
            tone: '1',
            interactive: 'r2-ti-int-2',
            live: '3',
        },
    },
};

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const note = document.querySelector('[data-tl-motion]');
const showNote = () => {
    if (note) note.hidden = !reduce.matches;
};
showNote();
reduce.addEventListener('change', showNote);

let made = 0;

/**
 * Give every id in a clone its own name, and drop the references to ids
 * a clone cannot keep, so the two sides never share an id.
 * @param {Element} root
 */
function unique(root) {
    made += 1;
    for (const el of root.querySelectorAll('[id]')) el.id = `${el.id}-tl${made}`;
    for (const el of root.querySelectorAll('[aria-controls], [aria-labelledby], [aria-describedby]')) {
        el.removeAttribute('aria-controls');
        el.removeAttribute('aria-labelledby');
        el.removeAttribute('aria-describedby');
    }
}

/**
 * Set a character's decided picks on the side and on every element of the
 * clone that carries that character's aspects; the loading aspect is the
 * decided picture on the left and the anodising bath on the right.
 * @param {HTMLElement} side @param {string} char @param {boolean} anodised
 */
function pick(side, char, anodised) {
    const { prefix, picks } = DECIDED[char];
    const hosts = [side, ...side.querySelectorAll('*')].filter((el) =>
        [...el.attributes].some((a) => a.name.startsWith(`data-${prefix}-`) || a.name === `data-${prefix}`),
    );
    for (const host of hosts)
        for (const [aspect, key] of Object.entries(picks)) {
            const name = `data-${prefix}-${aspect}`;
            if (!host.hasAttribute(name)) continue;
            host.setAttribute(name, aspect === 'loading' && anodised ? 'anodised' : key);
        }
}

for (const sides of document.querySelectorAll('[data-tl-pair]')) {
    const id = sides.getAttribute('data-tl-pair');
    const template = /** @type {HTMLTemplateElement} */ (document.querySelector(`template[data-tl-markup="${id}"]`));
    const char = sides.getAttribute('data-tl-char');
    for (const side of /** @type {NodeListOf<HTMLElement>} */ (sides.querySelectorAll('[data-tl-version]'))) {
        const stage = /** @type {HTMLElement} */ (side.querySelector('.tl-stage'));
        stage.append(template.content.cloneNode(true));
        unique(stage);
        if (id === 'busy-refresh') {
            stage.querySelector('.kp-datatable__busy-overlay')?.remove();
            stage.querySelector('[data-kp-busy-overlay]')?.removeAttribute('data-kp-busy-overlay');
        }
        if (id === 'menu') {
            const menu = stage.querySelector('.kp-menu');
            menu?.setAttribute('style', 'inset: calc(100% + 0.25rem) auto auto 0; width: min(19.75rem, 100%);');
            menu?.removeAttribute('data-kp-menu-side');
        }
        if (char) pick(side, char, side.getAttribute('data-tl-version') === 'anodised');
    }
}

// Speed and pause, on every running animation of the page through the Web
// Animations API, so neither side needs a rule of this page to follow them.
let speed = 1;
let paused = false;
function drive() {
    for (const a of document.getAnimations()) {
        if (a.playbackRate !== speed) a.playbackRate = speed;
        if (paused && a.playState === 'running') a.pause();
        else if (!paused && a.playState === 'paused') a.play();
    }
}
setInterval(drive, 250);

for (const button of document.querySelectorAll('[data-tl-speed]'))
    button.addEventListener('click', () => {
        speed = Number(button.getAttribute('data-tl-speed'));
        for (const b of document.querySelectorAll('[data-tl-speed]')) b.setAttribute('aria-pressed', String(b === button));
        drive();
    });

const pause = document.querySelector('[data-tl-pause]');
pause?.addEventListener('click', () => {
    paused = !paused;
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Play' : 'Pause';
    drive();
});
