# Demo review kit

Judge every section of a research demo in every theme from one dialog, and
copy one structured answer back into the conversation [scope-141].

## Opting in

```html
<html lang="en" data-review="my-topic" data-review-themes="formal,retro">
  …
  <section data-review-item="spinner" data-review-title="Spinner">
    <div data-review-look>
      <p data-for="formal">What to look at in formal.</p>
      <p data-for="retro">What to look at in retro.</p>
    </div>
    …
  </section>
  …
  <script type="module" src="../_review/review.js"></script>
</html>
```

`data-review-themes` is optional; without it the dialog walks all 22 themes
in the registry's order.

## What the reviewer gets

- A bar at the top of the page: how many pairs (theme × section) are judged,
  "Review in a dialog" and "Copy answer".
- The dialog walks theme by theme: every section in one theme, then it loads
  the next theme's register and switches by itself. Up approves, Down rejects
  (a note is required), Left/Right move while the note is empty, Escape
  closes. "Approve the rest of this theme" approves every open section in
  the theme on screen. After the last open pair the dialog closes.
- Full screen on a phone, the section on top and the buttons below.
- At the foot of the page, the answer:

```
Demo review · signature-elements · 220 of 220 judged, 217 approved, 3 not approved, 0 open

Approved in every theme: spinner, skeleton, switch, …

Not approved:
- tooltip · forest: the sign reads too dark on the green
```

Verdicts and notes live in the browser's localStorage under
`kp-demo-review:<demo id>`, until "Clear all verdicts".
