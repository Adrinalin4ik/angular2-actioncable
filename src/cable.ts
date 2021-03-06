import * as ActionCableNs from 'actioncable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const ActionCable = ActionCableNs;

export class Cable {
  baseCable: any;
  constructor(public url: string) {
    this.baseCable = ActionCable.createConsumer(this.url);
  }

  /**
   * Create a new subscription to a channel, optionally with topic paramters.
   */
  channel(name: string, params = {}): Channel {
    return new Channel(this, name, params);
  }

  /**
   * Close the connection.
   */
  disconnect() {
    return this.baseCable.disconnect();
  }
}

export class Channel {
  /**
   * Once a channel subscription is created, the messages Observable will emit any messages the channel receives.
   * For easy clean-up, when this Observable is completed the ActionCable channel will also be closed.
   */
  messages: BehaviorSubject<any> = new BehaviorSubject({});
  baseChannel: any;
  onrejected: BehaviorSubject<any> = new BehaviorSubject({});
  onclose: BehaviorSubject<any> = new BehaviorSubject({});
  onerror: BehaviorSubject<any> = new BehaviorSubject({});
  onconnected: BehaviorSubject<any> = new BehaviorSubject({});
  ondisconnected: BehaviorSubject<any> = new BehaviorSubject({});
  
  constructor(public cable: Cable, public name: string, public params = {}) {
    console.warn("NEW")
    const channelParams = Object.assign({}, params, {channel: name});
    this.baseChannel = this.cable.baseCable.subscriptions.create(channelParams, {
      received: (data: any) => { 
        this.messages.next(data);
      },
      connected: (data: any) => { 
        this.onconnected.next(data);
      },
      disconnected: (data: any) => { 
        this.ondisconnected.next(data);
      },
      open: (data: any) => { 
        this.onrejected.next(data);
      },
      close: (data: any) => { 
        this.onclose.next(data);
      },
      error: (data: any) => { 
        this.onerror.next(data);
      }
    });
    //return () => this.unsubscribe();
  }

  /**
   * Close the connection.
   */
  send(data: any) {
    this.baseChannel.send(data);
  }

  /**
   * Close the connection.
   */
  unsubscribe() {
    this.cable.baseCable.subscriptions.remove(this.baseChannel);
  }
}
