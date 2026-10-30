// Page descriptor for the "command" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const commandDescriptor = {
        id: 'command',
        title: 'Command block',
        group: 'Content',
        classes: ['kp-command'],
        aliases: ['continued'],
        exports: [],
        intro: 'One command to run, with the terminal it runs in, whether it needs admin or sudo, a copy button that confirms and where it runs. `attachCommands(root)` in js/command.js writes the head (the terminal’s name from `data-kp-command`: `wsl`, `powershell`, `cmd`, `garuda`, `bash`; the amber `admin` or `sudo` badge with `data-kp-command-elevated`; the package’s copy button) and the note `data-kp-command-where` under the code, and puts every line behind the terminal’s prompt, which the stylesheet draws so it is never copied. A line ending in a continuation mark or a pipe carries on, indented, on the next. A long line wraps under its first character; `data-kp-command-wrap="scroll"` keeps it whole and the code scrolls.',
        whenToUse:
            'Whenever a page asks a person to run something: a fix in a runbook, the next step of a release, a command a dialog shows for a workstation. Not for a code listing to read (use a plain `pre`) and not for a value to copy (use the copyable value).',
        examples: [
            {
                title: 'A WSL command that needs sudo',
                why: 'The markup is the code and three attributes; the head (the terminal’s name, the amber `admin` or `sudo` badge, the copy button), the prompt and the note “Runs on …” are the script’s. The prompt is drawn by the stylesheet, so a copy is the command as written. The copy button is the package’s own: it says “Copied” on itself, announces it and fires `kp-copy`; a refused copy fires `kp-copy-failed`.',
                markup: `
<div class="kp-command" id="doc-command" data-kp-command="wsl" data-kp-command-elevated data-kp-command-where="CT 109 (kyu)"><pre class="kp-command__code"><code>sudo systemctl restart kyu</code></pre></div>
<p class="kp-text-muted" id="doc-command-said" role="status">Nothing copied yet.</p>
`,
                script: `
import { attachCommands } from '@kp-soft/themes/js/command';

const block = document.getElementById('doc-command');
attachCommands(block.parentElement);
block.addEventListener('kp-copy', () => { document.getElementById('doc-command-said').textContent = 'Copied to the clipboard.'; });
block.addEventListener('kp-copy-failed', () => { document.getElementById('doc-command-said').textContent = 'The clipboard refused it.'; });
`,
            },
            {
                title: 'The five terminals, continued lines and a long line that scrolls',
                why: 'The terminal decides the name, the prompt and the continuation mark: `$` and a backslash for `bash`, `wsl` and `garuda`, `PS>` and a backtick for `powershell`, `>` and a caret for `cmd`. A line that ends in that mark, a pipe, or `&&` and `||` in a Linux shell carries on, indented and without a prompt (`data-kp-continued`). A long line wraps under its first character; `data-kp-command-wrap="scroll"` keeps it whole and the code scrolls, a focusable region with a fading edge on the side that has more. `data-kp-command-label` names a terminal the dictionary does not know.',
                markup: `
<div class="kp-command" data-kp-command="powershell" data-kp-command-elevated data-kp-command-where="the workstation"><pre class="kp-command__code"><code>Get-ChildItem C:\\Users -Recurse \`
    -Filter *.log |
    Remove-Item -WhatIf</code></pre></div>
<div class="kp-command" data-kp-command="cmd"><pre class="kp-command__code"><code>dir C:\\Users ^
  /s /b</code></pre></div>
<div class="kp-command" data-kp-command="garuda" data-kp-command-wrap="scroll"><pre class="kp-command__code"><code>sudo pacman -Syu --noconfirm &amp;&amp; flatpak update -y &amp;&amp; sudo journalctl --vacuum-time=7d &amp;&amp; echo "everything is up to date"</code></pre></div>
<div class="kp-command" data-kp-command="bash"><pre class="kp-command__code"><code>docker compose \\
  --project-name media \\
  up -d</code></pre></div>
<div class="kp-command" data-kp-command="fish" data-kp-command-label="Fish"><pre class="kp-command__code"><code>set -x EDITOR nvim</code></pre></div>
`,
                script: `
import { attachCommands } from '@kp-soft/themes/js/command';

attachCommands(document.getElementById('doc-command').parentElement.parentElement);
`,
            },
        ],
        variants: [
            { name: 'data-kp-command', what: 'The terminal: `wsl`, `powershell`, `cmd`, `garuda` or `bash`; it decides the name, the prompt and the continuation marks.' },
            { name: 'data-kp-command-label', what: 'The terminal’s name when it is not one the dictionary knows.' },
            { name: 'data-kp-command-elevated', what: 'The command needs a terminal opened as administrator (Windows) or runs with sudo (Linux): the amber badge.' },
            { name: 'data-kp-command-where', what: 'Where it runs; shown under the code as “Runs on …”.' },
            { name: 'data-kp-command-wrap', what: '`scroll`: long lines stay whole and the code scrolls sideways, its edge fading on the side with more.' },
            { name: 'data-kp-command-shell', what: 'Set by the script: the terminal the prompt is drawn for, or `other`.' },
            { name: 'data-kp-command-ready', what: 'Set by the script once the block is drawn; before it the head’s room is kept.' },
            { name: 'data-kp-command-before', what: 'Set by the script on scrolling code with more before the view.' },
            { name: 'data-kp-command-after', what: 'Set by the script on scrolling code with more after the view.' },
            { name: 'data-kp-continued', what: 'Set by the script on a line that carries on from the line before: indented, without a prompt.' },
        ],
        accessibility: [
            'Built in — the block is a group named by its terminal; the copy button is described by it, says “Copied” on itself and announces it; a refused copy says so in a toast and on the button.',
            'Built in — the prompts are drawn, not written, so neither a screen reader nor a copy reads them; scrolling code is a focusable region a keyboard can scroll.',
            'Yours — say what the command does in the sentence before it, and name where it runs when that is not the obvious machine.',
            'Built in — in a column too narrow for the head, the Copy button goes under the terminal’s name and the badge; neither breaks a word.',
        ],
    };
