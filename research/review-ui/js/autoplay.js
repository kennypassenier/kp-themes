// Prototype 1 — AUTOPLAY CARDS. One aspect per screen, every option in the
// demo's own row enlarged and already playing its own motion (the row's
// cells are the demo's own markup — name, one-line hint and live preview —
// just focused and scaled up). Click a cell or press 1–6 to pick, N for
// "None of these" with a note, Space/Enter confirms the keyboard-focused
// cell. The next screen comes by itself.
import * as E from './engine.js';

const stage = document.getElementById('stage');
const top = document.getElementById('top');
const bottom = document.getElementById('bottom');
const progressBar = document.getElementById('progress-bar');
const noteBar = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const probe = document.getElementById('probe');

let tasks = [];
let index = 0;
let paused = false;
let speed = '1';
let noneMode = false;
let currentCells = [];
let focusedCell = 0;

async function boot() {
    tasks = await E.buildTasks(probe);
    if (!tasks.length) {
        stage.textContent = 'No open aspects found for the configured themes.';
        return;
    }
    const ui = E.uiState('autoplay');
    index = Math.min(ui.index || 0, tasks.length);
    show(index);
}

function updateProgress() {
    progressBar.style.width = `${(Math.min(index, tasks.length) / tasks.length) * 100}%`;
    E.saveUi('autoplay', { index });
}

function markSelection(task) {
    const picked = E.pickOf(task);
    currentCells.forEach((cell, i) => cell.classList.toggle('rv2-cell--picked', task.options[i].value === picked));
}

async function show(at) {
    index = Math.max(0, at);
    if (index >= tasks.length) return finish();
    updateProgress();
    const task = tasks[index];
    noneMode = false;
    focusedCell = 0;
    noteBar.hidden = true;
    top.querySelector('[data-title]').textContent = `${task.demoTitle} · ${task.theme} · ${task.aspectLabel}`;
    top.querySelector('[data-meta]').textContent = `Screen ${index + 1} of ${tasks.length}`;
    stage.innerHTML = '';

    const reduced = E.prefersReducedMotion();
    if (reduced) {
        const note = document.createElement('p');
        note.className = 'rv2-still';
        note.textContent = 'Reduced motion: still frames, no autoplay.';
        stage.append(note);
    }

    await E.switchChromeTheme(task.theme);
    const wrap = document.createElement('div');
    wrap.className = 'rv2-frame-wrap';
    const frame = document.createElement('iframe');
    frame.title = `${task.demoTitle} · ${task.theme}`;
    wrap.append(frame);
    stage.append(wrap);
    const doc = await E.loadFrame(frame, task.demoPath, task.theme);

    const aspects = E.openAspects(doc, task.theme);
    const aspectObj = aspects.find((a) => a.choice.id === task.aspectId);
    const { cells, row } = E.cellsFor(aspectObj);
    E.focusRow(aspectObj, { fill: true });
    if (!reduced) E.setSpeed(doc, speed);
    E.setPaused(doc, paused || reduced);
    E.play(doc, task.aspectId);
    E.settle(row);

    currentCells = cells;
    cells.forEach((cell, i) => {
        cell.style.cursor = 'pointer';
        cell.tabIndex = 0;
        cell.addEventListener('click', () => pick(task, task.options[i].value));
    });
    markSelection(task);

    bottom.querySelector('[data-keys]').textContent =
        `1–${task.options.length} pick · click a card · N none of these · P pause (${paused ? 'paused' : 'playing'}) · S speed (${speed === '1' ? 'full' : speed === '0.5' ? '½' : '¼'}) · ← previous`;
}

function openNone() {
    noneMode = true;
    noteBar.hidden = false;
    noteInput.value = '';
    noteInput.focus();
}

function pick(task, value) {
    const pairTasks = tasks.filter((t) => t.pairKey === task.pairKey && t.demo === task.demo);
    E.recordPick(task, pairTasks, value, '');
    advance();
}

function pickNone() {
    const task = tasks[index];
    const note = noteInput.value.trim();
    if (!note) {
        noteInput.focus();
        return;
    }
    const pairTasks = tasks.filter((t) => t.pairKey === task.pairKey && t.demo === task.demo);
    E.recordPick(task, pairTasks, null, note);
    advance();
}

function advance() {
    show(index + 1);
}

function finish() {
    stage.innerHTML = '';
    top.querySelector('[data-title]').textContent = 'Done';
    top.querySelector('[data-meta]').textContent = `${tasks.length} of ${tasks.length}`;
    progressBar.style.width = '100%';
    bottom.querySelector('[data-keys]').textContent = 'Copy the answer below and paste it into the conversation.';
    const box = document.createElement('div');
    box.className = 'rv2-answer';
    box.innerHTML = `<h2>Your answer</h2><pre data-answer></pre><p><button type="button" class="kp-button kp-button--primary" data-copy>Copy answer</button> <span data-status></span></p>`;
    box.querySelector('[data-answer]').textContent = E.buildAnswer(tasks);
    box.querySelector('[data-copy]').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(E.buildAnswer(tasks));
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
    const task = tasks[index];
    if (!task) return;
    if (/^[1-6]$/.test(event.key)) {
        const n = Number(event.key);
        if (n <= task.options.length) pick(task, task.options[n - 1].value);
    } else if (event.key.toLowerCase() === 'n') {
        openNone();
    } else if (event.key === 'ArrowLeft') {
        show(index - 1);
    } else if (event.key.toLowerCase() === 'p') {
        paused = !paused;
        show(index);
    } else if (event.key.toLowerCase() === 's') {
        speed = speed === '1' ? '0.5' : speed === '0.5' ? '0.25' : '1';
        show(index);
    }
});

document.getElementById('note-form').addEventListener('submit', (event) => {
    event.preventDefault();
    pickNone();
});

boot();
