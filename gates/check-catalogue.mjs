// The catalogue's completeness gate [scope-31].
//
// The catalogue is hand-written on purpose: a generated page cannot be
// steered, and steering is the whole point of a page whose job is to be
// looked at. The price of writing it by hand is that a new component can
// be added and never shown, which is the drift a generator would have
// prevented. So this gate pays that price back: it lays the class roots
// `css/components.css` defines beside the roots the catalogue actually
// shows, and refuses a commit where one exists that nobody can see.
//
// Round eight starts with two pages against sixty-odd roots, so the
// not-yet-shown roots are listed in `catalogue/coverage.json` as a
// ratchet: a root may be listed as pending, but a root that is neither
// shown nor listed fails, and a listed root that IS shown fails too, so
// the list can only shrink. That is the same shape check-docs-private
// uses for its counts, and for the same reason — a number that can only
// go one way needs no discipline to hold.
//
// Run: node gates/check-catalogue.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
/** @param {string} path */
const read = (path) => readFileSync(new URL(path, root), 'utf8');

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

function main() {
    const components = read('css/components.css');
    const dir = new URL('catalogue/', root);
    if (!existsSync(dir)) {
        console.error('catalogue/ does not exist; the gate that guards it cannot pass');
        process.exit(1);
    }
    const pages = readdirSync(dir)
        .filter((name) => name.endsWith('.html'))
        .map((name) => readFileSync(new URL(name, dir), 'utf8'));
    if (!pages.length) {
        console.error('catalogue/ holds no pages');
        process.exit(1);
    }

    const defined = rootsIn(components);
    const shown = rootsShown(pages);
    const pending = new Set(JSON.parse(read('catalogue/coverage.json')).pending);

    // A root nobody can see and nobody wrote down: the drift this exists for.
    const invisible = [...defined].filter((name) => !shown.has(name) && !pending.has(name)).sort();
    // A root written down as pending that the catalogue now shows: the
    // ratchet's other half, so the list cannot quietly stop shrinking.
    const stale = [...pending].filter((name) => shown.has(name)).sort();
    // A pending name that no longer exists at all.
    const gone = [...pending].filter((name) => !defined.has(name)).sort();

    if (invisible.length) {
        console.error(
            `${invisible.length} component(s) exist in css/components.css and appear on no catalogue page,\n` +
                'and are not listed as pending in catalogue/coverage.json:\n  ' +
                invisible.join('\n  '),
        );
    }
    if (stale.length) {
        console.error(
            `${stale.length} component(s) are listed as pending but the catalogue already shows them;\n` +
                'remove them from catalogue/coverage.json:\n  ' +
                stale.join('\n  '),
        );
    }
    if (gone.length) {
        console.error(`${gone.length} pending component(s) no longer exist in css/components.css:\n  ` + gone.join('\n  '));
    }

    // Every review page is reachable from the navigation catalogue.js builds,
    // and the navigation names no page that does not exist. A page written
    // and left out of PAGES is a page nobody opens [scope-52].
    const shell = read('catalogue/pages.js');
    const listed = new Set([...shell.matchAll(/href:\s*'([^']+)'/g)].map((m) => m[1]));
    const reviewPages = readdirSync(dir)
        .filter((name) => name.endsWith('.html'))
        .map((name) => `catalogue/${name}`);
    const research = new URL('research/', root);
    if (existsSync(research)) {
        for (const topic of readdirSync(research)) {
            if (existsSync(new URL(`research/${topic}/demo.html`, root))) reviewPages.push(`research/${topic}/demo.html`);
        }
    }
    /** @type {Record<string, string>} */
    const readmes = {};
    if (existsSync(research)) {
        for (const topic of readdirSync(research)) {
            const readme = new URL(`research/${topic}/README.md`, root);
            if (existsSync(readme)) readmes[topic] = readFileSync(readme, 'utf8');
        }
    }
    const undecided = decidedOutsideArchive(shell, readmes);
    if (undecided.length) {
        console.error(
            `${undecided.length} decided research topic(s) are not under "Archived research" in catalogue/pages.js [fix-37]:\n  ` +
                undecided.join('\n  '),
        );
    }
    /** @type {Record<string, number>} */
    const blocksPerPage = {};
    for (const page of reviewPages.filter((name) => name.startsWith('catalogue/'))) {
        blocksPerPage[page] = (readFileSync(new URL(page, root), 'utf8').match(/class="cat-block"/g) ?? []).length;
    }
    const unjudgeable = blocksOutsideTheReview(shell, blocksPerPage);
    if (unjudgeable.length) {
        console.error(
            `${unjudgeable.length} catalogue page(s) carry blocks but are not gathered by "Every component, one page" [scope-111]:\n  ` +
                unjudgeable.join('\n  '),
        );
    }
    /** @type {Record<string, string>} */
    const pageSources = {};
    for (const page of reviewPages.filter((name) => name.startsWith('catalogue/'))) {
        pageSources[page] = readFileSync(new URL(page, root), 'utf8');
    }
    const gathered = new Set(
        [...shell.matchAll(/href:\s*'(catalogue\/[^']+)'([^}]*)}/g)].filter((match) => /component:\s*true/.test(match[2])).map((match) => match[1]),
    );
    const dead = scriptsOutsideTheReview(pageSources, gathered);
    if (dead.length) {
        console.error(
            `${dead.length} gathered catalogue page(s) run a script the review page does not, so those blocks are dead where Kenny judges [fix-43]:\n  ` +
                dead.join('\n  '),
        );
    }
    const unlisted = reviewPages.filter((page) => !listed.has(page)).sort();
    const phantom = [...listed].filter((page) => !existsSync(new URL(page, root))).sort();
    if (unlisted.length) {
        console.error(
            `${unlisted.length} review page(s) exist but the navigation in catalogue/catalogue.js (catalogue/pages.js) does not list them:\n  ` +
                unlisted.join('\n  '),
        );
    }
    // And every one of them carries the shell, or the navigation is not there
    // to reach the next page from it (Kenny, 2026-09-13: "die sidenav moet op
    // elke pagina terugkomen, anders is er ook niks aan").
    const shellless = reviewPages.filter((page) => !/src="[^"]*catalogue\.js"/.test(readFileSync(new URL(page, root), 'utf8'))).sort();
    if (shellless.length) {
        console.error(
            `${shellless.length} review page(s) do not load catalogue/catalogue.js, so they have no navigation:\n  ` + shellless.join('\n  '),
        );
    }
    if (phantom.length) {
        console.error(`${phantom.length} page(s) in the navigation do not exist:\n  ` + phantom.join('\n  '));
    }
    // An example page the navigation opens with `?review` must answer it with
    // the shell (gates/generate-examples.mjs), or the reviewer lands on a page
    // with no way back [scope-31].
    const reviewHrefs = [...shell.matchAll(/href:\s*'([^']+)'[^}]*review:\s*true/g)].map((m) => m[1]);
    const unanswered = reviewHrefs
        .filter((page) => existsSync(new URL(page, root)))
        .filter((page) => !readFileSync(new URL(page, root), 'utf8').includes("'../catalogue/catalogue.js'"))
        .sort();
    if (unanswered.length) {
        console.error(
            `${unanswered.length} page(s) the navigation opens with ?review do not load the catalogue shell when asked:\n  ` +
                unanswered.join('\n  '),
        );
    }

    // A class the package does not define styles nothing, and a page using one
    // shows the reviewer the page's mistake rather than the package's look.
    // Batch 2 found three on the first pages — kp-badge--destructive,
    // kp-alert__title, kp-field__control — each counted a root as shown while
    // painting nothing [scope-53].
    const known = new Set();
    for (const name of readdirSync(new URL('css/', root)).filter((n) => n.endsWith('.css'))) {
        for (const match of readFileSync(new URL(`css/${name}`, root), 'utf8').matchAll(/\.(kp-[a-z0-9_-]+)/g)) {
            known.add(match[1]);
        }
    }
    // The package's own modules and React components also name classes they
    // write (a calendar's blank cell, an upload row); those are its vocabulary
    // even where no rule styles them.
    for (const [folder, ext] of [
        ['js/', '.js'],
        ['components/', '.jsx'],
    ]) {
        for (const name of readdirSync(new URL(folder, root)).filter((n) => n.endsWith(ext))) {
            for (const match of readFileSync(new URL(`${folder}${name}`, root), 'utf8').matchAll(/\b(kp-[a-z0-9_-]+)/g)) {
                known.add(match[1]);
            }
        }
    }
    const used = new Map();
    const sources = [
        ...readdirSync(dir)
            .filter((n) => n.endsWith('.html') || n.endsWith('.js'))
            .map((n) => `catalogue/${n}`),
        ...(existsSync(new URL('catalogue/frame/', root)) ? readdirSync(new URL('catalogue/frame/', root)).map((n) => `catalogue/frame/${n}`) : []),
    ];
    for (const path of sources) {
        const text = readFileSync(new URL(path, root), 'utf8');
        const lists = [
            ...[...text.matchAll(/class(?:Name)?\s*=\s*["'`]([^"'`]*)["'`]/g)].map((m) => m[1]),
            ...[...text.matchAll(/classList\.(?:add|toggle|remove)\(([^)]*)\)/g)].map((m) => m[1].replace(/['"`,]/g, ' ')),
        ];
        for (const list of lists) {
            for (const name of list.split(/\s+/)) {
                if (/^kp-[a-z0-9_-]+$/.test(name) && !known.has(name)) {
                    if (!used.has(name)) used.set(name, new Set());
                    used.get(name).add(path);
                }
            }
        }
    }
    const undefinedClasses = [...used.entries()].sort(([a], [b]) => a.localeCompare(b));
    if (undefinedClasses.length) {
        console.error(
            `${undefinedClasses.length} class(es) on catalogue pages that no stylesheet in css/ defines:\n  ` +
                undefinedClasses.map(([name, paths]) => `${name}  (${[...paths].join(', ')})`).join('\n  '),
        );
    }

    // A composition uses the styled components [scope-58].
    const bare = [];
    const pendingSeen = new Set();
    for (const name of readdirSync(dir).filter((n) => n.endsWith('.html'))) {
        for (const { line, fault, pending } of bareControls(readFileSync(new URL(name, dir), 'utf8'))) {
            if (pending === undefined) bare.push(`catalogue/${name}:${line} — ${fault}`);
            else pendingSeen.add(pending);
        }
    }
    PENDING_BARE.forEach((entry, i) => {
        if (!pendingSeen.has(i))
            bare.push(`PENDING_BARE[${i}] in gates/check-catalogue.mjs matches no bare control any more — remove it (${entry.match})`);
    });
    if (bare.length) {
        console.error(
            `${bare.length} bare control(s) on catalogue pages where the package has a styled component [scope-58]:\n  ` + bare.join('\n  '),
        );
    }

    // A file name an ad or privacy blocklist refuses never reaches a reviewer
    // whose browser runs one, and a module the catalogue imports then takes
    // the whole page down with it: `catalogue/fingerprint.js` matched
    // EasyPrivacy's `/fingerprint.js^$domain=~github.com`, and FireDragon ships
    // uBlock Origin with that list on (fix-23, Kenny 2026-09-13).
    const PUBLISHED = ['catalogue', 'research', 'examples', 'css', 'js', 'fonts'];
    const BLOCKED_WORDS = /fingerprint|analytics|tracking|tracker|beacon|telemetry|advert/i;
    // Published means tracked: a build directory in the working tree (the
    // Ratatui demo's gitignored target/ holds `.fingerprint`) never reaches
    // the review site, so it is read from git, not from the disk.
    const tracked = execFileSync('git', ['-C', fileURLToPath(root), 'ls-files', '--', ...PUBLISHED], { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);
    const blockable = tracked.filter((name) => BLOCKED_WORDS.test(name.split('/').pop() ?? '')).sort();
    if (blockable.length) {
        console.error(
            `${blockable.length} published file name(s) an ad or privacy blocklist refuses, so the page breaks for a reviewer running one [fix-23]:\n  ` +
                blockable.join('\n  '),
        );
    }

    if (
        blockable.length ||
        undecided.length ||
        unjudgeable.length ||
        dead.length ||
        invisible.length ||
        stale.length ||
        gone.length ||
        unlisted.length ||
        phantom.length ||
        shellless.length ||
        unanswered.length ||
        undefinedClasses.length ||
        bare.length
    )
        process.exit(1);

    console.log(
        `catalogue: ${shown.size} of ${defined.size} component roots shown across ${pages.length} page(s), ` +
            `${pending.size} pending; ${reviewPages.length} review page(s), every one in the navigation.`,
    );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
