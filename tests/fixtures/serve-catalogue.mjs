// Serve the repository for a person to look at, and say where to look.
//
// The catalogue and the research demos are review pages: Kenny opens them.
// On 2026-09-13 the links he was handed pointed at a server started inside
// a Claude session, which died when that session restarted, and every link
// answered "cannot connect" [fix-19]. A server a person needs should live in
// that person's terminal, so this starts the same static server the browser
// tests use and prints every review page it can find, each one checked
// against the running server before it is printed.
import { spawn } from 'node:child_process';
import { readdirSync, existsSync } from 'node:fs';
import process from 'node:process';

const PORT = Number(process.env.PORT ?? 4300);
const root = new URL('../../', import.meta.url);

/** Every page a reviewer might open: the catalogue, then each research demo. */
function pages() {
    const found = [];
    const catalogue = new URL('catalogue/', root);
    if (existsSync(catalogue)) {
        for (const name of readdirSync(catalogue)
            .filter((n) => n.endsWith('.html'))
            .sort()) {
            found.push(`catalogue/${name}`);
        }
    }
    const research = new URL('research/', root);
    if (existsSync(research)) {
        for (const topic of readdirSync(research).sort()) {
            if (existsSync(new URL(`research/${topic}/demo.html`, root))) found.push(`research/${topic}/demo.html`);
        }
    }
    return found;
}

const server = spawn(process.execPath, [new URL('./server.mjs', import.meta.url).pathname], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'ignore', 'inherit'],
});
server.on('exit', (code) => process.exit(code ?? 1));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));

// Print a link only once the server has answered for it, so a link on the
// screen is a link that works.
const deadline = Date.now() + 5000;
async function announce() {
    const list = pages();
    const lines = [];
    for (const path of list) {
        const url = `http://localhost:${PORT}/${path}`;
        try {
            const response = await fetch(url);
            lines.push(`  ${response.ok ? '✓' : `✗ ${response.status}`}  ${url}`);
        } catch {
            if (Date.now() < deadline) {
                setTimeout(announce, 150);
                return;
            }
            lines.push(`  ✗ no answer  ${url}`);
        }
    }
    console.log(`\nkp-themes review pages, served from this terminal (Ctrl+C stops it):\n\n${lines.join('\n')}\n`);
}
setTimeout(announce, 150);
