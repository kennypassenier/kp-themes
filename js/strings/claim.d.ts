export type ClaimStrings = {
    /**
     * The word before the last name in a list of people who bring an item (js/claim.js) [kpadopt6]
     */
    claimAnd: string;
    /**
     * Why every claim button is off when the page gives no reason (js/claim.js) [kpadopt6]
     */
    claimDisabled: string;
    /**
     * Why the buttons are off while nobody is signed in (js/claim.js) [kpadopt6]
     */
    claimNoViewer: string;
    /**
     * Why the button is off on an item that has its people (js/claim.js) [kpadopt6]
     */
    claimFullReason: (max: number) => string;
    /**
     * The button's face on an item you do not bring (js/claim.js) [kpadopt6]
     */
    claimTake: string;
    /**
     * The button's face on an item you bring (a press lets go) (js/claim.js) [kpadopt6]
     */
    claimHeld: string;
    /**
     * The words of the gap, an item nobody brings (js/claim.js) [kpadopt6]
     */
    claimNobody: string;
    /**
     * The group of people on a row, as a screen reader hears it (js/claim.js) [kpadopt6]
     */
    claimBy: (names: string) => string;
    /**
     * The same for the gap (js/claim.js) [kpadopt6]
     */
    claimNobodyLabel: string;
    /**
     * The button's name on an item you bring (js/claim.js) [kpadopt6]
     */
    claimHeldLabel: (label: string) => string;
    /**
     * The button's name on an item you do not bring (js/claim.js) [kpadopt6]
     */
    claimTakeLabel: (label: string) => string;
    /**
     * The assign mode's menu button (js/claim.js) [kpadopt6]
     */
    claimAssign: string;
    /**
     * Its name for a screen reader (js/claim.js) [kpadopt6]
     */
    claimAssignOf: (label: string) => string;
    /**
     * The assign menu's heading (js/claim.js) [kpadopt6]
     */
    claimAssignHeading: string;
    /**
     * The hint of a person who is on the item (js/claim.js) [kpadopt6]
     */
    claimAssigned: string;
    /**
     * The hint of a person who is not (js/claim.js) [kpadopt6]
     */
    claimNotAssigned: string;
    /**
     * A group's count of items somebody brings (js/claim.js) [kpadopt6]
     */
    claimGroupCount: (done: number, total: number) => string;
    /**
     * The bar's line when every item has somebody (js/claim.js) [kpadopt6]
     */
    claimAllTaken: string;
    /**
     * The bar's line with the exact number of items nobody brings (js/claim.js) [kpadopt6]
     */
    claimGapsCount: (n: number) => string;
    /**
     * The filter chips' name (js/claim.js) [kpadopt6]
     */
    claimFilterLabel: string;
    /**
     * The chip that shows every item (js/claim.js) [kpadopt6]
     */
    claimFilterAll: string;
    /**
     * The chip that shows only the items nobody brings (js/claim.js) [kpadopt6]
     */
    claimFilterGaps: string;
    /**
     * The chip that shows only the items you bring (js/claim.js) [kpadopt6]
     */
    claimFilterMine: string;
    /**
     * The bar's button that takes all items nobody brings (js/claim.js) [kpadopt6]
     */
    claimTakeAll: string;
    /**
     * The bar's button that copies the items nobody brings (js/claim.js) [kpadopt6]
     */
    claimCopyGaps: string;
    /**
     * Why those two buttons are off (js/claim.js) [kpadopt6]
     */
    claimNothingOpen: string;
    /**
     * The filter plate when no item is left without somebody (js/claim.js) [kpadopt6]
     */
    claimNoneOpenTitle: string;
    /**
     * Its sentence (js/claim.js) [kpadopt6]
     */
    claimNoneOpenText: string;
    /**
     * The filter plate for Mine when it is empty (js/claim.js) [kpadopt6]
     */
    claimNoneMineTitle: string;
    /**
     * Its sentence (js/claim.js) [kpadopt6]
     */
    claimNoneMineText: string;
    /**
     * The plates' button (js/claim.js) [kpadopt6]
     */
    claimShowAll: string;
    /**
     * The Retry of a list that could not be read (js/claim.js) [kpadopt6]
     */
    claimRetry: string;
    /**
     * The line when the server refused a change and gave no reason (js/claim.js) [kpadopt6]
     */
    claimNotSaved: string;
    /**
     * The line when somebody was faster (js/claim.js) [kpadopt6]
     */
    claimLost: (name: string, label: string) => string;
    /**
     * What is said after a change (js/claim.js) [kpadopt6]
     */
    claimAnnounce: (label: string, names: string) => string;
    /**
     * What is said after the last person let go (js/claim.js) [kpadopt6]
     */
    claimAnnounceNobody: (label: string) => string;
    /**
     * The toast after you let go (js/claim.js) [kpadopt6]
     */
    claimReleased: (label: string) => string;
    /**
     * The toast after a person was taken off (js/claim.js) [kpadopt6]
     */
    claimUnassigned: (name: string, label: string) => string;
    /**
     * The toast and the line after Take every open item (js/claim.js) [kpadopt6]
     */
    claimTookAll: (n: number) => string;
    /**
     * The text Copy the open list writes (js/claim.js) [kpadopt6]
     */
    claimCopyLine: (names: string) => string;
    /**
     * What is said after the copy (js/claim.js) [kpadopt6]
     */
    claimCopied: (n: number) => string;
    /**
     * What is said when the clipboard refuses (js/claim.js) [kpadopt6]
     */
    claimCopyFailed: string;
    /**
     * The shortcut sheet's line for c (js/claim.js) [kpadopt6]
     */
    claimKeyTake: string;
    /**
     * The sheet's heading for the claim keys (js/claim.js) [kpadopt6]
     */
    claimKeyGroup: string;
    /**
     * Why c does nothing now (js/claim.js) [kpadopt6]
     */
    claimKeyReason: string;
    /**
     * The sheet's line for Shift C (js/claim.js) [kpadopt6]
     */
    claimKeyGaps: string;
};
/**
 * @typedef {object} ClaimStrings
 * @property {string} claimAnd  The word before the last name in a list of people who bring an item (js/claim.js) [kpadopt6]
 * @property {string} claimDisabled  Why every claim button is off when the page gives no reason (js/claim.js) [kpadopt6]
 * @property {string} claimNoViewer  Why the buttons are off while nobody is signed in (js/claim.js) [kpadopt6]
 * @property {(max: number) => string} claimFullReason  Why the button is off on an item that has its people (js/claim.js) [kpadopt6]
 * @property {string} claimTake  The button's face on an item you do not bring (js/claim.js) [kpadopt6]
 * @property {string} claimHeld  The button's face on an item you bring (a press lets go) (js/claim.js) [kpadopt6]
 * @property {string} claimNobody  The words of the gap, an item nobody brings (js/claim.js) [kpadopt6]
 * @property {(names: string) => string} claimBy  The group of people on a row, as a screen reader hears it (js/claim.js) [kpadopt6]
 * @property {string} claimNobodyLabel  The same for the gap (js/claim.js) [kpadopt6]
 * @property {(label: string) => string} claimHeldLabel  The button's name on an item you bring (js/claim.js) [kpadopt6]
 * @property {(label: string) => string} claimTakeLabel  The button's name on an item you do not bring (js/claim.js) [kpadopt6]
 * @property {string} claimAssign  The assign mode's menu button (js/claim.js) [kpadopt6]
 * @property {(label: string) => string} claimAssignOf  Its name for a screen reader (js/claim.js) [kpadopt6]
 * @property {string} claimAssignHeading  The assign menu's heading (js/claim.js) [kpadopt6]
 * @property {string} claimAssigned  The hint of a person who is on the item (js/claim.js) [kpadopt6]
 * @property {string} claimNotAssigned  The hint of a person who is not (js/claim.js) [kpadopt6]
 * @property {(done: number, total: number) => string} claimGroupCount  A group's count of items somebody brings (js/claim.js) [kpadopt6]
 * @property {string} claimAllTaken  The bar's line when every item has somebody (js/claim.js) [kpadopt6]
 * @property {(n: number) => string} claimGapsCount  The bar's line with the exact number of items nobody brings (js/claim.js) [kpadopt6]
 * @property {string} claimFilterLabel  The filter chips' name (js/claim.js) [kpadopt6]
 * @property {string} claimFilterAll  The chip that shows every item (js/claim.js) [kpadopt6]
 * @property {string} claimFilterGaps  The chip that shows only the items nobody brings (js/claim.js) [kpadopt6]
 * @property {string} claimFilterMine  The chip that shows only the items you bring (js/claim.js) [kpadopt6]
 * @property {string} claimTakeAll  The bar's button that takes all items nobody brings (js/claim.js) [kpadopt6]
 * @property {string} claimCopyGaps  The bar's button that copies the items nobody brings (js/claim.js) [kpadopt6]
 * @property {string} claimNothingOpen  Why those two buttons are off (js/claim.js) [kpadopt6]
 * @property {string} claimNoneOpenTitle  The filter plate when no item is left without somebody (js/claim.js) [kpadopt6]
 * @property {string} claimNoneOpenText  Its sentence (js/claim.js) [kpadopt6]
 * @property {string} claimNoneMineTitle  The filter plate for Mine when it is empty (js/claim.js) [kpadopt6]
 * @property {string} claimNoneMineText  Its sentence (js/claim.js) [kpadopt6]
 * @property {string} claimShowAll  The plates' button (js/claim.js) [kpadopt6]
 * @property {string} claimRetry  The Retry of a list that could not be read (js/claim.js) [kpadopt6]
 * @property {string} claimNotSaved  The line when the server refused a change and gave no reason (js/claim.js) [kpadopt6]
 * @property {(name: string, label: string) => string} claimLost  The line when somebody was faster (js/claim.js) [kpadopt6]
 * @property {(label: string, names: string) => string} claimAnnounce  What is said after a change (js/claim.js) [kpadopt6]
 * @property {(label: string) => string} claimAnnounceNobody  What is said after the last person let go (js/claim.js) [kpadopt6]
 * @property {(label: string) => string} claimReleased  The toast after you let go (js/claim.js) [kpadopt6]
 * @property {(name: string, label: string) => string} claimUnassigned  The toast after a person was taken off (js/claim.js) [kpadopt6]
 * @property {(n: number) => string} claimTookAll  The toast and the line after Take every open item (js/claim.js) [kpadopt6]
 * @property {(names: string) => string} claimCopyLine  The text Copy the open list writes (js/claim.js) [kpadopt6]
 * @property {(n: number) => string} claimCopied  What is said after the copy (js/claim.js) [kpadopt6]
 * @property {string} claimCopyFailed  What is said when the clipboard refuses (js/claim.js) [kpadopt6]
 * @property {string} claimKeyTake  The shortcut sheet's line for c (js/claim.js) [kpadopt6]
 * @property {string} claimKeyGroup  The sheet's heading for the claim keys (js/claim.js) [kpadopt6]
 * @property {string} claimKeyReason  Why c does nothing now (js/claim.js) [kpadopt6]
 * @property {string} claimKeyGaps  The sheet's line for Shift C (js/claim.js) [kpadopt6]
 */
/** @type {ClaimStrings} */
export declare const CLAIM_STRINGS: ClaimStrings;
