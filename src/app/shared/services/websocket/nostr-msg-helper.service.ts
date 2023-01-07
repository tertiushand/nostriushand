import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { StorageHelperService } from '../storage-helper.service';
import { iNipFilter } from './nostr.interface';
import { InitializedRelay, RelayService } from './relay.service';

@Injectable({
  providedIn: 'root'
})
export class NostrMsgHelperService {

  constructor(
    private storage: StorageHelperService,
    private relay: RelayService
  ) { }

  public createRequestMessage(request: iNostrRequest): (string | iNipFilter)[] {
    let filter: iNipFilter = {};
    if (request.eventIds)
      filter['ids'] = request.eventIds;
    
    if (request.authors)
      filter['authors'] = request.authors;

    filter['kinds'] = request.kinds;

    if (request.taggedEvents)
      filter['#e'] = request.taggedEvents;

    if (request.taggedPubkeys)
      filter['#p'] = request.taggedPubkeys;

    if (request.since)
      filter['since'] = this.convertDateToUnixTimestamp(request.since);

    if (request.until)
      filter['until'] = this.convertDateToUnixTimestamp(request.until);

    if (request.limit)
      filter['limit'] = request.limit?request.limit:10;

    return [
      "REQ",
      request.requestId,
      filter
    ]
  }

  public createCloseMessage(eventId: string) {
    return [
      'CLOSE',
      eventId
    ]
  }

  public populateInitialStorage() {
    //Should be the first call to get all the pubkeys initial data for events, profiles, and arrays.
  }

  public getUserProfile(pubkey:string, relay:string) {
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USER_PROFILE',
      kinds: [0],
      authors: [pubkey]
    });
  }

  public getUsersProfile(pubkeys:string[], relay:string) {
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USERS_PROFILES',
      kinds: [0],
      authors: pubkeys
    });
  }

  public getUserEvents(pubkey:string, relay:string) {
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USER_EVENTS',
      authors: [pubkey],
      kinds: [1]
    });
  }

  public getUsersEvents(pubkeys: string[], relay:string) {
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USERS_EVENTS',
      authors: pubkeys,
      kinds: [1]
    });
  }

  public getUserRelay(pubkey:string, relay:string) {
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USER_RELAY',
      authors: [pubkey],
      kinds: [2]
    });
  }

  public getUsersRelays(pubkeys:string[], relay:string) {
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USERS_RELAYS',
      authors: pubkeys,
      kinds: [2]
    });
  }

  public getUserContacts(pubkey:string, relay:string) {
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USER_CONTACTS',
      authors: [pubkey],
      kinds: [3]
    });
  }

  public getEvent(event:string, relay:string) {
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'EVENT',
      eventIds: [event],
      kinds: [1]
    });
  }

  public getEvents(events:string[], relay:string) {
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'EVENTS',
      eventIds: events,
      kinds: [1]
    });
  }

  public getFollowsEvents() {
    //Should get all of the user's follows' events.
  }

  public scrutinizeResponse(response: any) {
    //Should collect the functions to identify what kind of event it is and populate the appropriate objects and arrays.
  }

  private convertDateToUnixTimestamp(date: Date): number {
    return Math.floor(date.getTime()/1000);
  }

  public initiateCommonRelays() {
    this.relay.relays.forEach(relay => {
      this.relay.initializedRelays[relay] = new InitializedRelay(webSocket(relay), this);
    });
  }

  public initiateNewRelay(relay: string) {
    if (!this.relay.initializedRelays[relay])
      this.relay.initializedRelays[relay] = new InitializedRelay(webSocket(relay), this);
  }
}

export interface iNostrRequest {
  requestId: string;
  eventIds?: string[];
  authors?: string[];
  kinds: number[];
  taggedEvents?: string[];
  taggedPubkeys?: string[];
  since?: Date;
  until?: Date;
  limit?: number;
}