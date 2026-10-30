/** The screen line. @param {HTMLElement} root @param {string} wakeState */
export declare function paintWake(root: HTMLElement, wakeState: string): void;
/** Ask for the screen to stay on. @param {HTMLElement} root */
export declare function holdScreen(root: HTMLElement): Promise<void>;
/** @param {HTMLElement} root */
export declare function letScreenGo(root: HTMLElement): void;
/** The screen option changed at run time: ask for the screen again, or let it go. @param {HTMLElement} root */
export declare function applyWake(root: HTMLElement): void;
