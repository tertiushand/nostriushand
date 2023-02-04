import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { StorageHelperService } from '../storage-helper.service';
import { iNipProfile,iNipNote, NipNote, NipProfile, NipResponseEvent, iNoteStorage } from './nostr.class';
import { iNipEvent, iNipFilter, iNipKind0Content, Nos2x } from './nostr.interface';
import { InitializedRelay, RelayService } from './relay.service';

@Injectable({
  providedIn: 'root'
})
export class NostrMsgHelperService {

  constructor(
    private storage: StorageHelperService,
    private relay: RelayService
  ) { }

  public createRequestMessage(request: iNostrRequest): (String | iNipFilter)[] {
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
    if (!this.storage.getNotes()[event]) {
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
          this.setNoteCallOpen(event);
          this.relay.initializedRelays[relay].sendMessage({
            requestId: requestId?requestId:'EVENT',
            eventIds: [event],
            kinds: [1]
          });
        });
      }
      this.setNoteCallOpen(event);
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
  public scrutinizeResponse(response: iNipEvent, eventId: EventIds, relay: string) {
    switch(response?.kind) {
      case 0: this.scrutinizeKind0(response, relay); break;
      case 1: this.scrutinizeKind1(response, eventId, relay); break;
      case 2: this.scrutinizeKind2(response);
    }
    
    //Should collect the functions to identify what kind of event it is and populate the appropriate objects and arrays.
  }

  scrutinizeKind0(kind: iNipEvent, relay: string) {
    let content = JSON.parse(kind.content) as iNipKind0Content;
    let newProfile: NipProfile;
    if (this.storage.getProfiles()[kind.id]) {
      newProfile = new NipProfile(this.storage.getProfiles()[kind.id]);
      newProfile.updateProfile({
        id: kind.id,
        created_at: kind.created_at,
        tags: kind.tags,
        sig: kind.sig,
        pubkey: kind.pubkey,
        name: content.name,
        about: content.about,
        picture: content.picture,
        preferredRelays: newProfile?newProfile.preferredRelays:[relay]
      })
    } else {
      newProfile = new NipProfile({
        id: kind.id,
        created_at: kind.created_at,
        tags: kind.tags,
        sig: kind.sig,
        pubkey: kind.pubkey,
        name: content.name,
        about: content.about,
        picture: content.picture,
        preferredRelays: [relay]
      });
    }
    
    this.storage.addToProfiles(newProfile);
  }

  scrutinizeKind1(kind: iNipEvent, eventId: EventIds, relay: string) {
    let hasReply = undefined;
    let hasRoot = undefined;

    let author = this.storage.getProfiles()[kind.pubkey];
    const noteStorage: iNoteStorage = {id:kind.id,date:this.convertUnixTimestampToDate(kind.created_at)};

    author = author?new NipProfile(author):new NipProfile({
      pubkey: kind.pubkey
    });

    kind.tags.forEach(tag => {
      switch (tag[3]) {
        case TagRelation.root:
          hasRoot = tag[1];
          this.getEvent(tag[1],tag[2], EventIds.root);
          break;
        case TagRelation.reply:
          hasReply = tag[1];
          this.getEvent(tag[1],tag[2], EventIds.reply);
          break;
      }
      
      if (tag[0] === TagType.profile) {
        if (tag[1] === this.storage.getUserInfo().pubkey)
          this.storage.addToNotifications(noteStorage);
        
        this.getUserProfile(tag[1], tag[2]);
      } else if (tag[0] === TagType.event &&
        eventId !== EventIds.event &&
        eventId !== EventIds.reply &&
        eventId !== EventIds.root
      ) {
        this.getEvent(tag[1], tag[2]);
      }
    });

    this.storage.addToNotes(new NipNote({
      relay: relay,
      content: kind.content,
      created_at: kind.created_at,
      id: kind.id,
      pubkey: kind.pubkey,
      sig: kind.sig,
      root: hasRoot,
      reply: hasReply
    }));

    this.storage.addToAllNotes(noteStorage);
    author.addToAllNotes(noteStorage);
    

    if (!hasRoot) {
      this.storage.addToNotesList(noteStorage);
      author.addToNote(noteStorage);

      this.mediaTypes.forEach(type => {
        if (kind.content.toLowerCase().includes(type)) {
          this.storage.addToMedia(noteStorage)
        }
      });
    } else {
      this.storage.addToReplies(noteStorage);
      author.addToReplies(noteStorage);
    }

    if (eventId === EventIds.reply || eventId === EventIds.root) {
      this.storage.addToNotifications(noteStorage);
    }

    this.storage.addToProfiles(author);
  }

  public scrutinizeKind2(kind: iNipEvent) {
    this.storage.addRelayToProfile(kind.pubkey, kind.content);
  }

  private convertDateToUnixTimestamp(date: Date): number {
    return Math.floor(date.getTime()/1000);
  }

  private convertUnixTimestampToDate(timestamp: number): Date {
    return new Date(timestamp*1000);
  }

  private setProfileCallOpen(pubkey: string) {
    let newNotes: {[key: string]:NipNote} = this.storage.getNotes();
    if (newNotes[pubkey])
      newNotes[pubkey].callOpen = true;
    else {
      newNotes[pubkey] = {callOpen:true} as NipNote;
      this.storage.setNotes(newNotes);
    }
  }

  private setNoteCallOpen(noteId: string) {
    let newProfiles: {[key: string]:NipProfile} = this.storage.getProfiles();
    if (newProfiles[noteId])
    newProfiles[noteId].callOpen = true;
    else {
      newProfiles[noteId] = {callOpen:true} as NipProfile;
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
        message => {this.scrutinizeResponse(message[2] as iNipEvent,message[1] as EventIds,relay)}
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