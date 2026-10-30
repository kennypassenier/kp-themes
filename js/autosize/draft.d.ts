/** Keep the box's text as its draft (an empty box clears it). @param {HTMLTextAreaElement} area */
export declare function keepDraft(area: HTMLTextAreaElement): void;
/** Bring a kept draft back into an empty box. @param {HTMLTextAreaElement} area */
export declare function restoreDraft(area: HTMLTextAreaElement): void;
/** The form was sent: the draft is done. @param {HTMLTextAreaElement} area */
export declare function forgetDraft(area: HTMLTextAreaElement): void;
