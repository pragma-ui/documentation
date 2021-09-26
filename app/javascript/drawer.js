document.addEventListener('turbolinks:load', function () {
  'use strict'

  // Class constructor for Pragma Drawer component.
  // Implements Pragma component design pattern
  //
  // @constructor
  // @param {HTMLElement} The element that will be upgraded to be Pragma Drawer.
  var PragmaDrawer = function PragmaDrawer(element) {
    this.element_ = element
    this.main_ = document.querySelector('main')
    this.closeElement_ = this.element_.querySelector('.' + this.cssClasses_.CLOSE)
    this.openElement_ = document.querySelector('.' + this.cssClasses_.OPEN)
    // Open Drawer
    this.openElement_.addEventListener('click', this.openDrawer.bind(this))
    // Close Drawer
    this.closeElement_.addEventListener('click', this.hideDrawer.bind(this))

    if (this.element_.classList.contains("drawer-fixed") && this.element_.classList.contains("is-visible")) {
      this.manageClasses()
      window.onresize = this.manageClasses.bind(this)
    }
  };
  window['PragmaDrawer'] = PragmaDrawer

  // Store strings for class names defined by this component that are used in
  // Javascript. This allows us to simply change it in one place should we decide
  // to modify at a later date.
  //
  // @enum {string}
  // @private
  PragmaDrawer.prototype.cssClasses_ = {
    ACTIVE: 'is-visible',
    CLOSE: 'drawer-close-button',
    OPEN: 'drawer-open-button',
    FIXED_DRAWER_LAYOUT: 'fixed-drawer-layout',
  };

  // Open the drawer.
  //
  // @public
  PragmaDrawer.prototype.openDrawer = function () {
    this.element_.classList.add(this.cssClasses_.ACTIVE)
  };
  PragmaDrawer.prototype['openDrawer'] = PragmaDrawer.prototype.openDrawer;

  // Hide the drawer.
  //
  // @public
  PragmaDrawer.prototype.hideDrawer = function () {
    this.element_.classList.remove(this.cssClasses_.ACTIVE)
  };
  PragmaDrawer.prototype['hideDrawer'] = PragmaDrawer.prototype.hideDrawer;

  // Manage classes for the drawer.
  //
  // @public
  PragmaDrawer.prototype.manageClasses = function () {
    // Manage visibility class to esnure responsivity
    let sw = componentHandler.windowInfo().screen_width
    if (sw < 992) {
      this.element_.classList.remove(this.cssClasses_.ACTIVE)
      this.main_.classList.remove(this.cssClasses_.FIXED_DRAWER_LAYOUT)
    } else {
      this.element_.classList.add(this.cssClasses_.ACTIVE)
      this.main_.classList.add(this.cssClasses_.FIXED_DRAWER_LAYOUT)
    }
  };
  PragmaDrawer.prototype['manageClasses'] = PragmaDrawer.prototype.manageClasses;

  // The component registers itself. It can assume componentHandler is available
  // in the global scape.
  componentHandler.register({
    constructor: PragmaDrawer,
    classAsString: 'PragmaDrawer',
    cssClass: 'drawer',
    widget: true
  })
})