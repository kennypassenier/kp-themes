// One component documentation page, rendered from a descriptor and the extracted sources.

import { escape, indent, section, shell } from '../site/chrome.mjs';
import { highlight } from '../site/highlight.mjs';
import { knobsOf, rowsOf } from '../site/selection.mjs';
/** @typedef {import('./types.mjs').Nav} Nav */
/** @typedef {import('./types.mjs').Sources} Sources */
/** @typedef {import('./types.mjs').Descriptor} Descriptor */

/**
 * One documented unit, with its nine sections [S27].
 *
 * @param {Nav} nav
 * @param {Descriptor} descriptor
 * @param {Sources} sources
 */
export function componentPage(nav, descriptor, sources) {
    const { props, events, knobs, attributes } = sources;
    // Every export the page documents, in the order the descriptor names
    // them, and each with its own table: a page that documented two and
    // printed one table was showing the first component's props under the
    // second component's name.
    //
    // A component whose props are written inline in the declaration
    // (`Spinner`, `Skeleton`) is not in `components` — the mapping rule is
    // `X` is documented by `XProps` — but the extractor parsed its members
    // all the same and reports it as unmapped with the reason. Reading it
    // from there is the difference between "no props" and "no props type".
    const documented = descriptor.exports
        .map((name) => props.components.find((c) => c.name === name) ?? props.unmapped.find((u) => u.name === name))
        .filter((c) => c !== undefined);

    const examples = descriptor.examples
        .map((ex) => ({ ...ex, markup: indent(ex.markup) }))
        .map(
            (ex) => `                    <figure class="sc-example">
                        <figcaption class="kp-fw-semibold">${escape(ex.title)}</figcaption>
                        <p class="kp-text-muted">${escape(ex.why)}</p>
                        <div class="sc-example__live kp-card" data-sc-live>
${ex.frame ? frameOf(ex) : ex.markup}${ex.script ? liveScript(ex.script) : ''}
                        </div>
                        <pre class="kp-code-block" data-sc-snippet><code>${highlight(ex.markup.trim(), 'html')}</code></pre>${
                            ex.script
                                ? `\n                        <p class="kp-text-muted">The page’s part: it hands the component its data.</p>\n                        <pre class="kp-code-block" data-sc-snippet><code>${highlight(ex.script.trim(), 'js')}</code></pre>`
                                : ''
                        }
                    </figure>`,
        )
        .join('\n');

    // The catalogue's blocks about this component, each with what to look at
    // and the markup folded under it: the options and states the handful of
    // examples above do not show (Kenny, 2026-09-29).
    const more = (sources.catalogue.get(descriptor.id) ?? [])
        .map((block) => {
            const markup = block.stages.map((stage) => indent(stage)).join('\n');
            // Several stages in one block (a loading table and a failed one)
            // keep their own boxes, as they do in the catalogue.
            const live = block.stages
                .map((stage, i) => `<div class="sc-example__stage${block.rows[i] ? ' sc-example__stage--row' : ''}">\n${indent(stage)}\n</div>`)
                .join('\n');
            const look = block.look.charAt(0).toUpperCase() + block.look.slice(1);
            // Two catalogue pages may both have an #invalid block; the page
            // name keeps the anchor unique.
            const anchor = `more-${block.page.replace(/\.html$/, '')}-${block.id}`;
            return `                    <figure class="sc-example" id="${escape(anchor)}">
                        <figcaption class="kp-fw-semibold">${escape(block.title)}</figcaption>
                        <p class="kp-text-muted">${look}</p>
                        <div class="sc-example__live kp-card" data-sc-live>
${live}
                        </div>
                        <details class="sc-example__code"><summary>Markup</summary><pre class="kp-code-block" data-sc-snippet><code>${highlight(markup.trim(), 'html')}</code></pre></details>
                    </figure>`;
        })
        .join('\n');

    const ownEvents = rowsOf(events.events, sources.eventOwners, descriptor);
    const ownKnobs = knobsOf(knobs.knobs, descriptor);
    const ownAttributes = rowsOf(attributes.attributes, sources.attributeOwners, descriptor);

    /**
     * One machine-sourced table, in the package's own scroll wrapper.
     *
     * Not a bare table: at 360px the props table on every component page
     * was 525px wide and the whole document scrolled sideways with it,
     * which is the fault `.kp-table-wrap` exists to prevent (DI11,
     * SC 1.4.10). The site holds itself to the bar it sets. The label is
     * what names the scroll region, so it is the section's own word
     * rather than a caption repeating the heading above it.
     *
     * @param {string} label
     * @param {string[]} head
     * @param {string} rows
     * @param {string} empty
     */
    const table = (label, head, rows, empty) =>
        rows.length === 0
            ? `                    <p class="kp-text-muted">${empty}</p>`
            : `                    <div class="kp-table-wrap" data-kp-region-label="${escape(label)}"><table class="kp-table"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>\n${rows}\n                    </tbody></table></div>`;

    const body = [
        `                <header class="kp-section">
                    <h1 class="kp-fw-bold">${escape(descriptor.title)}</h1>
                    <p class="kp-prose">${escape(descriptor.intro)}</p>
                </header>`,
        section('when', 'When to use it', `                    <p class="kp-prose">${escape(descriptor.whenToUse)}</p>`),
        section('example', 'Live example', examples),
        ...(more === ''
            ? []
            : [
                  section(
                      'more-examples',
                      'More examples',
                      `                    <p class="kp-prose">Every option and state, one block each, taken from the review catalogue so the two cannot drift apart.</p>\n${more}`,
                  ),
              ]),
        section(
            'markup',
            'Framework-free markup',
            `                    <p class="kp-prose">Server-rendered markup with the behaviour attached by <code>js/auto.js</code>, the one module that does anything on import. The snippets above are that markup, printed from the same string the example renders.</p>
                    <p class="kp-prose">These are the framework-free channel's props. A <em>selector</em> is how a module finds an element, a <em>read</em> is a value you set on it, and a <em>written</em> one is state the module puts back for the stylesheet and for you to read.</p>
${table(
    'Attributes',
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
            documented.length > 0
                ? `                    <pre class="kp-code-block"><code>${highlight(
                      `import { ${documented.map((c) => c.name).join(', ')} } from '@kp-soft/themes';`,
                      'js',
                  )}</code></pre>
                    <p class="kp-text-muted">Declared in ${documented.map((c) => `<code>${escape('module' in c ? c.module : c.declaration.replace(/\.d\.ts$/, '.jsx'))}</code>`).join(', ')}; the package re-exports every component from its root.</p>`
                : `                    <p class="kp-text-muted">This unit has no React component; it is CSS and markup only.</p>`,
        ),
        section(
            'props',
            'Props',
            documented.length === 0
                ? `                    <p class="kp-text-muted">No props: this unit is CSS and markup only.</p>`
                : documented
                      .map(
                          (c) =>
                              `                    <h3 class="kp-fw-semibold"><code>${escape(c.name)}</code></h3>\n${table(
                                  `${c.name} props`,
                                  ['Prop', 'Type', 'Required', 'What it does'],
                                  c.props
                                      .map(
                                          (p) =>
                                              `                            <tr><td><code>${escape(p.name)}</code></td><td><code>${escape(p.type)}</code></td><td>${p.optional ? 'optional' : 'required'}</td><td>${escape(p.description)}</td></tr>`,
                                      )
                                      .join('\n'),
                                  'This component declares no props of its own.',
                              )}`,
                      )
                      .join('\n'),
        ),
        section(
            'events',
            'Events',
            table(
                'Events',
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
                'Knobs',
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
                'Variants and states',
                ['Name', 'What it is'],
                descriptor.variants
                    .map((v) => `                            <tr><td><code>${escape(v.name)}</code></td><td>${escape(v.what)}</td></tr>`)
                    .join('\n'),
                'This unit has one appearance and no states.',
            ) +
                (ownAttributes.length === 0
                    ? ''
                    : '\n                    <p class="kp-text-muted">Options written as attributes are read again when they change. A component of your own that reads options from attributes does the same with <code>watchOptions(element, attributes, onChange)</code> from <code>js/live-options.js</code>.</p>'),
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

/**
 * A framed example's live half: the markup inside a <template>, which the
 * page's site/frames.js turns into an iframe document. A fixed launcher, a
 * panel against the window's edge or a pushed page needs a window of its own
 * to be itself; in the page it would take over the documentation. The
 * template holds the example's markup as written, so the page still carries
 * the string the snippet prints [AR19].
 *
 * @param {{ title: string, markup: string, frame?: boolean | { height?: string, width?: string } }} ex
 */
function frameOf(ex) {
    const height = typeof ex.frame === 'object' && ex.frame.height ? ` data-sc-frame-height="${escape(ex.frame.height)}"` : '';
    const width = typeof ex.frame === 'object' && ex.frame.width ? ` data-sc-frame-width="${escape(ex.frame.width)}"` : '';
    return `                            <template data-sc-frame data-sc-frame-title="${escape(ex.title)}"${height}${width}>
${ex.markup}
                            </template>`;
}

/**
 * An example's `script`: the page's part of it (it hands a component its
 * data). The snippet prints it with the package's specifiers; the live page
 * runs the same text with each `@kp-soft/themes/js/x` pointing at the
 * module in this tree, so the two cannot diverge [AR19]. It runs before
 * js/auto.js, so the page's options are the ones that count.
 *
 * @param {string} script
 */
function liveScript(script) {
    const run = script.trim().replace(/@kp-soft\/themes\/js\/([a-z-]+)/g, '../../js/$1.js');
    return `\n                            <script type="module">\n${run}\n                            </script>`;
}
