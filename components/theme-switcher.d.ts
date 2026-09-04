export type ThemeSwitcherProps = {
    /**
     * Passed straight to useTheme (preferred / fallback / onChange).
     */
    themeOptions?: import('../hooks/use-theme.js').UseThemeOptions;
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
     * Extra classes on the wrapper.
     */
    className?: string;
    /**
     * Per-theme labels overriding the Dutch defaults (an English consumer passes its own).
     */
    labels?: Partial<Record<import('../hooks/use-theme.js').Theme, string>>;
};
/**
 * @typedef {object} ThemeSwitcherProps
 * @property {import('../hooks/use-theme.js').UseThemeOptions} [themeOptions]  Passed straight to useTheme (preferred / fallback / onChange).
 * @property {string} [label]         Accessible name of the trigger. Default: the dictionary's `themePicker`.
 * @property {string} [failedMessage] Shown when onChange refused the change. Default: the dictionary's `themeSaveRefused`.
 * @property {string} [storageMessage] Shown when the browser refused to store the choice. Default: the dictionary's `themeSaveFailed`.
 * @property {Partial<import('../js/strings.js').Strings>} [strings] override any of the words this component speaks
 * @property {string} [className]     Extra classes on the wrapper.
 * @property {Partial<Record<import('../hooks/use-theme.js').Theme, string>>} [labels]  Per-theme labels overriding the Dutch defaults (an English consumer passes its own).
 */
/** @param {ThemeSwitcherProps} props */
export default function ThemeSwitcher({ labels, themeOptions, label, failedMessage, storageMessage, strings, className }: ThemeSwitcherProps): import("react").JSX.Element;
