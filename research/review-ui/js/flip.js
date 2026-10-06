// Prototype 2 — FLIP COMPARE. One huge stage, one option shown at a time;
// ←/→ flip between options instantly (motion restarts on every flip, an
// eye-test A/B), Space/Enter picks the shown option, N + note is "none".
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
let optionAt = 0;
let paused = false;
let speed = '1';
let noneMode = false;
let cells = [];
let doc = null;
let task = null;

async function boot() {
    tasks = await E.buildTasks(probe);
    if (!tasks.length) {
        stage.textContent = 'No open aspects found for the configured themes.';
        return;
    }
    const ui = E.uiState('flip');
    index = Math.min(ui.index || 0, tasks.length);
    show(index);
}

function updateProgress() {
    progressBar.style.width = `${(Math.min(index, tasks.length) / tasks.length) * 100}%`;
    E.saveUi('flip', { index });
}

async function show(at) {
    index = Math.max(0, at);
    if (index >= tasks.length) return finish();
    updateProgress();
    task = tasks[index];
    noneMode = false;
    noteBar.hidden = true;
    const already = E.pickOf(task);
    optionAt = already ? task.options.findIndex((o) => o.value === already) : 0;
    if (optionAt < 0) optionAt = 0;
    top.querySelector('[data-title]').textContent = `${task.demoTitle} · ${task.theme} · ${task.aspectLabel}`;
    top.querySelector('[data-meta]').textContent = `Screen ${index + 1} of ${tasks.length}`;
    stage.innerHTML = '';

    const reduced = E.prefersReducedMotion();
    const stageInner = document.createElement('div');
    stageInner.className = 'rv2-flip';
    const box = document.createElement('div');
    box.className = 'rv2-flip__stage';
    const left = document.createElement('button');
    left.type = 'button';
    left.className = 'rv2-flip__arrow rv2-flip__arrow--left';
    left.textContent = '←';
    left.setAttribute('aria-label', 'Previous option');
    left.addEventListener('click', () => flip(-1));
    const right = document.createElement('button');
    right.type = 'button';
    right.className = 'rv2-flip__arrow rv2-flip__arrow--right';
    right.textContent = '→';
    right.setAttribute('aria-label', 'Next option');
    right.addEventListener('click', () => flip(1));
    const wrap = document.createElement('div');
    wrap.className = 'rv2-flip__frame';
    const frame = document.createElement('iframe');
    frame.title = `${task.demoTitle} · ${task.theme}`;
    wrap.append(frame);
    const label = document.createElement('div');
    label.className = 'rv2-flip__label';
    box.append(wrap, label);
    stageInner.append(left, box, right);
    stage.append(stageInner);
    if (reduced) {
        const note = document.createElement('p');
        note.className = 'rv2-still';
        note.textContent = 'Reduced motion: still frame, no autoplay.';
        stage.append(note);
    }
    const dots = document.createElement('div');
    dots.className = 'rv2-flip__dots';
    stage.append(dots);

    await E.switchChromeTheme(task.theme);
    doc = await E.loadFrame(frame, task.demoPath, task.theme);
    const aspects = E.openAspects(doc, task.theme);
    const aspectObj = aspects.find((a) => a.choice.id === task.aspectId);
    const found = E.cellsFor(aspectObj);
    cells = found.cells;
    E.focusRow(aspectObj, { fill: true });
    cells.forEach((cell) => {
        cell.classList.add('rv2-cell--only');
        // The name/description already show once, large, in rv2-flip__label below the
        // stage — the demo's own heading and one-line hint inside the card would repeat
        // them a second time, so they are hidden here (CSS only; the card's own markup
        // is untouched).
        cell.querySelectorAll('.tr-label, .gr-label, .tr-desc, .gr-desc').forEach((el) => el.classList.add('rv2-flip-hide'));
    });
    if (!reduced) E.setSpeed(doc, speed);
    E.setPaused(doc, paused || reduced);
    task.options.forEach(() => dots.append(document.createElement('span')));
    paint(label, dots);
    E.settle(found.row);

    bottom.querySelector('[data-keys]').textContent =
        `←/→ flip (${task.options.length} options) · Space/Enter pick · N none of these · P pause (${paused ? 'paused' : 'playing'}) · S speed (${speed === '1' ? 'full' : speed === '0.5' ? '½' : '¼'})`;
}

function paint(label, dots) {
    cells.forEach((cell, i) => cell.classList.toggle('rv2-cell--shown', i === optionAt));
    const option = task.options[optionAt];
    const hint = option.hints?.[task.theme] || option.hint || '';
    label.textContent = `${optionAt + 1}/${task.options.length} · ${option.label}${hint ? ' — ' + hint : ''}`;
    [...dots.children].forEach((d, i) => d.classList.toggle('rv2-dot--active', i === optionAt));
    const picked = E.pickOf(task);
    label.parentElement.querySelector('.rv2-flip__pick')?.remove();
    if (picked === option.value) {
        const tag = document.createElement('span');
        tag.className = 'rv2-flip__pick';
        tag.textContent = 'Picked';
        label.parentElement.append(tag);
    }
    E.play(doc, task.aspectId); // restarts the motion on every flip
}

function flip(dir) {
    if (!task) return;
    optionAt = (optionAt + dir + task.options.length) % task.options.length;
    paint(stage.querySelector('.rv2-flip__label'), stage.querySelector('.rv2-flip__dots'));
}

function pickShown() {
    const option = task.options[optionAt];
    const pairTasks = tasks.filter((t) => t.pairKey === task.pairKey && t.demo === task.demo);
    E.recordPick(task, pairTasks, option.value, '');
    show(index + 1);
}

function openNone() {
    noneMode = true;
    noteBar.hidden = false;
    noteInput.value = '';
    noteInput.focus();
}

function pickNone() {
    const note = noteInput.value.trim();
    if (!note) {
        noteInput.focus();
        return;
    }
    const pairTasks = tasks.filter((t) => t.pairKey === task.pairKey && t.demo === task.demo);
    E.recordPick(task, pairTasks, null, note);
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
    if (!task) return;
    if (event.key === 'ArrowRight') flip(1);
    else if (event.key === 'ArrowLeft') flip(-1);
    else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        pickShown();
    } else if (event.key.toLowerCase() === 'n') openNone();
    else if (event.key === 'Backspace') show(index - 1);
    else if (event.key.toLowerCase() === 'p') {
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
