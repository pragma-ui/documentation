document.addEventListener('turbolinks:load', function () {
  'use strict'

  // Class constructor for Pragma Dialog component.
  // Implements Pragma component design pattern
  //
  // @constructor
  // @param {HTMLElement} The element that will be upgraded to be Pragma Accordion.
  var PragmaDialog = function PragmaDialog(element) {
    this.dialogTrigger = element
    this.elementContainer_ = document.querySelector(element.dataset.dialog)
    if (this.elementContainer_) {
      this.element_ = this.elementContainer_.querySelector('.' + this.cssClasses_.DIALOG)
      this.headerElement_ = this.element_.querySelector('.' + this.cssClasses_.HEADER)
      this.bodyElement_ = this.element_.querySelector('.' + this.cssClasses_.BODY)
      this.dialogClose = this.element_.querySelector('.' + this.cssClasses_.CLOSE)
      this.dialogCancels = this.element_.querySelectorAll('.' + this.cssClasses_.CANCEL)
      // Toggle Dialog
      this.dialogTrigger.addEventListener('click', (event) => {
        event.preventDefault()
        this.openDialog()
      })
      this.dialogClose.addEventListener('click', (event) => {
        event.preventDefault()
        this.closeDialog()
      })
      this.elementContainer_.addEventListener('click', (event) => {
        if (event.target === this.elementContainer_) {
          event.preventDefault()
          this.closeDialog()
        } else {
          event.stopImmediatePropagation()
        }
      })
      for (let cancel of this.dialogCancels) {
        cancel.addEventListener('click', (event) => {
          event.preventDefault()
          this.closeDialog()
        })
      }
    }
  };
  window['PragmaDialog'] = PragmaDialog

  // Store strings for class names defined by this component that are used in
  // Javascript. This allows us to simply change it in one place should we decide
  // to modify at a later date.
  //
  // @enum {string}
  // @private
  PragmaDialog.prototype.cssClasses_ = {
    ACTIVE: 'is-visible',
    DIALOG: 'dialog',
    HEADER: 'dialog-header',
    BODY: 'dialog-body',
    CLOSE: 'dialog-close',
    CANCEL: 'dialog-cancel'
  };

  // Open Dialog.
  //
  // @public
  PragmaDialog.prototype.openDialog = function () {
    this.elementContainer_.dispatchEvent(componentHandler.createEvent('opening.pragma.dialog', null, false, true))
    this.elementContainer_.classList.add(this.cssClasses_.ACTIVE)
    this.elementContainer_.dispatchEvent(componentHandler.createEvent('open.pragma.dialog', null, false, true))
    document.addEventListener('keyup', (e) => {
      if (e.key === "Escape") {
        this.closeDialog()
      }
    })
  };
  PragmaDialog.prototype['openDialog'] = PragmaDialog.prototype.openDialog;

  // Close Dialog.
  //
  // @public
  PragmaDialog.prototype.closeDialog = function () {
    this.elementContainer_.dispatchEvent(componentHandler.createEvent('closing.pragma.dialog', null, false, true))
    this.elementContainer_.classList.remove(this.cssClasses_.ACTIVE)
    this.elementContainer_.dispatchEvent(componentHandler.createEvent('closed.pragma.dialog', null, false, true))
  };
  PragmaDialog.prototype['closeDialog'] = PragmaDialog.prototype.closeDialog;

  // The component registers itself.
  // It can assume componentHandler is available in the global scape.
  componentHandler.register({
    constructor: PragmaDialog,
    classAsString: 'PragmaDialog',
    cssClass: 'dialog-trigger',
    widget: true
  })
})