export type Timer = import('./types.js').Timer;
/** @typedef {import('./types.js').Timer} Timer */
/** The sounds a list may choose. @type {readonly ['chime', 'bell', 'buzzer']} */
export declare const TIMER_SOUNDS: readonly ['chime', 'bell', 'buzzer'];
/**
 * Play one of the sounds, once. Call it from a press (a preview) or let a timer's end call it.
 * @param {string} [sound]  'chime' (default), 'bell' or 'buzzer'; anything else is the chime, 'off' is silence
 * @returns {number} how long it lasts in seconds (0 where nothing played)
 */
export declare function playTimerSound(sound?: string): number;
/**
 * Say a sentence aloud with the browser's voice, in the page's language. Where there is no speech nothing happens.
 * @param {string} text
 * @returns {boolean} whether it was handed to the voice
 */
export declare function speakTimerMessage(text: string): boolean;
/** Wake the sound up from a press, so a sound may play later without one. */
export declare function primeSound(): void;
/** @param {Timer} timer */
export declare function stopRing(timer: Timer): void;
