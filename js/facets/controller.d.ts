import { Controller } from '../controller.js';
export declare class FacetGroup extends Controller {
    connect(): void;
    /** The group's status region, made on first need (right after the group). @returns {HTMLElement} */
    region(): HTMLElement;
    /** Say something through the group's region. @param {string} message */
    say(message: string): void;
    /** @param {string} source @param {string} [value] */
    emit(source: string, value?: string): void;
    /** @param {Event} event */
    onChange(event: Event): void;
    /** @param {Event} event */
    onPress(event: Event): void;
}
