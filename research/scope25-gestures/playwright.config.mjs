// The scope-25 gestures research demo's own Playwright run, firefox only. Not
// part of the suite: it lives beside the research it verifies. Run it from the
// repository root with
//   KP_TEST_PORT=4654 npx playwright test -c research/scope25-gestures/playwright.config.mjs
// The fixture server it starts is its own (reuseExistingServer: false), on the
// port above, so it never borrows another checkout's server.

import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.KP_TEST_PORT ?? 4654);

export default defineConfig({
    testDir: '.',
    testMatch: 'verify.spec.mjs',
    fullyParallel: false,
    workers: 1,
    retries: 0,
    forbidOnly: true,
    reporter: 'line',
    timeout: 180_000,
    use: { baseURL: `http://127.0.0.1:${PORT}`, viewport: { width: 1280, height: 900 } },
    projects: [{ name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 900 } } }],
    webServer: {
        command: 'node tests/fixtures/server.mjs',
        cwd: '../..',
        url: `http://127.0.0.1:${PORT}/research/scope25-gestures/demo.html`,
        reuseExistingServer: false,
        env: { PORT: String(PORT) },
    },
});
