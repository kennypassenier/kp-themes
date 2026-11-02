// research/parts-forms-1102: the page's control groups. Each is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in
// its group and calls the group's handler with the pressed value and the component the group drives (`data-target`).

/** @param {string} id */
export const $ = (id) => /** @type {HTMLElement} */ (document.getElementById(id));

/** One line the page says under a component. @param {string} id @param {string} words */
export const say = (id, words) => {
    const line = document.getElementById(id);
    if (line) line.textContent = words;
};

/** Two animation frames: what a press changed has been laid out. */
export const settle = () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => done(undefined))));

/** @type {Record<string, (value: string, target: HTMLElement | null) => void>} */
const HANDLERS = {};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    const handler = HANDLERS[button?.dataset.pg ?? ''];
    if (!button || !handler) return;
    for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', document.getElementById(button.dataset.target ?? ''));
});

/** @param {string} name @param {(value: string, target: HTMLElement | null) => void} handler */
export const on = (name, handler) => {
    HANDLERS[name] = handler;
};

/** The pressed value of a group that drives `target`. @param {string} name @param {string} target @param {string} fallback */
export const pressed = (name, target, fallback) =>
    /** @type {HTMLElement | null} */ (document.querySelector(`button[data-pg="${name}"][data-target="${target}"][aria-pressed="true"]`))?.dataset.value ?? fallback;

on('width', (value, target) => target?.setAttribute('data-pg-width', value));
