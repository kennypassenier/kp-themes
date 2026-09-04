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
import Combobox from '../../components/combobox.jsx';
import { CommandPalette, ShortcutSheet } from '../../components/palette.jsx';
import DataTable from '../../components/datatable.jsx';
import { Form, FormField } from '../../components/form.jsx';
import { Reorder, SplitPane, Tree } from '../../components/structure.jsx';
import { DatePicker, Upload, Wizard } from '../../components/flow.jsx';
import { ColorPicker, GridLayout } from '../../components/canvas.jsx';
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
            <div data-test="react-combobox">
                <Combobox
                    label="Fruit"
                    options={[
                        { value: 'appel', label: 'Appel' },
                        { value: 'banaan', label: 'Banaan' },
                        { value: 'citroen', label: 'Citroen' },
                    ]}
                />
            </div>
            <div data-test="react-color">
                <ColorPicker />
            </div>
            <div data-test="react-grid">
                <GridLayout
                    tiles={[
                        { id: 'cpu', label: 'CPU', x: 0, y: 0, w: 2, h: 1 },
                        { id: 'ram', label: 'RAM', x: 2, y: 0, w: 2, h: 1 },
                    ]}
                />
            </div>
            <div data-test="react-form">
                {/* The shape JobTracker actually has: a submit whose failure
                    is an outcome the screen renders, so the promise RESOLVES
                    after a wrong password rather than rejecting. Clearing
                    busy only on rejection would have left them stuck. */}
                <Form onValid={() => new Promise((resolve) => setTimeout(resolve, 400))}>
                    <FormField label="Naam" name="naam" required help="Zoals het op je pas staat." />
                    <FormField label="E-mail" name="mail" type="email" required />
                </Form>
            </div>
            <div data-test="react-rich-form">
                <Form>
                    <FormField
                        label="Land"
                        name="land"
                        type="select"
                        required
                        options={[
                            { value: '', label: 'Kies\u2026' },
                            { value: 'be', label: 'Belgi\u00eb' },
                            { value: 'nl', label: 'Nederland' },
                        ]}
                    />
                    <FormField label="Toelichting" name="toelichting" type="textarea" required />
                    <FormField label="Ik ga akkoord" name="akkoord" type="checkbox" required />
                    <FormField
                        label="Hoe bereiken we je?"
                        name="kanaal"
                        type="radio"
                        required
                        options={[
                            { value: 'mail', label: 'E-mail' },
                            { value: 'tel', label: 'Telefoon' },
                        ]}
                    />
                </Form>
            </div>
            <div data-test="react-router-nav">
                {/* A consumer's own link component: what a router hands in.
                    It records that it was called, which is the only thing
                    the contract promises. */}
                <NavBar
                    brand="kp"
                    links={[{ href: '#routed', label: 'Gerouteerd' }]}
                    linkComponent={({ href, children, ...rest }) => (
                        <a href={href} data-routed="" {...rest}>
                            {children}
                        </a>
                    )}
                />
            </div>
            <div data-test="react-structure">
                <Tree
                    label="Mappen"
                    nodes={[
                        { id: 'map', label: 'Map een', children: [{ id: 'kind', label: 'Kind een' }] },
                        { id: 'zaak', label: 'Zaak twee' },
                    ]}
                />
                <Reorder
                    items={[
                        { id: 'a', label: 'A' },
                        { id: 'b', label: 'B' },
                    ]}
                />
                <SplitPane start="Links" end="Rechts" />
            </div>
            <div data-test="react-date">
                <DatePicker label="Van" />
            </div>
            <div data-test="react-upload">
                <Upload maxBytes={1024} />
            </div>
            <div data-test="react-wizard">
                <Wizard
                    steps={[
                        { label: 'Gegevens', content: <span>Stap een</span> },
                        { label: 'Controle', content: <span>Stap twee</span> },
                    ]}
                />
            </div>
            <div data-test="react-datatable">
                <DataTable
                    columns={[
                        { key: 'naam', label: 'Naam' },
                        { key: 'bedrag', label: 'Bedrag', kind: 'number' },
                    ]}
                    rows={[
                        { naam: 'Acme', bedrag: '100' },
                        { naam: 'Bakker', bedrag: '20' },
                        { naam: 'Cerise', bedrag: '1.284,50' },
                        { naam: 'Delta', bedrag: '7' },
                    ]}
                    rowKey={(_, i) => `r${i}`}
                    pageSize={3}
                    selectable
                />
            </div>
            <div data-test="react-palette">
                <CommandPalette
                    commands={[
                        { value: 'nieuw', label: 'Nieuw item' },
                        { value: 'thema', label: 'Thema wisselen' },
                        { value: 'afmelden', label: 'Afmelden' },
                    ]}
                />
                <ShortcutSheet shortcuts={[{ keys: 'Ctrl K', description: 'Opdrachten openen' }]} />
            </div>
            <div data-test="react-tags">
                <Combobox
                    label="Labels"
                    tags
                    options={[
                        { value: 'urgent', label: 'Urgent' },
                        { value: 'bug', label: 'Bug' },
                        { value: 'idee', label: 'Idee' },
                    ]}
                />
            </div>
        </div>
    );
}

createRoot(document.getElementById('react-components')).render(<Cases />);
