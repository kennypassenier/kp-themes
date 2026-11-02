export type PressHandlers = {
    mode: 'now' | 'hold';
    /**
     * how long a finger holds still before it lifts (the `hold` mode)
     */
    holdMs: number;
    /**
     * the element that takes the pointer once the press is a drag
     */
    capture: Element;
    /**
     * the press is a drag from here; false refuses it (nothing moves)
     */
    start: (e: PointerEvent) => boolean;
    /**
     * a step of the drag
     */
    move: (e: PointerEvent) => void;
    /**
     * let go (`drop`), or put back (`back`: Escape, cancelled)
     */
    end: (how: 'drop' | 'back', e: PointerEvent | null) => void;
    /**
     * a finger held still long enough: the item is lifted and the next move drags it
     */
    lift?: () => void;
};
/** Hold back the scroll of a touch that lifted an item. Put on an element before any touch starts on it. @param {EventTarget} el */
export declare function holdScroll(el: EventTarget): () => void;
/**
 * Follow one press. Its listeners go when it ends.
 * @param {PointerEvent} down
 * @param {PressHandlers} h
 */
export declare function followPress(down: PointerEvent, h: PressHandlers): void;
