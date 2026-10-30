import { ScopeWatch } from './scope.js';
/**
 * Wire every KPI toggle under a scope: a click flips `aria-pressed` and fires `kp-kpi-toggle`. A tile marked
 * `data-kp-kpi-owned` is left to the page (a framework that keeps the pressed state itself).
 */
export declare class KpiToggles extends ScopeWatch {
    connect(): void;
    /** @param {Event} event */
    onClick(event: Event): void;
}
