// Prototype 3 — CONTACT SHEET. One aspect, every open theme at once, a row
// per theme with its options small and autoplaying. ↑/↓ moves the active
// theme row, 1–6 picks an option in it, N + note is "none of these" for
// the active row, Enter confirms. Good for consistency across themes.
import * as E from './engine.js';

const stage = document.getElementById('stage');
const top = document.getElementById('top');
const bottom = document.getElementById('bottom');
const progressBar = document.getElementById('progress-bar');
const noteBar = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const probe = document.getElementById('probe');

let groups = []; // [{ key, demo, demoTitle, aspectId, aspectLabel, tasks: [task...] }]
let gIndex = 0;
let rowAt = 0;
let allTasks = [];
let paused = false;
let speed = '1';
let noneMode = false;
let rowCells = []; // per-row cells array, aligned with group.tasks

async function boot() {
    allTasks = await E.buildTasks(probe);
    if (!allTasks.length) {
        stage.textContent = 'No open aspects found for the configured themes.';
        return;
    }
    const byGroup = new Map();
    for (const t of allTasks) {
        const key = `${t.demo}|${t.aspectId}`;
        if (!byGroup.has(key))
            byGroup.set(key, { key, demo: t.demo, demoTitle: t.demoTitle, aspectId: t.aspectId, aspectLabel: t.aspectLabel, tasks: [] });
        byGroup.get(key).tasks.push(t);
    }
    groups = [...byGroup.values()];
    const ui = E.uiState('sheet');
    gIndex = Math.min(ui.gIndex || 0, groups.length);
    show(gIndex);
}

function updateProgress() {
    progressBar.style.width = `${(Math.min(gIndex, groups.length) / groups.length) * 100}%`;
    E.saveUi('sheet', { gIndex });
}

async function show(at) {
    gIndex = Math.max(0, at);
    if (gIndex >= groups.length) return finish();
    updateProgress();
    const group = groups[gIndex];
    rowAt = 0;
    noneMode = false;
    noteBar.hidden = true;
    top.querySelector('[data-title]').textContent = `${group.demoTitle} · ${group.aspectLabel}`;
    top.querySelector('[data-meta]').textContent = `Aspect ${gIndex + 1} of ${groups.length} · ${group.tasks.length} theme(s)`;
    stage.innerHTML = '';
    const sheet = document.createElement('div');
    sheet.className = 'rv2-sheet';
    stage.append(sheet);
    const reduced = E.prefersReducedMotion();
    if (reduced) {
        const note = document.createElement('p');
        note.className = 'rv2-still';
        note.textContent = 'Reduced motion: still frames, no autoplay.';
        stage.prepend(note);
    }

    rowCells = [];
    // Row height: fit the budget this aspect's theme-count gets within the stage (roughly
    // 680px), but never below a size that still shows the card whole — the exact figure is
    // settled per row below, from the row's own real content height.
    const rowBudget = Math.max(170, Math.min(300, Math.floor(660 / group.tasks.length)));
    await E.switchChromeTheme(group.tasks[0].theme);
    const loaded = []; // { doc, task } — themes are reasserted on all of these once every row has loaded
    for (const [i, task] of group.tasks.entries()) {
        const row = document.createElement('div');
        row.className = 'rv2-sheet__row';
        row.dataset.row = String(i);
        const label = document.createElement('div');
        label.className = 'rv2-sheet__label';
        label.innerHTML = `<span></span><small></small>`;
        label.firstElementChild.textContent = task.theme;
        label.lastElementChild.textContent = E.pickOf(task) ? 'picked' : E.noneNoteOf(task) ? 'none of these' : 'open';
        const wrap = document.createElement('div');
        wrap.className = 'rv2-frame-wrap';
        wrap.style.flex = '1';
        wrap.style.height = `${rowBudget}px`;
        const frame = document.createElement('iframe');
        frame.title = `${task.demoTitle} · ${task.theme}`;
        wrap.append(frame);
        row.append(label, wrap);
        sheet.append(row);

        const doc = await E.loadFrame(frame, task.demoPath, task.theme);
        loaded.push({ doc, task });
        const aspects = E.openAspects(doc, task.theme);
        const aspectObj = aspects.find((a) => a.choice.id === task.aspectId);
        const { cells, row: focusedRow } = E.cellsFor(aspectObj);
        // Size the row to its own real content height — never a guessed fixed height, which is
        // what cropped the card before. A row taller than the budget just makes the sheet
        // scroll a little further (it already does, `.rv2-sheet{overflow:auto}`); it never
        // hides the bottom of a card.
        E.focusRow(aspectObj, { scale: 1 });
        await new Promise((r) => doc.defaultView.requestAnimationFrame(() => doc.defaultView.requestAnimationFrame(r)));
        const naturalHeight = focusedRow?.scrollHeight || rowBudget;
        wrap.style.height = `${naturalHeight + 8}px`;
        if (!reduced) E.setSpeed(doc, speed);
        E.setPaused(doc, paused || reduced);
        E.play(doc, task.aspectId);
        E.settle(focusedRow);
        cells.forEach((cell, n) => {
            cell.style.cursor = 'pointer';
            cell.addEventListener('click', () => {
                rowAt = i;
                paintActive();
                pick(task, task.options[n].value);
            });
        });
        rowCells.push(cells);
        markRowSelection(row, task);
    }
    // Every frame but the last just had its theme clobbered back to the last-loaded one by
    // the demo's own cross-tab storage sync (see reassertTheme) — put each row's real theme
    // back now that no more frames are about to load and re-trigger it.
    for (const { doc, task } of loaded) E.reassertTheme(doc, task.theme);
    paintActive();
    bottom.querySelector('[data-keys]').textContent =
        `↑/↓ theme · 1–6 pick in active row · N none of these · P pause (${paused ? 'paused' : 'playing'}) · S speed (${speed === '1' ? 'full' : speed === '0.5' ? '½' : '¼'})`;
}

