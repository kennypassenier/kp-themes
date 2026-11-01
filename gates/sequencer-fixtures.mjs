// The plans the sequencer tests are written against: an item, the values a plan left for it, and the two-lane recipe.

/** @param {string} id @param {string} lane @param {number} start @param {number} duration @param {object} [more] */
export const it = (id, lane, start, duration, more = {}) => ({ id, label: id, lane, start, duration, with: null, ...more });
/** The values a plan left, by id. @param {{ items: any[] }} plan @param {string} id */
export const at = (plan, id) => {
    const i = plan.items.find((x) => x.id === id);
    return [i.lane, i.start, i.duration];
};

/** Pasta: boil 0-8, cook 8-18, plate 18-23. Sauce: chop 0-10, simmer 10-40. */
export const recipe = () => [
    it('boil', 'pasta', 0, 8),
    it('cook', 'pasta', 8, 10),
    it('plate', 'pasta', 18, 5),
    it('chop', 'sauce', 0, 10),
    it('simmer', 'sauce', 10, 30),
];
