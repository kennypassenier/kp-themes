import { Controller } from '../controller.js';
/** The controller of one `.kp-formgrid`. */
export declare class FormgridColumnsController extends Controller {
    connect(): void;
    /** The shown children of the grid: no templates, scripts, styles or hidden elements. */
    kids(): Element[];
    /** Whether the grid's groups may stand side by side at all. */
    eligible(): boolean;
    /** Measure with the groups side by side, and put them back when they do not fit (one task, nothing is painted between). */
    decide(): void;
}
