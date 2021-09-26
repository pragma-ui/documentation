document.addEventListener('turbolinks:load', function () {
  'use strict'

  // Class constructor for Pragma Drawer component.
  // Implements Pragma component design pattern
  //
  // @constructor
  // @param {HTMLElement} The element that will be upgraded to be Pragma Drawer.
  var PragmaMobileMenu = function PragmaMobileMenu(element) {
    this.element_ = element
    this.menu_ = document.querySelector('header .title-bar .links')
    // Toggle Mobile Menu
    this.element_.addEventListener('click', this.toggleMenu.bind(this))
  };
  window['PragmaMobileMenu'] = PragmaMobileMenu

  // Store strings for class names defined by this component that are used in
  // Javascript. This allows us to simply change it in one place should we decide
  // to modify at a later date.
  //
  // @enum {string}
  // @private
  PragmaMobileMenu.prototype.cssClasses_ = {
    ACTIVE: 'is-visible',
  };

  // Toggle Menu.
  //
  // @public
  PragmaMobileMenu.prototype.toggleMenu = function (event) {
    event.preventDefault()

    // Add a click listener to the document, to close the menu.
    var callback = function (evt) {
      // Check to see if the document is processing the same event that
      // displayed the menu in the first place. If so, do nothing.
      // Also check to see if the menu is in the process of closing itself, and
      // do nothing in that case.
      // Also check if the clicked element is a menu item
      // if so, do nothing.
      if (evt !== event && evt.target.parentNode !== this.element_) {
        document.removeEventListener('click', callback)
        this.element_.dispatchEvent(componentHandler.createEvent('closing.pragma.mobile-menu', null, false, true))
        this.menu_.classList.remove(this.cssClasses_.ACTIVE)
        this.element_.dispatchEvent(componentHandler.createEvent('closed.pragma.mobile-menu', null, false, true))
      }
    }.bind(this)

    if (!this.menu_.classList.contains(this.cssClasses_.ACTIVE)) {
      this.element_.dispatchEvent(componentHandler.createEvent('opening.pragma.mobile-menu', null, false, true))
      this.menu_.classList.add(this.cssClasses_.ACTIVE)
      this.element_.dispatchEvent(componentHandler.createEvent('open.pragma.mobile-menu', null, false, true))
      document.addEventListener('click', callback)
    }
  };
  PragmaMobileMenu.prototype['toggleMenu'] = PragmaMobileMenu.prototype.toggleMenu;

  // The component registers itself. It can assume componentHandler is available
  // in the global scape.
  componentHandler.register({
    constructor: PragmaMobileMenu,
    classAsString: 'PragmaMobileMenu',
    cssClass: 'mobile-menu',
    widget: true
  })
})