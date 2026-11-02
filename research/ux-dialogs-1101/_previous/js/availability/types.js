// The types of the availability grid: answers, people, columns, the spec and the state.

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
