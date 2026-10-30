// The shape of one documentation-page descriptor; documented in full in ../descriptors.mjs [AR19].

/**
 * @typedef {{ title: string, why: string, markup: string, react?: string, script?: string, frame?: boolean | { height?: string, width?: string } }} Example
 * @typedef {{ name: string, what: string }} Variant
 * @typedef {{
 *   id: string,
 *   title: string,
 *   group: string,
 *   intro: string,
 *   whenToUse: string,
 *   classes: string[],
 *   exports: string[],
 *   aliases?: string[],
 *   examples: Example[],
 *   variants: Variant[],
 *   accessibility: string[],
 * }} Descriptor
 */
