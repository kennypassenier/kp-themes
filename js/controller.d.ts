/** The base every component controller extends. */
export declare class Controller {
    /** The element this controller wires. */
    host: HTMLElement;
    /** The options the page passed to its `attachX` call. */
    options: Record<string, unknown>;
    /** What `destroy()` undoes, in the order it was set up. @type {(() => void)[]} */
    teardown: (() => void)[];
    /** Whether `destroy()` has run; a destroyed controller ignores late callbacks. */
    destroyed: boolean;
    /**
     * @param {HTMLElement} host
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /**
     * Register an undo step for `destroy()`.
     * @template {() => void} F
     * @param {F} undo
     * @returns {F}
     */
    own<F extends () => void>(undo: F): F;
    /**
     * Add an event listener that `destroy()` removes.
     * @param {EventTarget} target
     * @param {string} type
     * @param {EventListenerOrEventListenerObject} handler
     * @param {AddEventListenerOptions | boolean} [options]
     */
    listen(target: EventTarget, type: string, handler: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void;
    /**
     * Start an observer that `destroy()` disconnects.
     * @template {{ disconnect(): void }} O
     * @param {O} observer
     * @returns {O}
     */
    observe<O extends {
        disconnect(): void;
    }>(observer: O): O;
    /** Wire the host: listeners, observers, first render. Subclasses override it; the base has nothing to wire. */
    connect(): void;
    /** Undo everything the controller set up, newest first; an undo step that throws is reported and the rest still run. */
    destroy(): void;
}
/**
 * The elements under `root` that match `selector`, `root` itself first when it matches.
 * @param {ParentNode} root
 * @param {string} selector
 * @returns {HTMLElement[]}
 */
export declare function hostsOf(root: ParentNode, selector: string): HTMLElement[];
/**
 * The live controller of class `Ctor` on `host`, if there is one.
 * @template {Controller} C
 * @param {Element} host
 * @param {new (host: HTMLElement, options?: any) => C} Ctor
 * @returns {C | undefined}
 */
export declare function controllerOf<C extends Controller>(host: Element, Ctor: new (host: HTMLElement, options?: any) => C): C | undefined;
/**
 * Make a `Ctor` on one host, or return the one it has. A `connect()` that throws is undone and reported, and nothing is returned.
 * @template {Controller} C
 * @param {HTMLElement} host
 * @param {new (host: HTMLElement, options?: any) => C} Ctor
 * @param {Record<string, unknown>} [options]
 * @returns {C | undefined}
 */
export declare function attachOne<C extends Controller>(host: HTMLElement, Ctor: new (host: HTMLElement, options?: any) => C, options?: Record<string, unknown>): C | undefined;
/**
 * Make one `Ctor` per matching host under `root` that has none yet.
 * @template {Controller} C
 * @param {ParentNode} root
 * @param {string} selector
 * @param {new (host: HTMLElement, options?: any) => C} Ctor
 * @param {Record<string, unknown>} [options]
 * @returns {() => void} detach: destroys the controllers this call made
 */
export declare function attachAll<C extends Controller>(root: ParentNode, selector: string, Ctor: new (host: HTMLElement, options?: any) => C, options?: Record<string, unknown>): () => void;
