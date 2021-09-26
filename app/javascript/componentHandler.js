document.addEventListener('turbolinks:load', function () {
	// Pre-defining the componentHandler interface, for documentation and
	// static verification.
	var componentHandler = {

		// Window Information
		windowInfo: {},

		// Upgrade DOM
		// Searches existing DOM for elements of our component type and upgrades
		// them if they have not already been ugraded.
		// 
		// @param {string=} optJsClass the programatic name of the element class
		// we need to create a new instance of.
		// @param {string=} optCssClass the name of the CSS Class elements of this
		// type will have.
		upgradeDom: function (optJsClass, optCssClass) {
		},

		// Upgrade Element
		// Upgrades a specific element rather than all in the DOM.
		// 
		// @param {!Element} element The element we wish to upgrade
		// @param {string=} optJsClass Optional name of the class we want to upgrade
		// the element to.
		upgradeElement: function (element, optCssClass) {
		},

		// UpgradeElements
		// Upgrades a specific list of elements rather than all in the DOM.
		// 
		// @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} element.
		// The elements we wish to upgrade.
		upgradeElements: function (elements) {
		},

		// Uphrade All Registered
		// Upgrades all registered components found in the Current DOM. This is
		// automatically called on window load.
		upgradeAllRegistered: function () {
		},

		// Register Upgraded CallBack
		// Allows user to be alerted to any ypgrades that are performed for a given
		// component type.
		// 
		// @param {string} jsClass The class name of the Pragma component we wish to
		// hook into for any upgrades performed.
		// @param {function(!HTMLElement)} callback The function to call upon an upgrade. 
		// This funciton should expect 1 parameter - the HTMLElement which got upgraded.
		registerUpgradedCallback: function (jsClass, callback) {
		},

		// Register
		// Registers a class for future use and attempts to upgrade existing DOM.
		// 
		// @param {componentHandler.ComponentConfigPublic} config the registration configuration
		register: function (config) {
		},

		// Downgrade Elements
		// Downgrade either a given node, an array of nodes, or a NodeList.
		// 
		// @param {!Node|!Array<!Node>|!NodeList} nodes
		downgradeElements: function (nodes) {
		}
	};
	componentHandler = (function () {
		'use strict'

		// Window Information
		function windowInfoInternal() {
			return {
				screen_width: window.innerWidth,
				screen_height: window.innerHeight,
			}
		}

		// @type {!Array<componentHandler.ComponentConfig}
		var registeredComponents_ = []

		// @type {!Array<componentHandler.Component>}
		var createdComponents_ = []

		var componentConfigProperty_ = 'pragmaComponentConfigInternal_'

		// Searches registered components for a class we are interested in using.
		// Optionally replaces a match with passed object if specificed.
		// 
		// @param {string} name the name of a class we want to use.
		// @param {componentHandler.ComponentConfig=} optReplace Optional object to replace match with.
		// @return {!Object|boolean}
		// @private
		function findRegisteredClass_(name, optReplace) {
			for (var i = 0; i < registeredComponents_.length; i++) {
				if (registeredComponents_[i].className === name) {
					if (typeof optReplace !== 'undefined') {
						registeredComponents_[i] = optReplace;
					}
					return registeredComponents_[i];
				}
			}
			return false;
		}

		// Returns an array of the classnames of the upgraded class on the element.
		//
		// @param {!Element} element The element to fetch data from.
		// @return {!Array<string>}
		// @private
		function getUpgradedListOfElement_(element) {
			var dataUpgraded = element.getAttribute('data-upgraded')
			// Use `['']` as default value to conform the `,name,name...` style.
			return dataUpgraded === null ? [''] : dataUpgraded.split(',')
		}

		// Returns true if the given element has already been upgraded for the given
		// class.
		// 
		// @param {!Element} element The element we want to check.
		// @param {string} jsClass The class to check for.
		// @returns {boolean}
		// @private
		function isElementUpgraded_(element, jsClass) {
			var upgradedList = getUpgradedListOfElement_(element);
			return upgradedList.indexOf(jsClass) !== -1;
		}

		// Create an event object.
		// 
		// @param {string} eventType The type name of the event.
		// @param {boolean} bubbles Whether the event should bubble up the DOM.
		// @param {boolean} cancelable Whether the event can be canceled.
		// @returns {!Event}
		function createEvent_(eventType, detail=null, bubbles, cancelable) {
			if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
				return new CustomEvent(eventType, {
					detail: detail,
					bubbles: bubbles,
					cancelable: cancelable
				});
			} else {
				var ev = document.createEvent('Events');
				ev.initEvent(eventType, bubbles, cancelable);
				return ev;
			}
		}

		// Searches existing DOM for elements of our component type and upgrades them
		// if they have not already been upgraded.
		// 
		// @param {string=} optJsClass the programatic name of the element class we
		// need to create a new instance of.
		// @param {string=} optCssClass the name of the CSS class elements of this
		// type will have.
		function upgradeDomInternal(optJsClass, optCssClass) {
			if (typeof optJsClass === 'undefined' &&
					typeof optCssClass === 'undefined') {
				for (var i = 0; i < registeredComponents_.length; i++) {
					upgradeDomInternal(registeredComponents_[i].className,
							registeredComponents_[i].cssClass);
				}
			} else {
				var jsClass = /** @type {string} */ (optJsClass);
				if (typeof optCssClass === 'undefined') {
					var registeredClass = findRegisteredClass_(jsClass);
					if (registeredClass) {
						optCssClass = registeredClass.cssClass;
					}
				}

				var elements = document.querySelectorAll('.' + optCssClass);
				for (var n = 0; n < elements.length; n++) {
					upgradeElementInternal(elements[n], jsClass);
				}
			}
		}

		// Upgrades a specific element rather than all in the DOM.
		// 
		// @param {!Element} element The element we wish to upgrade.
		// @param {string=} optJsClass Optional name of the class we want to upgrade
		// the element to.
		function upgradeElementInternal(element, optJsClass) {
			// Verify argument type.
			if (!(typeof element === 'object' && element instanceof Element)) {
				throw new Error('Invalid argument provided to upgrade Pragma element.');
			}
			// Allow upgrade to be canceled by canceling emitted event.
			var upgradingEv = createEvent_('pragma-componentupgrading', null, true, true);
			element.dispatchEvent(upgradingEv);
			if (upgradingEv.defaultPrevented) {
				return;
			}

			var upgradedList = getUpgradedListOfElement_(element);
			var classesToUpgrade = [];
			// If jsClass is not provided scan the registered components to find the
			// ones matching the element's CSS classList.
			if (!optJsClass) {
				var classList = element.classList;
				registeredComponents_.forEach(function (component) {
					// Match CSS & Not to be upgraded & Not upgraded.
					if (classList.contains(component.cssClass) &&
							classesToUpgrade.indexOf(component) === -1 &&
							!isElementUpgraded_(element, component.className)) {
						classesToUpgrade.push(component);
					}
				});
			} else if (!isElementUpgraded_(element, optJsClass)) {
				classesToUpgrade.push(findRegisteredClass_(optJsClass));
			}

			// Upgrade the element for each classes.
			for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
				registeredClass = classesToUpgrade[i];
				if (registeredClass) {
					// Mark element as upgraded.
					upgradedList.push(registeredClass.className);
					element.setAttribute('data-upgraded', upgradedList.join(','));
					var instance = new registeredClass.classConstructor(element);
					instance[componentConfigProperty_] = registeredClass;
					createdComponents_.push(instance);
					// Call any callbacks the user has registered with this component type.
					for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
						registeredClass.callbacks[j](element);
					}

					if (registeredClass.widget) {
						// Assign per element instance for control over API
						element[registeredClass.className] = instance;
					}
				} else {
					throw new Error(
							'Unable to find a registered component for the given class.');
				}

				var upgradedEv = createEvent_('pragma-componentupgraded', true, false);
				element.dispatchEvent(upgradedEv);
			}
		}

		// 
		// Upgrades a specific list of elements rather than all in the DOM.
		// 
		// @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
		// The elements we wish to upgrade.
		// 
		function upgradeElementsInternal(elements) {
			if (!Array.isArray(elements)) {
				if (elements instanceof Element) {
					elements = [elements];
				} else {
					elements = Array.prototype.slice.call(elements);
				}
			}
			for (var i = 0, n = elements.length, element; i < n; i++) {
				element = elements[i];
				if (element instanceof HTMLElement) {
					upgradeElementInternal(element);
					if (element.children.length > 0) {
						upgradeElementsInternal(element.children);
					}
				}
			}
		}

		// 
		// Registers a class for future use and attempts to upgrade existing DOM.
		// 
		// @param {componentHandler.ComponentConfigPublic} config
		// 
		function registerInternal(config) {
			// In order to support both Closure-compiled and uncompiled code accessing
			// this method, we need to allow for both the dot and array syntax for
			// property access. You'll therefore see the `foo.bar || foo['bar']`
			// pattern repeated across this method.
			var widgetMissing = (typeof config.widget === 'undefined' &&
					typeof config['widget'] === 'undefined');
			var widget = true;

			if (!widgetMissing) {
				widget = config.widget || config['widget'];
			}

			var newConfig = /** @type {componentHandler.ComponentConfig} */ ({
				classConstructor: config.constructor || config['constructor'],
				className: config.classAsString || config['classAsString'],
				cssClass: config.cssClass || config['cssClass'],
				widget: widget,
				callbacks: []
			});

			registeredComponents_.forEach(function (item) {
				if (item.cssClass === newConfig.cssClass) {
					throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
				}
				if (item.className === newConfig.className) {
					throw new Error('The provided className has already been registered');
				}
			});

			if (config.constructor.prototype
					.hasOwnProperty(componentConfigProperty_)) {
				throw new Error(
						'Pragma component classes must not have ' + componentConfigProperty_ +
						' defined as a property.');
			}

			var found = findRegisteredClass_(config.classAsString, newConfig);

			if (!found) {
				registeredComponents_.push(newConfig);
			}
		}

		// Allows user to be alerted to any upgrades that are performed for a given
		// component type
		// 
		// @param {string} jsClass The class name of the MDL component we wish
		// to hook into for any upgrades performed.
		// @param {function(!HTMLElement)} callback The function to call upon an
		// upgrade. This function should expect 1 parameter - the HTMLElement which
		// got upgraded.
		function registerUpgradedCallbackInternal(jsClass, callback) {
			var regClass = findRegisteredClass_(jsClass);
			if (regClass) {
				regClass.callbacks.push(callback);
			}
		}

		// Upgrades all registered components found in the current DOM. This is
		// automatically called on window load.
		function upgradeAllRegisteredInternal() {
			for (var n = 0; n < registeredComponents_.length; n++) {
				upgradeDomInternal(registeredComponents_[n].className);
			}
		}

		// Check the component for the downgrade method.
		// Execute if found.
		// Remove component from createdComponents list.
		// 
		// @param {?componentHandler.Component} component
		function deconstructComponentInternal(component) {
			if (component) {
				var componentIndex = createdComponents_.indexOf(component);
				createdComponents_.splice(componentIndex, 1);

				var upgrades = component.element_.getAttribute('data-upgraded').split(',');
				var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString);
				upgrades.splice(componentPlace, 1);
				component.element_.setAttribute('data-upgraded', upgrades.join(','));

				var ev = createEvent_('pragma-componentdowngraded', true, false);
				component.element_.dispatchEvent(ev);
			}
		}

		// Downgrade either a given node, an array of nodes, or a NodeList.
		// 
		// @param {!Node|!Array<!Node>|!NodeList} nodes
		function downgradeNodesInternal(nodes) {
			// 
			// Auxiliary function to downgrade a single node.
			// @param  {!Node} node the node to be downgraded
			// 
			var downgradeNode = function (node) {
				createdComponents_.filter(function (item) {
					return item.element_ === node;
				}).forEach(deconstructComponentInternal);
			};
			if (nodes instanceof Array || nodes instanceof NodeList) {
				for (var n = 0; n < nodes.length; n++) {
					downgradeNode(nodes[n]);
				}
			} else if (nodes instanceof Node) {
				downgradeNode(nodes);
			} else {
				throw new Error('Invalid argument provided to downgrade Pragma nodes.');
			}
		}

		// Now return the functions that should be made public with their publicly
		// facing names...
		return {
			windowInfo: windowInfoInternal,
			createEvent:	createEvent_,
			upgradeDom: upgradeDomInternal,
			upgradeElement: upgradeElementInternal,
			upgradeElements: upgradeElementsInternal,
			upgradeAllRegistered: upgradeAllRegisteredInternal,
			registerUpgradedCallback: registerUpgradedCallbackInternal,
			register: registerInternal,
			downgradeElements: downgradeNodesInternal
		};
	})();

	// 
	// Describes the type of a registered component type managed by
	// componentHandler. Provided for benefit of the Closure compiler.
	// 
	// @typedef {{
	// 	constructor: Function,
	// 	classAsString: string,
	// 	cssClass: string,
	// 	widget: (string|boolean|undefined)
	// }}
	// 
	componentHandler.ComponentConfigPublic;  // jshint ignore:line

	// 
	// Describes the type of a registered component type managed by
	// componentHandler. Provided for benefit of the Closure compiler.
	// 
	// @typedef {{
	// 	constructor: !Function,
	// 	className: string,
	// 	cssClass: string,
	// 	widget: (string|boolean),
	// 	callbacks: !Array<function(!HTMLElement)>
	// }}
	// 
	componentHandler.ComponentConfig;  // jshint ignore:line
	// 
	// 
	// Created component (i.e., upgraded element) type as managed by
	// componentHandler. Provided for benefit of the Closure compiler.
	// 
	// @typedef {{
	// 	element_: !HTMLElement,
	// 	className: string,
	// 	classAsString: string,
	// 	cssClass: string,
	// 	widget: string
	// }}

	componentHandler.Component;  // jshint ignore:line

	// Export all symbols, for the benefit of Closure compiler.
	// No effect on uncompiled code.
	componentHandler['windowInfo'] = componentHandler.windowInfo;
	componentHandler['createEvent'] = componentHandler.createEvent;
	componentHandler['upgradeDom'] = componentHandler.upgradeDom;
	componentHandler['upgradeElement'] = componentHandler.upgradeElement;
	componentHandler['upgradeElements'] = componentHandler.upgradeElements;
	componentHandler['upgradeAllRegistered'] = componentHandler.upgradeAllRegistered;
	componentHandler['registerUpgradedCallback'] = componentHandler.registerUpgradedCallback;
	componentHandler['register'] = componentHandler.register;
	componentHandler['downgradeElements'] = componentHandler.downgradeElements;
	window.componentHandler = componentHandler;
	window['componentHandler'] = componentHandler;
})