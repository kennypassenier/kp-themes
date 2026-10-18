// research/review-kit-v2: each section previews the real review dialog in an iframe at a real window size, with one layout option
// switched by the section's own controls. The preview is the live part page (registry: options.json, `previewPage`) opened at its
// first step, with `?rvui=` forcing the options for that visit only, so nothing here changes how any review looks for the viewer.
// A frame is looked at, never answered in: it takes no pointer and no Tab (page.css), and the page in it keeps its storage in memory
// (research/_review/rv-preview.js), so nothing it does is kept and no verdict can be filed on a part from here.

// The previews' own frames store the theme they are shown in for a moment (the kit puts the stored one back); this page, and
// the frame the review dialog makes of it, keep their theme and do not follow that.
addEventListener('storage', (event) => event.key === 'theme' && event.stopImmediatePropagation(), true);

const SIZES = /** @type {Record<string, [number, number]>} */ ({ desktop: [1920, 1080], laptop: [1280, 800], phone: [390, 844] });
const main = /** @type {HTMLElement} */ (document.querySelector('[data-rk2-page]'));
const PAGE = new URL(`../../${main.dataset.rk2Page}`, import.meta.url);
/** The registry (options.json) as the builder wrote it: per option its kind, its storage, its own page and what to do in the frame. */
const REGISTRY = /** @type {Record<string, any>} */ (JSON.parse(main.dataset.rk2Registry || '{}'));

/** The pressed button of a group, by its data attribute. @param {Element} scope @param {string} attr */
const pressed = (scope, attr) => scope.querySelector(`[${attr}][aria-pressed="true"]`)?.getAttribute(attr) ?? '';
/** The section's controls: the kit moves them next to the preview, so they are found through the section. */
const controlsOf = (/** @type {HTMLElement} */ preview) => /** @type {HTMLElement} */ (preview.closest('[data-review-item]') ?? document);

/** The `rvui` list that shows the layout option `option` on or off, the other layout options all off or all on. */
function rvui(/** @type {string} */ option, /** @type {boolean} */ on, /** @type {boolean} */ others) {
    if (REGISTRY[option]?.kind !== 'ui') return others ? 'all' : 'none';
    if (others) return on ? 'all' : `all,-${option}`;
    return on ? option : 'none';
}

/**
 * What the frame's memory is seeded with (research/_review/rv-preview.js): every option that lives in storage at its value,
 * `option` as asked, the rest all off or all on, and the option's own seed (a part half judged).
 */
function seedFor(/** @type {string} */ option, /** @type {boolean} */ on, /** @type {boolean} */ others) {
    /** @type {Record<string, string>} */
    const seed = {};
    for (const [id, entry] of Object.entries(REGISTRY)) {
        if (entry.kind !== 'store') continue;
        const want = id === option ? on : others;
        const value = want ? entry.store.on : entry.store.off;
        if (entry.store.json) {
            const current = JSON.parse(seed[entry.store.key] ?? '{}');
            current[entry.store.field] = value;
            seed[entry.store.key] = JSON.stringify(current);
        } else seed[entry.store.key] = String(value);
    }
    for (const [key, value] of Object.entries(REGISTRY[option]?.seed ?? {})) seed[key] = JSON.stringify(value);
    return seed;
}

function sync(/** @type {HTMLElement} */ preview) {
    const scope = controlsOf(preview);
    const option = preview.dataset.rk2Option ?? '';
    const on = (pressed(scope, 'data-rk2-set') || preview.dataset.rk2Default) === 'on';
    const size = SIZES[pressed(scope, 'data-rk2-size')] ?? SIZES.laptop;
    const others = pressed(scope, 'data-rk2-others') === 'all';
    preview.style.setProperty('--rk2-w', String(size[0]));
    preview.style.setProperty('--rk2-h', String(size[1]));
    fit(preview);
    const own = REGISTRY[option]?.page;
    const url = new URL(own ? new URL(`../../${own}`, import.meta.url) : PAGE);
    url.searchParams.set('rvui', rvui(option, on, others));
    url.searchParams.set('rvopt', JSON.stringify(seedFor(option, on, others)));
    url.searchParams.set('rv-preview', '1');
    preview.dataset.rk2Want = url.href;
    if (preview.dataset.rk2Seen === '1') load(preview);
}

function fit(/** @type {HTMLElement} */ preview) {
    // Measured on the section's own box, not the frame's (which is as wide as the window it shows, scaled).
    const width = Number(preview.style.getPropertyValue('--rk2-w')) || 1280;
    preview.style.setProperty('--rk2-scale', String(Math.min(1, preview.clientWidth / width) || 1));
}

