// The alarm research demo's own Playwright run, firefox only. Not part of the
// suite: it lives beside the research it verifies. Run it from the repository
// root with
//   KP_TEST_PORT=4605 npx playwright test -c research/alarm/playwright.config.mjs
// The fixture server it starts is its own (reuseExistingServer: false), on
// the port above, so it never borrows another checkout's server.

import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.KP_TEST_PORT ?? 4605);

export default defineConfig({
    testDir: '.',
    testMatch: 'verify.spec.mjs',
    fullyParallel: false,
    workers: 1,
    retries: 0,
    forbidOnly: true,
    reporter: 'line',
    timeout: 120_000,
    use: { baseURL: `http://127.0.0.1:${PORT}`, viewport: { width: 1024, height: 768 } },
    projects: [{ name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1024, height: 768 } } }],
    webServer: {
        command: 'node tests/fixtures/server.mjs',
        cwd: '../..',
        url: `http://127.0.0.1:${PORT}/research/alarm/demo.html`,
        reuseExistingServer: false,
        env: { PORT: String(PORT) },
    },
});
