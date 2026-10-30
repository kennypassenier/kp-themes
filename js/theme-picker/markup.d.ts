/** The icon the menu button wears by default; pass your own SVG string to `icon`. */
export declare const THEME_MENU_ICON: string;
/**
 * The options of a picker, as markup — grouped light and dark [TH63].
 *
 * Each group is a `<li role="presentation">` carrying a small heading
 * and its own list, so the menu reads "Light: Formal, Light, … — Dark:
 * Dark, Cyberpunk, …" rather than eleven names in one run. The grouping
 * comes from the registry's `dark` flag, which is generated from the
 * tokens, so this cannot disagree with the stylesheet about which is
 * which. Pass `grouped: false` for one flat list.
 *
 * @param {{ themes?: readonly import('../theme-registry.js').ThemeRecord[], labels?: Partial<Record<string, string>>, grouped?: boolean, groupLabels?: { light?: string, dark?: string } }} [options]
 * @returns {string}
 */
export declare function themeOptionsMarkup({ themes, labels, grouped, groupLabels }?: {
    themes?: readonly import('../theme-registry.js').ThemeRecord[];
    labels?: Partial<Record<string, string>>;
    grouped?: boolean;
    groupLabels?: {
        light?: string;
        dark?: string;
    };
}): string;
/**
 * The icon button with a dropdown, as markup [S2].
 *
 * Returned as a string rather than rendered, so a server can print it
 * into a template and a page can insert it — the same choice T1 makes
 * everywhere else in this channel. The id must be unique on the page;
 * pass one when there are two menus. Everything a person reads is
 * escaped; the icon is trusted markup you pass.
 *
 * @param {{ id?: string, label?: string, icon?: string, themes?: readonly import('../theme-registry.js').ThemeRecord[], labels?: Partial<Record<string, string>>, grouped?: boolean, groupLabels?: { light?: string, dark?: string }, className?: string }} [options]
 * @returns {string}
 */
export declare function themeMenuMarkup({ id, label, icon, themes, labels, grouped, groupLabels, className, }?: {
    id?: string;
    label?: string;
    icon?: string;
    themes?: readonly import('../theme-registry.js').ThemeRecord[];
    labels?: Partial<Record<string, string>>;
    grouped?: boolean;
    groupLabels?: {
        light?: string;
        dark?: string;
    };
    className?: string;
}): string;
