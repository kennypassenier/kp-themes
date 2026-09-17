// What a block looks like, in the theme on screen, as a hash — shared by the
// review page, the component pages, the research demos and the compare
// columns. The block's markup as written plus the computed style of the
// component under review and its two pseudo elements, over properties that do
// not depend on the window's width — so resizing the browser does not mark a
// block changed, and a colour, a border, a font or a spacing that moved does.
//
// Only the component, not the block around it (2026-09-13): the compare
// column lays a block out as separate rows with its own wrappers, and a hash
// over headings, look text and stage container could never match the review
// page's. So the reviewed elements are the descendants of the block's
// `.cat-stage` elements, in document order; a block with no stage (a research
// demo) gives every descendant but its own heading, look text and panel.
//
// The same in every browser of one engine (version 2, 2026-09-13): a verdict
// is only durable if the reviewer's browser reads the hash the tools read.
// Measured over all 154 blocks in six themes at 1400 and 1920 px, FireDragon
// 155 against Playwright's Firefox 153 differed in 704 of 924 readings and
// Chrome 152 against Playwright's Chromium 151 in 63, for three reasons the
// recipe now reads past:
//   - lengths: Gecko 155 keeps a font size to 1/64 px (13.3281px where 153
//     says 13.3333px), and every length taken from it in em moves with it.
//     Lengths are read to the half pixel; no difference that small is seen.
//   - `content: attr(x)`: Gecko 155 gives the attribute's text, 153 the
//     function. The function is resolved here, so both read the text.
//   - `transform`: a percentage translate (cyberpunk's sheen) is resolved in
//     pixels of the element's width, which follows the text's width, which
//     follows the browser's font rendering and the window. The translation
//     is left out of the matrix; scale, rotation and skew stay.
// And two that follow the moment and the window rather than the browser:
//   - a length in viewport units (the palette's `margin: 10vh`, fluid type
//     in `clamp(…vw…)`) moved with the window's height or width; such
//     lengths are read as "a length" (viewportDependence below).
//   - a block still loading its rows read differently in two runs; a block
//     busy beyond its markup is given up to three seconds (readBlocks).
// None of the three changes what is read, only when (2026-09-13): the version
// stayed 2. A block is read laid out and shown (judging.js), after two frames
// for the components that measure themselves, and a data table's own first
// request counts as busy.
//
// The markup without its reading aids (version 3, 2026-09-15, scope-95): the
// markup line was the block's whole section as written, its Look-at text
// included, so correcting pastel's sentence in `#dividers` (dce03cff) moved
// the block's hash in all 22 themes; read from its parent to it, version 3
// moves in pastel only. The markup is now read without what reviewedElements
// already leaves out of the element lines: the AROUND parts (Look at, and the
// reviewer's panel where a live section stands in for the source) and the
// block's own headings (`:scope > h2, h3`), which name it in lists and prompts
// and are not the component. What stays is everything that shapes the
// component: the section and its attributes, the stages with their classes
// and inline styles, and a `.cat-note`, which a block may place inside a
// stage as part of what is judged (combobox). The version-2 reading, the
// whole section as the markup line, is still returned (`earlier[2]`), so a
// verdict stored under version 2 carries over where the block did not change
// (judgements.js carryOver, `node gates/verdicts.mjs migrate --to 3`).
//
// Labels outside the stages (version 4, 2026-09-15, scope-96): a `.cat-note`
// that stands in the block but outside every `.cat-stage` names a part of the
// block for the reviewer ("At rest" above page-effects' `#headline` stage,
// "Live" in the bar of its live copy), and correcting it is not a change to
// the component, so version 4 leaves it out of the markup line. A `.cat-note`
// INSIDE a stage stays: it is part of what is judged (combobox `#open` puts
// one under the box for the open list to cover, the wizard writes its status
// line into one). A stage is a `.cat-stage` element, the block itself when it
// is one; the element lines already read only what is in the stages. A block
// with no stage (a research demo) has no inside: its notes leave the markup
// line too, and their computed style stays in the element lines as before.
// The version-3 reading is returned too (`earlier[3]`), for the same carry-over.
/**
 * The version of this recipe. catalogue/verdicts.json names the version its
 * hashes were taken with; any change to what is read below raises this, and
 * gates/check-verdicts.mjs refuses until `node gates/verdicts.mjs rehash` (or,
 * where only the markup line changed, `migrate --to <version>`) has brought
 * the register to it.
 */
