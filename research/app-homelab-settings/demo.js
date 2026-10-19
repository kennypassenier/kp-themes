// research/app-homelab-settings: the page's own wiring. The components are the package's; each section's module draws its
// sample into the section's frame, feeds it mock data and writes what it fires into a readout.
import { initSettings } from './s-settings.js';
import { initSettingsB } from './s-settings-b.js';
import { initSecrets } from './s-secrets.js';
import { initFrame } from './s-frame.js';

initSettings();
initSettingsB();
initSecrets();
initFrame();
