import { Injectable } from '@angular/core';
import * as ActionCableNs from 'actioncable';
import { BehaviorSubject as BehaviorSubject$1 } from 'rxjs/BehaviorSubject';

const ActionCable = ActionCableNs;
class Cable {
    /**
     * @param {?} url
     */
    constructor(url) {
        this.url = url;
        this.baseCable = ActionCable.createConsumer(this.url);
    }
    /**
     * Create a new subscription to a channel, optionally with topic paramters.
     * @param {?} name
     * @param {?=} params
     * @return {?}
     */
    channel(name, params = {}) {
        return new Channel(this, name, params);
    }
    /**
     * Close the connection.
     * @return {?}
     */
    disconnect() {
        return this.baseCable.disconnect();
    }
}
class Channel {
    /**
     * @param {?} cable
     * @param {?} name
     * @param {?=} params
     */
    constructor(cable, name, params = {}) {
        this.cable = cable;
        this.name = name;
        this.params = params;
        /**
         * Once a channel subscription is created, the messages Observable will emit any messages the channel receives.
         * For easy clean-up, when this Observable is completed the ActionCable channel will also be closed.
         */
        this.messages = new BehaviorSubject$1({});
        this.onrejected = new BehaviorSubject$1({});
        this.onclose = new BehaviorSubject$1({});
        this.onerror = new BehaviorSubject$1({});
        this.onconnected = new BehaviorSubject$1({});
        console.warn("NEW");
        const channelParams = Object.assign({}, params, { channel: name });
        this.baseChannel = this.cable.baseCable.subscriptions.create(channelParams, {
            received: (data) => {
                this.messages.next(data);
            },
            connected: (data) => {
                this.onconnected.next(data);
            },
            open: (data) => {
                this.onrejected.next(data);
            },
            close: (data) => {
                this.onclose.next(data);
            },
            error: (data) => {
                this.onerror.next(data);
            }
        });
        //return () => this.unsubscribe();
    }
    /**
     * Close the connection.
     * @param {?} data
     * @return {?}
     */
    send(data) {
        this.baseChannel.send(data);
    }
    /**
     * Close the connection.
     * @return {?}
     */
    unsubscribe() {
        this.cable.baseCable.subscriptions.remove(this.baseChannel);
    }
}

class ActionCableService {
    constructor() {
        this.cables = {};
    }
    /**
     * Open a new ActionCable connection to the url. Any number of connections can be created.
     * @param {?} url
     * @param {?=} params
     * @return {?}
     */
    cable(url, params) {
        if (!this.cables.hasOwnProperty(url)) {
            this.cables[url] = new Cable(this.buildUrl(url, params));
        }
        return this.cables[url];
    }
    /**
     * Close an open connection for the url.
     * @param {?} url
     * @return {?}
     */
    disconnect(url) {
        if (this.cables.hasOwnProperty(url)) {
            this.cables[url].disconnect();
            delete this.cables[url];
        }
    }
    /**
     * @param {?} url
     * @param {?=} params
     * @return {?}
     */
    buildUrl(url, params) {
        if (!params) {
            return url;
        }
        const /** @type {?} */ paramString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        return [url, paramString].join('?');
    }
}
ActionCableService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ActionCableService.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { Cable, Channel, ActionCableService };
//# sourceMappingURL=angular2-actioncable.js.map