export const HASH_VERSION = 6;

/** The versions readBlocks also reads each block with (`earlier`), newest first, so a verdict stored under one carries over. */
export const EARLIER_VERSIONS = [];

/** The version `previous` (readBlocks) is read with: the one before this. */
export const PREVIOUS_VERSION = 5;

export const PROPS = [
    'color',
    'background-color',
    'background-image',
    'opacity',
    'visibility',
    'display',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
    'outline-style',
    'outline-width',
    'outline-color',
    'box-shadow',
    'text-shadow',
    'filter',
    'clip-path',
    'font-family',
    'font-size',
    'font-weight',
    'font-style',
    'letter-spacing',
    'line-height',
    'text-transform',
    'text-decoration-line',
    'text-align',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'margin-top',
    'margin-bottom',
    'row-gap',
    'column-gap',
    'transform',
    'content',
];
const MAX_ELEMENTS = 400; // a 200-row table repeats one rule; the first rows say it

async function sha256(text) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hold every animation still while reading, so a glitch mid-frame is not a
 * change: a finite one is run to its end, an infinite one is set to its time 0.
 * The returned function gives each infinite animation back the time it had.
 *
 * The time only, never the play state (fix-31, 2026-09-15): `pause()` and
 * `play()` from a script outrank the CSS `animation-play-state` for good. A
 * marquee band out of view was already still (`data-kp-paused`) when it was
 * read, the old release restarted only what had been running, and the band
 * never ran again once it came into view. Everything read between holding
 * and releasing must be read synchronously, before the page renders a frame.
 */
export function stillAnimations() {
    const held = [];
    for (const animation of document.getAnimations()) {
        const timing = animation.effect?.getComputedTiming();
        if (timing && Number.isFinite(Number(timing.endTime))) animation.finish();
        else {
            held.push([animation, animation.currentTime]);
            animation.currentTime = 0;
        }
    }
    return () => {
        for (const [animation, time] of held) if (time !== null) animation.currentTime = time;
    };
}

/**
 * The blocks as written, for the length of a reading [fix-47].
 *
 * Kenny, 2026-09-16, after approving the same field blocks in theme after
 * theme: "Ik ga nog altijd in cirkels!". Measured on `catalogue/field.html`:
 * the block `#text` read 8413c69c at rest, ee6733ba with a name typed into
 * its first input, and cf1b057a with a control inside it focused — three
 * hashes for one block. So a verdict given after touching a field was given
 * on a hash nothing else ever reads, and the block came back as "Changed
 * since judged" for good.
 *
 * A reading is therefore taken of the block as written: whatever the reviewer
 * typed is put back to the markup's own value, the focus leaves the block,
 * and both are restored the moment the reading is done. Values are set
 * directly, so no component sees an input event.
 * @param {{ root: HTMLElement }[]} items the blocks being read
 * @returns {() => void} puts back what the reviewer had
 */
export function atRest(items) {
    const active = /** @type {HTMLElement | null} */ (document.activeElement);
    const inside = active && items.some((item) => item.root.contains(active));
    if (inside) active?.blur();
    /** @type {(() => void)[]} */
    const back = [];
    for (const item of items) {
        for (const control of item.root.querySelectorAll('input, textarea, select')) {
            if (control instanceof HTMLInputElement) {
                const { value, checked } = control;
                back.push(() => {
                    control.value = value;
                    control.checked = checked;
                });
                control.value = control.defaultValue;
                control.checked = control.defaultChecked;
            } else if (control instanceof HTMLTextAreaElement) {
                const { value } = control;
                back.push(() => {
                    control.value = value;
                });
                control.value = control.defaultValue;
            } else if (control instanceof HTMLSelectElement) {
                const chosen = [...control.options].map((option) => option.selected);
                back.push(() => {
                    for (const [i, option] of [...control.options].entries()) option.selected = chosen[i];
                });
                for (const option of control.options) option.selected = option.defaultSelected;
            }
        }
    }
    return () => {
        for (const put of back) put();
        if (inside) active?.focus({ preventScroll: true });
    };
}

