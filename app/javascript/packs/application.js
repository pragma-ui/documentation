// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
require("componentHandler")
require("accordions")
require("data-tables")
require("dialogs")
require("drawer")
require("dropdowns")
require("mobile-menu")
require("notifications")
// require("datepicker")

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
document.addEventListener('turbolinks:load', function () {
  'use strict';

  if ('classList' in document.createElement('div') &&
   'querySelector' in document &&
   'addEventListener' in window && Array.prototype.forEach) {
    componentHandler.upgradeAllRegistered();
  } else {
    //
    // Dummy function to avoid JS errors.
    //
    componentHandler.upgradeElement = function () {
    };
    //
    // Dummy function to avoid JS errors.
    //
    componentHandler.register = function () {
    };
  }
});
