import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { StorageHelperService } from '../storage-helper.service';
import { SystemEvent, SystemProfile } from '../system.class';
import { iSystemEventListItem } from '../system.interface';
import { iNostrEvent, iNostrQueryFilter, iNostrProfile, Nos2x, NostrTagMarker, NostrTagType } from './nostr.interface';
import { InitializedRelay, RelayService } from './relay.service';

@Injectable({
  providedIn: 'root'
})
export class NostrMsgHelperService {

  constructor(
    private storage: StorageHelperService,
    private relay: RelayService
  ) { }

  public createRequestMessage(request: iNostrRequest): (String | iNostrQueryFilter)[] {
    let filter: iNostrQueryFilter = {};
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

    filter['limit'] = request.limit?request.limit:20;

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

  public getUserProfile(pubkey:string, relay?:string) {
    if (!this.storage.getProfiles()[pubkey]) {
      if (relay) {
        this.initiateNewRelay(relay);
        this.setProfileCallOpen(pubkey);
        this.relay.initializedRelays[relay].sendMessage({
          requestId: 'USER_PROFILE',
          kinds: [0],
          authors: [pubkey]
        });
      } else if (!this.storage.getProfiles()[pubkey]) {
        Object.keys(this.relay.initializedRelays).forEach(relay => {
          this.initiateNewRelay(relay);
          this.relay.initializedRelays[relay].sendMessage({
            requestId: 'USER_PROFILE',
            kinds: [0],
            authors: [pubkey]
          });
        });
        this.setProfileCallOpen(pubkey);
      }
    }
  }

  public getUsersProfile(pubkeys:string[], relay:string) {
    this.initiateNewRelay(relay);
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USERS_PROFILES',
      kinds: [0],
      authors: pubkeys
    });
  }

  public getUserEvents(pubkey:string, relay:string) {
    this.initiateNewRelay(relay);
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USER_EVENTS',
      authors: [pubkey],
      kinds: [1]
    });
  }

  public getUsersEvents(pubkeys: string[], relay:string) {
    this.initiateNewRelay(relay);
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USERS_EVENTS',
      authors: pubkeys,
      kinds: [1]
    });
  }

  public getUserRelay(pubkey:string, relay:string) {
    this.initiateNewRelay(relay);
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USER_RELAY',
      authors: [pubkey],
      kinds: [2]
    });
  }

  public getUsersRelays(pubkeys:string[], relay:string) {
    this.initiateNewRelay(relay);
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USERS_RELAYS',
      authors: pubkeys,
      kinds: [2]
    });
  }

  public getUserContacts(pubkey:string, relay:string) {
    this.initiateNewRelay(relay);
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'USER_CONTACTS',
      authors: [pubkey],
      kinds: [3]
    });
  }

  public getEvent(event:string, relay?:string, requestId?: string) {
    if (!this.storage.getEvents()[event]) {
      if (relay) {
        this.initiateNewRelay(relay);
        this.relay.initializedRelays[relay].sendMessage({
          requestId: requestId?requestId:'EVENT',
          eventIds: [event],
          kinds: [1]
        });
      } else {
        Object.keys(this.relay.initializedRelays).forEach(relay => {
          this.initiateNewRelay(relay);
          this.setEventCallOpen(event);
          this.relay.initializedRelays[relay].sendMessage({
            requestId: requestId?requestId:'EVENT',
            eventIds: [event],
            kinds: [1]
          });
        });
      }
      this.setEventCallOpen(event);
    }
  }

  public getEvents(events:string[], relay:string) {
    this.initiateNewRelay(relay);
    this.relay.initializedRelays[relay].sendMessage({
      requestId: 'EVENTS',
      eventIds: events,
      kinds: [1]
    });
  }

  public getFollowsEvents() {
    //Should get all of the user's follows' events.
  }

  //This is where the scrutinizing the response begins
  public scrutinizeResponse(response: iNostrEvent, eventId: EventIds, relay: string) {
    switch(response?.kind) {
      case 0: this.scrutinizeKind0(response, relay); break;
      case 1: this.scrutinizeKind1(response, eventId, relay); break;
      case 2: this.scrutinizeKind2(response);
    }
    
    //Should collect the functions to identify what kind of event it is and populate the appropriate objects and arrays.
  }

  scrutinizeKind0(kind: iNostrEvent, relay: string) {
    let content = JSON.parse(kind.content) as iNostrProfile;
    let newProfile: SystemProfile;
    if (this.storage.getProfiles()[kind.id]) {
      newProfile = new SystemProfile(this.storage.getProfiles()[kind.id]);
      newProfile.updateProfile({
        id: kind.id,
        created_at: this.convertUnixTimestampToDate(kind.created_at),
        tags: kind.tags,
        sig: kind.sig,
        nostrId: kind.pubkey,
        name: content.name,
        about: content.about,
        picture: content.picture,
        preferredRelays: newProfile?newProfile.preferredRelays:[relay]
      })
    } else {
      newProfile = new SystemProfile({
        id: kind.id,
        created_at: this.convertUnixTimestampToDate(kind.created_at),
        tags: kind.tags,
        sig: kind.sig,
        nostrId: kind.pubkey,
        name: content.name,
        about: content.about,
        picture: content.picture,
        preferredRelays: [relay]
      });
    }
    
    this.storage.addToProfiles(newProfile);
  }

  scrutinizeKind1(kind: iNostrEvent, eventId: EventIds, relay: string) {
    let hasReply = undefined;
    let hasRoot = undefined;

    let author = this.storage.getProfiles()[kind.pubkey];
    const eventStorage: iSystemEventListItem = {id:kind.id,date:this.convertUnixTimestampToDate(kind.created_at)};

    author = author?new SystemProfile(author):new SystemProfile({
      nostrId: kind.pubkey
    });

    kind.tags.forEach(tag => {
      switch (tag[3]) {
        case NostrTagMarker.root:
          hasRoot = tag[1];
          this.getEvent(tag[1],tag[2], EventIds.root);
          break;
        case NostrTagMarker.reply:
          hasReply = tag[1];
          this.getEvent(tag[1],tag[2], EventIds.reply);
          break;
      }
      
      if (tag[0] === NostrTagType.pubkey) {
        if (tag[1] === this.storage.getUserInfo().pubkey)
          this.storage.addToNotifications(eventStorage);
        
        this.getUserProfile(tag[1], tag[2]);
      } else if (tag[0] === NostrTagType.event &&
        eventId !== EventIds.event &&
        eventId !== EventIds.reply &&
        eventId !== EventIds.root
      ) {
        this.getEvent(tag[1], tag[2]);
      }
    });

    this.storage.addToEvents(new SystemEvent({
      relay: relay,
      content: kind.content,
      created_at: this.convertUnixTimestampToDate(kind.created_at),
      id: kind.id,
      profileId: kind.pubkey,
      sig: kind.sig,
      root: hasRoot,
      reply: hasReply
    }));

    this.storage.addToAllEvents(eventStorage);
    author.addToAllEvents(eventStorage);
    

    if (!hasRoot) {
      this.storage.addToEventsList(eventStorage);
      author.addToRootEvents(eventStorage);

      this.mediaTypes.forEach(type => {
        if (kind.content.toLowerCase().includes(type)) {
          this.storage.addToMedia(eventStorage)
        }
      });
    } else {
      this.storage.addToReplies(eventStorage);
      author.addToRepliesEvents(eventStorage);
    }

    if (eventId === EventIds.reply || eventId === EventIds.root) {
      this.storage.addToNotifications(eventStorage);
    }

    this.storage.addToProfiles(author);
  }

  public scrutinizeKind2(kind: iNostrEvent) {
    this.storage.addRelayToProfile(kind.pubkey, kind.content);
  }

  private convertDateToUnixTimestamp(date: Date): number {
    return Math.floor(date.getTime()/1000);
  }

  private convertUnixTimestampToDate(timestamp: number): Date {
    return new Date(timestamp*1000);
  }

  private setProfileCallOpen(pubkey: string) {
    let newEvents: {[key: string]:SystemEvent} = this.storage.getEvents();
    if (newEvents[pubkey])
      newEvents[pubkey].callOpen = true;
    else {
      newEvents[pubkey] = {callOpen:true} as SystemEvent;
      this.storage.setEvents(newEvents);
    }
  }

  private setEventCallOpen(eventId: string) {
    let newProfiles: {[key: string]:SystemProfile} = this.storage.getProfiles();
    if (newProfiles[eventId])
    newProfiles[eventId].callOpen = true;
    else {
      newProfiles[eventId] = {callOpen:true} as SystemProfile;
      this.storage.setProfiles(newProfiles);
    }
  }

  public initiateCommonRelays() {
    this.relay.relays.forEach(relay => {
      this.relay.initializedRelays[relay] = new InitializedRelay(webSocket(relay), this);
    });
  }

  public initiateNewRelay(relay: string) {
    if (!this.relay.initializedRelays[relay]) {
      this.relay.initializedRelays[relay] = new InitializedRelay(webSocket(relay), this);
      this.relay.initializedRelays[relay].listen().subscribe(
        message => {this.scrutinizeResponse(message[2] as iNostrEvent,message[1] as EventIds,relay)}
      );
    }
  }

  public getCurrentUserPubKey(): Promise<string> {
    let nos2x = window as Window as Nos2x;
    return nos2x.nostr.getPublicKey();
  }

  public mediaTypes = [
    '.gif',
    '.jpg',
    '.jpeg',
    '.png',
    'youtube.com/watch',
    'youtu.be',
    'vimeo.com',
    '.mov',
    '.avi',
    '.flv'
  ]
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

export enum EventIds {
  event = 'EVENT',
  root = 'ROOT',
  reply = 'REPLY'
}

export enum TagType {
  event = 'e',
  profile = 'p'
}

export enum TagRelation {
  root = 'root',
  reply = 'reply'
}