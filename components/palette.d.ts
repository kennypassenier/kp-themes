export type Command = {
    value: string;
    label: string;
    keys?: string;
};
/** @typedef {{ value: string, label: string, keys?: string }} Command */
/**
 * @param {{ commands: Command[], onRun?: (value: string) => void, placeholder?: string, label?: string, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export declare function CommandPalette({ commands, onRun, placeholder, label, strings }: {
    commands: Command[];
    onRun?: (value: string) => void;
    placeholder?: string;
    label?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
}): import("react").JSX.Element;
/**
 * The shortcut sheet [TH49]. `?` opens it, unless someone is typing one.
 *
 * @param {{ shortcuts: { keys: string, description: string }[], label?: string, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export declare function ShortcutSheet({ shortcuts, label, strings }: {
    shortcuts: {
        keys: string;
        description: string;
    }[];
    label?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
}): import("react").JSX.Element;
