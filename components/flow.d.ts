/**
 * A date field where typing is the primary path and the grid is an aid
 * [TH43].
 *
 * @param {{ label: string, value?: string, onChange?: (iso: string | null) => void, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export declare function DatePicker({ label, value, onChange, strings }: {
    label: string;
    value?: string;
    onChange?: (iso: string | null) => void;
    strings?: Partial<import('../js/strings.js').Strings>;
}): import("react").JSX.Element;
/**
 * A drop zone and a file list [TH44]. The sending stays the consumer's.
 *
 * @param {{ label?: string, maxBytes?: number, onFiles?: (files: File[]) => void, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export declare function Upload({ label, maxBytes, onFiles, strings }: {
    label?: string;
    maxBytes?: number;
    onFiles?: (files: File[]) => void;
    strings?: Partial<import('../js/strings.js').Strings>;
}): import("react").JSX.Element;
/**
 * A multi-step form [TH48].
 *
 * @param {{ steps: { label: string, content: import('react').ReactNode }[], onFinish?: () => void, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export declare function Wizard({ steps, onFinish, strings }: {
    steps: {
        label: string;
        content: import('react').ReactNode;
    }[];
    onFinish?: () => void;
    strings?: Partial<import('../js/strings.js').Strings>;
}): import("react").JSX.Element;
