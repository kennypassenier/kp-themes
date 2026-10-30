import { Controller } from '../controller.js';
import { buildCard } from './build.js';
export type TourStep = import('../tour.js').TourStep;
export type TourRunOptions = {
    /**
     * the steps that are on the page
     */
    live: TourStep[];
    /**
     * the step to open on
     */
    start: number;
    /**
     * the card and its parts
     */
    ui: ReturnType<typeof buildCard>;
    returnFocus?: HTMLElement | null;
    strings?: Partial<import('../strings.js').Strings>;
    remember?: string;
    decorate?: (part: HTMLElement, info: import('../tour.js').TourDecorateInfo) => void;
    onEnd?: (finished: boolean) => void;
};
export declare class TourCore extends Controller {
    card: HTMLDialogElement;
    doc: Document;
    view: Window;
    strings: import("../strings/types.js").Strings;
    ui: {
        card: HTMLDialogElement;
        title: HTMLHeadingElement;
        text: HTMLParagraphElement;
        count: HTMLSpanElement;
        back: HTMLButtonElement;
        skip: HTMLButtonElement;
        next: HTMLButtonElement;
    };
    remember: string | undefined;
    decorate: ((part: HTMLElement, info: import('../tour.js').TourDecorateInfo) => void) | undefined;
    onEnd: ((finished: boolean) => void) | undefined;
    /** The steps that are on the page; one that vanishes is left out. @type {TourStep[]} */
    live: TourStep[];
    back: HTMLElement | null;
    index: number;
    /** The element the card talks about. @type {HTMLElement | null} */
    target: HTMLElement | null;
    /** Takes the step-change mark off the card early (a step after a step). */
    unmarkStep: () => void;
    /**
     * @param {HTMLElement} host the tour's card (a dialog); the controller's host
     * @param {TourRunOptions} options
     */
    constructor(host: HTMLElement, options: TourRunOptions);
    /** Ends the tour; the running tour overrides it. @param {boolean} _finished */
    finish(_finished: boolean): void;
    unmark(): void;
    /** @param {HTMLElement} el */
    mark(el: HTMLElement): void;
    /** A target replaced or hidden by a live update: find it again, or leave its step out. @returns {boolean} whether the step has a target again */
    refind(): boolean;
    /** Leave the current step out, and end the tour when none is left. @param {boolean} scroll */
    skipMissing(scroll: boolean): void;
    /** Put the card beside its target. */
    place(): void;
    /**
     * The card changes in place on a step after the first: it carries the
     * theme's update moment (js/update.js, `[data-kp-updating]` with the
     * idea the register's `--kp-update` names), so the next step reads as
     * news the way any value updated in place does.
     */
    markStep(): void;
    /** The card goes where the target is: into an open modal dialog when the target is in one, or it would sit behind it, inert. @param {HTMLElement} el */
    seat(el: HTMLElement): void;
    /** The words, the count and the buttons of a step. @param {TourStep} step @param {boolean} stepping */
    writeStep(step: TourStep, stepping: boolean): void;
    /** Scroll the target into view unless it is already all in the window. @param {HTMLElement} el */
    scrollInto(el: HTMLElement): void;
    /** Show a step: mark its target, seat the card, write the words, scroll and place. @param {number} i @param {boolean} [scroll] */
    show(i: number, scroll?: boolean): void;
}
