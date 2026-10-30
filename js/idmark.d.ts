export { IDMARK, IDMARK_SLOTS, IDMARK_GLYPHS, idmarkLetters, idmarkFor, idmarkColours } from './idmark/mark.js';
export { IDMARK_STATUSES } from './idmark/avatar.js';
export { setIdmark } from './idmark/draw.js';
export { setIdmarkGroup } from './idmark/group.js';
export { attachIdmarks } from './idmark/attach.js';
export type IdmarkPerson = {
    name: string;
    /**
     * the photo
     */
    src?: string;
    status?: 'online' | 'away' | 'busy' | 'none';
};
/**
 * @typedef {object} IdmarkPerson
 * @property {string} name
 * @property {string} [src] the photo
 * @property {'online' | 'away' | 'busy' | 'none'} [status]
 */
