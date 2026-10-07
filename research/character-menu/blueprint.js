// research/character-menu, blueprint: loading is ONE pen over the whole menu
// (its outline, then the place of every entry's words, in reading order). The
// opening is the register's own trace of the package's menu; see
// ../character-shared/.
import { loading } from '../character-shared/blueprint.js';

loading({
    scene: '.kp-menu-button > .kp-menu',
    busy: '[aria-busy="true"]',
    places: '[data-kp-loading]',
});
