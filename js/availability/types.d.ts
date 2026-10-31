export type AvailabilityAnswer = 'yes' | 'maybe' | 'no';
export type AvailabilityColumn = {
    key: string;
    label: string;
    sub?: string;
};
export type AvailabilityPerson = {
    id: string;
    name: string;
    mine?: boolean;
};
export type AvailabilityAnswers = Record<string, Record<string, AvailabilityAnswer | undefined>>;
export type AvailabilitySet = {
    columns: AvailabilityColumn[];
    answers: AvailabilityAnswers;
};
export type AvailabilitySpec = {
    /**
     * what a column is (default `range`)
     */
    unit?: 'range' | 'day';
    columns?: AvailabilityColumn[];
    people?: AvailabilityPerson[];
    answers?: AvailabilityAnswers;
    /**
     * both kinds of column, with their answers
     */
    sets?: {
        range?: AvailabilitySet;
        day?: AvailabilitySet;
    };
    /**
     * show the organiser's switch between the two sets (the attribute data-kp-availability-unit-switch on or off overrides it at run time)
     */
    canSwitchUnit?: boolean;
    state?: 'ready' | 'loading' | 'empty' | 'error';
    /**
     * the failed or empty plate's sentence
     */
    message?: string;
    /**
     * the empty plate's action words (fires `kp-availability-retry` with `{ action: 'add' }`)
     */
    emptyAction?: string;
};
export type AvState = {
    spec: AvailabilitySpec;
    set: AvailabilitySet;
    unit: 'range' | 'day';
    refused: Map<string, number>;
    saving: Set<string>;
    menu: HTMLElement | null;
};
/** @typedef {'yes' | 'maybe' | 'no'} AvailabilityAnswer */
/** @typedef {{ key: string, label: string, sub?: string }} AvailabilityColumn */
/** @typedef {{ id: string, name: string, mine?: boolean }} AvailabilityPerson */
/** @typedef {Record<string, Record<string, AvailabilityAnswer | undefined>>} AvailabilityAnswers */
/** @typedef {{ columns: AvailabilityColumn[], answers: AvailabilityAnswers }} AvailabilitySet */
/**
 * @typedef {object} AvailabilitySpec
 * @property {'range' | 'day'} [unit]  what a column is (default `range`)
 * @property {AvailabilityColumn[]} [columns]
 * @property {AvailabilityPerson[]} [people]
 * @property {AvailabilityAnswers} [answers]
 * @property {{ range?: AvailabilitySet, day?: AvailabilitySet }} [sets]  both kinds of column, with their answers
 * @property {boolean} [canSwitchUnit]  show the organiser's switch between the two sets (the attribute data-kp-availability-unit-switch on or off overrides it at run time)
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state]
 * @property {string} [message]  the failed or empty plate's sentence
 * @property {string} [emptyAction]  the empty plate's action words (fires `kp-availability-retry` with `{ action: 'add' }`)
 */
/** @typedef {{ spec: AvailabilitySpec, set: AvailabilitySet, unit: 'range' | 'day', refused: Map<string, number>, saving: Set<string>, menu: HTMLElement | null }} AvState */
export {};
