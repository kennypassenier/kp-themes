// Tests for the machine sources that read props, attributes and events [AR21, AR26, TH100].
//
// They run against the real files rather than fixtures: an extractor's
// whole job is to agree with this repository, and a fixture would let it
// agree with a copy of the repository instead. The numbers asserted are
// floors and relations, not the counts of the day, so adding a component
// does not turn a green suite red for no reason, except where the exact
// number IS the claim (the 24 stories, the one unread knob). The knob and
// default extractors have their own files beside this one.
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripComments, matchingBracket } from './source.mjs';
import { parseMembers, documentedDefault, valueExports, extractProps } from './extract-props.mjs';
import { extractAttributes, datasetKeyToAttribute } from './extract-attributes.mjs';
import { extractEvents } from './extract-events.mjs';

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
