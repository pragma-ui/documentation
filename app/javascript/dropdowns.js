document.addEventListener('turbolinks:load', function () {
	'use strict'

	// Class constructor for Pragma Menu component.
	// Implements Pragma component design pattern
	//
	// @constructor
	// @param {HTMLElement} The element that will be upgraded to be Pragma Accordion.
	var PragmaMenu = function PragmaMenu(element) {
		this.element_ = element
		this.elementTrigger_ = document.querySelector(element.dataset.trigger)
		if (this.elementTrigger_) {
			// Toggle DropMenu
			this.elementTrigger_.addEventListener('click', this.toggleMenu.bind(this))
		}
	};
	window['PragmaMenu'] = PragmaMenu

	// Store strings for class names defined by this component that are used in
	// Javascript. This allows us to simply change it in one place should we decide
	// to modify at a later date.
	//
	// @enum {string}
	// @private
	PragmaMenu.prototype.cssClasses_ = {
		ACTIVE: 'is-visible',
		BOTTOM_LEFT: 'menu-down-left',
		BOTTOM_RIGHT: 'menu-down-right',
		TOP_LEFT: 'menu-up-left',
		TOP_RIGHT: 'menu-up-right',
	};

	// Toggle Menu.
	//
	// @public
	PragmaMenu.prototype.toggleMenu = function (event) {
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
				this.element_.dispatchEvent(componentHandler.createEvent('closing.pragma.menu', null, false, true))
				this.element_.classList.remove(this.cssClasses_.ACTIVE)
				this.element_.dispatchEvent(componentHandler.createEvent('closed.pragma.menu', null, false, true))
			}
		}.bind(this)

		if (!this.element_.classList.contains(this.cssClasses_.ACTIVE)) {
			this.element_.dispatchEvent(componentHandler.createEvent('opening.pragma.menu', null, false, true))
			this.applyPosition_()
			this.element_.classList.add(this.cssClasses_.ACTIVE)
			this.element_.dispatchEvent(componentHandler.createEvent('open.pragma.menu', null, false, true))
			document.addEventListener('click', callback)
		}
	};
	PragmaMenu.prototype['toggleMenu'] = PragmaMenu.prototype.toggleMenu;

	// Apply Position
	//
	// Calculates the initial clip (for opening the menu) and applies it.
	// This allows us to animate from or to the correct point,
	// that is, the point it's aligned to in the "for" element.
	//
	// @param {number} height Height of the clip rectangle
	// @param {number} width Width of the clip rectangle
	// @private
	PragmaMenu.prototype.applyPosition_ = function () {
		if (this.element_.classList.contains(this.cssClasses_.TOP_LEFT)) {
			this.element_.style.bottom = this.elementTrigger_.getBoundingClientRect().height + "px";
		} else if (this.element_.classList.contains(this.cssClasses_.TOP_RIGHT)) {
			this.element_.style.bottom = this.elementTrigger_.getBoundingClientRect().height + "px";
		}
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scape.
	componentHandler.register({
		constructor: PragmaMenu,
		classAsString: 'PragmaMenu',
		cssClass: 'menu',
		widget: true
	})
})