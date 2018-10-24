(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// SITE-MENU
// =========
var attrAriaExpanded = 'aria-expanded';
var attrMultiExpand = 'data-multi-expand';
var attrSiteMenu = 'data-site-menu';
var attrSiteMenuButton = 'data-site-menu-button';
var attrSiteMenuLock = 'data-site-menu-lock';
var attrSubmenuAppendTo = 'data-submenu-append-to';
var elSubmenuIcon = '<i class="submenu-icon"></i>';
var togglerCollapsed = 'is-collapsed';
var togglerExpanded = 'is-expanded';
var togglerLocked = 'is-locked';
var togglerNoAnim = 'no-anim'; // Menu
// ----

var SiteMenu =
/*#__PURE__*/
function () {
  function SiteMenu(element) {
    var _this = this;

    _classCallCheck(this, SiteMenu);

    /* Initialize */
    this._menu = $(element);
    this._button = $('#' + this._menu.attr(attrSiteMenuButton));
    this._multiExpand = this._menu.attr(attrMultiExpand) == 'true';
    this._submenuAppendTo = $('#' + this._menu.attr(attrSubmenuAppendTo));
    /* Submenus */

    this._submenus = [];

    var submenus = this._menu.find('li>ul');

    for (var i = 0; i < submenus.length; i++) {
      this._submenus.push(new SubMenu(submenus[i], this, i));
    }
    /* Locks */


    this._locks = [];
    var lockIds = SiteMenu.stringToArray(this._menu.attr(attrSiteMenuLock));

    for (var _i = 0; _i < lockIds.length; _i++) {
      this._locks.push($('#' + lockIds[_i]));
    }
    /* Refresh */


    this.refresh();
    /* Events */

    $(window).resize(function (e) {
      _this.onResize(e);
    });
  }

  _createClass(SiteMenu, [{
    key: "lockTargets",
    value: function lockTargets(state) {
      for (var i = 0; i < this._locks.length; i++) {
        this._locks[i].toggleClass(togglerLocked, state);
      }
    }
  }, {
    key: "onResize",
    value: function onResize(e) {
      this.refresh();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var isRevealed = !this._button.is(':visible');

      if (isRevealed != this._isRevealed) {
        // State changed
        this._isRevealed = isRevealed;

        for (var i = 0; i < this._submenus.length; i++) {
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
  }, {
    key: "toggleSubmenus",
    value: function toggleSubmenus(state) {
      var animation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var expectIndex = arguments.length > 2 ? arguments[2] : undefined;

      for (var i = 0; i < this._submenus.length; i++) {
        if (i != expectIndex) this._submenus[i].toggle(state, animation);
      }
    }
  }], [{
    key: "stringToArray",
    value: function stringToArray(str) {
      var a = [];

      if (typeof str === 'string') {
        str = str.trim();

        if (str != '') {
          a = str.indexOf(',') > -1 ? str.split(/,/) : str.split(/ /);

          for (var i = 0; i < a.lenght; i++) {
            a[i] = a[i].trim();
          }
        }
      }

      return a;
    }
  }]);

  return SiteMenu;
}(); // SubMenu
// -------


exports.default = SiteMenu;

var SubMenu =
/*#__PURE__*/
function () {
  function SubMenu(element, menu, index) {
    var _this2 = this;

    _classCallCheck(this, SubMenu);

    this._index = index;
    this._menu = menu;
    this._submenu = $(element);
    this._expanded = this._submenu.outerHeight() > 0;
    this._button = this._submenu.prev();
    this._submenuIcon = $(elSubmenuIcon);

    this._submenuIcon.appendTo(this._button);

    this.toggle(this._expanded);

    this._button.on('click', function (e) {
      _this2.onClick(e);
    });

    this._button.on('mouseenter', function (e) {
      _this2.onMouseEnter(e);
    });

    this._button.on('mouseleave', function (e) {
      _this2.onMouseLeave(e);
    });

    this._submenu.on('mouseenter', function (e) {
      _this2.onMouseEnter(e);
    });

    this._submenu.on('mouseleave', function (e) {
      _this2.onMouseLeave(e);
    });
  }

  _createClass(SubMenu, [{
    key: "moveHome",
    value: function moveHome() {
      this._submenu.insertAfter(this._button);
    }
  }, {
    key: "moveTo",
    value: function moveTo(element) {
      this._submenu.appendTo(element);
    }
  }, {
    key: "onClick",
    value: function onClick(e) {
      e.preventDefault();
      if (this._menu._isRevealed) return;
      if (!this._menu._multiExpand) this._menu.toggleSubmenus(false, true, this._index);
      this.toggle();
    }
  }, {
    key: "onMouseEnter",
    value: function onMouseEnter(e) {
      if (this._menu._isRevealed) {
        this._menu.lockTargets(true);

        this.toggle(true);
      }
    }
  }, {
    key: "onMouseLeave",
    value: function onMouseLeave(e) {
      if (this._menu._isRevealed) {
        this._menu.lockTargets(false);

        this.toggle(false);
      }
    }
  }, {
    key: "resetMaxHeight",
    value: function resetMaxHeight() {
      this._submenu.css('max-height', '');
    }
  }, {
    key: "setMaxHeight",
    value: function setMaxHeight(state) {
      this._submenu.css('max-height', state ? this._submenu[0].scrollHeight : 0);
    }
  }, {
    key: "toggle",
    value: function toggle(state) {
      var animation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this._submenu.toggleClass(togglerNoAnim, !animation);

      if (state == undefined) state = !this._expanded; // console.log('submenu', this._index, state, this._expanded, (state != this._expanded) ? 'state changed' : '');

      if (state != this._expanded) {
        this._button.toggleClass(togglerExpanded, state);

        if (!this._menu._isRevealed) this.setMaxHeight(state);

        this._submenu.attr(attrAriaExpanded, state);

        this._submenu.toggleClass(togglerCollapsed, !state);

        this._submenu.toggleClass(togglerExpanded, state);

        this._expanded = state;
      }
    }
  }]);

  return SubMenu;
}(); // Initialize elements with 'data-site-menu' attribute
// ---------------------------------------------------


var siteMenus = [];
$(document).ready(function () {
  $('[' + attrSiteMenu + ']').each(function (index, item) {
    siteMenus.push(new SiteMenu(item));
  });
});

},{}]},{},[1])

//# sourceMappingURL=../maps/site-menu.js.map
