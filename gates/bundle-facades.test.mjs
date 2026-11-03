// The facades over the single bundle, and the metafile reading behind them [superset-1103; chassis-rs 03/11].
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { completeDeclarations } from './bundle-metafile.mjs';
import { bundleNamesUsed, exportNames, facadeFiles } from './bundle-facades.mjs';

test('a name only esbuild sees is its one exporter\'s own; one several export and none declares fails', () => {
    const declared = new Map([['a', ['./js/x.js']]]);
    const added = completeDeclarations(declared, new Map([['./js/x.js', ['a', 'b']], ['./js/y.js', ['a']]]));
    assert.deepEqual(added, ['b (./js/x.js)']);
    assert.deepEqual(declared.get('b'), ['./js/x.js']);
    assert.throws(() => completeDeclarations(new Map(), new Map([['./js/x.js', ['c']], ['./js/y.js', ['c']]])), /cannot tell/);
    assert.throws(() => completeDeclarations(new Map([['z', ['./js/x.js']]]), new Map([['./js/x.js', ['a']]])), /does not see it export/);
});

test('a facade is flat, aliased, or a namespace copy, and its names are the module\'s', () => {
    const declared = new Map([['flat', ['./js/x.js']], ['OPEN_EVENT', ['./js/x.js', './js/y.js']], ['shared', ['./js/y.js', './js/z.js']]]);
    const aliasList = [{ module: './js/x.js', name: 'OPEN_EVENT', alias: 'X_OPEN_EVENT' }];
    const exportsOf = new Map([['./js/x.js', ['OPEN_EVENT', 'default', 'flat', 'shared']]]);
    const [file] = facadeFiles([{ out: 'x', module: 'js/x.js' }], exportsOf, declared, aliasList, () => 'xExports', '1.0.0');
    assert.equal(file.name, 'bundle/x.js');
    assert.deepEqual([...exportNames(file.content)].sort(), ['OPEN_EVENT', 'default', 'flat', 'shared']);
    assert.deepEqual(bundleNamesUsed(file.content), ['X_OPEN_EVENT', 'flat']);
    assert.match(file.content, /export const \{ shared \} = m;/);
    assert.match(file.content, /export default m\.default;/);
});