/** Not the component: the block's reading aids and the reviewer's own panel. */
const AROUND = '.cat-look, .cat-feedback-field, .cat-approval, .cat-judge';

/**
 * A block's markup as the hash reads it: the source without its reading aids
 * and headings (version 3) and without its labels outside the stages
 * (version 4; see the head of this file). Parsed and serialised the same way
 * on every surface, so a review page, a component page, a compare column and
 * a demo read one string for one block.
 * @param {string} source the block's markup as written, one element
 * @param {number} [version] the recipe to read it with: 2 is the source as written
 */
export function componentMarkup(source, version = HASH_VERSION) {
    if (version <= 2) return source;
    const template = document.createElement('template');
    template.innerHTML = source;
    const block = template.content.firstElementChild;
    if (!block) return source;
    for (const el of block.querySelectorAll(AROUND)) el.remove();
    for (const heading of block.querySelectorAll(':scope > h2, :scope > h3')) heading.remove();
    if (version >= 4) {
        for (const note of block.querySelectorAll('.cat-note')) if (!note.closest('.cat-stage')) note.remove();
    }
    return block.outerHTML;
}

/** The descendants of every outermost stage in `stages`, in document order. */
export function stageElements(stages) {
    return stages
        .filter((stage) => !stages.some((other) => other !== stage && other.contains(stage)))
        .flatMap((stage) => [...stage.querySelectorAll('*')]);
}

/** The elements of a block that are the component under review. */
export function reviewedElements(block) {
    const stages = [...block.querySelectorAll('.cat-stage')];
    if (stages.length) return stageElements(stages);
    const headings = [...block.querySelectorAll(':scope > h2, :scope > h3')];
    return [...block.querySelectorAll('*')].filter((el) => !el.closest(AROUND) && !headings.some((h) => h.contains(el)));
}

/**
 * @param {Element} block the block as it stands on this page
 * @param {string} source the block's markup as written
 * @param {Element[]} [reviewed] the component's elements, where the block is not one element (a compare column)
 */
export async function fingerprint(block, source, reviewed = reviewedElements(block)) {
    return sha256(blockLines(block, source, reviewed).join('\n'));
}

/** A length to the half pixel, without a negative zero. */
function halfPixel(number) {
    const rounded = Math.round(Number(number) * 2) / 2;
    return String(rounded === 0 ? 0 : rounded);
}

/** A CSS string, quoted the way a computed value serialises it. */
const cssString = (text) => `"${text.replace(/["\\]/g, (c) => `\\${c}`)}"`;

const QUOTED = '"(?:[^"\\\\]|\\\\.)*"';
const ATTR = new RegExp(`attr\\(\\s*([^\\s,)]+)\\s*(?:,\\s*(${QUOTED}))?\\s*\\)`, 'g');
const ADJACENT = new RegExp(`"((?:[^"\\\\]|\\\\.)*)"\\s+"((?:[^"\\\\]|\\\\.)*)"`);

/**
 * A computed value as the recipe reads it: engine-version noise taken out
 * (see the head of this file), everything a reviewer can see kept.
 * @param {string} prop
 * @param {string} value
 * @param {Element} el the element, or a pseudo element's originating element
 */
export function normalised(prop, value, el) {
    let out = value;
    if (prop === 'transform') {
        out = out
            .replace(/matrix\(([^,]+),([^,]+),([^,]+),([^,]+),[^,]+,[^)]+\)/, 'matrix($1,$2,$3,$4)')
            .replace(/matrix3d\(((?:[^,]+,){12})[^,]+,[^,]+,[^,]+,([^)]+)\)/, 'matrix3d($1$2)');
    }
    if (prop === 'content' && out.includes('attr(')) {
        out = out.replace(ATTR, (_, name, fallback) => {
            const text = el.getAttribute(name);
            return text === null ? (fallback ?? '""') : cssString(text);
        });
        // "a" "b" is the one string "ab" once the attribute is in.
        for (let joined = out.replace(ADJACENT, '"$1$2"'); joined !== out; joined = out.replace(ADJACENT, '"$1$2"')) out = joined;
    }
    return out.replace(/(-?\d*\.?\d+(?:e[-+]?\d+)?)px/g, (_, number) => `${halfPixel(number)}px`);
}

