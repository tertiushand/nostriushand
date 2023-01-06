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
      filter['limit'] = request.limit?request.limit:100;

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

  public getUserProfile(pubkey:string) {
    //Should get all info on the user's profile.
    //if pubkey is not provided, use the user's.
    this.relay.initializedRelays[''].listen().subscribe(profile => {
      
    });
    this.relay.initializedRelays[''].sendMessage({
      requestId: 'PROFILE',
      kinds: [0],
      authors: [pubkey]
    });

  }

  public getFollowsEvents() {
    //Should get all of the user's follows' events.
  }

  public getEvent(eventId: string) {
    //Should get the info for a single event.
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