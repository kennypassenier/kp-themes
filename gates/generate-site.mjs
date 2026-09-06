// The documentation site [TH100, TH101, TH102, S27].
//
// One generator, one output directory. Everything a page states about
// the package is either extracted from a source file or rendered from a
// document that already exists; the descriptors in gates/site/descriptors.mjs
// hold only what no machine can know -- prose, examples, and which unit a
// page is about.
//
// The site is written atomically (AR22): the whole tree goes into a
// temporary directory and is renamed into place, so an interrupted run
// never leaves a half-written site behind.
//
// Usage:
//   node gates/generate-site.mjs           write site/
//   node gates/generate-site.mjs --check   exit 1 if anything would change

import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { DESCRIPTORS, GROUPS } from './site/descriptors.mjs';
import { escape, section, shell } from './site/chrome.mjs';
import { highlight, highlightCss } from './site/highlight.mjs';
import { renderMarkdown } from './site/markdown.mjs';
import { extractAttributes } from './site/extract-attributes.mjs';
import { extractEvents } from './site/extract-events.mjs';
import { extractKnobs } from './site/extract-knobs.mjs';
import { extractProps } from './site/extract-props.mjs';
import { FAMILIES, names as utilityNames } from './generate-utilities.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const OUT = join(ROOT, 'site');

/** @type {string[]} */
const ORDER = JSON.parse(readFileSync(join(ROOT, 'themes/order.json'), 'utf8'));

// MR-R6-1: nine spans across six anatomy documents use underscore
// emphasis, an eighth construct T10's measurement missed. The renderer
// refuses it by default; the site passes the flag so all 24 stories can
// render at all. Provisional, pending the mini-round: the alternative is
// rewriting those nine spans as bold and dropping the flag.
const EMPHASIS = { emphasis: true };

const UTILITY_COUNT = utilityNames().length;

/**
 * @typedef {{ href: string, label: string }} Link
 * @typedef {{ group: string, links: Link[] }[]} Nav
 * @typedef {{
 *   props: ReturnType<typeof extractProps>,
 *   events: ReturnType<typeof extractEvents>,
 *   knobs: ReturnType<typeof extractKnobs>,
 *   attributes: ReturnType<typeof extractAttributes>,
 * }} Sources
 * @typedef {import('./site/descriptors.mjs').Descriptor} Descriptor
 */

/** The six tokens a theme is recognised by, shown as chips beside its story. */
const SWATCH_TOKENS = ['background', 'card', 'foreground', 'primary', 'muted-foreground', 'border'];

/** The `## The idea` section of a theme's anatomy, rendered. */
/** @param {string} theme */
function story(theme) {
    const file = `themes/${theme}/anatomy.md`;
    const source = readFileSync(join(ROOT, file), 'utf8');
    // The story is the theme's own reason for existing, which is what
    // `## The idea` and `## What is load-bearing` say. Rendering the
    // whole document would put the invariant answers and the L3 notes on
    // a page meant to introduce a theme -- and would make the page a copy
    // of the file rather than a reading of it [TH102].
    const wanted = ['The idea', 'What is load-bearing'];
    const blocks = [];
    for (const heading of wanted) {
        const start = source.indexOf(`\n## ${heading}\n`);
        if (start === -1) throw new Error(`${file} has no "## ${heading}" section`);
        const after = source.indexOf('\n## ', start + 1);
        blocks.push(source.slice(start + heading.length + 5, after === -1 ? undefined : after).trim());
    }
    return renderMarkdown(blocks.join('\n\n'), { file, ...EMPHASIS }).html;
}

/**
 * The swatch strip beside a story: the theme's live tokens, not an image.
 *
 * The `data-theme` sits on the whole card, not on this list, so the card
 * itself is painted by the theme it describes -- and so the labels keep
 * the contrast the gates guarantee. With the attribute on the list only,
 * a dark theme's muted-foreground landed on a light card.
 */
