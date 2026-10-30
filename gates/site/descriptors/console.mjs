// Page descriptor for the "console" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const consoleDescriptor = {
        id: 'console',
        title: 'Console',
        group: 'Data',
        classes: ['kp-console'],
        exports: [],
        intro: 'A prompt and, per command, a block that shows whether it still runs, worked or failed: the command, its exit code, its output folded and copyable, and a refusal in what and what to do now. The app runs the commands; the package draws the shell of the interaction and remembers your earlier lines for as long as the tab is open.',
        whenToUse: 'An admin page that runs a command on a host or a container and shows what came back. For a stream of log lines use the log; for one captured request use the request inspector.',
        examples: [
            {
                title: 'A host console',
                why: 'The page gives `run(command, context)`; the module does everything around it.',
                markup: `
<div class="kp-console" data-kp-console data-kp-console-prompt="#" aria-label="Host console"></div>
`,
            },
            {
                title: 'A host console with every kind of block',
                why: 'The page supplies `run(command, context)`; it returns a job whose `update(handler)` reports `{ state, code, output, append, error, remedy }`. A block is `running` (with its elapsed time and, with `data-kp-console-cancel`, a Cancel), then `ok` or `failed` with the exit code, or `refused` with what is wrong and what to do. The line a refusal came from stays in the prompt. `data-kp-console-context="select"` puts a labelled select before the prompt whose value is the second argument of `run`; `data-kp-console-confirm` makes a matching line need a second press; Tab completes through `setConsoleComplete`.',
                markup: `
<div class="kp-console" id="doc-console-host" data-kp-console data-kp-console-prompt="#" data-kp-console-context="select" data-kp-console-cancel data-kp-console-tab="complete" data-kp-console-confirm="reboot,rm" data-kp-console-hint="Try: uptime, ls /missing, build, reboot. Tab completes." aria-label="Host console"></div>
`,
                script: `
import { setConsoleRun, setConsoleContext, setConsoleComplete, runConsoleCommand } from '@kp-soft/themes/js/console';

const box = document.getElementById('doc-console-host');
setConsoleContext(box, { label: 'Host', options: [{ value: 'media', label: 'media' }, { value: 'backups', label: 'backups' }] });
setConsoleComplete(box, (prefix) => ['uptime', 'ls /missing', 'build', 'reboot'].filter((word) => word.startsWith(prefix)));
setConsoleRun(box, (command, host) => ({
    update(handler) {
        const done = (change, ms) => setTimeout(() => handler(change), ms);
        if (command === 'uptime') {
            done({ state: 'ok', code: 0, output: '22:41:07 up 12 days, 3:02, 1 user, load average: 0.12, 0.09, 0.08' }, 300);
        } else if (command.startsWith('ls')) {
            done({ state: 'failed', code: 2, output: 'ls: cannot access ' + command.slice(3) + ': No such file or directory' }, 300);
        } else if (command === 'build') {
            handler({ state: 'running', output: 'Compiling on ' + host + '…\\n' });
            [1, 2, 3, 4].forEach((step) => done({ state: 'running', append: 'step ' + step + ' of 4\\n' }, step * 600));
            done({ state: 'ok', code: 0, append: 'Finished.\\n' }, 2900);
        } else {
            done({ state: 'refused', error: 'Rebooting is not allowed here.', remedy: 'Ask for a maintenance window first.' }, 300);
        }
    },
    cancel() {},
}));
['uptime', 'ls /missing', 'reboot'].forEach((command) => runConsoleCommand(box, command));
`,
            },
            {
                title: 'Loading, unreachable and off with a reason',
                why: '`setConsole(el, { state })` is `loading` (the busy card over the output at its final size), `error` (a plate saying the host could not be reached, with Retry, which fires `kp-console-retry`) or `ready`. `data-kp-disabled-reason` with `disabled` stops the prompt and says why.',
                markup: `
<div class="kp-stack">
<div class="kp-console" id="doc-console-loading" data-kp-console aria-label="Console that is connecting"></div>
<div class="kp-console" id="doc-console-failed" data-kp-console aria-label="Console that cannot reach its host"></div>
<div class="kp-console" data-kp-console disabled data-kp-disabled-reason="Commands are off while a backup is running." aria-label="Console that is switched off"></div>
</div>
`,
                script: `
import { setConsole } from '@kp-soft/themes/js/console';

setConsole(document.getElementById('doc-console-loading'), { state: 'loading' });
setConsole(document.getElementById('doc-console-failed'), { state: 'error', message: 'The host did not answer.' });
`,
            },
            {
                title: 'A console that is only a bar',
                why: '`data-kp-console-mode="bar"` keeps the prompt, the select and Run; the blocks are not drawn but go out as `kp-console-block` with `{ block }`, for a page that shows the output in a panel of its own. `data-kp-console-order="newest-first"` and `data-kp-console-max-lines` change how a full console reads.',
                markup: `
<div class="kp-stack">
<div class="kp-console" id="doc-console-bar" data-kp-console data-kp-console-mode="bar" data-kp-console-prompt="$" aria-label="Command bar"></div>
<pre class="kp-code-block" id="doc-console-out" aria-live="polite"><code>Nothing run yet.</code></pre>
</div>
`,
                script: `
import { setConsoleRun } from '@kp-soft/themes/js/console';

const bar = document.getElementById('doc-console-bar');
const out = document.getElementById('doc-console-out').querySelector('code');
setConsoleRun(bar, (command) => ({
    update(handler) {
        setTimeout(() => handler({ state: 'ok', code: 0, output: 'ran: ' + command }), 200);
    },
}));
bar.addEventListener('kp-console-block', (event) => {
    const { command, state, output } = event.detail.block;
    out.textContent = '$ ' + command + '\\n[' + state + '] ' + output;
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-console-prompt', what: 'The prompt glyph (#).' },
            { name: 'data-kp-console-context', what: '`select`: a select before the prompt whose value goes to `run`.' },
            { name: 'data-kp-console-history', what: 'How many lines Up recalls (50).' },
            { name: 'data-kp-console-remember', what: '`session` (default, only while the tab is open), `device` or `off`.' },
            { name: 'data-kp-console-dedupe', what: '`false` keeps a line typed twice in a row twice.' },
            { name: 'data-kp-console-order', what: '`newest-last` (default) or `newest-first`.' },
            { name: 'data-kp-console-follow', what: '`stick` (default) or `off`.' },
            { name: 'data-kp-console-max-blocks', what: 'Blocks kept (200); older ones fold.' },
            { name: 'data-kp-console-max-lines', what: 'Lines of output shown before the fold (12).' },
            { name: 'data-kp-console-max-bytes', what: 'Bytes of output kept per block (262144).' },
            { name: 'data-kp-console-status', what: '`exit-code` (default) or `word`.' },
            { name: 'data-kp-console-timer', what: '`false` hides the elapsed time of a running block.' },
            { name: 'data-kp-console-cancel', what: 'A running block offers Cancel when the job can.' },
            { name: 'data-kp-console-tab', what: '`none` (default) or `complete`.' },
            { name: 'data-kp-console-focus-key', what: 'The key that jumps to the prompt (:).' },
            { name: 'data-kp-console-confirm', what: 'Words or a /regular expression/: a matching line needs a second press.' },
            { name: 'data-kp-console-hint', what: 'The line under the prompt, its height reserved.' },
            { name: 'data-kp-console-mode', what: '`full` (default) or `bar`: only the prompt; blocks go out as `kp-console-block`.' },
        ],
        accessibility: [
            'Built in — the output is a log region, a running block is busy, only the last command’s result is announced (never its output), a refusal is an alert, the prompt says why it is off.',
            'Yours — everything about what a command may do, and masking secrets in the output.',
        ],
    };
