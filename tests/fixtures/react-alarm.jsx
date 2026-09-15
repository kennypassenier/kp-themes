// The React channel's alarms, for tests/alarm.spec.mjs.
//
// The same three cases as the framework-free half of alarm.html, in the
// same order — acknowledged, acknowledged with Escape, closes by itself —
// raised through useAlarm(), so one suite drives both channels and compares
// what they render [AR7]. A fourth raises a controlled <Alarm> with replaced
// words, for the dictionary.

import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Alarm, useAlarm } from '../../components/alarm.jsx';

const OPTIONS = {
    title: 'Access denied',
    code: 'Security protocol 7 · lockout',
    detail: 'Three failed attempts on terminal 4. This console is locked for ten minutes.',
};

function Cases() {
    const [showAlarm, alarm] = useAlarm();
    const [result, setResult] = useState('');
    const [open, setOpen] = useState(false);
    /** @param {object} extra */
    const raise = async (extra) => {
        setResult('');
        setResult(await showAlarm({ ...OPTIONS, ...extra }));
    };
    return (
        <>
            <button type="button" className="kp-button kp-button--destructive" data-test="react-ack" onClick={() => raise({ mode: 'ack' })}>
                Raise, acknowledged
            </button>
            <button type="button" className="kp-button" data-test="react-ack-escape" onClick={() => raise({ mode: 'ack', escape: true })}>
                Raise, acknowledged with Escape
            </button>
            <button type="button" className="kp-button" data-test="react-auto" onClick={() => raise({ mode: 'auto', seconds: 2 })}>
                Raise, closes by itself
            </button>
            <button type="button" className="kp-button" data-test="react-strings" onClick={() => setOpen(true)}>
                Raise, in other words
            </button>
            <output data-test="react-result">{result}</output>
            {alarm}
            <Alarm
                open={open}
                title="Toegang geweigerd"
                mode="auto"
                seconds={30}
                strings={{ alarmKeepOpen: 'Openhouden', alarmCountdown: (n) => `Sluit over ${n} s` }}
                onClose={(reason) => {
                    setOpen(false);
                    setResult(reason);
                }}
            />
        </>
    );
}

createRoot(/** @type {HTMLElement} */ (document.getElementById('react-alarm'))).render(<Cases />);
