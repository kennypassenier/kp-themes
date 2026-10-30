import { Controller } from '../controller.js';
/** Follows one card in four data states. */
export declare class CardStateController extends Controller {
    connect(): void;
    /** A framework wrote `data-kp-state`: sync, unless the card is in that state already. */
    onState(): void;
    /** A press on Try again of this card, not of a card inside it. @param {Event} event */
    onPress(event: Event): void;
}
