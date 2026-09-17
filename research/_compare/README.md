# The comparison page, fixed once

Kenny, 2026-09-16 (scope-105): a choice about how something looks comes with a demo, not a description — and "kunnen we bv de demo pagina ook al vastleggen zodat enkel de componenten zelf er in moeten geplaatst worden?"

So `template.html` is the page. Copy it to `research/<topic>/demo.html` and fill four slots, marked FILL in the file:

| Slot | What goes in                                                                                                                                  |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | the theme and the title (`<html data-theme>`, `data-cat-theme`, `<title>`, `<h1>`)                                                            |
| 2    | one CSS block per state, written `[data-theme='<theme>'] .cmp-<state> <selector> { … }` so it moves into the register by dropping the wrapper |
| 3    | the component's markup, once, inside `<template id="cmp-markup">` — package classes only                                                      |
| 4    | one sentence saying what is compared and what each state costs                                                                                |

The page then shows every state twice, on the page ground and on a card, with the same markup, so only the compared rule differs. It measures nothing on purpose: numbers belong in the form's text, the page belongs to the eye. Add the copy to `catalogue/pages.js` under "Research to look at"; a `verify.spec.mjs` is only worth writing when the choice hinges on a number.
