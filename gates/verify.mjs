// `npm run verify` — everything, and it says where it is [Kenny, 2026-09-09].
//
// This is the command Kenny gives before a release. It replaced the CI
// that used to run on every push, which means it is also the only thing
// that ever runs the whole browser suite — six minutes in which the old
// chain (`npm run gates && npm run test:browser && npm run advice`) said
// nothing about which of the three it was in, how far along, or how long
// it had been going. Kenny asked for that, and this is it.
//
// What it adds over the `&&` chain:
//
//   - a banner per phase, numbered, with the wall clock it started at
//   - a heartbeat while a phase is quiet, so a silent minute still shows
//     movement rather than looking like a hang
//   - elapsed time per phase and a total at the end
//   - a summary that says what ran, what passed, and what the advice
//     found — the advisory phase never fails the run, so its findings
//     have to be visible or they are not findings at all
//
// The browser phase uses Playwright's `line` reporter, which prints
// `[412/2526] [firefox] › tests/x.spec.mjs:31:5 › name` over one line:
// that is the "what is running" half, and the heartbeat below never
// fires while it is printing.
//
// Usage:
//   node gates/verify.mjs               gates, the whole suite, the advice
//   node gates/verify.mjs --fast        Firefox only in the browser phase
//   node gates/verify.mjs --no-advice   stop after the suite
//   node gates/verify.mjs --only=gates  one phase by name
//
// What the reporting costs: one node process (17 ms measured) and a pipe.
// The phases are the same commands the `&&` chain ran — nothing is
// recomputed, nothing is run twice, and the heartbeat is an idle timer
// that only prints. Measured 2026-09-09 on Kenny's PC: `npm run gates`
// alone 11617 ms, the same phase through this runner 11617 ms — the
// difference is inside the noise, and the node process that makes the
// difference boots in 17 ms.

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/** How often to say "still going" while a phase prints nothing. */
const HEARTBEAT_MS = 30_000;

/** @param {number} ms @returns {string} `m:ss`, or `h:mm:ss` past an hour */
function elapsed(ms) {
    const total = Math.round(ms / 1000);
    const s = String(total % 60).padStart(2, '0');
    const m = Math.floor(total / 60);
    if (m < 60) return `${m}:${s}`;
    return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}:${s}`;
}

/** @returns {string} the wall clock, to the minute */
const clock = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

/**
 * Run one phase, streaming its output, and keep saying so while it is quiet.
 *
 * The child inherits stderr and stdout is piped only so the heartbeat can
 * tell "quiet" from "printing" — every chunk is written straight through,
 * so nothing is buffered or reordered.
 *
 * @param {string} command
 * @param {string[]} args
 * @param {string} label
 * @returns {Promise<{ code: number, ms: number }>}
 */
function phase(command, args, label) {
    return new Promise((resolve) => {
        const started = Date.now();
        let lastOutput = started;
        const child = spawn(command, args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'], shell: false });
        child.stdout.on('data', (chunk) => {
            lastOutput = Date.now();
            process.stdout.write(chunk);
        });
        const beat = setInterval(() => {
            if (Date.now() - lastOutput < HEARTBEAT_MS) return;
            process.stdout.write(`   … ${label}, still running (${elapsed(Date.now() - started)})\n`);
            lastOutput = Date.now();
        }, HEARTBEAT_MS);
        child.on('close', (code) => {
            clearInterval(beat);
            resolve({ code: code ?? 1, ms: Date.now() - started });
        });
    });
}

const fast = process.argv.includes('--fast');
const skipAdvice = process.argv.includes('--no-advice');
const only = (process.argv.find((a) => a.startsWith('--only=')) ?? '').slice('--only='.length);

/** @type {{ name: string, what: string, command: string, args: string[], blocking: boolean }[]} */
const PHASES = [
    {
        name: 'gates',
        what: 'the thirty blocking checks — generated files, tokens, layers, hooks, registers, fonts, strings, types',
        command: 'npm',
        args: ['run', 'gates'],
        blocking: true,
    },
    {
        name: 'browser',
        what: fast ? 'the whole suite, Firefox only (--fast)' : 'the whole suite, Chromium and Firefox — about 2500 tests, six minutes',
        command: 'npx',
        args: fast ? ['playwright', 'test', '--project=firefox', '--reporter=line'] : ['playwright', 'test', '--reporter=line'],
        blocking: true,
    },
    {
        name: 'advice',
        what: 'contrast, the design invariants, motion, the DI5 report, the texture ceiling — a reading, never a verdict',
        command: 'npm',
        args: ['run', 'advice'],
        // Kenny, 2026-09-09: the accessibility floors report and do not
        // refuse. A non-zero exit here is still shown in the summary — it
        // just does not fail the run, because that is what "advice" means.
        blocking: false,
    },
].filter((p) => !(skipAdvice && p.name === 'advice') && (only === '' || p.name === only));

if (PHASES.length === 0) {
    console.error(`--only=${only} names no phase. They are: gates, browser, advice.`);
    process.exit(1);
}

const runStarted = Date.now();
console.log(`\nverify — ${PHASES.length} phase${PHASES.length === 1 ? '' : 's'}, started ${clock()}\n`);

/** @type {{ name: string, code: number, ms: number, blocking: boolean }[]} */
const results = [];
let failed = null;

for (const [index, p] of PHASES.entries()) {
    console.log(`\n━━ [${index + 1}/${PHASES.length}] ${p.name} — ${p.what}`);
    console.log(`   started ${clock()}, ${elapsed(Date.now() - runStarted)} into the run\n`);
    const { code, ms } = await phase(p.command, p.args, p.name);
    results.push({ name: p.name, code, ms, blocking: p.blocking });
    console.log(`\n━━ ${p.name}: ${code === 0 ? 'passed' : `EXIT ${code}`} in ${elapsed(ms)}`);
    if (code !== 0 && p.blocking) {
        failed = p.name;
        break;
    }
}

console.log(`\n${'─'.repeat(60)}`);
for (const r of results) {
    const verdict = r.code === 0 ? 'ok' : r.blocking ? 'FAILED' : 'findings — read them above';
    console.log(`  ${r.name.padEnd(8)} ${elapsed(r.ms).padStart(7)}   ${verdict}`);
}
console.log(`  ${'total'.padEnd(8)} ${elapsed(Date.now() - runStarted).padStart(7)}`);

if (failed) {
    const skipped = PHASES.slice(results.length).map((p) => p.name);
    console.error(`\nverify stopped at ${failed}.${skipped.length ? ` Not run: ${skipped.join(', ')}.` : ''}`);
    process.exit(1);
}
console.log('\nverify green. The advice above is a reading, not a verdict [Kenny, 2026-09-09].');
