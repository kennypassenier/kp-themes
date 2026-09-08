// The React channel of the ten example pages [TH98, AR20].
//
// The same trees showcase/examples.mjs describes, rendered with the real
// components instead of the markup those components write. This is the
// half that proves a page built on this package is not a framework-free
// page with a React page beside it: there is one description and two
// renderers, so a change to a page cannot land in one channel only.
//
// The prop names in a descriptor are HTML's (`class`, `for`, `tabindex`),
// because the framework-free channel is the one a server writes and
// reading it should look like reading markup. This file translates them,
// which is a dozen lines and the only place the two channels differ on
// purpose.

import { createElement, Fragment } from 'react';
import NavBar from '../components/nav-bar.jsx';
import Button from '../components/button.jsx';
import Badge from '../components/badge.jsx';
import Alert from '../components/alert.jsx';
import Card from '../components/card.jsx';
import Field from '../components/field.jsx';
import Table from '../components/table.jsx';
import Marquee from '../components/marquee.jsx';
import { EXAMPLES, conceptBody, isComponent } from './examples.mjs';
import { conceptCopy } from './concept-copy.mjs';

/** @typedef {import('./examples.mjs').Child} Child */

/**
 * HTML attribute names to React's, for the handful the pages use.
 *
 * Anything not here passes through unchanged, which is right for
 * `data-*`, `aria-*`, `id`, `href`, `type`, `role`, `scope`, `name`,
 * `placeholder` and `popover` — React takes those verbatim.
 */
const RENAME = {
    class: 'className',
    for: 'htmlFor',
    tabindex: 'tabIndex',
    colspan: 'colSpan',
    rowspan: 'rowSpan',
    autocomplete: 'autoComplete',
    novalidate: 'noValidate',
    popovertarget: 'popoverTarget',
    readonly: 'readOnly',
    maxlength: 'maxLength',
};

/**
 * A style string as React wants it: an object with camelCased keys.
 *
 * The only inline styles on these pages are the anchor-positioning pair a
 * popover needs (TH109's one exception), and React has no typed property
 * for either, hence the cast.
 *
 * @param {string} value
 * @returns {import('react').CSSProperties}
 */
