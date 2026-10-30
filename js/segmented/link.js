// A group tied to a tag input or combobox: the chips and the field hold the same values (`data-kp-segmented-for="<combobox id>"`).

import { Controller } from '../controller.js';
import { combobox } from '../combobox/handle.js';
import { CHANGE_EVENT } from '../combobox/constants.js';
import { SEGMENTED_EVENT } from './constants.js';
import { getSegmentedValues, itemsOf, valueOf } from './read.js';
import { paint } from './paint.js';

/** The attribute that names the combobox a group is tied to. */
export const LINK_ATTRIBUTE = 'data-kp-segmented-for';

/**
 * One group tied to one combobox. A chip pressed sets the field's values; a value the field gains or loses turns its chip on or off.
 * Values in the field that no chip stands for (typed ones) are kept as they are.
 */
export class SegmentedLink extends Controller {
    constructor(/** @type {HTMLElement} */ host) {
        super(host);
        /** True while this link writes to the field, so its own change is not read back. */
        this.writing = false;
    }

    /** The combobox the group names, or null while it is not on the page. @returns {HTMLElement | null} */
    target() {
        const id = this.host.getAttribute(LINK_ATTRIBUTE);
        return id ? this.host.ownerDocument.getElementById(id) : null;
    }

    connect() {
        const root = this.host.ownerDocument;
        this.listen(this.host, SEGMENTED_EVENT, () => this.toField());
        this.listen(root, CHANGE_EVENT, (event) => {
            if (!this.writing && event.target === this.target()) this.fromField();
        });
        // Typing in a single field: words that are not a chip's let that chip go.
        this.listen(root, 'input', (event) => {
            const field = this.target();
            if (!this.writing && field && event.target instanceof HTMLInputElement && field.contains(event.target) && !field.hasAttribute('data-kp-tags'))
                this.fromTyping(event.target.value);
        });
        this.fromField();
    }

    /** Light the chip whose words were typed, else none. @param {string} typed */
    fromTyping(typed) {
        const words = typed.trim().toLowerCase();
        const same = itemsOf(this.host).filter((item) => valueOf(item).toLowerCase() === words || (item.textContent ?? '').trim().toLowerCase() === words);
        paint(this.host, same.map(valueOf));
    }

    /** The values the chips stand for. @returns {Set<string>} */
    chipValues() {
        return new Set(itemsOf(this.host).map(valueOf));
    }

    /** The chips pressed: the field keeps its own values and takes the chips' on top. */
    toField() {
        const handle = combobox(this.target() ?? this.host);
        if (!handle) return;
        const chips = this.chipValues();
        const own = handle.values().filter((value) => !chips.has(value));
        this.writing = true;
        try {
            handle.set([...own, ...getSegmentedValues(this.host)]);
        } finally {
            this.writing = false;
        }
    }

    /** The field changed: the chips turn on for the values it holds. */
    fromField() {
        const handle = combobox(this.target() ?? this.host);
        if (!handle) return;
        const chips = this.chipValues();
        paint(
            this.host,
            handle.values().filter((value) => chips.has(value)),
        );
    }
}
