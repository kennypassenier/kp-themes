/** @param {{ className?: string }} props */
export declare function PaletteIcon({ className }: {
    className?: string;
}): import("react").JSX.Element;
/** @param {{ className?: string }} props */
export declare function CheckIcon({ className }: {
    className?: string;
}): import("react").JSX.Element;
export type ThemeSwitcherProps = {
    /**
     * Passed straight to useTheme (preferred / fallback / onChange).
     */
    themeOptions?: import('../hooks/use-theme.js').UseThemeOptions;
    /**
     * Which themes to offer. Default: all of them.
     */
    themes?: readonly import('../js/theme-registry.js').ThemeRecord[];
    /**
     * Light and dark in two sections, each with a small label [TH63]. Default true.
     */
    grouped?: boolean;
    /**
     * The section labels. Default: the dictionary's.
     */
    groupLabels?: {
        light?: string;
        dark?: string;
    };
    /**
     * Accessible name of the trigger. Default: the dictionary's `themePicker`.
     */
    label?: string;
    /**
     * Shown when onChange refused the change. Default: the dictionary's `themeSaveRefused`.
     */
    failedMessage?: string;
    /**
     * Shown when the browser refused to store the choice. Default: the dictionary's `themeSaveFailed`.
     */
    storageMessage?: string;
    /**
     * override any of the words this component speaks
     */
    strings?: Partial<import('../js/strings.js').Strings>;
    /**
     * Per-theme labels overriding the registry's.
     */
    labels?: Partial<Record<string, string>>;
    /**
     * Controlled open state.
     */
    open?: boolean;
    /**
     * Initial open state when uncontrolled.
     */
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * Default true.
     */
    closeOnEscape?: boolean;
    /**
     * Default true.
     */
    closeOnOutsideClick?: boolean;
    /**
     * Default true.
     */
    closeOnSelect?: boolean;
    /**
     * The trigger's icon. Default: the palette.
     */
    icon?: import('react').ReactNode;
    /**
     * The mark on the current theme. Default: a check.
     */
    checkIcon?: import('react').ReactNode;
    /**
     * Called after a choice, with the theme applied.
     */
    onSelect?: (theme: string) => void;
    /**
     * Extra classes on the wrapper.
     */
    className?: string;
    style?: import('react').CSSProperties;
    /**
     * Extra classes per part.
     */
    classNames?: {
        trigger?: string;
        menu?: string;
        option?: string;
        group?: string;
        groupLabel?: string;
        status?: string;
    };
};
declare const ThemeSwitcher: import("react").ForwardRefExoticComponent<Omit<ThemeSwitcherProps & Record<string, unknown>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
export default ThemeSwitcher;
