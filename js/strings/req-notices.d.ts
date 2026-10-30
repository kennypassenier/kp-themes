export type ReqNoticesStrings = {
    /**
     * The accessible name of an on-this-page list (js/page-contents.js) [wish-1120]
     */
    contentsLabel: string;
    /**
     * The heading over an on-this-page list [wish-1120]
     */
    contentsTitle: string;
    /**
     * The caret's place under a code field, "Line 3, column 12" (js/code-field.js) [wish-1120]
     */
    codeFieldPosition: (line: number, column: number) => string;
    /**
     * The problem the page found in a code field, with its place [wish-1120]
     */
    codeFieldError: (line: number, column: number, message: string) => string;
    /**
     * The same when only the line is known [wish-1120]
     */
    codeFieldErrorLine: (line: number, message: string) => string;
    /**
     * The same when no place is known [wish-1120]
     */
    codeFieldErrorPlain: (message: string) => string;
    /**
     * Why a form is held back while a code field has an error [wish-1120]
     */
    codeFieldBlocked: string;
    /**
     * The accessible name of the line numbers [kpadopt5]
     */
    jsonGutter: string;
    /**
     * The validity message that stops a form with broken JSON [kpadopt5]
     */
    jsonBlocked: string;
    /**
     * The error line when the page's shape check refuses valid JSON [kpadopt5]
     */
    jsonSchemaFailed: (why: string) => string;
    /**
     * Said after Format [kpadopt5]
     */
    jsonFormatted: string;
    /**
     * The accessible name of the request list (js/request-inspector.js) [kpadopt5]
     */
    reqLabel: string;
    /**
     * The empty list's heading [kpadopt5]
     */
    reqEmptyTitle: string;
    /**
     * Its sentence [kpadopt5]
     */
    reqEmptyText: string;
    /**
     * Its button [kpadopt5]
     */
    reqSendTest: string;
    /**
     * The failed list's heading [kpadopt5]
     */
    reqFailedTitle: string;
    /**
     * The busy card's words [kpadopt5]
     */
    reqLoading: string;
    /**
     * The headers block's heading [kpadopt5]
     */
    reqHeaders: string;
    /**
     * The body block's title [kpadopt5]
     */
    reqBody: string;
    /**
     * A request without a body [kpadopt5]
     */
    reqNoBody: string;
    /**
     * A request without headers [kpadopt5]
     */
    reqNoHeaders: string;
    /**
     * Copy as curl [kpadopt5]
     */
    reqCopyCurl: string;
    /**
     * Copy as JSON [kpadopt5]
     */
    reqCopyJson: string;
    /**
     * Copy the body [kpadopt5]
     */
    reqCopyBody: string;
    /**
     * The separate button that copies the curl with the real secrets [kpadopt5]
     */
    reqCopyCurlSecrets: string;
    /**
     * Said after a copy, "curl copied, secrets masked" is built from this and the next [kpadopt5]
     */
    reqCopyDone: (what: string) => string;
    /**
     * Added to a copy that masked the secrets [kpadopt5]
     */
    reqMaskedNote: string;
    /**
     * The button that shows one masked header on screen [kpadopt5]
     */
    reqSecretShow: string;
    /**
     * The same, once shown [kpadopt5]
     */
    reqSecretHide: string;
    /**
     * What a screen reader hears for a masked value [kpadopt5]
     */
    reqSecretMasked: string;
    /**
     * The button under the list, "Show 12 older" [kpadopt5]
     */
    reqShowOlder: (n: number) => string;
    /**
     * The accessible name of the status filter [kpadopt5]
     */
    reqFilterLabel: string;
    /**
     * The filter's first choice [kpadopt5]
     */
    reqFilterAll: string;
    /**
     * The word beside a 2xx status [kpadopt5]
     */
    reqToneSuccess: string;
    /**
     * The word beside a 3xx status [kpadopt5]
     */
    reqToneInfo: string;
    /**
     * The word beside a 4xx status [kpadopt5]
     */
    reqToneWarning: string;
    /**
     * The word beside a 5xx status [kpadopt5]
     */
    reqToneError: string;
    /**
     * The word beside a request without a status [kpadopt5]
     */
    reqToneNone: string;
    /**
     * The badge of a request the page sent itself [kpadopt5]
     */
    reqSourceTest: string;
    /**
     * The line above the list, "20 of 31 requests" [kpadopt5]
     */
    reqCount: (shown: number, total: number) => string;
    /**
     * The list when the filter shows nothing [kpadopt5]
     */
    reqNoMatch: string;
    /**
     * A request's accessible name [kpadopt5]
     */
    reqSummary: (method: string, path: string, status: string) => string;
    /**
     * The counter button's word (js/notices.js) [kpadopt5-notices]
     */
    noticesInbox: string;
    /**
     * The panel's heading [kpadopt5-notices]
     */
    noticesTitle: string;
    /**
     * The Inbox page's heading [kpadopt5-notices]
     */
    noticesPageTitle: string;
    /**
     * The accessible name of the list of notices [kpadopt5-notices]
     */
    noticesList: string;
    /**
     * The counter's label, "5 unread" [kpadopt5-notices]
     */
    noticesUnread: (n: number) => string;
    /**
     * The counter's label with nothing unread [kpadopt5-notices]
     */
    noticesNoneUnread: string;
    /**
     * The counter's label when the notices could not be read [kpadopt5-notices]
     */
    noticesCounterError: (why: string) => string;
    /**
     * The counter button's accessible name, "Inbox: 5 unread. Quiet until 09:00" [kpadopt5-notices]
     */
    noticesCounterName: (inbox: string, label: string, quiet: string) => string;
    /**
     * What the busy card over the list says, and the counter's label while it loads [kpadopt5-notices]
     */
    noticesLoading: string;
    /**
     * The quiet line, "Quiet until 09:00" [kpadopt5-notices]
     */
    noticesQuiet: (time: string) => string;
    /**
     * The button that ends the quiet time [kpadopt5-notices]
     */
    noticesEndQuiet: string;
    /**
     * The verb of a notice's age line, "since 2 min ago" [kpadopt5-notices]
     */
    noticesSinceVerb: string;
    /**
     * The per-row button that marks a notice read [kpadopt5-notices]
     */
    noticesMarkRead: string;
    /**
     * The per-row button that marks it unread again [kpadopt5-notices]
     */
    noticesMarkUnread: string;
    /**
     * The button that marks every notice read [kpadopt5-notices]
     */
    noticesReadAll: string;
    /**
     * The footer link, "All 37 in the Inbox", with the exact count [kpadopt5-notices]
     */
    noticesAllInInbox: (n: number) => string;
    /**
     * The empty plate's title [kpadopt5-notices]
     */
    noticesEmpty: string;
    /**
     * Its sentence [kpadopt5-notices]
     */
    noticesEmptyText: string;
    /**
     * The failed plate's title [kpadopt5-notices]
     */
    noticesErrorTitle: string;
    /**
     * Its sentence when the page gives no reason [kpadopt5-notices]
     */
    noticesErrorText: string;
    /**
     * The failed plate's Retry button [kpadopt5-notices]
     */
    noticesRetry: string;
    /**
     * The title of the per-source switches [kpadopt5-notices]
     */
    noticesSources: string;
    /**
     * A muted source's state word [kpadopt5-notices]
     */
    noticesMuted: string;
    /**
     * A source that is on [kpadopt5-notices]
     */
    noticesNotMuted: string;
    /**
     * Announced when one new notice arrived [kpadopt5-notices]
     */
    noticesNew: (title: string) => string;
    /**
     * Announced when several arrived, naming the worst [kpadopt5-notices]
     */
    noticesNewMany: (n: number, title: string) => string;
};
/**
 * @typedef {object} ReqNoticesStrings
 * @property {string} contentsLabel  The accessible name of an on-this-page list (js/page-contents.js) [wish-1120]
 * @property {string} contentsTitle  The heading over an on-this-page list [wish-1120]
 * @property {(line: number, column: number) => string} codeFieldPosition  The caret's place under a code field, "Line 3, column 12" (js/code-field.js) [wish-1120]
 * @property {(line: number, column: number, message: string) => string} codeFieldError  The problem the page found in a code field, with its place [wish-1120]
 * @property {(line: number, message: string) => string} codeFieldErrorLine  The same when only the line is known [wish-1120]
 * @property {(message: string) => string} codeFieldErrorPlain  The same when no place is known [wish-1120]
 * @property {string} codeFieldBlocked  Why a form is held back while a code field has an error [wish-1120]
 * @property {string} jsonGutter  The accessible name of the line numbers [kpadopt5]
 * @property {string} jsonBlocked  The validity message that stops a form with broken JSON [kpadopt5]
 * @property {(why: string) => string} jsonSchemaFailed  The error line when the page's shape check refuses valid JSON [kpadopt5]
 * @property {string} jsonFormatted  Said after Format [kpadopt5]
 * @property {string} reqLabel  The accessible name of the request list (js/request-inspector.js) [kpadopt5]
 * @property {string} reqEmptyTitle  The empty list's heading [kpadopt5]
 * @property {string} reqEmptyText  Its sentence [kpadopt5]
 * @property {string} reqSendTest  Its button [kpadopt5]
 * @property {string} reqFailedTitle  The failed list's heading [kpadopt5]
 * @property {string} reqLoading  The busy card's words [kpadopt5]
 * @property {string} reqHeaders  The headers block's heading [kpadopt5]
 * @property {string} reqBody  The body block's title [kpadopt5]
 * @property {string} reqNoBody  A request without a body [kpadopt5]
 * @property {string} reqNoHeaders  A request without headers [kpadopt5]
 * @property {string} reqCopyCurl  Copy as curl [kpadopt5]
 * @property {string} reqCopyJson  Copy as JSON [kpadopt5]
 * @property {string} reqCopyBody  Copy the body [kpadopt5]
 * @property {string} reqCopyCurlSecrets  The separate button that copies the curl with the real secrets [kpadopt5]
 * @property {(what: string) => string} reqCopyDone  Said after a copy, "curl copied, secrets masked" is built from this and the next [kpadopt5]
 * @property {string} reqMaskedNote  Added to a copy that masked the secrets [kpadopt5]
 * @property {string} reqSecretShow  The button that shows one masked header on screen [kpadopt5]
 * @property {string} reqSecretHide  The same, once shown [kpadopt5]
 * @property {string} reqSecretMasked  What a screen reader hears for a masked value [kpadopt5]
 * @property {(n: number) => string} reqShowOlder  The button under the list, "Show 12 older" [kpadopt5]
 * @property {string} reqFilterLabel  The accessible name of the status filter [kpadopt5]
 * @property {string} reqFilterAll  The filter's first choice [kpadopt5]
 * @property {string} reqToneSuccess  The word beside a 2xx status [kpadopt5]
 * @property {string} reqToneInfo  The word beside a 3xx status [kpadopt5]
 * @property {string} reqToneWarning  The word beside a 4xx status [kpadopt5]
 * @property {string} reqToneError  The word beside a 5xx status [kpadopt5]
 * @property {string} reqToneNone  The word beside a request without a status [kpadopt5]
 * @property {string} reqSourceTest  The badge of a request the page sent itself [kpadopt5]
 * @property {(shown: number, total: number) => string} reqCount  The line above the list, "20 of 31 requests" [kpadopt5]
 * @property {string} reqNoMatch  The list when the filter shows nothing [kpadopt5]
 * @property {(method: string, path: string, status: string) => string} reqSummary  A request's accessible name [kpadopt5]
 * @property {string} noticesInbox  The counter button's word (js/notices.js) [kpadopt5-notices]
 * @property {string} noticesTitle  The panel's heading [kpadopt5-notices]
 * @property {string} noticesPageTitle  The Inbox page's heading [kpadopt5-notices]
 * @property {string} noticesList  The accessible name of the list of notices [kpadopt5-notices]
 * @property {(n: number) => string} noticesUnread  The counter's label, "5 unread" [kpadopt5-notices]
 * @property {string} noticesNoneUnread  The counter's label with nothing unread [kpadopt5-notices]
 * @property {(why: string) => string} noticesCounterError  The counter's label when the notices could not be read [kpadopt5-notices]
 * @property {(inbox: string, label: string, quiet: string) => string} noticesCounterName  The counter button's accessible name, "Inbox: 5 unread. Quiet until 09:00" [kpadopt5-notices]
 * @property {string} noticesLoading  What the busy card over the list says, and the counter's label while it loads [kpadopt5-notices]
 * @property {(time: string) => string} noticesQuiet  The quiet line, "Quiet until 09:00" [kpadopt5-notices]
 * @property {string} noticesEndQuiet  The button that ends the quiet time [kpadopt5-notices]
 * @property {string} noticesSinceVerb  The verb of a notice's age line, "since 2 min ago" [kpadopt5-notices]
 * @property {string} noticesMarkRead  The per-row button that marks a notice read [kpadopt5-notices]
 * @property {string} noticesMarkUnread  The per-row button that marks it unread again [kpadopt5-notices]
 * @property {string} noticesReadAll  The button that marks every notice read [kpadopt5-notices]
 * @property {(n: number) => string} noticesAllInInbox  The footer link, "All 37 in the Inbox", with the exact count [kpadopt5-notices]
 * @property {string} noticesEmpty  The empty plate's title [kpadopt5-notices]
 * @property {string} noticesEmptyText  Its sentence [kpadopt5-notices]
 * @property {string} noticesErrorTitle  The failed plate's title [kpadopt5-notices]
 * @property {string} noticesErrorText  Its sentence when the page gives no reason [kpadopt5-notices]
 * @property {string} noticesRetry  The failed plate's Retry button [kpadopt5-notices]
 * @property {string} noticesSources  The title of the per-source switches [kpadopt5-notices]
 * @property {string} noticesMuted  A muted source's state word [kpadopt5-notices]
 * @property {string} noticesNotMuted  A source that is on [kpadopt5-notices]
 * @property {(title: string) => string} noticesNew  Announced when one new notice arrived [kpadopt5-notices]
 * @property {(n: number, title: string) => string} noticesNewMany  Announced when several arrived, naming the worst [kpadopt5-notices]
 */
/** @type {ReqNoticesStrings} */
export declare const REQ_NOTICES_STRINGS: ReqNoticesStrings;
