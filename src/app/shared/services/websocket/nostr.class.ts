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
    private id: string;
    private created_at: Date;
    private tags: string[][];
    private sig: string;
    private pubkey: string;
    private name: string;
    private about: string;
    private picture: string;
    private notes: iEventStorage[] = [];
    private allNotes: iEventStorage[] = [];
    private replies: iEventStorage[] = [];
    private media: iEventStorage[] = [];
    private likes: iEventStorage[] = [];

    constructor(
        id: string,
        created_at: number,
        tags: string[][],
        sig: string,
        pubkey: string,
        name: string,
        about: string,
        picture: string
    ){
        this.id = id;
        this.created_at = this.convertUnixTimestampToDate(created_at);
        this.tags = tags;
        this.sig = sig;
        this.pubkey = pubkey;
        this.name = name;
        this.about = about;
        this.picture = picture;
    }

    addToNote(event: iEventStorage): boolean {
        return this.checkAndPush(this.notes, event);
    }

    addToAllNotes(event: iEventStorage): boolean {
        return this.checkAndPush(this.allNotes, event);
    }

    addToReplies(event: iEventStorage): boolean {
        return this.checkAndPush(this.replies, event);
    }

    addToMedia(event: iEventStorage): boolean {
        return this.checkAndPush(this.media, event);
    }

    addToLikes(event: iEventStorage): boolean {
        return this.checkAndPush(this.likes, event);
    }

    getId(): string {
        return this.id;
    }

    getCreatedAt(): Date {
        return this.created_at;
    }

    getTags(): string[][] {
        return this.tags;
    }

    getSig(): string {
        return this.sig;
    }

    getPubkey(): string {
        return this.pubkey;
    }

    getName(): string {
        return this.name;
    }

    getAbout(): string {
        return this.about;
    }

    getPicture(): string {
        return this.picture;
    }

    getNotes(): iEventStorage[] {
        return this.notes;
    }

    getAllNotes(): iEventStorage[] {
        return this.allNotes;
    }

    getReplies(): iEventStorage[] {
        return this.replies;
    }

    getMedia(): iEventStorage[] {
        return this.media;
    }

    getLikes(): iEventStorage[] {
        return this.likes;
    }

    setId(id: string): boolean {
        this.id = id;
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

    private checkAndPush(events: iEventStorage[], eventToPush: iEventStorage): boolean {
        if (events.length === 0) {
            events.push(eventToPush);
            return true;
        }
        
        let eventInserted: boolean = false;
        events.some((event,i) => {
            if (event.date.getTime() < eventToPush.date.getTime()){
                events.splice(i,0,eventToPush);
                eventInserted = true;
                return true;
            }
            return false;
        });

        if (!eventInserted)
            events.push(eventToPush);
        
        return true;
    }
}

export interface iEventStorage {
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