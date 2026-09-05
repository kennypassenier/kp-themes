export type DatePickerProps = {
    label: string;
    /**
     * Controlled text.
     */
    value?: string;
    /**
     * Initial text when uncontrolled.
     */
    defaultValue?: string;
    onChange?: (iso: string | null, date: Date | null) => void;
    /**
     * Controlled panel state.
     */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * Default: the nearest `lang`, else the browser's.
     */
    locale?: string;
    /**
     * 0 = Sunday. Default: the locale's.
     */
    weekStartsOn?: number;
    /**
     * ISO. Days before are disabled.
     */
    min?: string;
    /**
     * ISO. Days after are disabled.
     */
    max?: string;
    /**
     * Weekdays (0-6) that cannot be chosen.
     */
    disabledDays?: number[];
    isDateDisabled?: (date: Date) => boolean;
    /**
     * Default true.
     */
    closeOnSelect?: boolean;
    /**
     * Default true.
     */
    returnFocus?: boolean;
    /**
     * What the open button shows. Default: the dictionary's `calendarButton`.
     */
    trigger?: import('react').ReactNode;
    previousGlyph?: import('react').ReactNode;
    nextGlyph?: import('react').ReactNode;
    renderDay?: (date: Date, defaults: {
        className: string;
        disabled: boolean;
    }) => import('react').ReactNode;
    /**
     * Default: the locale's pattern, e.g. dd-mm-yyyy.
     */
    placeholder?: string;
    /**
     * Spread onto the input (name, required, aria-describedby, …).
     */
    inputProps?: Record<string, unknown>;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const DatePicker: import("react").ForwardRefExoticComponent<DatePickerProps & import("react").RefAttributes<HTMLDivElement>>;
export type UploadRow = {
    id: string;
    file: File;
    name: string;
    size: number;
    progress: number;
    state: 'waiting' | 'uploading' | 'done' | 'error';
    message?: string;
};
export type UploadProps = {
    label?: string;
    maxBytes?: number;
    maxFiles?: number;
    maxTotal?: number;
    /**
     * Same syntax as the input's own; also set on the input.
     */
    accept?: string;
    /**
     * Default true.
     */
    multiple?: boolean;
    /**
     * Drag and drop. Default true.
     */
    dropping?: boolean;
    disabled?: boolean;
    /**
     * Controlled list.
     */
    rows?: UploadRow[];
    onRowsChange?: (rows: UploadRow[]) => void;
    /**
     * The accepted files of one pick.
     */
    onFiles?: (files: File[]) => void;
    onReject?: (file: File, reason: string, message: string) => void;
    /**
     * Return false to keep the row.
     */
    onRemove?: (row: UploadRow) => boolean | void;
    /**
     * A reason refuses the file.
     */
    validate?: (file: File, accepted: File[]) => string | null;
    locale?: string;
    renderRow?: (row: UploadRow, remove: () => void) => import('react').ReactNode;
    removeGlyph?: import('react').ReactNode;
    /**
     * What the zone shows. Default: `label`, else the dictionary's.
     */
    children?: import('react').ReactNode;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Upload: import("react").ForwardRefExoticComponent<UploadProps & import("react").RefAttributes<HTMLDivElement>>;
/** Helpers for a consumer holding the rows: return the list with one row updated. */
/** @param {UploadRow[]} rows @param {string} id @param {number} percent */
export declare const withProgress: (rows: UploadRow[], id: string, percent: number) => {
    id: string;
    file: File;
    name: string;
    size: number;
    message?: string;
    progress: number;
    state: string;
}[];
/** @param {UploadRow[]} rows @param {string} id @param {string} [message] */
export declare const withDone: (rows: UploadRow[], id: string, message?: string) => (UploadRow | {
    id: string;
    file: File;
    name: string;
    size: number;
    progress: number;
    state: string;
    message: string | undefined;
})[];
/** @param {UploadRow[]} rows @param {string} id @param {string} message */
export declare const withError: (rows: UploadRow[], id: string, message: string) => (UploadRow | {
    id: string;
    file: File;
    name: string;
    size: number;
    progress: number;
    state: string;
    message: string;
})[];
export type WizardProps = {
    steps: {
        id?: string;
        label: string;
        content: import('react').ReactNode;
        optional?: boolean;
    }[];
    /**
     * Controlled step index.
     */
    step?: number;
    /**
     * Default 0.
     */
    defaultStep?: number;
    onStepChange?: (step: number, detail: {
        previous: number;
        direction: 'forward' | 'back';
    }) => void;
    /**
     * Return false to hold the wizard.
     */
    beforeStep?: (from: number, to: number) => boolean | Promise<boolean>;
    /**
     * Default: always.
     */
    canGoNext?: (step: number) => boolean;
    onFinish?: () => void;
    onCancel?: () => void;
    /**
     * Completed steps in the list are clickable. Default false.
     */
    navigable?: boolean;
    /**
     * Move focus into the new step. Default true.
     */
    focusStep?: boolean;
    renderActions?: (state: {
        at: number;
        of: number;
        back: () => void;
        next: () => void;
        isLast: boolean;
        busy: boolean;
    }) => import('react').ReactNode;
    /**
     * Disables Next while an async check runs, if the consumer wants to show it.
     */
    busy?: boolean;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Wizard: import("react").ForwardRefExoticComponent<WizardProps & import("react").RefAttributes<HTMLDivElement>>;