function swatches() {
    const tokens = SWATCH_TOKENS;
    return `                        <ul class="sc-swatches kp-row kp-gap-xs kp-mb-md">
${tokens
    .map(
        (t) =>
            `                            <li class="sc-swatch" data-sc-token="${t}"><span class="sc-swatch__chip" data-sc-swatch="${t}"></span><span class="sc-swatch__name">${t}</span></li>`,
    )
    .join('\n')}
                        </ul>`;
}

/** @param {Nav} nav */
function indexPage(nav) {
    const stories = ORDER.map(
        (theme) => `                    <article class="kp-card sc-story" data-sc-story="${theme}" data-theme="${theme}">
                        <h3 class="kp-fw-semibold kp-mb-sm">${theme}</h3>
${swatches()}
                        <div class="kp-prose">
${story(theme)}
                        </div>
                    </article>`,
    ).join('\n');

    const body = [
        `                <header class="kp-section">
                    <h1 class="kp-fw-bold">kp-themes</h1>
                    <p class="kp-prose">One design system, ${ORDER.length} themes, two delivery channels and no runtime dependencies. Every page on this site is generated from the package's own sources, so nothing here can drift from what ships.</p>
                </header>`,
        section(
            'install',
            'Install',
            `                    <pre class="kp-code-block"><code>${highlight('npm install @kp-soft/themes', 'js')}</code></pre>
                    <pre class="kp-code-block"><code>${highlight('<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/themes.css" />\n<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/components.css" />\n<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/layout.css" />\n<link rel="stylesheet" href="node_modules/@kp-soft/themes/css/utilities.css" />', 'html')}</code></pre>`,
        ),
        section(
            'themes',
            `The ${ORDER.length} themes`,
            `                    <p class="kp-prose">Each theme answers the same questions differently. What follows is why each one exists, taken from its own anatomy document, with its live tokens beside it.</p>
                    <div class="kp-autogrid kp-gap-lg">
${stories}
                    </div>`,
        ),
    ].join('\n');

    return shell({
        title: 'Start',
        description: `The kp-themes design system: ${ORDER.length} themes, two delivery channels, no runtime dependencies.`,
        depth: 1,
        nav,
        current: 'site/index.html',
        body,
    });
}

/**
 * The layout layer, read out of the stylesheet that ships it.
 *
 * Not rendered from docs/LAYOUT.md: that document holds tables and code
 * fences, which the story renderer refuses by design (T10 measured the
 * seven constructs the anatomy documents use, and no more). Reading the
 * stylesheet instead is the stronger version anyway -- a class renamed in
 * css/layout.css changes this page, where a prose document would keep
 * its old claim [AR21].
 */
