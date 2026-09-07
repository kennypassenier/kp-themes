// The React channel's buttons, for the W0 suite.
//
// The same three sizes as the framework-free half of button.html, in the
// same order, so one suite drives both and compares what they render
// rather than what they contain [AR7].

import { createRoot } from 'react-dom/client';
import Button from '../../components/button.jsx';

function Cases() {
    return (
        <>
            <Button size="sm" data-test="react-sm">
                Save
            </Button>
            <Button data-test="react-md">Save</Button>
            <Button size="lg" data-test="react-lg">
                Save
            </Button>
        </>
    );
}

createRoot(/** @type {HTMLElement} */ (document.getElementById('react-button'))).render(<Cases />);
