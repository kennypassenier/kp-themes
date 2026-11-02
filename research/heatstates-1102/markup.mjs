// research/heatstates-1102: the controls and the components' markup, written once; sections.mjs places them. Every component is the
// package's own (kp- classes, filled by demo.js); the pg- classes are this page's frame. Names and values are mock.

/** A control group: `name` is the group's data-pg name, `buttons` are [value, words, pressed?]; `target` the component it drives. */
export const group = (label, name, buttons, target = '') =>
    `<div role="group" aria-label="${label}">${buttons
        .map(
            ([value, words, on]) =>
                `<button type="button" class="kp-button kp-button--sm" data-pg="${name}" data-value="${value}"${target ? ` data-target="${target}"` : ''} aria-pressed="${on ? 'true' : 'false'}">${words}</button>`,
        )
        .join('')}</div>`;

/** The stage's width: a phone's 390 px or the whole column. */
export const width = (target, phone = true) => group('Width', 'width', [['phone', 'Phone, 390 px', phone], ['full', 'Full width', !phone]], target);

/** A line under a component that says what the page heard or measured, two lines high whether it says something or not. */
export const log = (id) => `<p class="pg-log" id="${id}" role="status" aria-live="polite"></p>`;

/** The Counters page's history card, as Habits draws it: a heading, one sentence, the grid scrolling sideways in its own box. */
export const historyCard = (id) => `<div class="kp-card pg-card">
                <h3 class="pg-card__title">Last 30 days</h3>
                <p class="pg-card__lede">Every counter, one row each, the newest day on the right.</p>
                <div class="pg-scroll"><div id="${id}" data-kp-heat></div></div>
            </div>`;