/** Points the frame at the wanted address once, then opens the dialog in it as soon as the part has built its button. */
function load(/** @type {HTMLElement} */ preview) {
    const frame = /** @type {HTMLIFrameElement} */ (preview.querySelector('iframe'));
    const want = preview.dataset.rk2Want ?? '';
    if (!want || frame.dataset.rk2Loaded === want) return;
    frame.dataset.rk2Loaded = want;
    const entry = REGISTRY[preview.dataset.rk2Option ?? ''] ?? {};
    frame.addEventListener(
        'load',
        () => {
            const doc = () => frame.contentDocument;
            if (entry.open === false) {
                // A page that is not the dialog (the Agenda): bring the part that shows the option into view once it has built.
                let tries = 0;
                const timer = setInterval(() => {
                    const target = entry.reveal ? doc()?.querySelector(entry.reveal) : null;
                    if (target || ++tries > 40) {
                        clearInterval(timer);
                        void act(doc, entry.actions ?? [], '').then(() => doc()?.querySelector(entry.reveal)?.scrollIntoView({ block: 'center' }));
                    }
                }, 500);
                return;
            }
            // The part builds its button before it attaches the click, so press until the dialog is really open.
            let tries = 0;
            const timer = setInterval(() => {
                if (doc()?.querySelector('dialog.rv-dialog[open]')) {
                    clearInterval(timer);
                    void act(doc, entry.actions ?? [], 'dialog.rv-dialog ');
                    return;
                }
                if (++tries > 120) return clearInterval(timer);
                /** @type {HTMLElement | null | undefined} */ (doc()?.querySelector('[data-rv-open]'))?.click();
            }, 400);
        },
        { once: true },
    );
    frame.src = want;
}

const pause = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));
/**
 * What the preview does in its dialog so the option shows (an approval, a tick, a key). The frame keeps its storage in memory
 * (rv-preview.js), so none of it is kept. @param {() => Document | null} doc @param {{ click?: string, open?: string, key?: string, wait?: number }[]} steps @param {string} scope the selector the clicks start from
 */
async function act(doc, steps, scope) {
    await pause(1500);
    for (const step of steps) {
        const d = doc();
        if (!d) return;
        if (step.wait) await pause(step.wait);
        if (step.click) /** @type {HTMLElement | null} */ (d.querySelector(`${scope}${step.click}`))?.click();
        if (step.open) for (const el of d.querySelectorAll(step.open)) /** @type {HTMLDetailsElement} */ (el).open = true;
        if (step.key) {
            const win = /** @type {any} */ (d.defaultView);
            d.dispatchEvent(new win.KeyboardEvent('keydown', { code: step.key, key: step.key.replace(/^Key/, '').toLowerCase(), bubbles: true, cancelable: true }));
        }
    }
}

const watch = new IntersectionObserver(
    (entries) => {
        for (const entry of entries)
            if (entry.isIntersecting) {
                const preview = /** @type {HTMLElement} */ (entry.target);
                preview.dataset.rk2Seen = '1';
                watch.unobserve(preview);
                load(preview);
            }
    },
    { rootMargin: '200px' },
);
const resize = new ResizeObserver((entries) => {
    for (const entry of entries) fit(/** @type {HTMLElement} */ (entry.target));
});

for (const preview of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.rk2-preview'))) {
    sync(preview);
    watch.observe(preview);
    resize.observe(preview);
}

document.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement | null} */ ((/** @type {Element} */ (event.target)).closest?.('[data-rk2-set], [data-rk2-size], [data-rk2-others]'));
    if (!button) return;
    const group = /** @type {HTMLElement} */ (button.closest('[role="group"]'));
    for (const other of group.querySelectorAll('button')) other.setAttribute('aria-pressed', String(other === button));
    const section = button.closest('[data-review-item]');
    const preview = section?.querySelector('.rk2-preview');
    if (preview) sync(/** @type {HTMLElement} */ (preview));
});

// The choice "Default for this option" follows into the preview: picking a default shows the dialog the way it will open.
document.addEventListener('review:choice', (event) => {
    const detail = /** @type {CustomEvent} */ (event).detail;
    const section = /** @type {Element} */ (event.target).closest?.('[data-review-item]');
    if (!section || !String(detail?.id).startsWith('default-')) return;
    const button = section.querySelector(`[data-rk2-set="${detail.value}"]`);
    if (button instanceof HTMLElement) button.click();
});
