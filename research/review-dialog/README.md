# The review dialog: one block at a time, by keyboard

Kenny, 2026-09-15 [scope-89]: a large dialog of fixed size that opens a
block, the cursor in the note on every new item, Left/Right between
blocks, Up approves, Down rejects, a rejection only with text, and the
next item on its own after a verdict. A demo first.

## What was built

`demo.html` (39456 bytes, `wc -c`) gathers eight real blocks at load with
`readPage` and `suffixIds` from `catalogue/review.js`, used read-only:
`button#variants`, `table#datatable`, `navigation#bar`, `overlays#dialog`,
`datepicker#open`, `media#marquee`, `field#summary` (a form) and
`navigation#app-shell` (the tall one). The dialog is a `<dialog class="kp-dialog">`
of 92vw × 90vh. Its stage has `contain: strict` and scrolls, so a block can
never resize it. The live block is moved into the stage and back, which
keeps its behaviour attached. The verdict hash is read with
`catalogue/block-hash.js` at the block's place on the page. Verdicts and
notes stay in page memory, and the page shows the prompt lines they would
produce. The dialog, its keys and the prompt preview are mock (`rd-`
classes). The blocks, `.kp-dialog`, `.kp-button`, `.kp-field` and `.kp-badge`
come from the package.

Measured in Playwright firefox, in formal, nostromo and cyberpunk, over all
eight items:

| Window     | Dialog (every item) | Stage (item → scroll size)                                   |
| ---------- | ------------------- | ------------------------------------------------------------ |
| 1440 × 900 | 1324.8 × 810 px     | 939 × 761 (formal); data table scrolls to 1239 px high       |
| 1280 × 720 | 1177.6 × 648 px     | 792 × 599 (formal); data table 1239 high, app shell 721 high |

- The cursor was in the note on all 8 items.
- Down with an empty or whitespace-only note: no verdict, the reason is shown, and the button is disabled.
- Down with text: rejected, and item 2 opens with the cursor in its note.
- Up approved and moved on.
- 60 presses of Tab stayed inside the dialog.
- Escape closed the dialog from all 8 items. Focus went back to that block's "Open in the dialog" button, and the block was scrolled into view.
- The block's live nested modal took the first Escape; the second Escape closed the review dialog.
- The page hash was identical to the hash read inside the dialog for all eight blocks.

## The three arrow variants

| Variant                                  | Left/Right with an empty note | Left/Right with text                 | Gains                                                                  | Costs                                                                                                                                                            |
| ---------------------------------------- | ----------------------------- | ------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (a) always navigate                      | next/previous block           | next/previous block; the draft stays | one rule, never a mode                                                 | the cursor cannot be moved by arrow keys; fixing a typo mid-sentence means mouse, Home/End, or Backspace over the tail                                           |
| (b) only while empty                     | next/previous block           | moves the cursor                     | typing feels like any text field; triage of clean blocks stays one key | the same key does two things depending on an invisible condition; a draft left unjudged must be deleted or judged before Right moves on                          |
| (c) Alt+Left/Right while text is present | next/previous block           | cursor; Alt+Left/Right navigate      | both jobs always reachable                                             | a chord for the case with a note; Alt+Left is the browser's Back and some Linux desktops take Alt+arrows (Playwright did not trigger either, a real desktop may) |

Up and Down are verdicts in all three, so the cursor never moves between
lines of a multi-line note by keyboard. The keys act only while focus is in
the note or on the dialog's own buttons. Inside the block, the arrows belong
to the component (date grid, data table cells, tabs).

## How other triage tools do it

| Tool                       | What it is for             | Reference                                                                                                                                                                          | What we can reuse                                                                                                               | Build cost | Recommendation              |
| -------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------- |
| Gmail                      | moving through a mail list | [support.google.com/mail/answer/6594](https://support.google.com/mail/answer/6594?hl=en&co=GENIE.Platform%3DDesktop)                                                               | single letters j/k for older/newer, not arrows; shortcuts are a setting the user turns on                                       | small      | the "not while typing" idea |
| GitHub pull request review | marking files viewed       | [github.blog: mark files as viewed](https://github.blog/news-insights/product-news/mark-files-as-viewed/), [community #10197](https://github.com/orgs/community/discussions/10197) | a verdict collapses the item and counts progress; "changed since last view" returns it — the catalogue's hash already does this | small      | already matched             |
| Lightroom Classic          | culling photos             | [Photofocus: shortcuts for culling](https://photofocus.com/photography/lightroom-shortcuts-for-faster-culling/)                                                                    | P picks, X rejects, U skips; Auto Advance (or Caps Lock) moves on after each flag                                               | small      | the auto-advance model      |

None of the three combines a typed note with keyboard verdicts in one
focus, so none of them answers the arrow conflict. That is what the three
variants are for. Lightroom's auto-advance is the model for moving on after
a verdict; GitHub's "changed since last view" is the model the catalogue's
hash already follows.

## Recommendation

**(c)**: the arrows alone while the note is empty, Alt+Left/Right while
it has text. (c) is (b) plus an Alt route that always works. Kenny triages
in two modes. With nothing to say, the note is empty and the arrows fly
through the blocks with no chord. With a note, he is writing, and a text
field that eats Left and Right breaks the correction habit he asked to keep.
The Alt route means a half-written draft never traps him. (a) is the
simplest, but it turns every arrow press while typing into a jump. If
Alt+Left turns out to be taken on his desktop (browser Back, or the window
manager), fall back to (b); the demo lets him try that in his own Firefox.
Keep Up/Down as verdicts and Down refused without text, as built.

## Open questions for Kenny

1. Should approving with text in the note keep that text as a remark? Today an approval clears the note (fix-29).
2. After the last unjudged block: stay in the dialog with the message (as built), or close by itself?
3. Rejection needs text "on every review surface": the panel under each block in `catalogue/judging.js` does not refuse yet. That file is another agent's to change.
4. In formal a disabled `.kp-button--destructive` is only a lighter red, which is why the dialog also writes the reason under the note.
