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

function Cases() {
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
        </div>
    );
}

createRoot(document.getElementById('react-components')).render(<Cases />);
