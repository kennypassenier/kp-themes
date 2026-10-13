# Side navigation options in other component libraries

Researched 2026-10-13. Verification level is stated per library; "unverified" means the official page was
JavaScript-rendered or 404 and the item comes from a secondary source or is left out.

## What kp-themes has today (js/sidenav.js OPTIONS, css/components.css)

Attributes: mode (over | side | push), position, side (start | end), open, slim, slim-collapsed, expand-on-hover,
accordion, backdrop, backdrop-class, close-on-esc, lock-scroll, focus-trap, content (element to offset),
remember (persist), toggle / slim-toggle / slim-hide / slim-show (hooks), expanded (category), over-below
(turn `over` below a width, 40rem default), narrow. Parts: header, title, scroll, list, link, category-toggle,
submenu, icon, label, badge, divider, footer. RTL aware. Events: toggle, slim, mode. Handle `sidenavOf()`.
Focus trap and focus return, Escape, scroll lock. Not yet in the current tree (being added by another session):
fixed hamburger launcher, panel from the screen edge, push / reserved gutter / over variants.

## Per library

### shadcn/ui Sidebar (https://ui.shadcn.com/docs/components/sidebar, read)
| Option | Meaning |
|---|---|
| defaultOpen / open / onOpenChange | initial and controlled open state |
| side: left, right | edge |
| variant: sidebar, floating, inset | flush, detached card with margin, or inset into a rounded content area |
| collapsible: offcanvas, icon, none | slide fully away, shrink to icon rail, or not collapsible |
| keyboard shortcut Cmd/Ctrl+B | toggles the sidebar |
| SidebarRail | thin hit area on the edge to toggle |
| --sidebar-width, --sidebar-width-mobile | width tokens, separate mobile width |
| mobile = Sheet (isMobile, openMobile) | below the breakpoint it becomes an overlay drawer |
| SidebarHeader / Footer / Group / Menu / MenuSub / MenuAction / MenuBadge | slots, groups, nested items, per-item action and badge |
| SidebarInset | content wrapper that makes the inset variant work |

### MUI Drawer (https://mui.com/material-ui/react-drawer/, read)
| Option | Meaning |
|---|---|
| variant: temporary | modal overlay, closes on backdrop click or Esc |
| variant: persistent | same level as content, stays until closed |
| variant: permanent | always visible |
| mini variant | persistent drawer that rests as a narrow icon strip and expands |
| anchor: left, right, top, bottom | edge |
| SwipeableDrawer | open and close by swipe gesture (touch) |
| responsive pattern | temporary on small, permanent on wide screens |
| ModalProps.keepMounted | keep contents in the DOM while closed |

