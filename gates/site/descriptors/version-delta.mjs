// Page descriptor for the "version-delta" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const versionDeltaDescriptor = {
        id: 'version-delta',
        title: 'Version jump chip',
        group: 'Feedback',
        classes: ['kp-version'],
        aliases: ['level', 'raw'],
        exports: [],
        intro: 'A small chip that shows a version moving, “10.11 → 12.1”, with the old version struck and lighter and the new one strong, the size of the jump in words (“major”, with a “!” so it is never colour alone) and a link to the release notes.',
        whenToUse: 'An update list, a fleet table or a dialog that asks before an update: anywhere a person must see at a glance which of many moves is the risky one. Only the risky jump is loud; leave the rest plain.',
        examples: [
            {
                title: 'A quiet jump, a big one and a link',
                why: 'The first number is what counts as big; the chip says so in words and in tone, and the new version links to its release notes.',
                markup: `
<span class="kp-badge kp-badge--version" data-kp-version-from="1.118.2" data-kp-version-to="1.119.0"></span>
<span class="kp-badge kp-badge--version" data-kp-version-from="10.11.11" data-kp-version-to="12.1" data-kp-version-href="https://example.com/releases/tag/{to}"></span>
`,
            },
            {
                title: 'Schemes, a moving tag, a downgrade and a word alone',
                why: 'Only the risky jump is loud. `data-kp-version-scheme` says how the numbers are read (`semver` looks at three, `calver` calls nothing major, `none` never decides); `data-kp-version-big-minor` on anything above the chips lists the apps whose second number counts as big, each chip naming its app in `data-kp-version-app`; `data-kp-version-level` is one app’s own say. A chip with only `to` is a moving tag; a version that went back is `downgrade`; `data-kp-version-show="level"` is the word alone, for a tight table. Shift + click copies “10.11 → 12.1”.',
                markup: `
<ul class="kp-stack kp-gap-sm" id="doc-version-more" data-kp-version-big-minor="immich" style="list-style: none; margin: 0; padding: 0">
<li><span class="kp-badge kp-badge--version" data-kp-version-from="2026.3" data-kp-version-to="2026.10" data-kp-version-scheme="calver"></span> calendar versions: nothing is major</li>
<li><span class="kp-badge kp-badge--version" data-kp-version-from="1.118.2" data-kp-version-to="1.119.0" data-kp-version-app="immich"></span> immich: the second number counts</li>
<li><span class="kp-badge kp-badge--version" data-kp-version-from="2.4.1" data-kp-version-to="2.4.2" data-kp-version-level="other"></span> an app’s own say: other</li>
<li><span class="kp-badge kp-badge--version" data-kp-version-to="latest"></span> a moving tag</li>
<li><span class="kp-badge kp-badge--version" data-kp-version-from="12.1" data-kp-version-to="10.11"></span> a version that went back</li>
<li><span class="kp-badge kp-badge--version" data-kp-version-from="10.11.11" data-kp-version-to="12.1" data-kp-version-show="level"></span> the word alone</li>
<li><span class="kp-badge kp-badge--version" data-kp-version-from="sha256:5f1b9c0a3c4d8e7f6a2b1c0d9e8f7a6b" data-kp-version-to="sha256:0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b"></span> a digest, cut to 12 characters</li>
</ul>
<p id="doc-version-summary" class="kp-text-muted"></p>
`,
                script: `
import { summarizeDeltas } from '@kp-soft/themes/js/version-delta';

const list = [
    { from: '10.11.11', to: '12.1' },
    { from: '1.118.2', to: '1.119.0', app: 'immich' },
    { from: '2.4.1', to: '2.4.2' },
    { from: '2.4.1', to: '2.5.0' },
];
document.getElementById('doc-version-summary').textContent = summarizeDeltas(list, { bigMinorApps: ['immich'] }).text;
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachVersionDeltas(root, { bigMinorApps, href })` draws every chip and keeps it in step with its attributes, and returns a detach; `setVersionDelta(el, { from, to, app, href, state, error })` changes one; `versionLevel(from, to, options)` answers `VERSION_LEVELS` (`same`, `other`, `patch`, `minor`, `major`, `downgrade`, `unknown`) and `versionNumbers(version)` the numbers it reads; `summarizeDeltas(list, options)` counts a list exactly for its heading (“2 major, 5 minor, 3 patch”); `githubRepo(upstream)` and `releaseUrl(upstream, latest)` build the release-notes address. `VERSION_DELTA` is the selector.' },
            { name: 'data-kp-version-scheme', what: '`numbers` (default: every number in order), `semver` (the first three), `calver` (nothing is major: the first number is a year) or `none` (never decides).' },
            { name: 'data-kp-version-big-at', what: '`first` (default) or `second`: which number’s change is big for this chip alone; `data-kp-version-big-minor` lists the apps for which it is the second.' },
            { name: 'data-kp-version-level', what: '`auto` (default), `major`, `minor`, `patch` or `other`: one app’s own say about its jump.' },
            { name: 'data-kp-version-arrow', what: 'The arrow’s glyph; → by default.' },
            { name: 'data-kp-level / data-kp-raw / data-kp-sort-value', what: 'What the chip writes: its level (`data-kp-level`), the versions as given (`data-kp-raw`) and a sort value (4 older, 3 major, 2 minor, 1 patch, 0 other: `VERSION_SORT`), so an update list sorts the risky first.' },
            { name: '.kp-version__from / __arrow / __to / __level / __bang / __word / __bone', what: 'The parts of a chip: the old version (struck, lighter), the arrow, the new one (strong), the level word with its “!” (so the risk is never colour alone), and the skeleton of a chip still loading.' },
            { name: 'in a narrow place', what: 'A chip stays inside its component: a long version or digest breaks after a dot, a hyphen or an underscore instead of widening a table cell or a card.' },
            { name: 'kp-version-copy', what: 'Fired when Shift + click copies the jump as text (`VERSION_COPY_EVENT`).' },
            { name: 'data-kp-version-big-minor', what: 'A list of apps whose second number counts as a big jump as well, on the chip or anything above it; the chip names its app in `data-kp-version-app`.' },
            { name: 'data-kp-version-show', what: '`both` (default), `to` or `level` (the word alone, for a tight table).' },
            { name: 'data-kp-version-tones', what: 'The tone of each level, “major:warning,minor:none”; by default only a big jump (warning) and a version that went back (destructive) are loud.' },
            { name: 'data-kp-state', what: '`loading` (a skeleton at the final width), `error` (“could not check”, dashed) or `empty` (“not tracked”).' },
            { name: 'data-kp-version-digest', what: '`short` (default) shows the first 12 characters of a `sha256:` tag, `full` all of it.' },
        ],
        accessibility: [
            'Built in — a screen reader hears “from 10.11 to 12.1, major update”, never the glyphs; the risk is a word and a “!”, not colour alone; the release-notes link says it opens in a new tab.',
            'Yours — give a list of chips a heading with `summarizeDeltas`, and sort on `data-kp-sort-value` so the risky come first.',
        ],
    };
