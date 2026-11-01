// The pure checks of the catalogue gate [scope-31]: class roots defined and shown, bare controls, research decisions, review blocks and scripts.
// gates/check-catalogue.mjs reads the files and runs them; it re-exports these names for its tests.

/**
 * The class roots a stylesheet defines: `.kp-table__cell` -> `kp-table`.
 * @param {string} css
 */
export function rootsIn(css) {
    const found = new Set();
    for (const match of css.matchAll(/\.(kp-[a-z0-9-]+)/g)) {
        found.add(match[1].split('__')[0].replace(/--.*$/, ''));
    }
    return found;
}

/**
 * The class roots the catalogue's pages actually put on an element.
 * @param {string[]} pages
 */
export function rootsShown(pages) {
    const found = new Set();
    for (const html of pages) {
        for (const match of html.matchAll(/class="([^"]*)"/g)) {
            for (const name of match[1].split(/\s+/)) {
                if (name.startsWith('kp-')) found.add(name.split('__')[0].replace(/--.*$/, ''));
            }
        }
    }
    return found;
}

/**
 * Bare controls the gate knows about and does not refuse yet, each with the
 * reason and a matcher on the tag's attributes. An entry nothing matches any
 * more fails, so the list can only shrink.
 *
 * @type {{ match: RegExp, reason: string }[]}
 */
// Empty since the data table round gave its selection boxes the theme's
// checkbox (gap-13, 2026-09-13); an entry here is refused once it matches nothing.
export const PENDING_BARE = [];

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

/**
 * The bare controls a page carries where the package has a styled one
 * [scope-58]. Kenny judged a composition on the catalogue and found a
 * native date input in it, beside a styled everything else: "elke component
 * in een compositie moet het gestylede element zijn." Three shapes:
 *
 *   - a date input (`type="date"` or `datetime-local`) outside a `.kp-datepicker`
 *   - a `<select>` without `.kp-field__input`
 *   - a checkbox or radio without `.kp-field__check` or `.kp-switch__input`
 *
 * A small tag walker rather than a parser dependency: it keeps the stack of
 * open elements with their classes, which is all "outside" needs.
 *
 * @param {string} html
 * @returns {{ line: number, fault: string, pending?: number }[]}
 */
