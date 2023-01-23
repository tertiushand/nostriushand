import { iNipResponseEventUpgrade } from "./nostr.interface";

export class NipResponse {
    eventId?: String;
    event?: iNipResponseEventUpgrade;
    notice?: string;

    constructor(
        nip01: (String | NipResponseEvent)[]
    ){
        if (nip01[0] === NipResponseId.event) {
            this.eventId = nip01[1] instanceof String?nip01[1]:undefined;
            let newTags: NipResponseTag[]= []

            if (nip01[2] instanceof NipResponseEvent) {
                
                nip01[2].tags.forEach(tag => {
                    newTags.push(new NipResponseTag(tag));
                })

                this.event = {
                    id: nip01[2].id,
                    pubkey: nip01[2].pubkey,
                    created_at: nip01[2].created_at,
                    kind: nip01[2].kind,
                    tags: newTags,
                    content: nip01[2].content,
                    sig: nip01[2].sig
                }

                if (nip01[2].kind === 3) {
                    this.event['profile'] = JSON.parse(nip01[2].content);
                }
            }
        } else if (nip01[0] === NipResponseId.notice) {
            this.notice = nip01[1].toString();
        }
    }
}

export class NipResponseEvent {
    id: string; //32-bytes sha256 of the the serialized event data
    pubkey: string; //32-bytes hex-encoded public key of the event creator
    created_at: number; //unix timestamp in seconds
    kind: number; //0 - profile information, 1 - all notes matching filter, 2 - the URL (e.g., wss://somerelay.com) of a relay the event creator wants to recommend to its followers.
    tags: string[][]; //Array of arrays of "e" (event) and "p" (pubkey) with id/key then recommended relay.
    content: string; //arbitrary string
    sig: string; //64-bytes signature of the sha256 hash of the serialized event data, which is the same as the "id" field

    constructor(
        id: string,
        pubkey: string,
        created_at: number,
        kind: number,
        tags: string[][],
        content: string,
        sig: string
    ) {
        this.id = id;
        this.pubkey = pubkey;
        this.created_at = created_at;
        this.kind = kind;
        this.tags = tags;
        this.content = content;
        this.sig = sig;
    }
}

export class NipResponseTag {
    event?: string;
    pubkey?: string;
    relay: string;
    username?: string;
    reply?: string;
    root?: string;

    constructor(
        tag: string[]
    ){
        if (tag[0] === TagId.e)
            this.event = tag[1];
        else if (tag[0] === TagId.p)
            this.pubkey = tag[1];

        this.relay = tag[2];

        if (tag[3]){
            if (tag[3] === 'reply')
                this.reply = tag[3];
            else if (tag[3] === 'root')
                this.root = tag[3]
            else 
                this.username = tag[3];
        }
    }
}

export class NipProfile {
    public id?: string;
    public preferredRelay?: string;
    public created_at?: Date;
    public tags?: string[][];
    public sig?: string;
    public pubkey?: string;
    public name?: string;
    public about?: string;
    public picture?: string;
    public notes?: iNoteStorage[] = [];
    public allNotes?: iNoteStorage[] = [];
    public replies?: iNoteStorage[] = [];
    public media?: iNoteStorage[] = [];
    public likes?: iNoteStorage[] = [];
    public callOpen?: boolean;

    constructor(profile: iNipProfile){
        this.id = profile.id;
        this.created_at = profile.created_at instanceof Date?
            profile.created_at:
            profile.created_at?
                this.convertUnixTimestampToDate(profile.created_at):
                undefined;
        this.tags = profile.tags;
        this.sig = profile.sig;
        this.pubkey = profile.pubkey;
        this.name = profile.name;
        this.about = profile.about;
        this.picture = profile.picture;
        this.preferredRelay = profile.preferredRelay;
        this.callOpen = false;
        this.notes = profile.notes?profile.notes:[];
        this.allNotes = profile.allNotes?profile.allNotes:[];
        this.replies = profile.replies?profile.replies:[];
        this.media = profile.media?profile.media:[];
        this.likes = profile.likes?profile.likes:[];
    }

    public updateProfile(profile: iNipProfile): boolean {
        this.id = profile.id;
        this.created_at = profile.created_at instanceof Date?
            profile.created_at:
            profile.created_at?
                this.convertUnixTimestampToDate(profile.created_at):
                undefined;
        this.tags = profile.tags;
        this.sig = profile.sig;
        this.pubkey = profile.pubkey;
        this.name = profile.name;
        this.about = profile.about;
        this.picture = profile.picture;
        this.preferredRelay = profile.preferredRelay;
        this.callOpen = false;
        return true;
    }

    addToNote(event: iNoteStorage): boolean {
        return this.checkAndPush(event, this.notes);
    }

    addToAllNotes(event: iNoteStorage): boolean {
        return this.checkAndPush(event, this.allNotes);
    }

    addToReplies(event: iNoteStorage): boolean {
        return this.checkAndPush(event, this.replies);
    }

    addToMedia(event: iNoteStorage): boolean {
        return this.checkAndPush(event, this.media);
    }

    addToLikes(event: iNoteStorage): boolean {
        return this.checkAndPush(event, this.likes);
    }

    getId(): string | undefined {
        return this.id;
    }

    getCreatedAt(): Date | undefined {
        return this.created_at;
    }

    getTags(): string[][] | undefined {
        return this.tags;
    }

    getSig(): string | undefined {
        return this.sig;
    }

    getPubkey(): string | undefined {
        return this.pubkey;
    }

    getName(): string | undefined {
        return this.name;
    }

