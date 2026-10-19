// research/align-grid-1019: the page's own wiring. The grid is CSS alone (css/components.css, .kp-formgrid); js/auto.js
// attaches the time fields, the steppers and the selects. This file only turns the review dialog's switches into the
// grid's attributes, so each option is shown working live.
for (const button of /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll('[data-ag-opt]')])) {
    button.addEventListener('click', () => {
        const controls = button.closest('[data-review-controls-for]');
        const grid = document.getElementById(controls?.getAttribute('data-review-controls-for') || '');
        if (!grid) return;
        const opt = button.getAttribute('data-ag-opt');
        const value = button.getAttribute('data-ag-value') || '';
        grid.setAttribute(`data-kp-formgrid-${opt}`, value);
        for (const sibling of button.parentElement?.querySelectorAll('[data-ag-opt]') ?? [])
            sibling.setAttribute('aria-pressed', String(sibling === button));
    });
}
