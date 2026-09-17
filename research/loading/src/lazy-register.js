// Strategy (b): the register of the active theme, fetched when it is needed.
//
// The shared stylesheets (tokens, components, layout, utilities) are
// linked as today. The register — the one file that is different per
// theme and the one that weighs — is inserted as a <link> when the theme
// is known, and again when it changes. Every register is wrapped in
// `@layer kp.register { ... }` by its author, and the layer ORDER is
// fixed by the first statement of css/themes.css, so a register that
// arrives later still lands in the layer that statement gave it: layout
// and utilities keep beating it, components keep losing to it.
//
// The no-flash half is research/loading/src/no-flash-lazy.js: a head
// snippet that writes the first register link before first paint, the
// way the existing snippet writes the stored theme onto <html>.
//
// Three choices, each a knob:
//   hold  — keep the theme change back until the new register has
//           arrived (default true). Otherwise the attribute flips at
//           once and the page wears the new tokens with no register
//           until the file lands: on a cold cache that is one frame at
//           best and a visible half-theme at worst.
//   prune — remove the previous theme's link after a change (default
//           false: a register whose theme is not worn is inert, since
//           every rule in it is scoped to [data-theme='name'], and
//           keeping it makes switching back free).
//   base, min — where the registers are served from, and whether to ask
//           for the minified twin.

import { applyTheme, BEFORE_THEME_EVENT, currentTheme, onThemeChange } from '../../../js/theme-core.js';

/** The attribute a register link carries, with the theme it serves as its value. */
export const REGISTER_ATTRIBUTE = 'data-kp-register';
/** Dispatched on <html>, bubbling, when a register has arrived: `{ theme, href }`. */
export const REGISTER_EVENT = 'kp-register-load';

/** @type {Map<string, Promise<HTMLLinkElement>>} */
const loads = new Map();
/** @type {Set<string>} themes whose register is in the document and has loaded */
const loaded = new Set();

/**
 * @param {string} theme
 * @param {{ base?: string, min?: boolean }} [options]
 */
export function registerHref(theme, { base = '/css/', min = false } = {}) {
    return `${base}${theme}-register${min ? '.min' : ''}.css`;
}

/** @param {string} theme @param {Document} [doc] @returns {HTMLLinkElement | null} */
export function registerLink(theme, doc = document) {
    return doc.head.querySelector(`link[${REGISTER_ATTRIBUTE}="${theme}"]`);
}

/** The registers currently in the document, in head order. @param {Document} [doc] */
export function registersPresent(doc = document) {
    return [...doc.head.querySelectorAll(`link[${REGISTER_ATTRIBUTE}]`)].map((l) => l.getAttribute(REGISTER_ATTRIBUTE) ?? '');
}

/**
 * Make sure the register for `theme` is in the document, and resolve
 * when it has loaded. A link already there (the head snippet's, or an
 * earlier call's) is reused; a failed load is forgotten so the next call
 * tries again.
 *
 * @param {string} theme
 * @param {{ base?: string, min?: boolean, doc?: Document }} [options]
 * @returns {Promise<HTMLLinkElement>}
 */
export function ensureRegister(theme, options = {}) {
    const doc = options.doc ?? document;
    const known = loads.get(theme);
    if (known) return known;
    const existing = registerLink(theme, doc);
    const link = existing ?? doc.createElement('link');
    if (!existing) {
        link.rel = 'stylesheet';
        link.href = registerHref(theme, options);
        link.setAttribute(REGISTER_ATTRIBUTE, theme);
        // Chrome honours blocking=render on a script-inserted stylesheet
        // and holds the first paint for it; a browser that does not simply
        // ignores the attribute. That is why the head snippet exists: it
        // writes the first link through the parser, which every browser
        // blocks on.
        link.setAttribute('blocking', 'render');
    }
    const promise = new Promise((resolve, reject) => {
        // A link that was in the markup may already have its sheet.
        if (existing && existing.sheet) {
            loaded.add(theme);
            resolve(existing);
            return;
        }
        link.addEventListener(
            'load',
            () => {
                loaded.add(theme);
                doc.documentElement.dispatchEvent(new CustomEvent(REGISTER_EVENT, { bubbles: true, detail: { theme, href: link.href } }));
                resolve(link);
            },
            { once: true },
        );
        link.addEventListener(
            'error',
            () => {
                loads.delete(theme);
                reject(new Error(`kp-themes: the register for "${theme}" did not load from ${link.href}`));
            },
            { once: true },
        );
    });
    loads.set(theme, promise);
    if (!existing) doc.head.append(link);
    return promise;
}

/**
 * Keep the document's registers in step with its theme.
 *
 * @param {{ base?: string, min?: boolean, hold?: boolean, prune?: boolean, root?: Element }} [options]
 * @returns {() => void} detach: stop following theme changes (links already inserted stay)
 */
export function attachLazyRegisters({ base = '/css/', min = false, hold = true, prune = false, root } = {}) {
    const doc = document;
    const html = root ?? doc.documentElement;
    const options = { base, min, doc };

    // Before a change: if the new register is not here yet, refuse the
    // change, fetch, then ask again. The second ask finds it loaded and
    // goes through, so the attribute never flips ahead of its register.
    /** @param {Event} e */
    const onBefore = (e) => {
        const { theme } = /** @type {CustomEvent} */ (e).detail;
        if (!hold || loaded.has(theme)) return;
        e.preventDefault();
        ensureRegister(theme, options).then(
            () => applyTheme(theme, { root: html }),
            (error) => console.error(error),
        );
    };
    html.addEventListener(BEFORE_THEME_EVENT, onBefore);

    const unsubscribe = onThemeChange(
        (theme, { previous }) => {
            ensureRegister(theme, options).catch((error) => console.error(error));
            if (prune && previous && previous !== theme) {
                registerLink(previous, doc)?.remove();
                loads.delete(previous);
                loaded.delete(previous);
            }
        },
        { root: html },
    );

    ensureRegister(currentTheme({ root: html }), options).catch((error) => console.error(error));

    return () => {
        html.removeEventListener(BEFORE_THEME_EVENT, onBefore);
        unsubscribe();
    };
}
