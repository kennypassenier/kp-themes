// The React channel's side navigation, for the contract suite.
//
// The same four cases as the framework-free half of sidenav.html, in the
// same order, so one suite can put the two DOMs side by side and compare
// what they produce [feat-nav-3, sidenav-react]. Where a case is a plain
// list the component builds it from `items`; where it carries a theme's
// own furniture — a monogram that swaps in the slim state, categories
// that fold, a footer — the consumer writes that markup as children, and
// the point of this fixture is that the result is the same DOM either way.

import { createRoot } from 'react-dom/client';
import Sidenav, { SidenavToggle } from '../../components/sidenav.jsx';
import { sidenavOf } from '../../js/sidenav.js';

// This fixture puts both channels on one page, so the page ends up with
// TWO copies of js/sidenav.js: the one the page loads over the network and
// the one esbuild bundles in here. Each keeps its own map of handles. A
// real consumer has one copy and no such split; the suite needs to be able
// to ask the copy that actually attached the React half.
window.__reactSidenavOf = sidenavOf;

function Cases() {
    return (
        <>
            <div style={{ position: 'relative', inlineSize: '30rem', blockSize: '12rem', display: 'flex' }} data-test="r-side-box">
                <Sidenav id="r-nav-side" data-test="r-side" label="Side" title="Sections" items={[{ label: 'One', href: '#a', current: true }]} />
                <main data-test="r-side-beside">
                    <p>The content beside it, which is what makes this a flex row.</p>
                </main>
            </div>

            <div style={{ position: 'relative', inlineSize: '30rem', blockSize: '12rem' }} data-test="r-over-box">
                <SidenavToggle controls="r-nav-over" data-test="r-over-toggle">
                    Menu
                </SidenavToggle>
                <Sidenav
                    id="r-nav-over"
                    data-test="r-over"
                    label="Over"
                    mode="over"
                    position="absolute"
                    items={[
                        { label: 'One', href: '#a' },
                        { label: 'Two', href: '#b' },
                    ]}
                />
            </div>

            <div style={{ position: 'relative', inlineSize: '30rem', blockSize: '12rem' }} data-test="r-push-box">
                <SidenavToggle controls="r-nav-push" data-test="r-push-toggle">
                    Menu
                </SidenavToggle>
                <Sidenav
                    id="r-nav-push"
                    data-test="r-push"
                    label="Push"
                    mode="push"
                    position="absolute"
                    contentSelector="[data-test='r-push-content']"
                    items={[{ label: 'One', href: '#a' }]}
                />
                <main data-test="r-push-content">
                    <p>The content that makes room.</p>
                </main>
            </div>

            <div style={{ position: 'relative', inlineSize: '30rem', blockSize: '16rem' }} data-test="r-slim-box">
                <Sidenav id="r-nav-slim" data-test="r-slim" label="Slim" slim accordion>
                    <div className="kp-sidenav__header">
                        <span data-kp-sidenav-slim-hide="" data-test="r-slim-wordmark">
                            kp-themes
                        </span>
                        <span data-kp-sidenav-slim-show="" data-test="r-slim-monogram">
                            kp
                        </span>
                    </div>
                    <ul className="kp-sidenav__list">
                        <li className="kp-sidenav__category" data-test="r-cat-one">
                            <button type="button" className="kp-sidenav__category-toggle" data-test="r-cat-one-toggle">
                                One
                            </button>
                            <div className="kp-sidenav__submenu">
                                <ul className="kp-sidenav__list">
                                    <li>
                                        <a className="kp-sidenav__link" href="#a" data-test="r-cat-one-link">
                                            <span className="kp-sidenav__label">A</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <div className="kp-sidenav__footer">
                        <span className="kp-sidenav__label" data-test="r-slim-footer">
                            Signed in
                        </span>
                    </div>
                </Sidenav>
            </div>
        </>
    );
}

const host = document.getElementById('react-sidenav');
if (host) createRoot(host).render(<Cases />);
