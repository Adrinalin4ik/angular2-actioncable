(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('actioncable'), require('rxjs/BehaviorSubject')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'actioncable', 'rxjs/BehaviorSubject'], factory) :
	(factory((global['angular2-actioncable'] = {}),global.ng.core,global.actioncable,global.Rx));
}(this, (function (exports,core,ActionCableNs,BehaviorSubject) { 'use strict';

var ActionCable = ActionCableNs;
var Cable = /** @class */ (function () {
    /**
     * @param {?} url
     */
    function Cable(url) {
        this.url = url;
        this.baseCable = ActionCable.createConsumer(this.url);
    }
    /**
     * Create a new subscription to a channel, optionally with topic paramters.
     * @param {?} name
     * @param {?=} params
     * @return {?}
     */
    Cable.prototype.channel = function (name, params) {
        if (params === void 0) { params = {}; }
        return new Channel(this, name, params);
    };
    /**
     * Close the connection.
     * @return {?}
     */
    Cable.prototype.disconnect = function () {
        return this.baseCable.disconnect();
    };
    return Cable;
}());
var Channel = /** @class */ (function () {
    /**
     * @param {?} cable
     * @param {?} name
     * @param {?=} params
     */
    function Channel(cable, name, params) {
        if (params === void 0) { params = {}; }
        var _this = this;
        this.cable = cable;
        this.name = name;
        this.params = params;
        /**
         * Once a channel subscription is created, the messages Observable will emit any messages the channel receives.
         * For easy clean-up, when this Observable is completed the ActionCable channel will also be closed.
         */
        this.messages = new BehaviorSubject.BehaviorSubject({});
        this.onopen = new BehaviorSubject.BehaviorSubject({});
        this.onclose = new BehaviorSubject.BehaviorSubject({});
        this.onerror = new BehaviorSubject.BehaviorSubject({});
        this.onconnected = new BehaviorSubject.BehaviorSubject({});
        console.warn("NEW");
        var channelParams = Object.assign({}, params, { channel: name });
        this.baseChannel = this.cable.baseCable.subscriptions.create(channelParams, {
            received: function (data) {
                _this.messages.next(data);
            },
            connected: function (data) {
                _this.onconnected.next(data);
            },
            open: function (data) {
                _this.onopen.next(data);
            },
            close: function (data) {
                _this.onclose.next(data);
            },
            error: function (data) {
                _this.onerror.next(data);
            }
        });
        //return () => this.unsubscribe();
    }
    /**
     * Close the connection.
     * @param {?} data
     * @return {?}
     */
    Channel.prototype.send = function (data) {
        this.baseChannel.send(data);
    };
    /**
     * Close the connection.
     * @return {?}
     */
    Channel.prototype.unsubscribe = function () {
        this.cable.baseCable.subscriptions.remove(this.baseChannel);
    };
    return Channel;
}());
var ActionCableService = /** @class */ (function () {
    function ActionCableService() {
        this.cables = {};
    }
    /**
     * Open a new ActionCable connection to the url. Any number of connections can be created.
     * @param {?} url
     * @param {?=} params
     * @return {?}
     */
    ActionCableService.prototype.cable = function (url, params) {
        if (!this.cables.hasOwnProperty(url)) {
            this.cables[url] = new Cable(this.buildUrl(url, params));
        }
        return this.cables[url];
    };
    /**
     * Close an open connection for the url.
     * @param {?} url
     * @return {?}
     */
    ActionCableService.prototype.disconnect = function (url) {
        if (this.cables.hasOwnProperty(url)) {
            this.cables[url].disconnect();
            delete this.cables[url];
        }
    };
    /**
     * @param {?} url
     * @param {?=} params
     * @return {?}
     */
    ActionCableService.prototype.buildUrl = function (url, params) {
        if (!params) {
            return url;
        }
        var /** @type {?} */ paramString = Object.keys(params)
            .map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]); })
            .join('&');
        return [url, paramString].join('?');
    };
    return ActionCableService;
}());
ActionCableService.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
ActionCableService.ctorParameters = function () { return []; };

exports.Cable = Cable;
exports.Channel = Channel;
exports.ActionCableService = ActionCableService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular2-actioncable.umd.js.map
