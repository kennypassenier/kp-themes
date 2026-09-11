// Browser tests [H1, AR7].
//
// Phase 5 decision H1, as Kenny rewrote it on 2026-09-09: the fast gates
// block a commit and the browser tests run when he runs them. There is no
// CI to block a merge with — `npm run test:affected` covers a change,
// `npm run verify` covers a release, and both are commands he gives.
//
// AR7: one behaviour suite, run twice in the same browser — once against
// the React mount, once against the script-attached mount. A structural
// comparison would score two channels as identical while one of them
// fails to return focus; only driving them proves anything.

import { defineConfig, devices } from '@playwright/test';

// The port the fixture server listens on. Overridable, because a second
// checkout of this repository — a git worktree building another milestone
// — runs the same suite at the same time, and `reuseExistingServer` then
// hands one run the OTHER checkout's files: every fixture page 404s and
// the whole suite fails for a reason that has nothing to do with the
// code. `KP_TEST_PORT=4183 npx playwright test` keeps them apart.
const PORT = Number(process.env.KP_TEST_PORT ?? 4173);

export default defineConfig({
    testDir: './tests',
    globalSetup: './tests/global-setup.mjs',
    fullyParallel: true,
    // Always, not only under a CI variable that no longer exists: a
    // stray `.only` silently reduces the suite to one test, and nothing
    // downstream is left to catch that.
    forbidOnly: true,
    // Never. A test that passes on a retry is a test that failed
    // [Kenny, 2026-09-09].
    retries: 0,
    // Half the machine, not all of it [Kenny, 2026-09-11]. Playwright's
    // default is every core, and on his sixteen that made the desktop
    // stutter while a run was going — a suite that makes the machine it
    // runs on unusable is a suite nobody starts. KP_TEST_WORKERS overrides
    // it for a machine with room to spare.
    workers: Number(process.env.KP_TEST_WORKERS ?? 0) || '50%',
    reporter: 'line',
    use: {
        baseURL: `http://127.0.0.1:${PORT}`,
        trace: 'retain-on-failure',
    },
    // AR15's baseline is modern Chrome AND Firefox. Testing only one of
    // them makes "green" evidence about that one — standing rule 35.
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    ],
    webServer: {
        command: `node tests/fixtures/server.mjs`,
        url: `http://127.0.0.1:${PORT}/tests/fixtures/picker.html`,
        reuseExistingServer: true,
        env: { PORT: String(PORT) },
    },
});
