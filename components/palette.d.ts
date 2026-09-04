export type Command = {
    value: string;
    label: string;
    keys?: string;
};
/** @typedef {{ value: string, label: string, keys?: string }} Command */
/**
 * @param {{ commands: Command[], onRun?: (value: string) => void, placeholder?: string, label?: string }} props
 */
export declare function CommandPalette({ commands, onRun, placeholder, label }: {
    commands: Command[];
    onRun?: (value: string) => void;
    placeholder?: string;
    label?: string;
}): import("react").JSX.Element;
/**
 * The shortcut sheet [TH49]. `?` opens it, unless someone is typing one.
 *
 * @param {{ shortcuts: { keys: string, description: string }[], label?: string }} props
 */
export declare function ShortcutSheet({ shortcuts, label }: {
    shortcuts: {
        keys: string;
        description: string;
    }[];
    label?: string;
}): import("react").JSX.Element;