/* ---------------------------------------------- lengths that follow the window */

// A length written in viewport or container units (`clamp(1rem, 4vw, 3rem)`,
// `10vh`, a custom property holding one) resolves to other pixels in another
// window, and no reviewer sees a block change by resizing the browser.
// Measured 2026-09-13: at 1920×700 the palette dialog's `margin: 10vh` moved
// three blocks; at 1100 px wide the footer's padding and the futuristic demo's
// display type moved two more. So the rules that use such a unit are found in
// the stylesheets, and on an element they match the lengths of the properties
// they set are read as "a length". Where the font size follows the window,
// every length in that element and below it does (em follows the font size).
const VIEWPORT_UNIT = /\d(?:[dsl]?v(?:w|h|i|b|min|max)|cq(?:w|h|i|b|min|max))\b/i;
const FAMILIES = {
    'font-size': ['font', 'font-size'],
    'line-height': ['font', 'line-height'],
    'letter-spacing': ['letter-spacing'],
    'padding-top': ['padding', 'padding-top', 'padding-block', 'padding-block-start'],
    'padding-bottom': ['padding', 'padding-bottom', 'padding-block', 'padding-block-end'],
    'padding-left': ['padding', 'padding-left', 'padding-inline', 'padding-inline-start'],
    'padding-right': ['padding', 'padding-right', 'padding-inline', 'padding-inline-end'],
    'margin-top': ['margin', 'margin-top', 'margin-block', 'margin-block-start'],
    'margin-bottom': ['margin', 'margin-bottom', 'margin-block', 'margin-block-end'],
    'row-gap': ['gap', 'row-gap'],
    'column-gap': ['gap', 'column-gap'],
    'border-top-width': ['border', 'border-width', 'border-top', 'border-top-width', 'border-block', 'border-block-start'],
    'border-bottom-width': ['border', 'border-width', 'border-bottom', 'border-bottom-width', 'border-block', 'border-block-end'],
    'border-left-width': ['border', 'border-width', 'border-left', 'border-left-width', 'border-inline', 'border-inline-start'],
    'border-right-width': ['border', 'border-width', 'border-right', 'border-right-width', 'border-inline', 'border-inline-end'],
    'border-top-left-radius': ['border-radius', 'border-top-left-radius', 'border-start-start-radius'],
    'border-top-right-radius': ['border-radius', 'border-top-right-radius', 'border-start-end-radius'],
    'border-bottom-right-radius': ['border-radius', 'border-bottom-right-radius', 'border-end-end-radius'],
    'border-bottom-left-radius': ['border-radius', 'border-bottom-left-radius', 'border-end-start-radius'],
    'outline-width': ['outline', 'outline-width'],
    'box-shadow': ['box-shadow'],
    'text-shadow': ['text-shadow'],
    filter: ['filter'],
    'clip-path': ['clip-path'],
    transform: ['transform', 'translate', 'perspective'],
    'background-image': ['background', 'background-image'],
};

/** @type {WeakMap<CSSStyleSheet, { selector: string, plain: [string, string][], vars: [string, string][] }[]>} */
const SHEETS = new WeakMap();