    getAbout(): string | undefined {
        return this.about;
    }

    getPicture(): string | undefined {
        return this.picture;
    }

    getNotes(): iNoteStorage[] | undefined {
        return this.notes;
    }

    getPreferredRelay(): string | undefined {
        return this.preferredRelay;
    }

    getAllNotes(): iNoteStorage[] | undefined {
        return this.allNotes;
    }

    getReplies(): iNoteStorage[] | undefined {
        return this.replies;
    }

    getMedia(): iNoteStorage[] | undefined {
        return this.media;
    }

    getLikes(): iNoteStorage[] | undefined {
        return this.likes;
    }

    setId(id: string): boolean {
        this.id = id;
        return true;
    }

    setPreferredRelay(relay: string): boolean {
        this.preferredRelay = relay;
        return true;
    }

    setCreatedAtFromUnix(createdAt: number): boolean {
        this.created_at = this.convertUnixTimestampToDate(createdAt);
        return true;
    }

    setCreatedAtFromDate(createdAt: Date): boolean {
        this.created_at = createdAt;
        return true;
    }

    setTags(tags: string[][]): boolean {
        this.tags = tags;
        return true;
    }

    setSig(sig: string): boolean {
        this.sig = sig;
        return true;
    }

    setPubkey(pubkey:string): boolean {
        this.pubkey = pubkey;
        return true;
    }

    setName(name:string): boolean {
        this.name = name;
        return true;
    }

    setAbout(about:string): boolean {
        this.about = about;
        return true;
    }

    setPicture(picture:string): boolean {
        this.picture = picture;
        return true;
    }

    clearNotes(): boolean {
        this.notes = [];
        return true;
    }

    clearAllNotes(): boolean {
        this.allNotes = [];
        return true;
    }

    clearReplies(): boolean {
        this.replies = [];
        return true;
    }

    clearMedia(): boolean {
        this.media = [];
        return true;
    }

    clearLikes(): boolean {
        this.likes = [];
        return true;
    }

    private convertUnixTimestampToDate(timestamp: number): Date {
      return new Date(timestamp*1000);
    }

    private checkAndPush(eventToPush: iNoteStorage, events?: iNoteStorage[]): boolean {
        if (!events || !(events instanceof Array))
          events = [];
        
        let eventInserted: boolean = false;
        if (events.length === 0) {
          events.push(eventToPush);
          eventInserted = true;
          return true;
        } else {
          let newEvent: boolean = true;
          events.some((event,i) => {
            if (event.id === eventToPush.id) {
              newEvent = false;
              return true;
            }
            return false;
          })
    
          if (newEvent) {
          events.some((event,i) => {
                if (new Date(event.date).getTime() < eventToPush.date.getTime()){
                    events?.splice(i,0,eventToPush);
                    eventInserted = true;
                    return true;
                }
                return false;
            });
          }
        }
    
        if (!eventInserted)
            events.push(eventToPush);
        
        return true;
    }
}

export class NipNote {
    public content?: string;
    public created_at?: Date;
    public id?: string;
    public pubkey?: string;
    public sig?: string;
    public relay?: string;
    public root?: string;
    public reply?: string;
    public callOpen?: boolean;

    constructor(note: iNipNote) {
        this.content = note.content;
        this.relay = note.relay;
        this.created_at = note.created_at instanceof Date?
            note.created_at:
            note.created_at?
                this.convertUnixTimestampToDate(note.created_at):
                undefined;
        this.id = note.id;
        this.pubkey = note.pubkey;
        this.sig = note.sig;
        this.root = note.root;
        this.reply = note.reply;
        this.callOpen = false;
    }

    public updateNote(note: iNipNote): boolean {
        this.relay = note.relay;
        this.content = note.content;
        this.created_at = note.created_at instanceof Date?
            note.created_at:
            note.created_at?
                this.convertUnixTimestampToDate(note.created_at):
                undefined;
        this.id = note.id;
        this.pubkey = note.pubkey;
        this.sig = note.sig;
        this.root = note.root;
        this.reply = note.reply;
        this.callOpen = false;
        return true;
    }

    getContent(): string | undefined {
        return this.content;
    }

    getCreatedAt(): Date | undefined {
        return this.created_at;
    }

    getId(): string | undefined {
        return this.id;
    }

    getPubkey(): string | undefined {
        return this.pubkey;
    }

    getSig(): string | undefined {
        return this.sig;
    }

    getRelay(): string | undefined {
        return this.relay;
    }

    getRoot(): string | undefined {
        return this.root;
    }

    getReply(): string | undefined {
        return this.reply;
    }

    private convertUnixTimestampToDate(timestamp: number): Date {
      return new Date(timestamp*1000);
    }
}

export interface iNoteStorage {
    id: string;
    date: Date;
}

export enum TagId {
    e = 'e',
    p = 'p'
}

export enum NipResponseId {
    event = 'EVENT',
    notice = 'NOTICE'
}

export interface iNipProfile {
    id?: string;
    preferredRelay?: string;
    created_at?: Date | number;
    tags?: string[][];
    sig?: string;
    pubkey?: string;
    name?: string;
    about?: string;
    picture?: string;
    notes?: iNoteStorage[];
    allNotes?: iNoteStorage[];
    replies?: iNoteStorage[];
    media?: iNoteStorage[];
    likes?: iNoteStorage[];
}

export interface iNipNote {
    content?: string;
    created_at?: Date | number;
    id?: string;
    pubkey?: string;
    sig?: string;
    relay?: string;
    root?: string;
    reply?: string;
}