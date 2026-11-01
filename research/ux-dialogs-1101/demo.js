// research/ux-dialogs-1101: the page's own wiring. Every component is a stage frame (stage.html) that runs the package; this
// file wires the control groups (the state every frame of a section is put in, the width) and the default a section asks.
// Each section is wired by its own elements, so it works on any page that shows it. The data is mock.

const $ = (/** @type {string} */ id) => /** @type {HTMLElement | null} */ (document.getElementById(id));

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the handler. */
/** @type {Record<string, (value: string, target: HTMLElement | null) => void>} */
const HANDLERS = {
    width: (value, target) => target?.setAttribute('data-pg-width', value),
    state: (value, target) => {
        for (const frame of target?.querySelectorAll('iframe.pg-stage-frame') ?? []) setState(/** @type {HTMLIFrameElement} */ (frame), value);
    },
};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    const handler = HANDLERS[button?.dataset.pg ?? ''];
    if (!button || !handler) return;
    for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', $(button.dataset.target ?? ''));
});

/**
 * Put one frame in a state. The frame's own page does it (stage.js `pgStage.set`); the frame element carries the state too, so
 * the section says what it shows, and a frame that has not loaded yet takes it on load.
 * @param {HTMLIFrameElement} frame @param {string} value
 */
function setState(frame, value) {
    frame.setAttribute('data-pg-state', value);
    const stage = stageOf(frame);
    if (stage) void stage.set(value);
}

/** @typedef {{ set: (state: string) => Promise<void>, settled: () => Promise<void> }} Stage */
/** The frame's stage, once its page has made it. @param {HTMLIFrameElement} frame @returns {Stage | null} */
const stageOf = (frame) => /** @type {{ pgStage?: Stage } | null} */ (/** @type {unknown} */ (frame.contentWindow))?.pgStage ?? null;

// A frame that loads again (a reload) shows the state its section asks, not the one in its address.
for (const frame of document.querySelectorAll('iframe.pg-stage-frame')) {
    frame.addEventListener('load', () => {
        if (!frame.getAttribute('src')) return;
        const wanted = frame.getAttribute('data-pg-state') ?? '';
        const start = new URL(/** @type {HTMLIFrameElement} */ (frame).src).searchParams.get('state');
        if (wanted && wanted !== start) setState(/** @type {HTMLIFrameElement} */ (frame), wanted);
    });
}

// The default a section asks (DEMO_RULES ch. 7): the review kit fires `review:choice`; the frame it names wears the mark.
document.addEventListener('review:choice', (event) => {
    const { value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    const section = event.target instanceof Element ? event.target : null;
    for (const frame of section?.querySelectorAll('[data-pg-frame]') ?? []) frame.toggleAttribute('data-pg-default', frame.getAttribute('data-pg-frame') === value);
});

// The frames get their address once the page has loaded: each is a whole page with the package, and the review dialog lays a
// section out when its page has loaded, so the frames must not hold that up.
const startFrames = () => {
    for (const frame of /** @type {NodeListOf<HTMLIFrameElement>} */ (document.querySelectorAll('iframe.pg-stage-frame[data-pg-src]')))
        if (!frame.getAttribute('src')) frame.src = frame.dataset.pgSrc ?? '';
};
if (document.readyState === 'complete') startFrames();
else addEventListener('load', startFrames, { once: true });
