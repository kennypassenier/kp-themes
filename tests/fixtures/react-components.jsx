// The React channel's components, mounted for the contract suite.
//
// The same cases as the framework-free half of components.html, in the
// same order, so one suite can drive both and compare what they do rather
// than what they contain [AR7].

import { createRoot } from 'react-dom/client';
import Button from '../../components/button.jsx';
import Badge from '../../components/badge.jsx';
import Alert from '../../components/alert.jsx';
import Card from '../../components/card.jsx';
import Field from '../../components/field.jsx';
import Table from '../../components/table.jsx';
import NavBar from '../../components/nav-bar.jsx';
import { Dialog, Tabs } from '../../components/overlays.jsx';
import DecipherText from '../../fx/decipher-text.jsx';
import ScrambleNumber from '../../fx/scramble-number.jsx';
import { useState } from 'react';

function Cases() {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <NavBar brand="kp" links={[{ href: '#a', label: 'Een', current: true }]} />
            <Button data-test="plain">Gewoon</Button>
            <Button variant="primary" data-test="primary">
                Primair
            </Button>
            {/* Destructive without undo or confirmation: the contract this
                suite exists to catch. It must be reported and disarmed. */}
            <Button variant="destructive" data-test="destructive-bare">
                Verwijderen
            </Button>
            <Button variant="destructive" confirm="Zeker?" data-test="destructive-confirm" onClick={() => window.__acted?.('react')}>
                Verwijderen
            </Button>
            <Button variant="destructive" onUndo={() => {}} data-test="destructive-undo">
                Verwijderen
            </Button>
            <Badge status="offer" data-test="badge-labelled">
                Aanbod
            </Badge>
            <Badge status="rejected" data-test="badge-bare"></Badge>
            <Alert flavour="warning" data-test="alert">
                Let op deze zaak.
            </Alert>
            <Card title="Kaart" data-test="card">
                Inhoud
            </Card>
            <Field label="E-mail" help="We sturen niets door." error="Vul een geldig adres in." data-test="field" />
            <Table columns={['Naam', 'Aantal']} rows={[['Een', 1]]} />
            {/* The effects are cyberpunk-only and plain everywhere else;
                under reduced motion they are plain there too [DI7]. */}
            <span data-test="decipher">
                <DecipherText text="ONTCIJFEREN" />
            </span>
            <span data-test="scramble">
                <ScrambleNumber value="1284" />
            </span>
            <button type="button" className="kp-button" data-test="dialog-open" onClick={() => setOpen(true)}>
                Dialoog openen
            </button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                title="Bevestigen"
                actions={
                    <button type="button" className="kp-button" data-test="dialog-close" onClick={() => setOpen(false)}>
                        Sluiten
                    </button>
                }
            >
                <span data-test="dialog-body">Een dialoog die het toetsenbord zelf afhandelt.</span>
            </Dialog>
            <Tabs
                tabs={[
                    { label: 'Een', panel: <span data-test="panel-0">Paneel een</span> },
                    { label: 'Twee', panel: <span data-test="panel-1">Paneel twee</span> },
                ]}
            />
        </div>
    );
}

createRoot(document.getElementById('react-components')).render(<Cases />);
