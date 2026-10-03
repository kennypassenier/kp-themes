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

Catalogue blocks can ride along as a last step, each in its own theme
(shown through `block.html`, which copies the block's stages from the
catalogue page itself):

```html
<script type="application/json" data-review-extra>
    [{ "page": "catalogue/field.html", "block": "choices", "theme": "retro",
       "engine": "firefox", "title": "Fields › Choices", "look": "What changed." }]
</script>
```

## What the reviewer gets

- A bar at the top of the page: how many steps and pairs are judged,
  "Review in a dialog" and "Copy answer".
- One step per theme: every section of the demo at once, stacked as on
  "Every component, one page", and at the side one row per section with its
  look-at line and a "Not approved" box. The reviewer ticks only what is
  wrong, writes why, and approves the theme in one click (or Up); the dialog
  then loads the next theme's register and switches by itself. Left/Right
  move between steps, Escape closes, and after the last open step the dialog
  closes. Twenty-two themes are twenty-two clicks.
- Full screen on a phone: the sections on top, the rows and buttons below.
- At the foot of the page, the answer:

```
Demo review · signature-elements · 228 of 228 judged, 227 approved, 1 not approved, 0 open

Approved in full: formal, light, dark, …

Catalogue pairs approved:
- field--choices · retro · firefox

Not approved:
- switch · light: the thumb is too small
```

Verdicts and notes live in the browser's localStorage under
`kp-demo-review:<demo id>`, until "Clear all verdicts".
