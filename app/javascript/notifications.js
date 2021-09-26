document.addEventListener('turbolinks:load', function () {
  'use strict'

  // Class constructor for Pragma Notification component.
  // Implements Pragma component design pattern.
  //
  // @constructor
  // @param {HTMLElement} The element that will be upgraded to be Pragma Notification.
  var PragmaNotification = function PragmaNotification(element) {
    this.element_ = element
    this.textElement_ = this.element_.querySelector('.' + this.cssClasses_.MESSAGE)
    this.actionElement_ = this.element_.querySelector('.' + this.cssClasses_.ACTION)
    this.closeElement_ = this.element_.querySelector('.' + this.cssClasses_.CLOSE)
    if (!this.textElement_) {
      throw new Error('There must be a message element for a notification.')
    }
    if (!this.actionElement_ && !this.element_.dataset.nohide) {
      this.timeoutID_ = setTimeout(this.hideNotification.bind(this), this.Constant_.DISPLAY_DURATION);
    }
    if (this.closeElement_) {
      this.closeElement_.addEventListener('click', this.hideNotification.bind(this))
    }
  };
  window['PragmaNotification'] = PragmaNotification

  // Store constants in on place so they can be updated easily.
  //
  // @enum {string | number}
  // @private
  PragmaNotification.prototype.Constant_ = {
    // The duration of the notification show/hide animation, in ms.
    DISPLAY_DURATION: 2500
  };

  // Store strings for class names defined by this component that are used in
  // Javascript. This allows us to simply change it in one place should we decide
  // to modify at a later date.
  //
  // @enum {string}
  // @private
  PragmaNotification.prototype.cssClasses_ = {
    NOTIFICATION: 'notification',
    MESSAGE: 'notification-message',
    ACTION: 'notification-actions',
    CLOSE: 'notification-close',
    PARENT_NODE: 'main',
  };

  // Hide the notification.
  //
  // @public
  PragmaNotification.prototype.hideNotification = function () {
    this.element_.parentNode.removeChild(this.element_)
    clearTimeout(this.timeoutID_)
  };
  PragmaNotification.prototype['hideNotification'] = PragmaNotification.prototype.hideNotification;

  // Programatically create the notification.
  //
  // @param {string, Array}
  // Message: "This is a notificaiton message."
  // Action can be null if no action for a notification.
  // Action: [{text: 'Action', URL}]
  // @public
  var NewPragmaNotification = function NewPragmaNotification(message, action = null) {
    this.newNotification_ = document.createElement('div')
    this.newNotification_.classList.add(PragmaNotification.prototype.cssClasses_.NOTIFICATION)

    this.notificationMessage_ = document.createElement('div')
    this.notificationMessage_.classList.add(PragmaNotification.prototype.cssClasses_.MESSAGE)
    this.notificationMessage_.innerText = message
    this.newNotification_.appendChild(this.notificationMessage_)

    this.notificationClose_ = document.createElement('div')
    this.notificationClose_.classList.add(PragmaNotification.prototype.cssClasses_.CLOSE)
    this.notificationClose_.setAttribute('role', 'button')
    this.notificationClose_.innerHTML = "&times;"
    this.newNotification_.appendChild(this.notificationClose_)

    const newNotification_ = new PragmaNotification(this.newNotification_)
    const main = document.querySelector('main')
    main.prepend(newNotification_)
  };
  window['NewPragmaNotification'] = NewPragmaNotification;

  // The component registers itself. It can assume componentHandler is available
  // in the global scape.
  componentHandler.register({
    constructor: PragmaNotification,
    classAsString: 'PragmaNotification',
    cssClass: 'notification',
    widget: true
  })
})