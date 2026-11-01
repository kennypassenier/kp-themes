// research/ux-fixes-1101: the eight sections of the review page, in the order the review walks them.
import { OTHER_SECTIONS } from './sections-other.mjs';
import { TABLE_SECTIONS } from './sections-tables.mjs';

const [required, actionList, disabledReason, uptime, listHead] = OTHER_SECTIONS;
export const SECTIONS = [...TABLE_SECTIONS, required, actionList, listHead, disabledReason, uptime];
