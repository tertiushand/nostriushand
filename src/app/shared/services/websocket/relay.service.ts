import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { iNostrRequest, NostrMsgHelperService } from './nostr-msg-helper.service';
import { iNipEvent, iNipFilter } from './nostr.interface';

@Injectable({
  providedIn: 'root'
})
export class RelayService {

  constructor() { }

  public relays: string[] = [
    'wss://nostr-pub.wellorder.net',
    'wss://nostr-relay.wlvs.space',
    'wss://nostr-verified.wellorder.net',
    'wss://nostr.openchain.fr',
    'wss://relay.damus.io',
    'wss://relay.nostr.info',
    'wss://nostr.oxtr.dev',
    'wss://nostr-pub.semisol.dev',
    'wss://nostr-relay.wlvs.space'
  ];

  public initializedRelays: {[key: string]:InitializedRelay} = {};
}

export class InitializedRelay {
  private websocket: WebSocketSubject<(String | iNipEvent | iNipFilter)[]>;

  constructor(websocket: WebSocketSubject<(String | iNipEvent | iNipFilter)[]>, private nostrMsg: NostrMsgHelperService){
    this.websocket = websocket;
  }

  sendMessage(message: iNostrRequest) {
    this.websocket.next(this.nostrMsg.createRequestMessage(message));
  }

  listen(): Observable<(String | iNipEvent | iNipFilter)[]> {
    return this.websocket.asObservable();
  }

  closeRequest(id: string) {
    this.websocket.next(this.nostrMsg.createCloseMessage(id));
  }
}
