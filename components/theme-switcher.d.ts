export type ThemeSwitcherProps = {
    /**
     * Passed straight to useTheme (preferred / fallback / onChange).
     */
    themeOptions?: import('../hooks/use-theme.js').UseThemeOptions;
    /**
     * Accessible name of the trigger. Default: 'Thema kiezen'.
     */
    label?: string;
    /**
     * Shown when onChange refused the change. Default: 'Niet bewaard op de server — je keuze is teruggezet.'
     */
    failedMessage?: string;
    /**
     * Shown when the browser refused to store the choice. Default names blocked storage.
     */
    storageMessage?: string;
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
 * @property {string} [label]         Accessible name of the trigger. Default: 'Thema kiezen'.
 * @property {string} [failedMessage] Shown when onChange refused the change. Default: 'Niet bewaard op de server — je keuze is teruggezet.'
 * @property {string} [storageMessage] Shown when the browser refused to store the choice. Default names blocked storage.
 * @property {string} [className]     Extra classes on the wrapper.
 * @property {Partial<Record<import('../hooks/use-theme.js').Theme, string>>} [labels]  Per-theme labels overriding the Dutch defaults (an English consumer passes its own).
 */
/** @param {ThemeSwitcherProps} props */
export default function ThemeSwitcher({ labels, themeOptions, label, failedMessage, storageMessage, className, }: ThemeSwitcherProps): import("react").JSX.Element;
