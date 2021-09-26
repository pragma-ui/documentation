document.addEventListener('turbolinks:load', function () {
	'use strict'

	// Class constructor for Pragma Accordion component.
	// Implements Pragma component design pattern
	//
	// @constructor
	// @param {HTMLElement} The element that will be upgraded to be Pragma Accordion.
	var PragmaAccordion = function PragmaAccordion(element) {
		this.element_ = element
		this.headerElement_ = this.element_.querySelector('.' + this.cssClasses_.HEADER)
		this.bodyElement_ = this.element_.querySelector('.' + this.cssClasses_.BODY)
		// Toggle Accordion
		if (!this.element_.disabled) {
			this.headerElement_.addEventListener('click', this.toggleAccordion.bind(this))
		}
	};
	window['PragmaAccordion'] = PragmaAccordion

	// Store strings for class names defined by this component that are used in
	// Javascript. This allows us to simply change it in one place should we decide
	// to modify at a later date.
	//
	// @enum {string}
	// @private
	PragmaAccordion.prototype.cssClasses_ = {
		ACTIVE: 'is-visible',
		HEADER: 'accordion-header',
		BODY: 'accordion-body',
	};


	// Toggle Accordion.
	//
	// @public
	PragmaAccordion.prototype.toggleAccordion = function () {
	  if(this.element_.classList.contains(this.cssClasses_.ACTIVE)) {
	    this.element_.dispatchEvent(componentHandler.createEvent('hide.pragma.accordion', null, false, true))
    } else {
      this.element_.dispatchEvent(componentHandler.createEvent('show.pragma.accordion', null, false, true))
    }
		this.element_.classList.toggle(this.cssClasses_.ACTIVE)
    if(this.element_.classList.contains(this.cssClasses_.ACTIVE)) {
      this.element_.dispatchEvent(componentHandler.createEvent('shown.pragma.accordion', null, false, true))
    } else {
      this.element_.dispatchEvent(componentHandler.createEvent('hidden.pragma.accordion', null, false, true))
    }
	};
	PragmaAccordion.prototype['toggleAccordion'] = PragmaAccordion.prototype.toggleAccordion;

	// The component registers itself. It can assume componentHandler is available
	// in the global scape.
	componentHandler.register({
		constructor: PragmaAccordion,
		classAsString: 'PragmaAccordion',
		cssClass: 'accordion',
		widget: true
	})
})