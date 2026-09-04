// Browser tests [H1, AR7].
//
// Phase 5 decision H1: the fast gates block a commit, the browser tests
// block a merge. So these do not run in the pre-commit hook — they run in
// CI, and `npm run test:browser` runs them on demand.
//
// AR7: one behaviour suite, run twice in the same browser — once against
// the React mount, once against the script-attached mount. A structural
// comparison would score two channels as identical while one of them
// fails to return focus; only driving them proves anything.

import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
    testDir: './tests',
    globalSetup: './tests/global-setup.mjs',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    reporter: process.env.CI ? 'list' : 'line',
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
        reuseExistingServer: !process.env.CI,
        env: { PORT: String(PORT) },
    },
});
