// SITE-MENU
// =========

const attrAriaExpanded    = 'aria-expanded';
const attrMultiExpand     = 'data-multi-expand';
const attrSiteMenu        = 'data-site-menu';
const attrSiteMenuButton  = 'data-site-menu-button';
const attrSiteMenuLock    = 'data-site-menu-lock'
const attrSubmenuAppendTo = 'data-submenu-append-to';
const elSubmenuIcon       =  '<i class="submenu-icon"></i>';
const togglerCollapsed    = 'is-collapsed';
const togglerExpanded     = 'is-expanded';
const togglerLocked       = 'is-locked';
const togglerNoAnim       = 'no-anim';

// Menu
// ----

export default class SiteMenu {
    constructor(element) {
        /* Initialize */
        this._menu = $(element);
        this._button = $('#' + this._menu.attr(attrSiteMenuButton));
        this._multiExpand = (this._menu.attr(attrMultiExpand) == 'true');
        this._submenuAppendTo = $('#' + this._menu.attr(attrSubmenuAppendTo));

        /* Submenus */
        this._submenus = [];
        let submenus = this._menu.find('li>ul');
        for (let i=0; i < submenus.length; i++) {
            this._submenus.push(
                new SubMenu(submenus[i], this, i)
            );
        }

        /* Locks */
        this._locks = []
        let lockIds = SiteMenu.stringToArray(this._menu.attr(attrSiteMenuLock));
        for (let i = 0; i < lockIds.length; i++) {
            this._locks.push($('#' + lockIds[i]));
        }

        /* Refresh */
        this.refresh();

        /* Events */
        $(window).resize((e) => { this.onResize(e) });
    }

    lockTargets(state) {
        for (let i = 0; i < this._locks.length; i++) {
            this._locks[i].toggleClass(togglerLocked, state)
        }
    }

    onResize(e) {
        this.refresh();
    }

    refresh() {
        let isRevealed = !this._button.is(':visible');
        if (isRevealed != this._isRevealed) { // State changed
            this._isRevealed = isRevealed;
            for (let i=0; i < this._submenus.length; i++) {
                if (isRevealed) {
                    this._submenus[i].moveTo(this._submenuAppendTo);
                    this._submenus[i].resetMaxHeight(false);
                } else {
                    this._submenus[i].moveHome();
                    this._submenus[i].setMaxHeight(false);
                }
                this._submenus[i].toggle(false, false);
            }
        }
    }

    static stringToArray(str) {
        let a = [];
        if (typeof str === 'string') {
            str = str.trim();
            if (str != '') {
                a = (str.indexOf(',') > -1) ? str.split(/,/) : str.split(/ /);
                for (let i=0; i < a.lenght; i++) a[i] = a[i].trim();
            }
        }
        return a;
    }

    toggleSubmenus(state, animation = true, expectIndex) {
        for (let i=0; i < this._submenus.length; i++) {
            if (i != expectIndex) this._submenus[i].toggle(state, animation);
        }
    }
}

// SubMenu
// -------

class SubMenu {
    constructor(element, menu, index) {
        this._index = index;
        this._menu = menu;
        this._submenu = $(element);
        this._expanded = (this._submenu.outerHeight() > 0);
        this._button = this._submenu.prev();
        this._submenuIcon = $(elSubmenuIcon);
        this._submenuIcon.appendTo(this._button);

        this.toggle(this._expanded);

        this._button.on('click', (e) => { this.onClick(e) });
        this._button.on('mouseenter', (e) => { this.onMouseEnter(e) });
        this._button.on('mouseleave', (e) => { this.onMouseLeave(e) });
        this._submenu.on('mouseenter', (e) => { this.onMouseEnter(e) });
        this._submenu.on('mouseleave', (e) => { this.onMouseLeave(e) });
    }

    moveHome() {
        this._submenu.insertAfter(this._button);
    }

    moveTo(element) {
        this._submenu.appendTo(element);
    }

    onClick(e) {
        e.preventDefault();
        if (this._menu._isRevealed) return;
        if (!this._menu._multiExpand) this._menu.toggleSubmenus(false, true, this._index);
        this.toggle();
    }

    onMouseEnter(e) {
        if (this._menu._isRevealed) {
            this._menu.lockTargets(true);
            this.toggle(true);
        }
    }

    onMouseLeave(e) {
        if (this._menu._isRevealed) {
            this._menu.lockTargets(false);
            this.toggle(false);
        }
    }

    resetMaxHeight() {
        this._submenu.css('max-height', '');
    }

    setMaxHeight(state) {
        this._submenu.css('max-height', (state) ? this._submenu[0].scrollHeight : 0);
    }

    toggle(state, animation = true) {
        this._submenu.toggleClass(togglerNoAnim, !animation);
        if (state == undefined) state = !this._expanded;
        // console.log('submenu', this._index, state, this._expanded, (state != this._expanded) ? 'state changed' : '');
        if (state != this._expanded) {
            this._button.toggleClass(togglerExpanded, state);
            if (!this._menu._isRevealed) this.setMaxHeight(state);
            this._submenu.attr(attrAriaExpanded, state);
            this._submenu.toggleClass(togglerCollapsed, !state);
            this._submenu.toggleClass(togglerExpanded, state);
            this._expanded = state;
        }
    }
}

// Initialize elements with 'data-site-menu' attribute
// ---------------------------------------------------

let siteMenus = [];
$(document).ready(() => {
    $('[' + attrSiteMenu + ']').each((index, item) => {
        siteMenus.push(new SiteMenu(item));
    });
});