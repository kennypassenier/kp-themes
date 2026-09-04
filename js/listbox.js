// The listbox engine, framework-free [R2-M1, TH39, TH41, TH40].
//
// Three components in this round need the same thing: a list of options
// where the arrow keys move a highlight, Enter chooses, Escape closes,
// and a screen reader is told which option is current. The combobox
// (TH39), the tag input (TH41) and the command palette (TH40) differ in
// what they do with the choice, not in how the list behaves.
//
// So the behaviour lives here once. Writing it three times is how three
// implementations end up with three different bugs — and the bug is
// always the same one: the highlight moves visually while
// `aria-activedescendant` does not, so the list works with a mouse and is
// silent to everyone else.
//
// The pattern is the ARIA authoring practice's combobox, and the part
// that matters is **virtual focus**: DOM focus stays in the text input
// while the highlight travels the list. Moving real focus into the list
// would take it out of the input, and typing would stop working.
//
// This module renders nothing. It takes an input, a list container, and a
// callback, and returns a controller. What the options ARE — where they
// come from, what they look like — belongs to the caller.

/** Options a caller may pass to `createListbox`. */
/**
 * @typedef {object} ListboxOptions
 * @property {HTMLElement} input the text input keeping DOM focus
 * @property {HTMLElement} list the element with role="listbox"
 * @property {(index: number, option: HTMLElement) => void} [onChoose] Enter or click on an option
 * @property {() => void} [onDismiss] Escape, or focus leaving
 * @property {boolean} [loop] whether Down on the last option returns to the first
 */

/** The attribute an option carries. A contract value: consumers write it [TH26]. */
export const OPTION_SELECTOR = '[data-kp-option]';

/**
 * Wire virtual focus between an input and a list of options.
 *
 * @param {ListboxOptions} options
 */
export function createListbox({ input, list, onChoose, onDismiss, loop = true }) {
    let index = -1;

    /** @returns {HTMLElement[]} the options as they stand right now */
    const options = () =>
        /** @type {HTMLElement[]} */ ([...list.querySelectorAll(OPTION_SELECTOR)].filter((el) => !el.hasAttribute('data-kp-disabled')));

    /**
     * Give every option an id, because `aria-activedescendant` refers to
     * one and an option without an id cannot be pointed at. Generated
     * rather than demanded from the consumer: an id collision between two
     * pickers on one page is the kind of bug nobody looks for.
     */
    const identify = () => {
        const base = list.id || 'kp-listbox';
        options().forEach((option, i) => {
            if (!option.id) option.id = `${base}-option-${i}`;
        });
    };

    /** @param {number} next */
    const highlight = (next) => {
        const all = options();
        if (all.length === 0) {
            index = -1;
            input.removeAttribute('aria-activedescendant');
            return;
        }
        identify();
        index = Math.max(0, Math.min(next, all.length - 1));
        all.forEach((option, i) => {
            const current = i === index;
            // Two carriers, as everywhere in this package: the attribute
            // for assistive technology and for tests, the class for CSS.
            option.setAttribute('aria-selected', String(current));
            option.classList.toggle('is-active', current);
            if (current) {
                input.setAttribute('aria-activedescendant', option.id);
                // `nearest` rather than `center`: a list that jumps under
                // the cursor on every keystroke is worse than one that
                // scrolls the minimum.
                option.scrollIntoView({ block: 'nearest' });
            }
        });
    };

    const clear = () => {
        index = -1;
        input.removeAttribute('aria-activedescendant');
        for (const option of options()) {
            option.setAttribute('aria-selected', 'false');
            option.classList.remove('is-active');
        }
    };

    /** @param {number} step */
    const move = (step) => {
        const count = options().length;
        if (count === 0) return;
        if (index === -1) {
            highlight(step > 0 ? 0 : count - 1);
            return;
        }
        const next = index + step;
        if (next < 0) highlight(loop ? count - 1 : 0);
        else if (next >= count) highlight(loop ? 0 : count - 1);
        else highlight(next);
    };

    const choose = () => {
        const all = options();
        const option = all[index];
        if (option === undefined) return false;
        onChoose?.(index, option);
        return true;
    };

    /** @param {KeyboardEvent} event */
    const onKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                move(1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                move(-1);
                break;
            case 'Home':
                if (options().length > 0) {
                    event.preventDefault();
                    highlight(0);
                }
                break;
            case 'End': {
                const count = options().length;
                if (count > 0) {
                    event.preventDefault();
                    highlight(count - 1);
                }
                break;
            }
            case 'Enter':
                // Only swallow Enter when it actually chose something;
                // otherwise a combobox inside a form would stop the form
                // from submitting, which is a trap rather than a feature.
                if (choose()) event.preventDefault();
                break;
            case 'Escape':
                onDismiss?.();
                break;
            default:
                break;
        }
    };

    /** @param {MouseEvent} event */
    const onClick = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        const option = target.closest(OPTION_SELECTOR);
        if (!(option instanceof HTMLElement) || option.hasAttribute('data-kp-disabled')) return;
        const at = options().indexOf(option);
        if (at === -1) return;
        highlight(at);
        choose();
    };

    /**
     * Hover moves the highlight so the mouse and the keyboard cannot
     * disagree about which option Enter would take.
     *
     * @param {MouseEvent} event
     */
    const onOver = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        const option = target.closest(OPTION_SELECTOR);
        if (!(option instanceof HTMLElement)) return;
        const at = options().indexOf(option);
        if (at !== -1) highlight(at);
    };

    input.addEventListener('keydown', onKeyDown);
    list.addEventListener('click', onClick);
    list.addEventListener('mouseover', onOver);

    return {
        /** Re-read the options and put the highlight back at the top. */
        refresh() {
            clear();
            identify();
        },
        /** @param {number} at */
        highlight(at) {
            highlight(at);
        },
        clear,
        /** @returns {number} the highlighted index, or -1 */
        get index() {
            return index;
        },
        /** @returns {HTMLElement[]} */
        get options() {
            return options();
        },
        destroy() {
            input.removeEventListener('keydown', onKeyDown);
            list.removeEventListener('click', onClick);
            list.removeEventListener('mouseover', onOver);
            clear();
        },
    };
}

/**
 * Does `text` match `query` as a subsequence, the way a command palette
 * matches? "thm" finds "Theme wisselen".
 *
 * Deliberately not a fuzzy-score library: this returns whether it matches
 * and the caller keeps its own order. A ranking function that nobody can
 * explain is how a palette starts putting the wrong thing first.
 *
 * @param {string} text
 * @param {string} query
 * @returns {boolean}
 */
export function subsequence(text, query) {
    if (query === '') return true;
    const haystack = text.toLowerCase();
    const needle = query.toLowerCase();
    let at = 0;
    for (const character of needle) {
        at = haystack.indexOf(character, at);
        if (at === -1) return false;
        at += 1;
    }
    return true;
}
