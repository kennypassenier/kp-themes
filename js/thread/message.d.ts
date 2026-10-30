export type ThreadMessage = import('../thread.js').ThreadMessage;
export type ThreadSpec = import('../thread.js').ThreadSpec;
export type ThreadOptions = ReturnType<typeof import('./options.js').threadOptions>;
export type MessageContext = {
    options: ThreadOptions;
    first: boolean;
    newestKey: string | undefined;
    expanded: Set<string>;
    locale: string;
    spec: ThreadSpec;
};
/** @param {Document} doc @param {ThreadMessage} message @param {MessageContext} context */
export declare function messageItem(doc: Document, message: ThreadMessage, context: MessageContext): HTMLElement;
