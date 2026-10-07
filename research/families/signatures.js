// The package's signature elements that belong to a family of
// research/families/ (Kenny, 2026-10-07 01:32, forest's loading: "wacht, ik
// dacht dat ik hier een progressbar had goedgekeurd voor forest met kleine
// boompjes die in de bar zelf zaten, waar is die naartoe?").
//
// The families page offered only the character demos' picks, so the
// signature elements every register draws in its kp.signature layer
// (scope-140, in the package since 9.0.0) were never candidates. Each one
// here is offered as a card beside the components, drawn by signature.html
// from the package itself (the register, components.css and the package's
// own modules), never from a research copy.
//
// What the kp.signature layers draw, measured 2026-10-07 over the 19
// registers, and where each went:
//   - progress bar, spinner, skeleton: a loading picture → While loading;
//   - dialog, toast, tooltip: an entrance → How it arrives;
//   - a link in running text (its hover and press) → Hover, focus, press;
//   - the update in place (js/update.js, `--kp-update`): a live update, in
//     formal, cyberpunk and titanium only → A live update;
//   - not offered: the switch and the check/radio (a toggled state, not a
//     pointer state), the wizard steps and the empty state (a still shape,
//     no family asks for it), the meter with a mark (the meter is a
//     component of its own on the page), the leave (no family is about it).
//
// `themes` limits a card to the themes whose register draws it. Such a card
// goes last in its family: the review dialog drops an option a theme lacks
// from the end of the list, and the cards are matched to the options by
// place.

/**
 * @typedef {{ id: string, element: string, family: string, label: string, name: string, about: string, how?: string, themes?: string[] }} Signature
 * @type {readonly Signature[]}
 */
export const SIGNATURES = Object.freeze([
    {
        id: 'sig-progressbar',
        element: 'progressbar',
        family: 'loading',
        label: 'Signature progress bar',
        name: 'the package’s .kp-progressbar, filling and busy',
        about: 'the progress bar this theme draws (.kp-progressbar in kp.signature), filling from 0 to 100 % in steps, and under it the same bar busy with no idea how far',
    },
    {
        id: 'sig-spinner',
        element: 'spinner',
        family: 'loading',
        label: 'Signature spinner',
        name: 'the package’s .kp-spinner',
        about: 'the spinner this theme draws (.kp-spinner in kp.signature), at two sizes',
    },
    {
        id: 'sig-skeleton',
        element: 'skeleton',
        family: 'loading',
        label: 'Signature skeleton',
        name: 'the package’s .kp-skeleton',
        about: 'the skeleton placeholder this theme draws (.kp-skeleton in kp.signature): a circle, three lines and a block',
    },
    {
        id: 'sig-dialog',
        element: 'dialog',
        family: 'arrival',
        label: 'Signature dialog',
        name: 'the package’s .kp-dialog entrance',
        about: 'the entrance of the dialog this theme draws (.kp-dialog in kp.signature)',
    },
    {
        id: 'sig-toast',
        element: 'toast',
        family: 'arrival',
        label: 'Signature toast',
        name: 'the package’s .kp-toast entrance',
        about: 'the entrance of the toast this theme draws (.kp-toast in kp.signature), plain and success',
    },
    {
        id: 'sig-tooltip',
        element: 'tooltip',
        family: 'arrival',
        label: 'Signature tooltip',
        name: 'the package’s .kp-tooltip entrance',
        about: 'the entrance of the tooltip this theme draws (.kp-tooltip in kp.signature)',
    },
    {
        id: 'sig-link',
        element: 'link',
        family: 'hover',
        how: 'point',
        label: 'Signature link',
        name: 'a link in running text',
        about: 'a link in running text as this theme draws it (kp.signature), pointed at, focused and pressed in turn',
    },
    {
        id: 'sig-update',
        element: 'update',
        family: 'live',
        themes: ['formal', 'cyberpunk', 'titanium'],
        label: 'Update in place',
        name: 'the package’s update(), --kp-update',
        about: 'the update in place this theme draws (js/update.js and --kp-update in kp.signature) on a key figure, its line and a state word',
    },
]);
