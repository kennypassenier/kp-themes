export { RATING, RATING_EVENT, RATING_RETRY_EVENT, RATING_STATES } from './rating/constants.js';
export { snapRating } from './rating/math.js';
export { attachRatings, rating, setRating, setRatingState, ratingCell } from './rating/api.js';
export type RatingSource = import('./rating/constants.js').RatingSource;
export type RatingOptions = import('./rating/constants.js').RatingOptions;
export type RatingHandle = import('./rating/constants.js').RatingHandle;
/** @typedef {import('./rating/constants.js').RatingSource} RatingSource */
/** @typedef {import('./rating/constants.js').RatingOptions} RatingOptions */
/** @typedef {import('./rating/constants.js').RatingHandle} RatingHandle */
