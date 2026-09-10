// Tests for the four machine sources [AR21, AR26, TH100].
//
// They run against the real files rather than fixtures: an extractor's
// whole job is to agree with this repository, and a fixture would let it
// agree with a copy of the repository instead. The numbers asserted are
// floors and relations, not the counts of the day, so adding a component
// does not turn a green suite red for no reason — except where the exact
// number IS the claim (the 24 stories, the one unread knob).
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { documentedDefault, extractProps, parseMembers, valueExports } from './extract-props.mjs';
import { datasetKeyToAttribute, extractAttributes } from './extract-attributes.mjs';
import { extractEvents } from './extract-events.mjs';
import { extractKnobs, familyOf } from './extract-knobs.mjs';
import { destructuredDefaults, extractDefaults, literal } from './extract-defaults.mjs';
import { matchingBracket, stripComments } from './source.mjs';

test('the comment stripper keeps code after a // line containing /*', () => {
    // Live-found, standing rule 8: js/upload.js documents its markup in a
    // line comment holding `accept="image/*"`, and a regex that removed
    // block comments first swallowed the next sixty lines — including
    // `const UPLOAD = '[data-kp-upload]'`. The attribute vanished from the
    // extraction and the totals still looked plausible.
    const source = '// <input accept="image/*" />\nconst UPLOAD = \'[data-kp-upload]\';\n';
    assert.match(stripComments(source), /const UPLOAD = '\[data-kp-upload\]';/);
    assert.equal(stripComments('a /* b */ c'), 'a  c');
    assert.equal(matchingBracket('f({ a: { b: 1 } })', 2), 16);
});

test('AR21: props come from the generated declarations, with their doc and optionality', () => {
    const members = parseMembers(
        '\n    /**\n     * Between the label and the text. Default ": ".\n     */\n    separator?: string;\n    label: number;\n',
    );
    assert.deepEqual(members, [
        {
            name: 'separator',
            optional: true,
            type: 'string',
            description: 'Between the label and the text. Default ": ".',
            documentedDefault: '": "',
        },
        { name: 'label', optional: false, type: 'number', description: '', documentedDefault: null },
    ]);
    assert.equal(documentedDefault("Default: the dictionary's `close`."), null);
    assert.equal(documentedDefault('Default true.'), 'true');
});

test('AR21: a declaration file yields its default and its named value exports', () => {
    const source = [
        'export type WidgetProps = {',
        '    a?: string;',
        '};',
        'declare const Widget: import("react").ForwardRefExoticComponent<WidgetProps>;',
        'export default Widget;',
        '',
    ].join('\n');
    assert.deepEqual(valueExports(source), [
        { name: 'Widget', exported: 'default', form: 'const', type: 'import("react").ForwardRefExoticComponent<WidgetProps>' },
    ]);
});

test('AR21: every component in components/ maps to its XProps', () => {
    const result = extractProps();
    const alert = result.components.find((c) => c.name === 'Alert');
    assert.ok(alert, 'Alert is not among the mapped components');
    assert.equal(alert.propsType, 'AlertProps');
    assert.equal(alert.module, 'components/alert.jsx');
    assert.ok(alert.props.some((p) => p.name === 'flavour' && p.optional));
    assert.ok(result.components.length >= 33, `only ${result.components.length} components mapped`);
    assert.ok(result.found.props > 400, `only ${result.found.props} props`);
    assert.deepEqual(result.orphanTypes, [], 'a props type belongs to no exported component');
});

test('AR26: an export that cannot be mapped is reported, never skipped', () => {
    const result = extractProps();
    // The mapping rule is `X` -> `XProps`. Spinner's props are inline, so
    // it does not meet the rule; saying nothing would leave a component
    // undocumented while the count still added up.
    const spinner = result.unmapped.find((u) => u.name === 'Spinner');
    assert.ok(spinner, 'Spinner is neither mapped nor reported');
    assert.match(spinner.why, /no type SpinnerProps/);
    assert.ok(spinner.props.some((p) => p.name === 'label'));
    assert.ok(result.unmapped.some((u) => u.name === 'pageRange' && /not a component/.test(u.why)));
    assert.equal(result.expected.exports, result.components.length + result.unmapped.length);
});

test('AR21: the framework-free channel’s attributes, by the role they play', () => {
    const result = extractAttributes();
    assert.equal(datasetKeyToAttribute('kpMaxTags'), 'data-kp-max-tags');
    const byName = new Map(result.attributes.map((a) => [a.name, a]));

    const dialog = byName.get('data-kp-dialog');
    assert.ok(dialog?.roles.includes('selector'), 'data-kp-dialog is the hook the dialog module attaches to');

    // Read through `flag('kpMaxTags')`, never as a literal attribute name.
    const maxTags = byName.get('data-kp-max-tags');
    assert.ok(maxTags?.roles.includes('read'), 'data-kp-max-tags is a prop of the framework-free combobox');
    assert.deepEqual(maxTags?.families, ['combobox']);

    const armed = byName.get('data-kp-armed');
    assert.ok(armed?.roles.includes('written'), 'data-kp-armed is state the module writes');

    assert.equal(result.expected, result.attributes.length);
    assert.ok(result.attributes.filter((a) => a.roles.includes('read')).length >= 83, 'the critic counted 83 the consumer can set');
});

