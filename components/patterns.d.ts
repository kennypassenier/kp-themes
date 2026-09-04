/**
 * An empty state that knows which emptiness it is [TH50].
 *
 * "Nog geen items" and "niets gevonden" are different messages, and
 * offering "maak er een" to someone who just typed a filter is noise.
 *
 * @param {{ title: string, body?: string, action?: import('react').ReactNode, filtered?: boolean }} props
 */
export declare function EmptyState({ title, body, action, filtered }: {
    title: string;
    body?: string;
    action?: import('react').ReactNode;
    filtered?: boolean;
}): import("react").JSX.Element;
/**
 * A value with a copy button that confirms in words [TH53].
 *
 * @param {{ value: string, label?: string, copiedText?: string, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export declare function Copyable({ value, label, copiedText, strings }: {
    value: string;
    label?: string;
    copiedText?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
}): import("react").JSX.Element;
/**
 * A health indicator [TH52]. The dot is never the only carrier.
 *
 * @param {{ state: 'ok' | 'warn' | 'down' | 'unknown', label: string }} props
 */
export declare function Health({ state, label }: {
    state: 'ok' | 'warn' | 'down' | 'unknown';
    label: string;
}): import("react").JSX.Element;
/**
 * An event timeline [TH52].
 *
 * @param {{ events: { when: string, what: string }[] }} props
 */
export declare function Timeline({ events }: {
    events: {
        when: string;
        what: string;
    }[];
}): import("react").JSX.Element;
/**
 * A diff view [TH54].
 *
 * The sign has a column of its own so it survives where the colour does
 * not: printed, in high contrast, or for a reader who cannot tell green
 * from red [DI4].
 *
 * @param {{ lines: { kind: 'added' | 'removed' | 'same', text: string, number?: number }[] }} props
 */
export declare function Diff({ lines }: {
    lines: {
        kind: 'added' | 'removed' | 'same';
        text: string;
        number?: number;
    }[];
}): import("react").JSX.Element;
