export type CalendarDay = import('./constants.js').CalendarDay;
export type CalendarTone = import('./constants.js').CalendarTone;
export type CalendarModel = import('./controller.js').CalendarController;
/** The calm legend's entries. @param {{ calmLegendLogged: string, calmLegendQuiet: string, calmLegendPaused: string }} s */
export declare const calmLegend: (s: {
    calmLegendLogged: string;
    calmLegendQuiet: string;
    calmLegendPaused: string;
}) => {
    tone: CalendarTone;
    label: string;
}[];
/** @param {import('./controller.js').CalendarController} c @param {string} iso @param {string} today @returns {CalendarDay} */
export declare function dayFor(c: import('./controller.js').CalendarController, iso: string, today: string): CalendarDay;