test('AR21: every event constant is collected, with the module that exports it', () => {
    const result = extractEvents();
    const tab = result.events.find((e) => e.constant === 'TAB_CHANGE_EVENT');
    assert.equal(tab?.name, 'kp-tab-change');
    assert.equal(tab?.module, 'js/overlays.js');
    assert.match(tab?.description ?? '', /Dispatched on a tab list/);
    assert.equal(tab?.detail, '{ index, tab, panel, previous }');
    assert.ok(result.events.some((e) => e.constant === 'COMMIT_EVENT' && e.module === 'js/patterns.js'));
    assert.ok(result.events.some((e) => e.constant === 'COPY_EVENT'));

    // AR26: the expectation is counted from the sources first, so a
    // collector that quietly dropped one fails here.
    assert.equal(result.events.length, result.expected);
    assert.deepEqual(result.mismatched, []);
    assert.ok(result.events.length >= 40, `only ${result.events.length} events`);
    assert.ok(
        result.events.every((e) => e.dispatches > 0),
        'an exported event constant nothing dispatches',
    );
});

test('AR21: the knobs, their fallbacks and the families that read them', () => {
    const result = extractKnobs();
    assert.equal(familyOf('.kp-datatable[data-kp-cards] .kp-table thead'), 'datatable');
    assert.equal(familyOf('[data-kp-theme-picker] li'), 'theme');

    const height = result.knobs.find((k) => k.name === '--kp-control-height');
    assert.deepEqual(height?.defaults, ['2.25rem']);
    assert.ok(height?.families.includes('button') && height.families.includes('field'));

    // M1 (2026-09-08) added two: the marquee's duration and the gap
    // between its items, both declared on the row itself so a consumer
    // overrides one and keeps the theme's value for the other. Its third
    // knob, the rest-while-off-screen answer, is read by js/effects.js
    // rather than by any rule, so it is not declared here.
    // ask-1 (2026-09-10) added one: --kp-badge-wrap, the way out of the
    // overflow floor for the one of its five components whose content is
    // usually a label rather than a value.
    assert.equal(result.expected, 87, 'AR21 counted 87 --kp-* properties in css/components.css');
    // Every one of them is read through var(). The single exception used
    // to be --kp-breakpoint-narrow, which a media query cannot read, so
    // its value was repeated in the query [TH26]; R3 replaced that query
    // with a container query and the knob left the stylesheet altogether,
    // taking the exception with it. --kp-cell-truncate-max arrived in the
    // same milestone, which is why the total did not move.
    // R8 added four: the form gap, the field gap and the two halves of a
    // table cell's padding, each a literal put on the spacing scale so
    // the density mode could reach it. --kp-space-lg came with them, as
    // the first use of that step in this stylesheet. R0-TYPO then added
    // Round six (the concept demo's spec sheet) added --kp-mono: the mono
    // sample reads the register's mono face, with monospace as its fallback.
    // six more: the rules that wanted a text size the scale name did not
    // mean got their own knob, so every scale name means one thing. And
    // R3-CQ added --kp-table-wrap-min, the floor under a wrapper that
    // containment collapses.
    // Round five added twenty across three milestones, merged as a sum
    // rather than settled as a choice between three counts.
    // W0 added ten: the size scale's eight (a height, a block padding, an
    // inline padding and a type size for each of the two new steps),
    // --kp-focus-ring-inner-width for the ring .kp-button now composes
    // rather than replaces, and --kp-space-xl, whose first use in this
    // stylesheet is the large button's inline padding [TH111, AR30].
    // W1 added one, --kp-confirm-max-width, on the dialog TH107 opens:
    // one question wants a narrower box than a form.
    // W2 added nine — --kp-tile-x/y/w/h, the grid tile's place, which
    // js/gridlayout.js and components/canvas.jsx used to write as inline
    // `grid-column` and `grid-row` where no rule could ever overrule them
    // [AR31]; and TH104's five, the two wrapper floors plus the nav bar's
    // three padding knobs, which used to be one `clamp(…, 3vw, …)`
    // reading the window rather than its own box.
    assert.equal(result.readCount, 87);
    assert.deepEqual(result.unread, []);
});

test('AR21: a knob read in a nested rule is placed by the rule, not by its name', () => {
    const css =
        '@layer components {\n    .kp-menu {\n        @media (min-width: 40rem) {\n            min-width: var(--kp-menu-min-width, 11rem);\n        }\n    }\n}';
    const result = extractKnobs(css);
    assert.deepEqual(result.knobs, [
        { name: '--kp-menu-min-width', defaults: ['11rem'], families: ['menu'], selectors: ['.kp-menu'], read: true, declared: false },
    ]);
});

test('AR21: the documented default and the destructured one are compared', () => {
    assert.deepEqual(
        [...destructuredDefaults("flavour, separator = ': ', as: As = 'div', wrap = true, ...rest").entries()],
        [
            ['flavour', null],
            ['separator', "': '"],
            ['as', "'div'"],
            ['wrap', 'true'],
        ],
    );
    assert.equal(literal("': '"), ': ');
    assert.equal(literal('() => {}'), null);

    const result = extractDefaults();
    assert.ok(result.expected >= 75, `only ${result.expected} documented defaults`);
    assert.equal(result.agreed + result.disagreed.length + result.missing.length, result.expected);
    // A disagreement is a finding about a component, not about this
    // check: today there are none, and a new one should be looked at
    // rather than absorbed.
    assert.deepEqual(
        result.disagreed.map((c) => `${c.module} ${c.component}.${c.prop}: documented ${c.documented}, code has ${c.actual}`),
        [],
    );
});