function rulesOf(sheet) {
    if (SHEETS.has(sheet)) return SHEETS.get(sheet);
    const found = [];
    const walk = (rules) => {
        for (const rule of rules) {
            if (rule instanceof CSSKeyframesRule) continue;
            // The catalogue's deps.css brings the package in by @import.
            if (rule instanceof CSSImportRule) {
                if (rule.styleSheet) found.push(...rulesOf(rule.styleSheet));
                continue;
            }
            if (rule instanceof CSSStyleRule) {
                const text = rule.style.cssText;
                const declared = [...text.matchAll(/(?:^|;)\s*([-\w]+)\s*:\s*([^;]*)/g)].map((m) => [m[1], m[2]]);
                const vars = declared.filter(([name]) => name.startsWith('--'));
                const plain = declared.filter(([name]) => !name.startsWith('--'));
                const candidates = plain.filter(([, value]) => VIEWPORT_UNIT.test(value) || value.includes('var('));
                if (candidates.length || vars.length) found.push({ selector: rule.selectorText, plain: candidates, vars });
            }
            if (rule.cssRules) walk(rule.cssRules);
        }
    };
    try {
        walk(sheet.cssRules);
    } catch {
        /* a stylesheet from another origin cannot be read; none is linked here */
    }
    SHEETS.set(sheet, found);
    return found;
}

/**
 * Which properties of which elements follow the window, for the stylesheets
 * on the page now. `of(el)` answers per element.
 */
