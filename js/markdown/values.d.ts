/** The longest note drawn, in characters. */
export declare const MARKDOWN_LIMIT = 40000;
/** The deepest heading level HTML has. */
export declare const MAX_HEADING_LEVEL = 6;
/** The level a `#` heading is written at when the page names none. */
export declare const DEFAULT_HEADING_LEVEL = 4;
/** The width a tab counts as in a list's indent, in spaces. */
export declare const TAB_WIDTH = 4;
/** A list item: its indent, its marker and its text. */
export declare const LIST_ITEM: RegExp;
/** The inline forms; the earliest in a line wins and what is left of it is text. */
export declare const INLINE_FORMS: {
    name: string;
    re: RegExp;
}[];
