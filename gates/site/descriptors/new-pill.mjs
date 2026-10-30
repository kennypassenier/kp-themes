// Page descriptor for the "new-pill" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const newPillDescriptor = {
        id: 'new-pill',
        title: 'New-lines pill',
        group: 'Feedback',
        classes: ['kp-newpill'],
        exports: [],
        aliases: ['follow', 'following', 'pill-placement', 'pill-unit', 'since-left'],
        intro: 'The “12 new lines · back to the tail” pill on a list that grows while it is read. The list follows its newest row as long as the reader is at that end; once the reader scrolls away, rows that arrive out of sight are counted in the pill, which jumps back with one press.',
        whenToUse: 'A live log, a feed of messages or any list where new rows arrive at one end. For a static list, nothing is needed.',
        examples: [
            {
                title: 'A log that follows its tail',
                why: 'The element marked `data-kp-follow` is the scroller and its children are the rows; the pill is drawn in the parent, which becomes the host.',
                markup: `
<div data-kp-newpill-host>
<ul data-kp-follow="tail" data-kp-follow-threshold="24" data-kp-pill-unit="line,lines" style="max-block-size: 6rem; overflow: auto; margin: 0; padding: 0; list-style: none">
<li>20:14 backup started</li>
<li>20:15 photos: 1,204 files checked</li>
<li>20:16 media: 3,880 files checked</li>
<li>20:17 pruning old snapshots</li>
<li>20:18 backup finished</li>
</ul>
</div>
`,
            },
            {
                title: 'Rows arriving in a data table',
                why: '`data-kp-follow-rows="tbody"` on the scroller that holds the table: the pill counts rows arriving in the body, once each by `data-kp-row-key`. Add a row from the script and the count appears when the reader is not at the end.',
                markup: `
<div data-kp-newpill-host>
<div data-kp-follow="tail" data-kp-follow-rows="tbody" data-kp-pill-unit="job,jobs" id="doc-pill-table" style="max-block-size: 8rem; overflow: auto">
<table class="kp-table">
<caption>Jobs</caption>
<thead><tr><th scope="col">Job</th><th scope="col">Result</th></tr></thead>
<tbody>
<tr data-kp-row-key="j1"><td>Backup photos</td><td>Succeeded</td></tr>
<tr data-kp-row-key="j2"><td>Prune snapshots</td><td>Succeeded</td></tr>
<tr data-kp-row-key="j3"><td>Update images</td><td>Failed</td></tr>
<tr data-kp-row-key="j4"><td>Verify backups</td><td>Succeeded</td></tr>
<tr data-kp-row-key="j5"><td>Backup media</td><td>Succeeded</td></tr>
</tbody>
</table>
</div>
</div>
<button type="button" class="kp-button" id="doc-pill-add">Add a job</button>
`,
                script: `
import { attachNewPills } from '@kp-soft/themes/js/newpill';

attachNewPills(document.getElementById('doc-pill-table').parentElement);
let n = 5;
document.getElementById('doc-pill-add').addEventListener('click', () => {
    n += 1;
    const row = document.createElement('tr');
    row.setAttribute('data-kp-row-key', 'j' + n);
    row.innerHTML = '<td>Job ' + n + '</td><td>Succeeded</td>';
    document.querySelector('#doc-pill-table tbody').append(row);
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-follow', what: '`tail` (default) or `head` for a newest-first list: where new rows arrive.' },
            { name: 'data-kp-follow-threshold', what: 'Pixels from the end that still count as following; 24.' },
            { name: 'data-kp-pill-placement', what: '`bottom` or `top`; the end the rows arrive at by default.' },
            { name: 'data-kp-pill-unit', what: '`line,lines`: the app’s word for a row, singular and plural.' },
            { name: 'data-kp-since-left', what: 'On by default, `off` turns it off (read at runtime): a divider “New since 14:32” before the first row that came while the tab was away.' },
            { name: 'data-kp-follow-key', what: 'The key that jumps back and follows again; End, or Home for `head`.' },
            { name: 'data-kp-follow-space', what: 'Space pauses and resumes following, for a log.' },
            { name: 'data-kp-follow-toggle', what: 'On a button, naming the list: it pauses and resumes the following and says which it will do.' },
            { name: 'data-kp-follow-rows', what: '`children` (default) or `tbody`: where the rows are. With `tbody` the scroller holds a data table and its body’s rows are counted; a row counts once by its `data-kp-row-key`, so a re-sort or a page change does not count it again.' },
            { name: 'switchable at runtime', what: 'Switchable at runtime: changing `data-kp-pill-placement` redraws the pill.' },
        ],
        accessibility: [
            'Built in — a row counts only while it is shown, so a filter takes it out of the count, which is exact; the count is said to a screen reader at most every ten seconds.',
            'Yours — let the scroller really scroll (`overflow: auto`) and give it a name.',
        ],
    };