function styleObject(value) {
    /** @type {Record<string, string>} */
    const out = {};
    for (const declaration of value.split(';')) {
        const at = declaration.indexOf(':');
        if (at < 0) continue;
        const property = declaration.slice(0, at).trim();
        if (property === '') continue;
        out[property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = declaration.slice(at + 1).trim();
    }
    return /** @type {import('react').CSSProperties} */ (/** @type {unknown} */ (out));
}

/**
 * @param {Record<string, any>} props
 * @param {string | number} key
 * @returns {Record<string, any>}
 */
function domProps(props, key) {
    /** @type {Record<string, any>} */
    const out = { key };
    for (const [name, value] of Object.entries(props)) {
        if (value === undefined || value === null || value === false) continue;
        if (name === 'style') {
            out.style = styleObject(String(value));
            continue;
        }
        // A boolean attribute is written as an empty string in the
        // framework-free channel; React wants the boolean.
        if (name === 'checked') {
            out.defaultChecked = true;
            continue;
        }
        if (name === 'value') {
            out.defaultValue = value;
            continue;
        }
        if (name === 'required' || name === 'disabled' || name === 'hidden') {
            out[name] = true;
            continue;
        }
        out[/** @type {keyof typeof RENAME} */ (name) in RENAME ? RENAME[/** @type {keyof typeof RENAME} */ (name)] : name] = value;
    }
    return out;
}

/**
 * Render a list of children, keyed by position.
 *
 * @param {Child[]} children
 * @returns {any[]}
 */
function kids(children) {
    return children.map((child, index) => toReact(child, index));
}

/**
 * What each component node becomes in the React channel.
 *
 * The counterpart of TO_MARKUP in showcase/examples.mjs: the same
 * descriptor, rendered by the component itself instead of by a mirror of
 * what the component writes.
 *
 * @type {Record<string, (props: Record<string, any>, children: Child[], key: string | number) => any>}
 */
const TO_REACT = {
    // `brand` may be a string or descriptor children (the brand tag,
    // S49/A3), so it goes through the same conversion the children do.
    NavBar: (p, children, key) => (
        <NavBar key={key} brand={typeof p.brand === 'string' ? p.brand : kids(p.brand)} links={p.links ?? []} skipTo={p.skipTo}>
            {kids(children)}
        </NavBar>
    ),
    // Every `data-` prop is forwarded rather than listed, for the reason
    // the framework-free renderer carries in full: an allowlist drops in
    // silence, and AR20 then scores the two channels as different for a
    // reason neither of them states. The wizard example's Back and Next
    // are the case [2026-09-07].
    Button: (p, children, key) => (
        <Button
            key={key}
            {...Object.fromEntries(Object.entries(p).filter(([name]) => name.startsWith('data-')))}
            variant={p.variant}
            type={p.type ?? 'button'}
            confirm={p.confirm}
            className={p.class}
            aria-busy={p['aria-busy']}
        >
            {kids(children)}
        </Button>
    ),
    Badge: (p, children, key) => (
        <Badge key={key} className={p.class} data-example={p['data-example']}>
            {kids(children)}
        </Badge>
    ),
    Alert: (p, children, key) => (
        <Alert key={key} flavour={p.flavour} className={p.class} data-example={p['data-example']}>
            {kids(children)}
        </Alert>
    ),
    Card: (p, children, key) => (
        <Card
            key={key}
            title={p.title === undefined ? undefined : toReact(p.title, 'title')}
            headingLevel={p.headingLevel}
            actions={p.actions === undefined ? undefined : toReact(p.actions, 'actions')}
            footer={p.footer === undefined ? undefined : toReact(p.footer, 'footer')}
            className={p.class}
            {...Object.fromEntries(Object.entries(p).filter(([name]) => name.startsWith('data-')))}
        >
            {kids(children)}
        </Card>
    ),
    Field: (p, _children, key) => (
        <Field
            key={key}
            id={p.id}
            label={toReact(p.label, 'label')}
            help={p.help === undefined ? undefined : toReact(p.help, 'help')}
            error={p.error === undefined ? undefined : toReact(p.error, 'error')}
            type={p.type ?? 'text'}
            name={p.name}
            defaultValue={p.value}
            placeholder={p.placeholder}
            autoComplete={p.autocomplete}
            required={p.required === true}
            className={p.class}
        />
    ),
    // components/marquee.jsx: the items are the page's own copy, so they
    // go through the same conversion every other child does [M1].
    Marquee: (p, _children, key) => (
        <Marquee
            key={key}
            items={(p.items ?? []).map((/** @type {Child} */ item, /** @type {number} */ index) => toReact(item, index))}
            duration={p.duration}
            pause={p.pause}
            label={p.label}
            as={p.as}
            className={p.class}
            {...Object.fromEntries(Object.entries(p).filter(([name]) => name.startsWith('data-')))}
        />
    ),
    Table: (p, _children, key) => (
        <Table
            key={key}
            columns={p.columns.map((/** @type {any} */ column, /** @type {number} */ index) =>
                typeof column === 'string' ? column : { key: String(index), label: toReact(column.label, index), className: column.className },
            )}
            rows={p.rows.map((/** @type {Child[]} */ row) => row.map((cell, index) => toReact(cell, index)))}
            caption={p.caption === undefined ? undefined : toReact(p.caption, 'caption')}
        />
    ),
};

/**
 * @param {Child} child
 * @param {string | number} key
 * @returns {any}
 */
export function toReact(child, key) {
    if (child === null || child === undefined || child === false) return null;
    if (typeof child === 'string' || typeof child === 'number') return child;
    const { tag, props, children } = child;
    if (isComponent(tag)) {
        const build = TO_REACT[tag];
        if (!build) throw new Error(`No React rendering for <${tag}>`);
        return build(props, children, key);
    }
    const attrs = domProps(props, key);
    return children.length === 0 ? createElement(tag, attrs) : createElement(tag, attrs, ...kids(children));
}

/**
 * One example page, by id.
 *
 * `copy` names the theme whose words the concept demo is rendered in
 * [S49, A1]; the framework-free channel gets one file per theme and this
 * is the same choice in the channel that renders at runtime.
 *
 * @param {{id: string, copy?: string}} props
 */
export function ExamplePage({ id, copy }) {
    const example = EXAMPLES.find((e) => e.id === id);
    if (!example) throw new Error(`No example named ${id}`);
    const body = id === 'concept' && copy ? conceptBody(conceptCopy(copy)) : example.body;
    return createElement(Fragment, null, ...body.map((child, index) => toReact(child, index)));
}
