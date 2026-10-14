// research/sidenav-minor: one "Play once" button per section, above its
// windows. It is the section's replay control (`data-review-replay`), so the
// review dialog's "Play open and close" presses it in a loop; each press asks
// every window of the section for one round (rounds.js). Nothing plays until
// it is pressed.

for (const section of document.querySelectorAll('[data-review-item]')) {
    const first = section.querySelector('iframe');
    if (!first) continue;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'kp-button kp-button--sm mn-round';
    button.setAttribute('data-review-replay', '');
    button.setAttribute('data-mn-round', '');
    button.textContent = '▶ Play once';
    button.style.marginBlockEnd = '0.5rem';
    button.style.justifySelf = 'start';
    button.style.inlineSize = 'max-content';
    // Above the group of windows when they share one (look.html), else right above the window; always inside the
    // section, so the review dialog finds it as the section's replay control.
    const group = first.closest('figure')?.parentElement;
    (group && group !== section ? group : (first.closest('figure') ?? first)).before(button);
}

// Delegated, so a copy of the section the review dialog shows asks its own windows.
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-mn-round]') : null;
    if (!button) return;
    for (const frame of button.closest('[data-review-item]')?.querySelectorAll('iframe') ?? [])
        if (frame instanceof HTMLIFrameElement) frame.contentWindow?.postMessage({ type: 'mn-round' }, '*');
});
