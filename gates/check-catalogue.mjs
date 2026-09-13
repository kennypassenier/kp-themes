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
    const shell = read('catalogue/catalogue.js');
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
    const unlisted = reviewPages.filter((page) => !listed.has(page)).sort();
    const phantom = [...listed].filter((page) => !existsSync(new URL(page, root))).sort();
    if (unlisted.length) {
        console.error(
            `${unlisted.length} review page(s) exist but the navigation in catalogue/catalogue.js does not list them:\n  ` + unlisted.join('\n  '),
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

    if (invisible.length || stale.length || gone.length || unlisted.length || phantom.length || shellless.length) process.exit(1);

    console.log(
        `catalogue: ${shown.size} of ${defined.size} component roots shown across ${pages.length} page(s), ` +
            `${pending.size} pending; ${reviewPages.length} review page(s), every one in the navigation.`,
    );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