### Material Design 3 drawer and rail (m3.material.io pages are JS-rendered; read via developer.android.com plus secondary summaries, partly unverified)
| Option | Meaning |
|---|---|
| standard drawer | shares space with content (https://developer.android.com/develop/ui/compose/components/drawer) |
| modal drawer | over content with scrim; gesturesEnabled toggles drag |
| navigation rail | 3 to 7 destinations in a narrow column, icon plus optional label (https://developer.android.com/develop/ui/compose/components/navigation-rail) |
| wide rail collapsed / expanded | Expressive: expanded rail replaces the drawer; menu button switches between them (secondary source, SAP Fiori M3 docs) |
| modal expanded rail, hideOnCollapse | expanded rail over content; collapsed state may hide completely (secondary source) |

### Ant Design Layout.Sider (https://ant.design/components/layout, read)
| Option | Meaning |
|---|---|
| collapsible / collapsed / defaultCollapsed | allow, control, initial collapse |
| collapsedWidth (80 default; 0 = special edge trigger) | width when collapsed; zero gives a tab-like trigger |
| breakpoint + onBreakpoint | auto-collapse at a responsive breakpoint |
| width | expanded width |
| reverseArrow | flip trigger arrow for a right-hand sider |
| theme: light, dark | colour scheme |
| trigger (null hides) | custom or no toggle |
| zeroWidthTriggerStyle | style of the zero-width trigger |
| onCollapse | callback with the cause |

### Bootstrap 5.3 Offcanvas (https://getbootstrap.com/docs/5.3/components/offcanvas/, read) and sidebars example (https://getbootstrap.com/docs/5.3/examples/sidebars/, read)
| Option | Meaning |
|---|---|
| backdrop: true, false, 'static' | clickable, none, or visible but does not close on click |
| keyboard | Escape closes |
| scroll | allow body scroll while open |
| offcanvas-start, -end, -top, -bottom | placement |
| offcanvas-sm .. -xxl | static in the page above a breakpoint, offcanvas below |
| show, hide, toggle, events incl. hidePrevented | API and lifecycle |
| data-bs-theme | per-panel colour mode |
| Example variants | full sidebar, icon-only with title tooltips, collapsible groups, list-group sidebar, user footer dropdown |

### Fluent UI React v9 NavDrawer (https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-nav/library/etc/react-nav.api.md, read; Drawer sibling via search)
| Option | Meaning |
|---|---|
| NavDrawer extends Drawer | open, position, type inline or overlay (from DrawerProps, not in this API file) |
| size small, medium, large, full | drawer width |
| density small, medium | item spacing |
| multiple | several categories open at once |
| selectedValue, openCategories, defaultOpenCategories, selectedCategoryValue | controlled selection and expansion |
| onNavItemSelect, onNavCategoryItemToggle | callbacks |
| NavSectionHeader, NavCategory, NavSubItem | headings, groups, nested items |
| tabbable | roving versus tab focus |

### Carbon UI Shell SideNav (https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/react/src/components/UIShell/SideNav.tsx, read; usage page https://carbondesignsystem.com/components/UI-shell-left-panel/usage/ is thin)
| Option | Meaning |
|---|---|
| expanded / defaultExpanded / onToggle | controlled or initial state |
| isRail | icon rail that expands on hover or focus |
| isFixedNav | standalone nav not tied to a header |
| isPersistent | stays visible above the lg breakpoint (below it, hamburger overlay) |
| addMouseListeners, addFocusListeners, enterDelayMs (100) | hover and focus expand behaviour and its delay |
| onOverlayClick, onSideNavBlur | overlay click and blur-to-collapse hooks |
| href | skip target for Escape / skip-to-content |
| inert | set on the nav when hidden |
| SideNavMenu, SideNavSwitcher | nested menu, product switcher |

### Atlassian design system side navigation (https://atlassian.design/components/navigation-system/layout/side-nav; pages 404 or empty for the tool, so UNVERIFIED on the official docs)
Secondary sources only (Atlassian announcement https://www.atlassian.com/blog/announcements/introducing-new-navigation, developer community thread, AUI sidebar https://aui.atlassian.com/aui/8.4/docs/sidebar.html): user-resizable and collapsible sidebar, overlay when narrow, toggle button, expanded state reported not persisting by default, AUI `data-aui-responsive` auto-collapse by width, opt-in animation class, initial state set in markup to avoid a flash. Flyout and peek not confirmed.

### Mantine AppShell (https://mantine.dev/core/app-shell/, read)
| Option | Meaning |
|---|---|
| navbar.width (responsive object) | width, per breakpoint |
| navbar.breakpoint | width at which it switches to mobile full-width mode |
| navbar.collapsed {mobile, desktop} | independent collapse per mode |
| header, footer, aside | sibling regions with the same config |
| withBorder, padding, zIndex (100), disabled | frame options |
| layout "alt" | navbar full viewport height, header beside it |
| transitionDuration, transitionTimingFunction | animation |
| AppShell.Section (grow, ScrollArea) | header / body / footer slots in the navbar |

### Chakra UI Drawer (https://v2.chakra-ui.com/docs/components/drawer, read)
| Option | Meaning |
|---|---|
| placement top, right, bottom, left | edge |
| size xs .. full | width |
| isOpen | state |
| closeOnOverlayClick, closeOnEsc | dismissal switches |
| blockScrollOnMount, preserveScrollBarGap | scroll lock and no layout shift |
| trapFocus, autoFocus, initialFocusRef, finalFocusRef, returnFocusOnClose | focus handling |
| useInert | hide siblings from assistive tech |
| isFullHeight | top / bottom drawers full height |
| variant | visual variant |

### Headless UI Dialog (https://headlessui.com/react/dialog, read) and Radix Dialog (not fetched, same family)
| Option | Meaning |
|---|---|
| open / onClose | state; onClose fires on Esc or outside click |
| transition (data-closed, data-enter, data-leave) | CSS-driven enter and leave |
| static, unmount | external animation control, keep in DOM |
| autoFocus | focus on open |
| DialogBackdrop, DialogPanel | backdrop and panel parts, so a drawer is just a styled panel |

## Gap table: what kp-themes lacks

| Option | What it does | Libraries | Rating | What it would take in kp-themes |
|---|---|---|---|---|
| Edge placement top and bottom | Panel can slide from top or bottom as well as start and end. | MUI, Bootstrap, Chakra, (M3 sheets) | common | New `position`-like value plus axis-aware `--kp-sidenav-away` in CSS. Probably out of scope for a side nav. |
| Keyboard shortcut to toggle | A key chord (Ctrl/Cmd+B) toggles the panel from anywhere. | shadcn | rare | One opt-in attribute holding a key; one `keydown` listener in sidenav.js that ignores inputs. |
| Swipe to open and close on touch | Dragging from the edge opens the panel, dragging it away closes it. | MUI SwipeableDrawer, M3 (gesturesEnabled), shadcn Sheet (via mobile) | common | Pointer-event handler in sidenav.js that tracks drag distance, sets a translate variable, and snaps open or shut on release. |
| Resizable width by dragging | A grab handle on the panel edge changes its width. | Atlassian (secondary source), shadcn SidebarRail is a toggle only | rare | Drag handle element, pointer events writing `--kp-sidenav-width`, min/max attributes, optional persistence. |
| Floating variant | Panel detached from the edge with margin, radius and shadow. | shadcn (floating), M3 Expressive | rare | CSS-only variant attribute adjusting inset, radius and border. |
| Inset variant | Content area becomes a rounded card beside a flush panel. | shadcn (inset) | rare | CSS variant plus a content-wrapper rule; offset logic already exists for `content`. |
| Icon rail with tooltips when collapsed | Collapsed rail shows icons only and labels appear as tooltips on hover or focus. | Bootstrap example (title), Carbon rail, M3 rail, MUI mini, shadcn icon | common | Slim mode exists; add a tooltip from each link's label (CSS `attr()` or the kp tooltip component) when `slim-collapsed`. |
| Static backdrop (visible, does not close on click) | Backdrop dims the page but a click does nothing, so a form cannot be lost. | Bootstrap ('static'), Chakra (closeOnOverlayClick=false), MUI (via onClose reason) | common | Allow `data-kp-sidenav-backdrop="static"`; skip the close handler and emit a "prevented" event. |
| Separate switch for Escape vs. overlay click | Dismissal paths are individually controllable. | Chakra, Bootstrap, Carbon | common | `close-on-esc` exists; add `close-on-backdrop` as its sibling. |
| Auto-collapse by breakpoint (any width) | Panel collapses or changes mode at a chosen width, with a callback. | Ant, Mantine, Carbon, shadcn, Bootstrap responsive classes, MUI responsive | common | `over-below` exists with a 40rem step; generalise to `collapse-below` / `slim-below` with a length and fire the mode event. |
| Hover-expand rail | Collapsed rail expands while hovered or focused, with an enter delay. | Carbon (enterDelayMs), MUI mini (variants) | rare | Already present (`expand-on-hover`); missing piece is an optional enter delay and focus-within expand. |
| Peek / hint state | A sliver or tab stays visible when closed, hinting that the panel exists. | Ant (zero-width trigger tab), shadcn SidebarRail | rare | CSS variable for the closed offset (for example `--kp-sidenav-peek: 0.75rem`) instead of a full -100%. |
| Zero-width edge trigger | A small tab on the panel edge toggles it when collapsed to nothing. | Ant | rare | Optional pseudo-element or button slot positioned on the panel's inline-end edge. |
| Nested flyout menus | Sub-menus open as a floating popover beside a collapsed rail instead of inline. | Carbon (SideNavMenu in rail), shadcn (icon mode dropdown), M3 rail menus | common (usually via a popover) | Position the submenu absolutely beside the item in `slim-collapsed` state; needs flip logic and hover intent. |
| Header and footer slots | Sticky regions above and below the scrolling list. | shadcn, Mantine, Atlassian, Bootstrap example | common | Already present (`__header`, `__footer`); only missing is documenting sticky behaviour and a user-menu pattern. |
| Persisting width / collapsed state | State survives reload. | shadcn (cookie), Atlassian (asked for), MUI persistent | common for open state | Open and slim state already persist via `remember`; width persistence only follows if resizing is added. |
| Width tokens for mobile vs desktop | A separate width below the breakpoint. | shadcn, Mantine (responsive width), Chakra size | common | Add `--kp-sidenav-width-narrow` read when `narrow` is set. |
| Swipe-free API events with prevention (cancelable) | Events such as hidePrevented, onCollapse with a cause. | Bootstrap, Ant, Carbon | common | Events exist; make `kp-sidenav-toggle` cancelable and include a `reason` field. |
| Keep contents mounted / unmount when closed | Controls whether closed content stays in the DOM. | MUI keepMounted, Headless UI unmount | rare | Not relevant: panels are always in the DOM; closed state could add `inert` (Carbon, Chakra useInert do). |
| inert / aria-hidden on siblings or closed panel | Hides the background (modal) or closed panel from assistive tech and tab order. | Carbon (inert), Chakra (useInert) | rare | Set `inert` on the closed panel and, in `over` mode, on the content element. |
| Autofocus / initial and final focus targets | Choose which element receives focus on open and on close. | Chakra, Headless UI, MUI | common | Add `data-kp-sidenav-initial-focus` selector; focus return already exists. |
| Multiple categories open (non-accordion) | Several groups open at once. | Fluent (multiple), Bootstrap collapse | rare | Already there: `accordion` is optional. |
| Density / size option | Compact versus comfortable items, size presets for width. | Fluent (density, size), Chakra (size) | rare | Two or three attribute presets that set existing tokens. |
| Drawer on a theme-coloured scheme (per-panel light/dark) | Panel uses a different colour scheme from the page. | Ant (theme), Bootstrap (data-bs-theme) | rare | Deliberately not wanted: kp-themes leaves colour to the theme. |
| Item extras: per-item action button, badge, user switcher | Trailing action next to a link; product switcher. | shadcn (MenuAction, MenuBadge), Carbon (Switcher) | rare | Badge exists; a `__action` slot is CSS plus a documented pattern. |

## Kenny's decision (2026-10-13 19:47, form "kp-themes-zijnavigatie-opties")

- Onmisbaar, built with the fixed launcher and the three variants: inert-closed, rail-tooltips, collapse-below,
  flyout-submenus, keyboard-shortcut, initial-focus, hover-delay, and the edge tab.
- Not built (Kenny, 19:55, correcting the form): top/bottom placement and a light or dark scheme for the panel alone.
- Gewenst, a next round of the side navigation: the ten minor options (a narrow-screen width, cancelable events with a
  reason, resize by dragging, a static backdrop, close-on-backdrop, a floating variant, an inset variant, a peek strip,
  density presets, an action button beside an item).
- Later: swipe to open and close on touch (docs/MINI_ROUNDS.md).
