// Shapes shared by the site generator's parts.

import { extractAttributes } from '../site/extract-attributes.mjs';
import { extractEvents } from '../site/extract-events.mjs';
import { extractKnobs } from '../site/extract-knobs.mjs';
import { extractProps } from '../site/extract-props.mjs';

/**
 * @typedef {{ href: string, label: string }} Link
 * @typedef {{ group: string, links: Link[] }[]} Nav
 * @typedef {{
 *   props: ReturnType<typeof extractProps>,
 *   events: ReturnType<typeof extractEvents>,
 *   knobs: ReturnType<typeof extractKnobs>,
 *   attributes: ReturnType<typeof extractAttributes>,
 *   eventOwners: Map<string, Set<string>>,
 *   attributeOwners: Map<string, Set<string>>,
 *   catalogue: Map<string, import('../site/catalogue-examples.mjs').Block[]>,
 * }} Sources
 * @typedef {import('../site/descriptors.mjs').Descriptor} Descriptor
 */
