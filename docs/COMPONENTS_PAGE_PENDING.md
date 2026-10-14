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

(The pass of 2026-10-14 brought every line before this onto its component page.)

- Side navigation: `data-kp-sidenav-opener` (`launcher`, `tab`, `both`; `over` and `push` only, absent = the markup decides) needs its example on site/components/sidenav.html and an option row; the React prop is `opener` [sidenav-opener-M1].
