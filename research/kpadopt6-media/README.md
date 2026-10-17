# research/kpadopt6-media: the sixth adoption round, wave "media"

**Decided (2026-10-17 23:33):** Kenny approved every pair in formal. Recorded in `VERDICTS.json`; the part is not offered again.

Six new parts, formal only (Kenny, 2026-10-17 21:32 answers to the option design): the uses map (`js/uses-map.js`, the lines view of `kp-matrix`),
the picture gallery with its lightbox (`js/gallery.js` on the viewer shell `js/viewer.js`), the document preview and page icon (`js/docpreview.js`),
the growing text box (`js/autosize.js`, shared with `js/json-field.js`), link anchors on headings and rows (`js/anchors.js`) and lists that print well
(`css/_print.css`, `js/print.js`). One page, `demo.html`, one review topic per part. Hand-written: edit the page itself. `files/` holds the sample
material (twelve vector pictures, a 3-page PDF, a cover letter as text and a short clip recorded from a page). The print sheets are frames that load
the page's real stylesheets with the `@media print` at-rule turned into `@media all`. The other themes are asked after Kenny's formal verdict.