function markRowSelection(row, task) {
    const cells = rowCells[Number(row.dataset.row)] || [];
    const picked = E.pickOf(task);
    cells.forEach((cell, i) => cell.classList.toggle('rv2-cell--picked', task.options[i].value === picked));
}

function paintActive() {
    [...stage.querySelectorAll('.rv2-sheet__row')].forEach((row, i) => row.classList.toggle('rv2-sheet__row--active', i === rowAt));
    stage.querySelector('.rv2-sheet__row--active')?.scrollIntoView({ block: 'nearest' });
}

function pick(task, value) {
    const pairTasks = allTasks.filter((t) => t.pairKey === task.pairKey && t.demo === task.demo);
    E.recordPick(task, pairTasks, value, '');
    show(gIndex); // repaint this screen with the pick marked; move on manually to the next aspect
    maybeAdvance();
}

function maybeAdvance() {
    const group = groups[gIndex];
    if (group && group.tasks.every((t) => E.isDone(t))) show(gIndex + 1);
}

function openNone() {
    noneMode = true;
    noteBar.hidden = false;
    noteInput.value = '';
    noteInput.focus();
}

function pickNone() {
    const group = groups[gIndex];
    const task = group.tasks[rowAt];
    const note = noteInput.value.trim();
    if (!note) {
        noteInput.focus();
        return;
    }
    const pairTasks = allTasks.filter((t) => t.pairKey === task.pairKey && t.demo === task.demo);
    E.recordPick(task, pairTasks, null, note);
    noneMode = false;
    noteBar.hidden = true;
    show(gIndex);
    maybeAdvance();
}

function finish() {
    stage.innerHTML = '';
    top.querySelector('[data-title]').textContent = 'Done';
    top.querySelector('[data-meta]').textContent = `${groups.length} of ${groups.length}`;
    progressBar.style.width = '100%';
    bottom.querySelector('[data-keys]').textContent = 'Copy the answer below and paste it into the conversation.';
    const box = document.createElement('div');
    box.className = 'rv2-answer';
    box.innerHTML = `<h2>Your answer</h2><pre data-answer></pre><p><button type="button" class="kp-button kp-button--primary" data-copy>Copy answer</button> <span data-status></span></p>`;
    box.querySelector('[data-answer]').textContent = E.buildAnswer(allTasks);
    box.querySelector('[data-copy]').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(E.buildAnswer(allTasks));
            box.querySelector('[data-status]').textContent = 'Copied.';
        } catch {
            box.querySelector('[data-status]').textContent = 'Could not copy automatically — select the text above.';
        }
    });
    stage.append(box);
}

window.addEventListener('keydown', (event) => {
    if (noneMode) {
        if (event.key === 'Escape') {
            noneMode = false;
            noteBar.hidden = true;
        } else if (event.key === 'Enter') {
            event.preventDefault();
            pickNone();
        }
        return;
    }
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    const group = groups[gIndex];
    if (!group) return;
    if (event.key === 'ArrowDown') {
        rowAt = Math.min(group.tasks.length - 1, rowAt + 1);
        paintActive();
    } else if (event.key === 'ArrowUp') {
        rowAt = Math.max(0, rowAt - 1);
        paintActive();
    } else if (/^[1-6]$/.test(event.key)) {
        const n = Number(event.key);
        const task = group.tasks[rowAt];
        if (task && n <= task.options.length) pick(task, task.options[n - 1].value);
    } else if (event.key.toLowerCase() === 'n') {
        openNone();
    } else if (event.key === 'Backspace') {
        show(gIndex - 1);
    } else if (event.key.toLowerCase() === 'p') {
        paused = !paused;
        show(gIndex);
    } else if (event.key.toLowerCase() === 's') {
        speed = speed === '1' ? '0.5' : speed === '0.5' ? '0.25' : '1';
        show(gIndex);
    }
});

document.getElementById('note-form').addEventListener('submit', (event) => {
    event.preventDefault();
    pickNone();
});

boot();