export function bareControls(html) {
    const text = html
        .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '))
        .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, (m) => m.replace(/[^\n]/g, ' '));
    /** @type {{ name: string, classes: string[] }[]} */
    const stack = [];
    /** @type {{ line: number, fault: string, pending?: number }[]} */
    const found = [];
    for (const match of text.matchAll(/<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g)) {
        const [whole, closing, rawName, attributes] = match;
        const name = rawName.toLowerCase();
        const line = text.slice(0, match.index).split('\n').length;
        if (closing) {
            const at = stack.map((e) => e.name).lastIndexOf(name);
            if (at !== -1) stack.length = at;
            continue;
        }
        /** @param {string} attribute */
        const attr = (attribute) => new RegExp(`(?:^|\\s)${attribute}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(attributes);
        const value = (/** @type {string} */ attribute) => {
            const m = attr(attribute);
            return m ? (m[2] ?? m[3] ?? m[4] ?? '') : null;
        };
        const classes = (value('class') ?? '').split(/\s+/).filter(Boolean);
        if (name === 'input') {
            const type = (value('type') ?? 'text').toLowerCase();
            const inPicker = stack.some((e) => e.classes.includes('kp-datepicker'));
            if ((type === 'date' || type === 'datetime-local') && !inPicker) {
                found.push({ line, fault: `a bare <input type="${type}"> outside a .kp-datepicker` });
            }
            if ((type === 'checkbox' || type === 'radio') && !classes.includes('kp-field__check') && !classes.includes('kp-switch__input')) {
                const pending = PENDING_BARE.findIndex((entry) => entry.match.test(attributes));
                found.push({ line, fault: `a ${type} without .kp-field__check or .kp-switch__input`, ...(pending === -1 ? {} : { pending }) });
            }
        }
        if (name === 'select' && !classes.includes('kp-field__input')) {
            found.push({ line, fault: 'a <select> without .kp-field__input' });
        }
        if (!VOID.has(name) && !whole.endsWith('/>')) stack.push({ name, classes });
    }
    return found;
}

/**
 * The research topics whose README says they are decided ("**Decided (scope-N)"
 * near its top) but whose page the navigation still lists outside "Archived
 * research". The laurels demo stayed under "Research to look at" after
 * scope-93 decided it, until Kenny asked [fix-37].
 * @param {string} shell the text of catalogue/pages.js
 * @param {Record<string, string>} readmes topic → README text
 * @returns {string[]}
 */
export function decidedOutsideArchive(shell, readmes) {
    const groupOf = new Map();
    for (const part of shell.split(/group:\s*'/).slice(1)) {
        const group = part.slice(0, part.indexOf("'"));
        // One page outside the archive puts the whole topic outside [fix-53]:
        // a later page under "Archived research" must not overwrite it.
        for (const m of part.matchAll(/href:\s*'research\/([^/']+)\//g)) {
            if (groupOf.get(m[1]) === undefined || groupOf.get(m[1]) === 'Archived research') groupOf.set(m[1], group);
        }
    }
    return Object.entries(readmes)
        .filter(([, text]) => /^\*\*Decided \(/m.test(text.split('\n').slice(0, 12).join('\n')))
        .filter(([topic]) => groupOf.has(topic) && groupOf.get(topic) !== 'Archived research')
        .map(([topic]) => `research/${topic} (listed under "${groupOf.get(topic)}")`)
        .sort();
}

/**
 * The other way round: research topics the navigation files under "Archived
 * research" while their README carries no "**Decided (" line near its top.
 * On 2026-10-03 the signature-elements demo went straight into the archive
 * while Kenny was still judging it, and the closed look-round still stood
 * under "Research to look at" (Kenny: "wat een omgekeerde wereld"). A topic
 * without a README is not judged here.
 * @param {string} shell the text of catalogue/pages.js
 * @param {Record<string, string>} readmes topic → README text
 * @returns {string[]}
 */
export function archivedUndecided(shell, readmes) {
    const archive = shell.split(/group:\s*'Archived research'/)[1] ?? '';
    const topics = new Set([...archive.matchAll(/href:\s*'research\/([^/']+)\//g)].map((m) => m[1]));
    return [...topics]
        .filter((topic) => topic in readmes)
        .filter((topic) => !/^\*\*Decided \(/m.test(readmes[topic].split('\n').slice(0, 12).join('\n')))
        .map((topic) => `research/${topic} (no "**Decided (" line in its README)`)
        .sort();
}

/**
 * The catalogue pages that carry blocks but are not listed as component pages
 * [scope-111]. Kenny judges through "Every component, one page", which gathers
 * the component pages only, so a block on an unlisted page can never be judged.
 * @param {string} shell the text of catalogue/pages.js
 * @param {Record<string, number>} blocksPerPage catalogue page href → how many blocks it carries
 * @returns {string[]}
 */
export function blocksOutsideTheReview(shell, blocksPerPage) {
    const listed = new Map();
    for (const match of shell.matchAll(/href:\s*'(catalogue\/[^']+)'([^}]*)}/g)) {
        listed.set(match[1], /component:\s*true/.test(match[2]));
    }
    return Object.entries(blocksPerPage)
        .filter(([href, blocks]) => blocks > 0 && listed.has(href) && !listed.get(href))
        .map(([href, blocks]) => `${href} (${blocks} block(s), listed without component: true)`)
        .sort();
}

/**
 * The scripts a component page runs that the review page does not [fix-43].
 *
 * "Every component, one page" copies a block's markup and runs its own
 * scripts; a block whose behaviour comes from the page's module therefore
 * arrives dead where Kenny judges. That is how the four theme intros reached
 * him with a Play button that did nothing. So a component page may only load
 * what catalogue/index.html loads too.
 * @param {Record<string, string>} sources catalogue page path -> its html
 * @param {Set<string>} gathered the pages "Every component, one page" gathers
 * @returns {string[]} one line per page that runs something the review page does not
 */
export function scriptsOutsideTheReview(sources, gathered) {
    const REVIEW = 'catalogue/index.html';
    /** @param {string} html */
    const scripts = (html) => [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1].replace(/^\.\//, ''));
    const review = new Set(scripts(sources[REVIEW] ?? ''));
    return Object.entries(sources)
        .filter(([page]) => page !== REVIEW && gathered.has(page))
        .map(([page, html]) => [page, scripts(html).filter((src) => !review.has(src))])
        .filter(([, missing]) => missing.length)
        .map(([page, missing]) => `${page} runs ${/** @type {string[]} */ (missing).join(', ')}, which ${REVIEW} does not load`)
        .sort();
}
