// research/review-kit-v2: each section previews the real review dialog in an iframe at a real window size, with one layout option
// switched by the section's own controls. The preview is the live part page (registry: options.json, `previewPage`) opened at its
// first step, with `?rvui=` forcing the options for that visit only, so nothing here changes how any review looks for the viewer.
// The frame takes no pointer and no Tab (page.css): it is looked at, never answered in, so a verdict can never be filed on the part from this page.

// The previews' own frames store the theme they are shown in for a moment (the kit puts the stored one back); this page, and
// the frame the review dialog makes of it, keep their theme and do not follow that.
addEventListener('storage', (event) => event.key === 'theme' && event.stopImmediatePropagation(), true);

const SIZES = /** @type {Record<string, [number, number]>} */ ({ desktop: [1920, 1080], laptop: [1280, 800], phone: [390, 844] });
const main = /** @type {HTMLElement} */ (document.querySelector('[data-rk2-page]'));
const PAGE = new URL(`../../${main.dataset.rk2Page}`, import.meta.url);

/** The pressed button of a group, by its data attribute. @param {Element} scope @param {string} attr */
const pressed = (scope, attr) => scope.querySelector(`[${attr}][aria-pressed="true"]`)?.getAttribute(attr) ?? '';
/** The section's controls: the kit moves them next to the preview, so they are found through the section. */
const controlsOf = (/** @type {HTMLElement} */ preview) => /** @type {HTMLElement} */ (preview.closest('[data-review-item]') ?? document);

/** The `rvui` list that shows `option` on or off, the others all off or all on. */
function rvui(/** @type {string} */ option, /** @type {boolean} */ on, /** @type {boolean} */ others) {
    if (others) return on ? 'all' : `all,-${option}`;
    return on ? option : 'none';
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
    const url = new URL(PAGE);
    url.searchParams.set('rvui', rvui(option, on, others));
    url.searchParams.set('rv-preview', '1');
    preview.dataset.rk2Want = url.href;
    if (preview.dataset.rk2Seen === '1') load(preview);
}

function fit(/** @type {HTMLElement} */ preview) {
    const view = /** @type {HTMLElement} */ (preview.querySelector('.rk2-preview__view'));
    const width = Number(preview.style.getPropertyValue('--rk2-w')) || 1280;
    preview.style.setProperty('--rk2-scale', String(Math.min(1, view.clientWidth / width) || 1));
}

/** Points the frame at the wanted address once, then opens the dialog in it as soon as the part has built its button. */
function load(/** @type {HTMLElement} */ preview) {
    const frame = /** @type {HTMLIFrameElement} */ (preview.querySelector('iframe'));
    const want = preview.dataset.rk2Want ?? '';
    if (!want || frame.dataset.rk2Loaded === want) return;
    frame.dataset.rk2Loaded = want;
    frame.addEventListener(
        'load',
        () => {
            // The part builds its button before it attaches the click, so press until the dialog is really open.
            let tries = 0;
            const timer = setInterval(() => {
                const doc = frame.contentDocument;
                if (doc?.querySelector('dialog.rv-dialog[open]') || ++tries > 120) return clearInterval(timer);
                const button = doc?.querySelector('[data-rv-open]');
                /** @type {HTMLElement | null | undefined} */ (button)?.click();
            }, 400);
        },
        { once: true },
    );
    frame.src = want;
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
    for (const entry of entries) fit(/** @type {HTMLElement} */ (entry.target.closest('.rk2-preview')));
});

for (const preview of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.rk2-preview'))) {
    sync(preview);
    watch.observe(preview);
    resize.observe(/** @type {HTMLElement} */ (preview.querySelector('.rk2-preview__view')));
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
