// research/parts-layout-1102: the small pieces of markup every section uses: a control group, the width control, the event line
// and two named frames.

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]. */
export const group = (label, name, buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;

/** The stage's width: the whole column, or a phone's 390 px. */
export const width = (target) => group('Width', 'width', [['full', 'Full width', true], ['phone', 'Phone, 390 px']], target);

/** A line under a component that says what the page heard, one line high whether it says something or not. */
export const log = (id) => `<p class="pg-log" id="${id}" role="status" aria-live="polite"></p>`;

/** The option a section shows, switched live on every element of the component that carries `data-pg-attr`: [value, words,
 * pressed?]; the value `off` takes the attribute away. */
export const option = (target, buttons) => group('Option', 'opt', buttons, target);
