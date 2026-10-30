import { Controller } from '../controller.js';
/** One glyph on the page: marked as drawn, drawn, and unmarked on detach. */
export declare class DocGlyph extends Controller {
    connect(): void;
}
/**
 * Build a glyph.
 * @param {Document} doc @param {'pdf' | 'doc' | 'sheet' | 'image' | 'text' | 'unknown'} kind @param {{ size?: 'sm' | 'md' | 'lg', lines?: number, state?: 'ready' | 'missing' }} [options]
 */
export declare function docGlyph(doc: Document, kind: 'pdf' | 'doc' | 'sheet' | 'image' | 'text' | 'unknown', options?: {
    size?: 'sm' | 'md' | 'lg';
    lines?: number;
    state?: 'ready' | 'missing';
}): HTMLSpanElement;
