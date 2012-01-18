/*
 * Mootor Events (coded by emi420@gmail.com)
 */

(function (Mootor) {

    "use strict";

    var Drag,
        Touch,
        Orientation;

    // Touch

    Touch = function (element, callback) {
        this.element = this;
        this.callback = callback;
        
        // Prevents default callback
        element.addEventListener('click', function (e) { e.preventDefault(); }, false);
        element.onclick = function () {return false; };

        // Disable selection, copy, etc
        element.style.webkitTouchCallout = "none";
        element.style.webkitUserSelect = "none";
        element.style.webkitUserDrag = "none";
        element.style.webkitUserModify = "none";
        element.style.webkitHighlight = "none";

        element.addEventListener('touchstart', this, false);
        element.addEventListener('touchend', this, false);
    };

    // Touch Handler
    Touch.prototype.handleEvent = function (e) {
        switch (e.type) {
        case 'touchstart':
            this.onTouchStart(e);
            break;
        case 'touchend':
            this.onTouchEnd(e);
            break;
        }
    };

    // Touch Start
    Touch.prototype.onTouchStart = function () {
        //this.element.className += " active";
        this.callback.call();
    };

    // Touch End
    Touch.prototype.onTouchEnd = function () {
        //this.element.className.replace(" active", "");
        this.callback.call();
    };

    // Drag 
    Drag = function (element, callback) {
        this.element = this;
        this.startTouchX = 0;
        this.endTouchX = 0;
        this.lastTouchX = 0;
        this.callback = callback;
        element.addEventListener('touchstart', this, false);
        element.addEventListener('touchmove', this, false);
        element.addEventListener('touchend', this, false);
    };

    // Dreag Handler
    Drag.prototype.handleEvent = function (e) {
        switch (e.type) {
        case 'touchstart':
            this.onTouchStart(e);
            break;
        case 'touchmove':
            this.onTouchMove(e);
            break;
        case 'touchend':
            this.onTouchEnd(e);
            break;
        }
    };

    // Drag Start
    Drag.prototype.onTouchStart = function (e) {
        this.lastTouchX = this.startTouchX = e.touches[0].clientX;
    };

    // Drag Move
    Drag.prototype.onTouchMove = function (e) {
        var distance = e.touches[0].clientX - this.lastTouchX,
            distanceFromOrigin = this.startTouchX - this.lastTouchX;

        this.lastTouchX = e.touches[0].clientX;
        this.callback({
            distance: distance,
            distanceFromOrigin: distanceFromOrigin
        });
    };

    // Drag End
    Drag.prototype.onTouchEnd = function () {
        var distance = this.startTouchX - this.lastTouchX;
        if (this.onDragEnd !== 'undefined') {
            this.onDragEnd(distance);
        }
    };

    // Orientation
    Orientation = function (element, callback) {
        this.callback = callback;
        this.element = this;
        element.addEventListener("orientationchange", this, false);
    };

    // Handler
    Orientation.prototype.handleEvent = function (e) {
        if (e.type === 'orientationchange') {
            this.onOrientationChange(e);
        }
    };

    // Change
    Orientation.prototype.onOrientationChange = function () {
        this.callback();
    };
    
    // TODO: mantener un flag "isDragging" para cancelar
    //       eventos touch si se esta haciendo drag

    Mootor.Event = {
        bind: function (el, eventtype, callback) {
            switch (eventtype) {

            case 'drag':
                el.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
                Mootor.listeners[el] = new Drag(el, callback);
                break;

            case 'dragEnd':
                Mootor.listeners[el].onDragEnd = callback;
                break;

            case 'touch':
                Mootor.listeners[el] = new Touch(el, callback);
                break;

            case 'touchEnd':
                Mootor.listeners[el.rel] = new Touch(el, function () {});
                Mootor.listeners[el.rel].onTouchEnd = callback;
                break;

            case "orientationChange":
                Mootor.listeners.orientationchange = new Orientation(el, callback);
                break;

            }
        }
    };

    Mootor.extend(Mootor.Event);

    /*
     * Private
     */

    Mootor.listeners = [];

}(Mootor));