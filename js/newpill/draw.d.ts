import { NewPillCore } from './core.js';
export declare class NewPillDraw extends NewPillCore {
    /** The pill is ruled in, and taken out the way it came [prefers-reduced-motion: at once]. @param {boolean} on */
    show(on: boolean): void;
    /** The unit word for a count. @param {number} n */
    unitFor(n: number): string;
    /** The pause buttons say what they will do. */
    paintToggles(): void;
    draw(): void;
    /** A screen reader hears the count now and then, not on every row. */
    sayCount(): void;
    say(): void;
}
