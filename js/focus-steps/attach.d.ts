/**
 * Wire every focus-steps view under `root`: its buttons, keys, swipe, Read
 * aloud, and the screen kept on until the detach.
 * @param {ParentNode} [scope]
 * @returns {() => void} detach
 */
export declare function attachFocusSteps(scope?: ParentNode): () => void;
/**
 * Go on, exactly as the Next button does: a question is answered first, the last step ends the flow with Done.
 * @param {Element} root a focus-steps view that is attached
 */
export declare function nextStep(root: Element): void;
/**
 * Go back, exactly as the Back button does (within the active track when there are tracks).
 * @param {Element} root a focus-steps view that is attached
 */
export declare function prevStep(root: Element): void;