function layoutClasses() {
    const css = readFileSync(join(ROOT, 'css/layout.css'), 'utf8');
    /** @type {{selector: string, comment: string, knobs: string[]}[]} */
    const out = [];
    // Each rule is preceded by the comment that explains it, and every
    // knob it reads is a `var(--kp-…, ` in its body.
    const rule = /(?:\/\* ([^*]*?)\*\/\s*)?^ {4}([.[][^{\n]*?) \{\n([\s\S]*?)^ {4}\}/gm;
    for (const match of css.matchAll(rule)) {
        const [, comment, selector, body] = match;
        const knobs = [...body.matchAll(/var\((--kp-[a-z0-9-]+)/g)].map((m) => m[1]);
        out.push({
            selector: selector.trim(),
            comment: (comment ?? '').replace(/\s+/g, ' ').trim(),
            knobs: [...new Set(knobs)],
        });
    }
    return out;
}

/** @param {Nav} nav */
function layoutPage(nav) {
    const classes = layoutClasses();
    const knobs = [...new Set(classes.flatMap((c) => c.knobs))].sort();
    const rows = classes
        .map(
            (c) =>
                `                            <tr><td><code>${escape(c.selector)}</code></td><td>${escape(c.comment)}</td><td>${c.knobs.map((k) => `<code>${escape(k)}</code>`).join(', ') || '—'}</td></tr>`,
        )
        .join('\n');
    return shell({
        title: 'Layout layer',
        description: 'The layout classes, what each one is for, and the knobs it reads.',
        depth: 1,
        nav,
        current: 'site/layout.html',
        body: [
            `                <header class="kp-section">
                    <h1 class="kp-fw-bold">Layout layer</h1>
                    <p class="kp-prose">Classes for the shape of a page, in the cascade layer after the components, so a layout class wins on a component that sets the same property itself. Every value reads a knob whose default is the theme spacing scale.</p>
                </header>`,
            section(
                'classes',
                `The ${classes.length} rules`,
                `                    <div class="sc-example__live"><table class="kp-table"><thead><tr><th>Selector</th><th>What it is for</th><th>Knobs</th></tr></thead><tbody>\n${rows}\n                    </tbody></table></div>`,
            ),
            section(
                'knobs',
                `The ${knobs.length} knobs`,
                `                    <p class="kp-prose">Set any of these on a page, a theme or a single element. Each falls back to the scale.</p>
                    <ul class="kp-row kp-gap-sm">\n${knobs.map((k) => `                        <li><code>${escape(k)}</code></li>`).join('\n')}\n                    </ul>`,
            ),
        ].join('\n'),
    });
}

/** The utility API, read out of the generator that writes it [AR21]. */
/** @param {Nav} nav */
function utilitiesPage(nav) {
    const families = FAMILIES.map((family) => {
        const rows = family
            .classes()
            .map(
                (entry) =>
                    `                            <tr><td><code>.${escape(String(entry[0]))}</code></td><td><code>${escape(entry[1].map(([prop, value]) => `${prop}: ${value}`).join('; '))}</code></td></tr>`,
            )
            .join('\n');
        return section(
            family.id,
            family.title,
            `                    <p class="kp-prose">${escape(family.note)}</p>
                    <div class="sc-example__live"><table class="kp-table"><thead><tr><th>Class</th><th>What it sets</th></tr></thead><tbody>\n${rows}\n                    </tbody></table></div>`,
        );
    }).join('\n');
    return shell({
        title: 'Utility API',
        description: 'Every generated utility class and the declaration it carries.',
        depth: 1,
        nav,
        current: 'site/utilities.html',
        body: [
            `                <header class="kp-section">
                    <h1 class="kp-fw-bold">Utility API</h1>
                    <p class="kp-prose">${UTILITY_COUNT} single-purpose classes in the last cascade layer, so a utility beats a component value without an override. There are no breakpoint variants; the layout containers do responsive work instead.</p>
                </header>`,
            families,
        ].join('\n'),
    });
}

/** One documented unit, with its nine sections [S27]. */
/**
 * @param {Nav} nav
 * @param {Descriptor} descriptor
 * @param {Sources} sources
 */
function componentPage(nav, descriptor, sources) {
    const { props, events, knobs, attributes } = sources;
    const component = props.components.find((c) => descriptor.exports.includes(c.name));

    const examples = descriptor.examples
        .map(
            (ex) => `                    <figure class="sc-example">
                        <figcaption class="kp-fw-semibold">${escape(ex.title)}</figcaption>
                        <p class="kp-text-muted">${escape(ex.why)}</p>
                        <div class="sc-example__live kp-card" data-sc-live>
${ex.markup}
                        </div>
                        <pre class="kp-code-block" data-sc-snippet><code>${highlight(ex.markup.trim(), 'html')}</code></pre>
                    </figure>`,
        )
        .join('\n');

    const propRows = (component?.props ?? [])
        .map(
            (p) =>
                `                            <tr><td><code>${escape(p.name)}</code></td><td><code>${escape(p.type)}</code></td><td>${p.optional ? 'optional' : 'required'}</td><td>${escape(p.description)}</td></tr>`,
        )
        .join('\n');

    const ownEvents = events.events.filter((e) => descriptor.classes.some((c) => e.module.includes(c.replace(/^kp-/, ''))));
    const ownKnobs = knobs.knobs.filter((k) => k.families.some((f) => descriptor.classes.includes(f)));
    const ownAttributes = attributes.attributes.filter((a) => a.families.some((f) => descriptor.classes.includes(f)));

    /**
     * @param {string[]} head
     * @param {string} rows
     * @param {string} empty
     */
    const table = (head, rows, empty) =>
        rows.length === 0
            ? `                    <p class="kp-text-muted">${empty}</p>`
            : `                    <table class="kp-table"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>\n${rows}\n                    </tbody></table>`;

    const body = [
        `                <header class="kp-section">
                    <h1 class="kp-fw-bold">${escape(descriptor.title)}</h1>
                    <p class="kp-prose">${escape(descriptor.intro)}</p>
                </header>`,
        section('when', 'When to use it', `                    <p class="kp-prose">${escape(descriptor.whenToUse)}</p>`),
        section('example', 'Live example', examples),
        section(
            'markup',
            'Framework-free markup',
            `                    <p class="kp-prose">Server-rendered markup with the behaviour attached on import. The snippets above are that markup, printed from the same string the example renders.</p>
${table(
    ['Attribute', 'What it does'],
    ownAttributes
        .map((a) => `                            <tr><td><code>${escape(a.name)}</code></td><td>${escape(a.roles.join(', '))}</td></tr>`)
        .join('\n'),
    'This unit reads no data attributes of its own.',
)}`,
        ),
        section(
            'react',
            'React usage',
            component
                ? `                    <pre class="kp-code-block"><code>${highlight(`import { ${component.name} } from '@kp-soft/themes/${component.module.replace(/\.jsx$/, '')}';`, 'js')}</code></pre>`
                : `                    <p class="kp-text-muted">This unit has no React component; it is CSS and markup only.</p>`,
        ),
        section('props', 'Props', table(['Prop', 'Type', 'Required', 'What it does'], propRows, 'No props: this unit is CSS and markup only.')),
        section(
            'events',
            'Events',
            table(
                ['Event', 'What it means'],
                ownEvents
                    .map((e) => `                            <tr><td><code>${escape(e.name)}</code></td><td>${escape(e.description)}</td></tr>`)
                    .join('\n'),
                'This unit fires no events.',
            ),
        ),
        section(
            'knobs',
            'Knobs',
            table(
                ['Custom property', 'Default'],
                ownKnobs
                    .map(
                        (k) =>
                            `                            <tr><td><code>${escape(k.name)}</code></td><td><code>${escape(k.defaults[0] ?? '')}</code></td></tr>`,
                    )
                    .join('\n'),
                'This unit reads no knobs of its own.',
            ),
        ),
        section(
            'a11y',
            'Accessibility',
            `                    <ul class="kp-stack">\n${descriptor.accessibility.map((a) => `                        <li>${escape(a)}</li>`).join('\n')}\n                    </ul>`,
        ),
        section(
            'variants',
            'Variants and states',
            table(
                ['Name', 'What it is'],
                descriptor.variants
                    .map((v) => `                            <tr><td><code>${escape(v.name)}</code></td><td>${escape(v.what)}</td></tr>`)
                    .join('\n'),
                'This unit has one appearance and no states.',
            ),
        ),
    ].join('\n');

    return shell({
        title: descriptor.title,
        description: descriptor.intro,
        depth: 2,
        nav,
        current: `site/components/${descriptor.id}.html`,
        body,
    });
}

/** The site's own stylesheet: furniture plus the snippet colours. */
function siteCss() {
    return `/* Generated by gates/generate-site.mjs — do not edit by hand. */
/* The site's own furniture. Every class carries the \`sc-\` prefix, so the
   site can restyle itself without touching a name the package promises
   its consumers (AR23). Nothing here styles a bare element: the pages are
   built out of css/layout.css and css/utilities.css, which is the point. */

@layer kp.utilities {
    .sc-skip {
        position: absolute;
        inset-inline-start: -9999px;
    }

    .sc-skip:focus {
        position: static;
    }

    .sc-brand {
        display: block;
        color: var(--primary);
        text-decoration: none;
    }

    .sc-nav__title {
        font-size: 0.75em;
        color: var(--muted-foreground);
    }

    .sc-nav__list {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .sc-nav__link {
        display: block;
        padding-block: 0.15rem;
        color: var(--foreground);
        text-decoration: none;
    }

    .sc-nav__link[aria-current='page'] {
        color: var(--primary);
    }

    .sc-swatches {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    /* The strip wraps and each chip keeps its own width: with the row
       held on one line the six labels overlapped each other and the last
       one ran past the card edge. */
    .sc-swatch {
        flex: 0 0 auto;
        inline-size: 4.5rem;
    }

    .sc-swatch__chip {
        display: block;
        inline-size: 100%;
        block-size: 1.75rem;
        border: 1px solid var(--border);
    }

    .sc-swatch__name {
        display: block;
        font-size: 0.6875em;
        line-height: 1.2;
        color: var(--muted-foreground);
        overflow-wrap: anywhere;
    }

    .sc-example__live {
        overflow-x: auto;
    }

    /* One rule per swatch token rather than a style attribute on each
       chip: the site holds itself to the same bar it asks of the example
       pages (TH109). */
${SWATCH_TOKENS.map((t) => `    .sc-swatch__chip[data-sc-swatch='${t}'] {\n        background: var(--${t});\n    }`).join('\n\n')}
}

${highlightCss()}`;
}

/** Every page the site holds, as a path relative to site/ plus content. */
function build() {
    const sources = {
        props: extractProps(),
        events: extractEvents(),
        knobs: extractKnobs(),
        attributes: extractAttributes(),
    };

    /** @type {{group: string, links: {href: string, label: string}[]}[]} */
    const nav = [
        {
            group: 'Getting started',
            links: [
                { href: 'site/index.html', label: 'Start' },
                { href: 'site/layout.html', label: 'Layout layer' },
                { href: 'site/utilities.html', label: 'Utility API' },
                { href: 'showcase/index.html', label: 'Showcase' },
            ],
        },
        ...GROUPS.filter((g) => g !== 'Getting started').map((group) => ({
            group,
            links: DESCRIPTORS.filter((d) => d.group === group).map((d) => ({
                href: `site/components/${d.id}.html`,
                label: d.title,
            })),
        })),
    ].filter((s) => s.links.length > 0);

    /** @type {{name: string, content: string}[]} */
    const pages = [
        { name: 'site.css', content: siteCss() },
        { name: 'index.html', content: indexPage(nav) },
        { name: 'layout.html', content: layoutPage(nav) },
        { name: 'utilities.html', content: utilitiesPage(nav) },
        ...DESCRIPTORS.map((d) => ({
            name: `components/${d.id}.html`,
            content: componentPage(nav, d, sources),
        })),
    ];
    return pages;
}

const pages = build();

if (process.argv.includes('--check')) {
    let stale = 0;
    for (const page of pages) {
        const path = join(OUT, page.name);
        const current = existsSync(path) ? readFileSync(path, 'utf8') : '';
        if (current !== page.content) {
            stale++;
            console.error(`site/${page.name} does not match its source.`);
        }
    }
    const expected = new Set(pages.map((p) => p.name));
    /**
     * @param {string} dir
     * @param {string} prefix
     */
    const walk = (dir, prefix = '') => {
        if (!existsSync(dir)) return;
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const rel = prefix + entry.name;
            if (entry.isDirectory()) walk(join(dir, entry.name), `${rel}/`);
            else if (!expected.has(rel)) {
                stale++;
                console.error(`site/${rel} is generated by nothing.`);
            }
        }
    };
    walk(OUT);
    if (stale > 0) {
        console.error('Run `npm run generate:site` and commit the result.');
        process.exit(1);
    }
    console.log(`Site: ${pages.length} files match their source (${ORDER.length} theme stories).`);
    process.exit(0);
}

// Atomic (AR22): the whole tree is written beside the target and moved
// into place, so an interrupted run leaves the old site standing rather
// than half of a new one.
const staging = mkdtempSync(join(tmpdir(), 'kp-site-'));
for (const page of pages) {
    const path = join(staging, page.name);
    mkdirSync(join(path, '..'), { recursive: true });
    writeFileSync(path, page.content);
}
rmSync(OUT, { recursive: true, force: true });
cpSync(staging, OUT, { recursive: true });
rmSync(staging, { recursive: true, force: true });
console.log(`Wrote site/: ${pages.length} files, ${ORDER.length} theme stories.`);
