// Assembles every page of the site, as a path relative to site/ plus content.

import { extractEvents } from '../site/extract-events.mjs';
import { extractAttributes } from '../site/extract-attributes.mjs';
import { extractProps } from '../site/extract-props.mjs';
import { extractKnobs } from '../site/extract-knobs.mjs';
import { attributeOwners, eventOwners } from '../site/selection.mjs';
import { DESCRIPTORS, GROUPS } from '../site/descriptors.mjs';
import { catalogueExamples } from '../site/catalogue-examples.mjs';
import { ROOT } from './config.mjs';
import { framesJs, siteCss } from './assets.mjs';
import { indexPage } from './home-page.mjs';
import { layoutPage, utilitiesPage } from './reference-pages.mjs';
import { componentPage } from './component-page.mjs';

/** Every page the site holds, as a path relative to site/ plus content. */
export function build() {
    const events = extractEvents();
    const attributes = extractAttributes();
    const sources = {
        props: extractProps(),
        events,
        knobs: extractKnobs(),
        attributes,
        // Resolved once for the whole site: an attribute's owner depends
        // on what every other page claims, not only on this one.
        eventOwners: eventOwners(events.events, DESCRIPTORS),
        attributeOwners: attributeOwners(attributes.attributes, DESCRIPTORS),
        catalogue: catalogueExamples(ROOT, DESCRIPTORS),
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
                // The ten pages TH98 built are uploaded to Pages and were
                // reachable only by typing their URL: nothing on the site
                // pointed at them. Kenny found that on 2026-09-07 and said
                // they must be linked. A page that ships and cannot be
                // navigated to is a page nobody reads.
                { href: 'examples/index.html', label: 'Example pages' },
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
        { name: 'frames.js', content: framesJs() },
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