export function viewportDependence(doc = document) {
    const rules = [...doc.styleSheets].flatMap(rulesOf);
    // Custom properties that hold a viewport unit, directly or through another.
    const following = new Set();
    const follows = (value) => VIEWPORT_UNIT.test(value) || [...value.matchAll(/var\(\s*(--[\w-]+)/g)].some((m) => following.has(m[1]));
    for (let grew = true; grew;) {
        grew = false;
        for (const rule of rules) {
            for (const [name, value] of rule.vars) {
                if (following.has(name)) continue;
                if (follows(value)) {
                    following.add(name);
                    grew = true;
                }
            }
        }
    }
    /** @type {Map<Element, Set<string>>} */
    const marks = new Map();
    for (const rule of rules) {
        // Only the declarations that hold such a unit, not the whole rule.
        const moving = rule.plain.filter(([, value]) => follows(value)).map(([name]) => name);
        if (!moving.length) continue;
        const props = PROPS.filter((prop) => (FAMILIES[prop] ?? []).some((family) => moving.includes(family)));
        if (!props.length) continue;
        // A pseudo element's rule counts for the element it belongs to.
        const selector = rule.selector.replace(/::?(before|after|marker|placeholder|backdrop|first-line|first-letter|selection)\b/g, '');
        let matched = [];
        try {
            matched = doc.querySelectorAll(selector || '*');
        } catch {
            continue;
        }
        for (const el of matched) {
            const set = marks.get(el) ?? new Set();
            for (const prop of props) set.add(prop);
            marks.set(el, set);
        }
    }
    const fluid = [...marks.entries()].filter(([, set]) => set.has('font-size')).map(([el]) => el);
    const none = new Set();
    return {
        of(el) {
            const all = fluid.some((root) => root === el || root.contains(el));
            return { all, props: marks.get(el) ?? none };
        },
    };
}

/**
 * What the hash is taken over, one line per element and pseudo element after
 * the markup — exported so a measurement can say which property differed.
 * @param {Element} block
 * @param {string} source
 * @param {Element[]} [reviewed]
 * @returns {string[]}
 */
export function blockLines(block, source, reviewed = reviewedElements(block), viewport = viewportDependence()) {
    const lines = [componentMarkup(source)];
    const elements = reviewed.slice(0, MAX_ELEMENTS);
    // A control whose look follows the scroll position rather than the theme
    // (back-to-top shows itself past a threshold) would mark its block changed
    // whenever the page was scrolled differently. Its state attribute is
    // lifted while reading, so the block is compared at rest.
    const volatile = reviewed.filter((el) => el.hasAttribute('data-kp-to-top-shown'));
    for (const el of volatile) el.removeAttribute('data-kp-to-top-shown');
    // Lifting the attribute starts the control's own fade; a reading taken now
    // would catch the first frame of it, so the fade is run to its end first.
    for (const el of volatile) for (const animation of el.getAnimations({ subtree: true })) animation.finish();
    for (const el of elements) {
        const follows = viewport.of(el);
        for (const pseudo of [null, '::before', '::after']) {
            const cs = getComputedStyle(el, pseudo);
            if (pseudo && (cs.content === 'none' || cs.content === 'normal')) continue;
            lines.push(
                PROPS.map((prop) => {
                    const value = normalised(prop, cs.getPropertyValue(prop), el);
                    // A length that follows the window is read as "a length".
                    return follows.all || follows.props.has(prop) ? value.replace(/-?[\d.]+(?:e[-+]?\d+)?px/g, '~px') : value;
                }).join('|'),
            );
        }
    }
    for (const el of volatile) el.setAttribute('data-kp-to-top-shown', '');
    return lines;
}

/**
 * Read every block the way a review page does: lay out, wait for the fonts,
 * hold every animation still, hash each block in order, let them run again.
 * One procedure for the pages (judging.js) and for the tools that hash a
 * block outside them (gates/verdicts.mjs), so both read the same thing.
 * @param {{ root: Element, source: string, elements?: () => Element[] }[]} items
 * @param {{ lines?: boolean }} [options] lines: also return what each hash was taken over
 * @returns {Promise<{ hash: string, previous: string, earlier: Record<number, string>, lines?: string[] }[]>}
 *   earlier: the same reading under each of EARLIER_VERSIONS, which differ only in the markup line;
 *   previous: the one under PREVIOUS_VERSION
 */
/**
 * What a block is made of, as the code says [scope-114, scope-116]: the
 * digests of gates/generate-code-version.mjs, fetched once per page.
 * @returns {Promise<CodeVersion | null>}
 */
let codeVersion = null;
export function readCodeVersion() {
    codeVersion ??= fetch(new URL('./code-version.json', import.meta.url))
        .then((response) => (response.ok ? response.json() : null))
        .catch(() => null);
    return codeVersion;
}

/**
 * @typedef {object} CodeVersion
 * @property {string} base
 * @property {Record<string, string>} themes
 * @property {Record<string, { shared: string, themes: Record<string, string> }>} families
 * @property {Record<string, { modules: string, families: string[] }>} components
 * @property {Record<string, string[]>} selectors
 * @property {Record<string, string[]>} markers
 */

/** The theme a block is read in: its own declaration, or the page's. @param {Element} block */
export const themeOf = (block) => block.getAttribute('data-cat-theme') || document.documentElement.getAttribute('data-theme') || 'formal';

/**
 * The families a block's markup names — gates/generate-code-version.mjs's
 * `familiesIn`, the same expression, so the page and the generator agree on
 * what `kp-button--primary` and `data-kp-reveal` are.
 * @param {string} text
 * @returns {string[]}
 */
export const familiesIn = (text) => [...new Set([...text.matchAll(/(?<![\w-])((?:data-)?kp-[a-z0-9]+(?:-[a-z0-9]+)*)/g)].map((m) => m[1]))].sort();

/**
 * The components a family belongs to, by tests/tags.json's selector map:
 * the longest dash-separated prefix that the map names, as gates/tags.mjs
 * reads a stylesheet.
 * @param {string} family
 * @param {Record<string, string[]>} selectors
 * @returns {string[]}
 */
export function componentsOf(family, selectors) {
    const segments = family.split('-');
    for (let n = segments.length; n >= 2; n--) {
        const found = selectors[segments.slice(0, n).join('-')];
        if (found) return found.filter((tag) => tag.startsWith('@component:')).map((tag) => tag.slice('@component:'.length));
    }
    return [];
}

/**
 * The lines a block is hashed over, version 6 [scope-116]: its markup as
 * written, the theme it is judged in, and only the code that touches it —
 * the CSS of each family its markup carries, shared and in this theme's
 * register, and the modules of each component those families belong to.
 * Kenny, 2026-09-17: "Enkel dingen die de component zelf raken mogen in de
 * hash verwerkt worden." A change to the data table's module asks about the
 * blocks with a data table in them, and about nothing else.
 * @param {Element} block
 * @param {string} source
 * @param {CodeVersion | null} code
 * @returns {string[]}
 */
export function inputLines(block, source, code) {
    const theme = themeOf(block);
    const markup = componentMarkup(source);
    if (!code) return [markup, `theme: ${theme}`, 'code: unknown'];
    const families = new Set(familiesIn(markup));
    const components = new Set();
    for (const family of families) for (const component of componentsOf(family, code.selectors)) components.add(component);
    for (const [marker, named] of Object.entries(code.markers ?? {}))
        if (markup.includes(marker)) for (const component of named) components.add(component);
    // What a component's modules write that the markup does not show — the
    // boot screen effects.js draws over an intro — is the component's too.
    for (const component of components) for (const family of code.components[component]?.families ?? []) families.add(family);
    return [
        markup,
        `theme: ${theme}`,
        `base: ${code.base} ${code.themes[theme] ?? '-'}`,
        ...[...families]
            .sort()
            .map((family) => `${family}: ${code.families[family]?.shared ?? '-'} ${code.families[family]?.themes?.[theme] ?? '-'}`),
        ...[...components].sort().map((component) => `${component}: ${code.components[component]?.modules ?? '-'}`),
    ];
}

export async function readBlocks(items, { lines = false } = {}) {
    // The theme's own typeface arrives only once a layout asks for it, and
    // until then a width-derived value reads the fallback's: cyberpunk's
    // sheen is a percentage translate, resolved in pixels of the button's
    // width, and the review page stored a hash taken before Rajdhani was in
    // (measured 2026-09-13). So: lay out, then wait for the fonts.
    void document.body.offsetWidth;
    await document.fonts?.ready;
    // A component that measures itself in a ResizeObserver (a tab row writes
    // data-kp-tabs-overflow while its tabs do not fit) learns its size only at
    // the next rendering step. A block the review page had hidden and shows
    // again for reading still carried the answer it got while hidden — no
    // overflow, so the scrolling row's padding read 0px for 8px: measured
    // 2026-09-13 in Chromium, nostromo to formal to nostromo with every block
    // judged. So two frames pass before reading; a timer stands in where no
    // frame runs (a tab in the background, where no observer runs either).
    await new Promise((resolve) => {
        const timer = setTimeout(resolve, 100);
        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                clearTimeout(timer);
                resolve(undefined);
            }),
        );
    });
    // A block still waiting for its rows (a data table on a mock server that
    // answers in 250 to 900 ms) reads as its loading state in one browser and
    // its rows in the next: measured 2026-09-13, the data table demo's
    // server block differed between two runs of one Chromium. So a block busy
    // beyond what its markup says (a loading state shown on purpose is busy
    // as written) is given up to three seconds to finish.
    // A data table written as `data-kp-state="loading"` stays busy for good,
    // so a loading state counts as busy only beyond the ones written: a data
    // table on its first request marks ITSELF `data-kp-state="loading"` and
    // `aria-busy`, and excluding every element under a loading state let the
    // review page read the server block's skeleton rows (measured 2026-09-13
    // in Chromium, 77 elements where the rows give 95).
    const count = (text, pattern) => (text.match(pattern) ?? []).length;
    const busy = (item) => {
        const elements = item.elements?.() ?? reviewedElements(item.root);
        const loading = elements.filter((el) => el.getAttribute('data-kp-state') === 'loading').length;
        const waiting = elements.filter((el) => el.getAttribute('aria-busy') === 'true' && !el.closest('[data-kp-state="loading"]')).length;
        return loading > count(item.source, /data-kp-state="loading"/g) || waiting > count(item.source, /aria-busy="true"/g);
    };
    for (const started = performance.now(); items.some(busy) && performance.now() - started < 3000;) {
        await new Promise((resolve) => setTimeout(resolve, 50));
    }
    // Version 5 reads the inputs, not the paint [scope-114]: the markup as
    // written, the theme, and the digests of the code that shapes it. The
    // waiting above stays, because a block that is still building its own
    // markup (a data table filling its rows) is not yet the block.
    const code = await readCodeVersion();
    const readings = items.map((item) => inputLines(item.root, item.source, code));
    const out = [];
    for (const read of readings) {
        const hash = await sha256(read.join('\n'));
        out.push(lines ? { hash, previous: hash, earlier: {}, lines: read } : { hash, previous: hash, earlier: {} });
    }
    return out;
}
