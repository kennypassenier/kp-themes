# What the components page still has to show

The site's component pages (`site/components/*.html`, every component with its
code examples) are brought up to date in one pass, on Kenny's go, once every
open review is approved (Kenny, 2026-10-13: "nadat alles approved is, vraag je
aan mij of je onze pagina waar al onze componenten staan (met codevoorbeelden)
mag updaten met alles wat nieuws is en alle nieuwe opties").

Every session that adds or changes a component, an option, an attribute or a
token adds a line here in the same commit. The pass works down the list, gives
each line its example and its option row, and empties the list.

## Waiting

- Date picker: `data-kp-date-format="locale"` / `dateFormat: 'locale'` (the default is dd/mm/yyyy, rule 52); the "Another locale" and "First day of
  the week, and a locale by attribute" examples show 13/09/2026 now, and the options table row for `placeholder` says the locale's pattern.
- Key figure: the label of a plain tile and of a trend tile wraps between words (no ellipsis); the trend tile keeps two label lines.

(The pass of 2026-10-14 brought every line before this onto its component page.)
