// Page descriptor for the "formrows" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const formrowsDescriptor = {
        id: 'formrows',
        title: 'Form rows',
        group: 'Forms',
        classes: ['kp-formrows', 'kp-formrow'],
        exports: [],
        intro: 'A settings form as rows: the label, the package’s own control with its help or error under it, and an aside for where the value comes from or an Edit button. The label column is as wide as the longest label; under 36rem each row reads top to bottom.',
        whenToUse: 'A settings page or a long form of independent values.',
        examples: [
            {
                title: 'Two rows',
                why: 'Mark a changed row with `data-kp-changed`, a failed one with `data-kp-state="error"`, a locked one with `data-kp-locked`.',
                markup: `
<div class="kp-formrows kp-formrows--lines">
<div class="kp-formrow" data-kp-changed><label class="kp-formrow__label" for="doc-ret">Retention<small>backup.retention_days</small></label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-ret" value="30" /><p class="kp-field__help">Days of nightly copies to keep.</p></div><div class="kp-formrow__aside">Not saved</div></div>
<div class="kp-formrow" data-kp-locked><label class="kp-formrow__label" for="doc-dir">Data folder</label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-dir" value="/srv/data" disabled /></div><div class="kp-formrow__aside"><span class="kp-formrow__lock">Set at install</span></div></div>
</div>
`,
            },
            {
                title: 'A failed row, a choice with an Edit, a switch, and tall controls',
                why: 'A row with `data-kp-state="error"` gets a rule on its start edge and the control carries the field’s own error line, tied with `aria-describedby`. The aside holds where a value comes from, a badge or a button. `kp-formrow--top` puts the label at the top of a tall control and `kp-formrow--wide` lets the control take the aside’s column as well. A switch’s label is a `span` with an id that the switch names with `aria-labelledby`.',
                markup: `
<div class="kp-formrows kp-formrows--lines">
<div class="kp-formrow"><label class="kp-formrow__label" for="doc-keep">Keep snapshots for<small>snapshot.keep</small></label><div class="kp-formrow__control"><select class="kp-field__input" id="doc-keep"><option>7 days</option><option selected>30 days</option><option>90 days</option></select></div><div class="kp-formrow__aside"><span class="kp-badge">override</span><button type="button" class="kp-button kp-button--sm kp-button--ghost">Reset</button></div></div>
<div class="kp-formrow" data-kp-state="error"><label class="kp-formrow__label" for="doc-mail">Mail server<small>notify.smtp_host</small></label><div class="kp-formrow__control kp-field--invalid"><input class="kp-field__input" id="doc-mail" value="smtp.example" aria-invalid="true" aria-describedby="doc-mail-error" /><p class="kp-field__error" id="doc-mail-error">Not a host name: it needs a domain, as in smtp.example.net.</p></div><div class="kp-formrow__aside"><span>Set 02/10/2026 09:41</span></div></div>
<div class="kp-formrow"><span class="kp-formrow__label" id="doc-night-label">Night alarms</span><div class="kp-formrow__control"><label class="kp-switch"><input class="kp-switch__input" type="checkbox" role="switch" checked aria-labelledby="doc-night-label" /><span class="kp-switch__state" aria-hidden="true"></span><span>On between 23:00 and 07:00</span></label></div><div class="kp-formrow__aside"><span>Applies at once</span></div></div>
<div class="kp-formrow kp-formrow--top"><label class="kp-formrow__label" for="doc-desc">Description</label><div class="kp-formrow__control"><textarea class="kp-field__input kp-field__input--multiline" id="doc-desc" rows="3">Nightly copy of every container volume to the NAS, checked after it is written.</textarea></div><div class="kp-formrow__aside"><span>Set 27/09/2026 06:57</span></div></div>
<div class="kp-formrow kp-formrow--wide kp-formrow--top"><label class="kp-formrow__label" for="doc-notes">Notes</label><div class="kp-formrow__control"><textarea class="kp-field__input kp-field__input--multiline" id="doc-notes" rows="2">The NAS sleeps after 02:00; the copy wakes it first.</textarea></div></div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-formrows--lines', what: 'A hairline between rows.' },
            { name: '.kp-formrow--top / --wide', what: 'The label at the top for a tall control; the control takes the aside’s column too.' },
            { name: 'data-kp-changed / data-kp-state="error" / data-kp-locked', what: 'On a `.kp-formrow`: a rule on the start edge for a value not saved; a destructive rule for a failed one; the label muted for a value the reader cannot change, with `.kp-formrow__lock` in the aside saying why.' },
            { name: '.kp-formrow__label small', what: 'The setting’s own key under its label, in the quiet face.' },
            { name: '.kp-formgrid', what: 'The same rows on four tracks (label, control, value, actions) have their own page: the form grid. On a first baseline, a field fills the track and a short control takes its short width.' },
        ],
        accessibility: ['Built in — the label is a real label.', 'Yours — tie help and errors to the control with aria-describedby.'],
    };
