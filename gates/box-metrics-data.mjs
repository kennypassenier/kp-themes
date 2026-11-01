// What the box-metrics guard (gates/box-metrics.test.mjs) knows: the covered boxes, the block and type metrics, the package tokens, and the declarations a register may keep.

/**
 * The covered boxes, by what their subject compound carries.
 *
 * The button in every size and variant; the field — which is also the
 * select, the date field's input and the inline editor — except the
 * multi-line one, which is a text box and keeps its block padding; the
 * combobox input, which is also the tag input's; and a table's header and
 * body cells, whose block size is the row's height.
 */
export const COVERED = [
    { name: '.kp-button', matches: (/** @type {string} */ compound) => /\.kp-button(?:--[\w-]+)?(?![\w-])/.test(compound) },
    { name: '.kp-field__input', matches: (/** @type {string} */ compound) => /\.kp-field__input(?![\w-])/.test(compound) },
    { name: '.kp-combobox__input', matches: (/** @type {string} */ compound) => /\.kp-combobox__input(?![\w-])/.test(compound) },
    {
        name: '.kp-table th, td, tr',
        matches: (/** @type {string} */ compound, /** @type {string} */ selector) =>
            /^(?:th|td|tr)(?![\w-])/.test(compound) && /\.kp-(?:data)?table(?![\w-])/.test(selector),
    },
];

/** The type metrics option B adds to a box's block metrics [scope-87]. */
export const TYPE_METRICS = ['font', 'font-size', 'line-height'];

/**
 * The boxes option B covers [scope-87], each with the properties a register
 * may not set on it. A trail or a link strip is covered for its type only:
 * its descendants inherit the size, and its own padding is layout.
 *
 * @type {{ name: string, properties: string[], matches: (compound: string, selector: string) => boolean }[]}
 */
export const COVERED_TYPE = [];

/** The block metrics of a covered box. */
export const BLOCK_METRICS = [
    'height',
    'min-height',
    'max-height',
    'block-size',
    'min-block-size',
    'max-block-size',
    'line-height',
    'padding',
    'padding-block',
    'padding-block-start',
    'padding-block-end',
    'padding-top',
    'padding-bottom',
];

COVERED_TYPE.push(
    {
        name: 'a heading (h1–h6, .kp-card__title, .kp-dialog__title)',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound) => /^h[1-6](?![\w-])/.test(compound) || /\.kp-(?:card|dialog)__title(?![\w-])/.test(compound),
    },
    {
        name: '.kp-field__label / .kp-field__help',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound) => /\.kp-field__(?:label|help)(?![\w-])/.test(compound),
    },
    { name: '.kp-tab', properties: [...TYPE_METRICS, ...BLOCK_METRICS], matches: (compound) => /\.kp-tab(?![\w-])/.test(compound) },
    { name: '.kp-badge', properties: [...TYPE_METRICS, ...BLOCK_METRICS], matches: (compound) => /\.kp-badge(?:--[\w-]+)?(?![\w-])/.test(compound) },
    {
        name: 'a bar link (.kp-nav__link, .kp-nav__disclosure, .kp-nav__search-trigger, a dropdown or mega-menu link)',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound, selector) =>
            /\.kp-nav__(?:link|disclosure|search-trigger)(?![\w-])/.test(compound) ||
            (/^a(?![\w-])/.test(compound) && /\.kp-nav__(?:menu|group)(?![\w-])/.test(selector)),
    },
    { name: '.kp-nav__links', properties: TYPE_METRICS, matches: (compound) => /\.kp-nav__links(?![\w-])/.test(compound) },
    {
        name: '.kp-sidenav__link',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound) => /\.kp-sidenav__(?:link|category-toggle)(?![\w-])/.test(compound),
    },
    // scope-88: the bar's call to action, a field's error and the side navigation's title.
    {
        name: '.kp-nav__link--cta',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound) => /\.kp-nav__link--cta(?![\w-])/.test(compound),
    },
    { name: '.kp-field__error', properties: [...TYPE_METRICS, ...BLOCK_METRICS], matches: (compound) => /\.kp-field__error(?![\w-])/.test(compound) },
    {
        name: '.kp-sidenav__title',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound) => /\.kp-sidenav__title(?![\w-])/.test(compound),
    },
    {
        name: '.kp-breadcrumb / .kp-pagination',
        properties: TYPE_METRICS,
        matches: (compound) => /\.kp-(?:breadcrumb|pagination)(?![\w-])/.test(compound),
    },
    {
        name: 'a breadcrumb or pagination item',
        properties: [...TYPE_METRICS, ...BLOCK_METRICS],
        matches: (compound, selector) =>
            /^(?:a|li|span|button)(?![\w-])|^\[aria-current/.test(compound) && /\.kp-(?:breadcrumb|pagination)(?![\w-])/.test(selector),
    },
);

/** The tokens the heights are made of: a register may not restate them either. */
export const PACKAGE_TOKENS = [
    '--kp-control-height',
    '--kp-control-padding-block',
    '--kp-control-line-height',
    '--kp-line-height',
    '--kp-row-height',
    '--kp-button-height-sm',
    '--kp-button-height-lg',
    '--kp-button-padding-block-sm',
    '--kp-button-padding-block-lg',
    '--kp-table-cell-block',
    // Option B [scope-87].
    '--kp-heading-line-height',
    '--kp-h1-size',
    '--kp-h2-size',
    '--kp-h3-size',
    '--kp-h4-size',
    '--kp-h5-size',
    '--kp-h6-size',
    '--kp-display-line-height',
    '--kp-card-title-size',
    '--kp-dialog-title-size',
    '--kp-footer-heading-size',
    '--kp-field-label-size',
    '--kp-field-help-size',
    '--kp-badge-size',
    '--kp-badge-line-height',
    '--kp-badge-padding-block',
    '--kp-tab-size',
    '--kp-tab-padding-block',
    '--kp-nav-link-size',
    '--kp-nav-link-padding-block',
    '--kp-nav-menu-link-size',
    '--kp-nav-menu-link-padding-block',
    '--kp-sidenav-link-size',
    '--kp-sidenav-link-padding-block',
    '--kp-sidenav-item-pad',
    '--kp-breadcrumb-size',
    '--kp-pagination-size',
    // scope-88.
    '--kp-field-error-size',
    '--kp-sidenav-title-size',
];

/**
 * Declarations a register may keep, each with its reason. Listed rather than
 * pattern-matched, so adding one is a decision somebody makes on purpose.
 *
 * @type {Record<string, string>}
 */
export const MAY_KEEP = {
    // The button's own entry went on 2026-09-15 (Kenny's retro notes): its
    // pressed step is painted now, not padded, so it keeps no block metric.
    // The call to action's entry followed the same day [scope-93]: its press
    // is painted the button's way.
    // Option B [scope-87]: block padding that is a painted bar's or a frame's inset, not the heading's size.
    "deco-register.css [data-theme='deco'] [data-kp-surface] h1[data-kp-reveal='headline'] padding":
        'the headline is set in a cartouche, a stepped frame drawn around it: the padding is the room between the frame and the words.',
    "cyberpunk-register.css [data-theme='cyberpunk'] [data-kp-surface] h2 padding-top":
        'the room above the words where the four corner brackets are painted (background gradients): without it the brackets cross the letters.',
};
