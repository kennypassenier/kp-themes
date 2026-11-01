// research/ux-fixes-1101: the control groups every section draws, written once.

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]; `target` is the id of the component it drives. */
export const group = (label, name, buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;

/** The stage's width: the whole column, or a phone's 390 px. */
export const width = (target, phone = false) =>
    group('Width', 'width', [['full', 'Full width', !phone], ['phone', 'Phone, 390 px', phone]], target);

/** A line under a component that says what the page heard or measured, one line high whether it says something or not. */
export const log = (id) => `<p class="pg-log" id="${id}" role="status" aria-live="polite"></p>`;

/** A caption over one of two components that stand one above the other. */
export const label = (words) => `<h3 class="pg-label">${words}</h3>`;
