import { WizardView } from './view.js';
/** One step wizard. */
export declare class WizardController extends WizardView {
    connect(): void;
    /** @param {number} to @returns {Promise<boolean>} whether the wizard moved */
    goTo(to: number): Promise<boolean>;
    onNext(): void;
    /** @param {Event} event */
    onLabel(event: Event): void;
    /** @param {KeyboardEvent} event */
    onLabelKey(event: KeyboardEvent): void;
}
