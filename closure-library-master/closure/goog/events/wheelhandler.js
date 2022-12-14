/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview This event wrapper will dispatch an event when the user uses
 * the wheel on an element. The event provides details of the unit type (pixel /
 * line / page) and deltas in those units in up to 3 dimensions. Additionally,
 * simplified pixel deltas are provided for code that doesn't need to handle the
 * different units differently. This is not to be confused with the scroll
 * event, where an element in the dom can report that it was scrolled.
 *
 * This class aims to smooth out inconsistencies between browser platforms with
 * regards to wheel events, but we do not cover every possible software/hardware
 * combination out there, some of which occasionally produce very large deltas
 * in wheel events, especially when the device supports acceleration.
 *
 * Relevant standard:
 * http://www.w3.org/TR/2014/WD-DOM-Level-3-Events-20140925/#interface-WheelEvent
 *
 * Clients of this code should be aware that some input devices only fire a few
 * discrete events (such as a mouse wheel without acceleration) whereas some can
 * generate a large number of events for a single interaction (such as a
 * touchpad with acceleration). There is no signal in the events to reliably
 * distinguish between these.
 *
 * @see ../demos/wheelhandler.html
 */

goog.provide('goog.events.WheelHandler');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.events.WheelEvent');
goog.require('goog.style');
goog.require('goog.userAgent');
goog.require('goog.userAgent.product');
goog.requireType('goog.events.BrowserEvent');



/**
 * This event handler allows you to catch wheel events in a consistent manner.
 * @param {!Element|!Document} element The element to listen to the wheel event
 *     on.
 * @param {boolean=} opt_capture Whether to handle the wheel event in capture
 *     phase.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
goog.events.WheelHandler = function(element, opt_capture) {
  'use strict';
  goog.events.WheelHandler.base(this, 'constructor');

  /**
   * This is the element that we will listen to the real wheel events on.
   * @private {!Element|!Document}
   */
  this.element_ = element;

  var rtlElement = goog.dom.isElement(this.element_) ?
      /** @type {!Element} */ (this.element_) :
                              /** @type {!Document} */ (this.element_).body;

  /**
   * True if the element exists and is RTL, false otherwise.
   * @private {boolean}
   */
  this.isRtl_ = !!rtlElement && goog.style.isRightToLeft(rtlElement);

  /**
   * The key returned from the goog.events.listen.
   * @private {goog.events.Key}
   */
  this.listenKey_ = goog.events.listen(
      this.element_, goog.events.WheelHandler.getDomEventType(), this,
      opt_capture);
};
goog.inherits(goog.events.WheelHandler, goog.events.EventTarget);


/**
 * Returns the dom event type.
 * @return {string} The dom event type.
 */
goog.events.WheelHandler.getDomEventType = function() {
  'use strict';
  // Prefer to use wheel events whenever supported.
  if (goog.userAgent.GECKO || goog.userAgent.IE ||
      goog.userAgent.product.CHROME) {
    return 'wheel';
  }

  // Legacy events. Still the best we have on Opera and Safari.
  return goog.userAgent.GECKO ? 'DOMMouseScroll' : 'mousewheel';
};


/**
 * Handles the events on the element.
 * @param {!goog.events.BrowserEvent} e The underlying browser event.
 * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
 */
goog.events.WheelHandler.prototype.handleEvent = function(e) {
  'use strict';
  var deltaMode = goog.events.WheelEvent.DeltaMode.PIXEL;
  var deltaX = 0;
  var deltaY = 0;
  var deltaZ = 0;
  var be = e.getBrowserEvent();
  if (be.type == 'wheel') {
    deltaMode = be.deltaMode;
    deltaX = be.deltaX;
    deltaY = be.deltaY;
    deltaZ = be.deltaZ;
  } else if (be.type == 'mousewheel') {
    // Assume that these are still comparable to pixels. This may not be true
    // for all old browsers.
    if (be.wheelDeltaX !== undefined) {
      deltaX = -be.wheelDeltaX;
      deltaY = -be.wheelDeltaY;
    } else {
      deltaY = -be.wheelDelta;
    }
  } else {  // Historical Gecko
    // Gecko returns multiple of 3 (representing the number of lines)
    deltaMode = goog.events.WheelEvent.DeltaMode.LINE;
    // Firefox 3.1 adds an axis field to the event to indicate axis.
    if (be.axis !== undefined && be.axis === be.HORIZONTAL_AXIS) {
      deltaX = be.detail;
    } else {
      deltaY = be.detail;
    }
  }
  // For horizontal deltas we need to flip the value for RTL grids.
  if (this.isRtl_) {
    deltaX = -deltaX;
  }
  var newEvent =
      new goog.events.WheelEvent(be, deltaMode, deltaX, deltaY, deltaZ);
  this.dispatchEvent(newEvent);
};


/** @override */
goog.events.WheelHandler.prototype.disposeInternal = function() {
  'use strict';
  goog.events.WheelHandler.superClass_.disposeInternal.call(this);
  goog.events.unlistenByKey(this.listenKey_);
  this.listenKey_ = null;
};
