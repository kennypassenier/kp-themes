/**
 * A date field where typing is the primary path and the grid is an aid
 * [TH43].
 *
 * @param {{ label: string, value?: string, onChange?: (iso: string | null) => void }} props
 */
export declare function DatePicker({ label, value, onChange }: {
    label: string;
    value?: string;
    onChange?: (iso: string | null) => void;
}): import("react").JSX.Element;
/**
 * A drop zone and a file list [TH44]. The sending stays the consumer's.
 *
 * @param {{ label?: string, maxBytes?: number, onFiles?: (files: File[]) => void }} props
 */
export declare function Upload({ label, maxBytes, onFiles }: {
    label?: string;
    maxBytes?: number;
    onFiles?: (files: File[]) => void;
}): import("react").JSX.Element;
/**
 * A multi-step form [TH48].
 *
 * @param {{ steps: { label: string, content: import('react').ReactNode }[], onFinish?: () => void }} props
 */
export declare function Wizard({ steps, onFinish }: {
    steps: {
        label: string;
        content: import('react').ReactNode;
    }[];
    onFinish?: () => void;
}): import("react").JSX.Element;
