export type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type FormState = {
    errors: Record<string, string>;
    validate: (el: Control) => void;
};
/**
 * One field: label, optional help, error, and the wiring between them.
 *
 * `type` is the control, not only the input type. Anything the browser
 * knows (`text`, `email`, `number`, …) renders an `<input>`; `select`,
 * `textarea`, `checkbox` and `radio` render what they say. Before this
 * the component rendered an `<input>` whatever it was told, so half of
 * every real form had to be written by hand beside it — losing the
 * label, the error and the describedby wiring that are the whole point.
 *
 * @param {{
 *   label: string,
 *   name: string,
 *   help?: string,
 *   error?: string,
 *   required?: boolean,
 *   type?: string,
 *   options?: { value: string, label: string, disabled?: boolean }[],
 *   children?: import('react').ReactNode,
 *   strings?: Partial<import('../js/strings.js').Strings>,
 *   className?: string,
 * } & Record<string, unknown>} props
 */
export declare function FormField({ label, name, help, error, required, type, options, children, strings, className, ...rest }: {
    label: string;
    name: string;
    help?: string;
    error?: string;
    required?: boolean;
    type?: string;
    options?: {
        value: string;
        label: string;
        disabled?: boolean;
    }[];
    children?: import('react').ReactNode;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
} & Record<string, unknown>): import("react").JSX.Element;
/**
 * A form that gathers its errors and takes focus to them.
 *
 * The busy state is the consumer's to end [KT6]. Three ways, nearest
 * wins: a controlled `busy` prop; a promise returned from `onValid`,
 * awaited and cleared when it settles — fulfilled OR rejected, because a
 * login that renders "wrong password" resolves rather than throws; or the
 * `done()` handed to `onValid` as its second argument. Nothing returned
 * and nothing called keeps the button busy, on purpose: a consumer who
 * navigates away on submit must not get back a button that double-sends.
 *
 * The first version set busy and never cleared it. JobTracker rebuilt
 * their login on it and their suite failed at the second submit — the
 * one after a typo — with "element is not enabled". A person would have
 * been locked out of their own dashboard by a wrong password.
 *
 * @param {{
 *   children: import('react').ReactNode,
 *   onValid?: (data: FormData, done: () => void) => void | Promise<unknown>,
 *   busy?: boolean,
 *   submitLabel?: string,
 *   busyLabel?: string,
 *   strings?: Partial<import('../js/strings.js').Strings>,
 *   className?: string,
 * }} props
 */
export declare function Form({ children, onValid, busy: busyProp, submitLabel, busyLabel, strings, className }: {
    children: import('react').ReactNode;
    onValid?: (data: FormData, done: () => void) => void | Promise<unknown>;
    busy?: boolean;
    submitLabel?: string;
    busyLabel?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
}): import("react").JSX.Element;
