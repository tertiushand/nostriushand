import { iEvents, iSystemEvent, iSystemEventListItem, iSystemProfile, iSystemUserInfo, Theme } from "./system.interface";

export class SystemUserInfo {
    pubkey?: string;
    theme: Theme;

    constructor(
        user: iSystemUserInfo
    ) {
        this.pubkey = user.pubkey;
        this.theme = user.theme?user.theme:Theme.default;
    }
}

export class SystemProfile {
    public id?: string;
    public preferredRelays?: string[];
    public created_at?: Date;
    public tags?: string[][];
    public sig?: string;
    public nostrId?: string;
    public name?: string;
    public about?: string;
    public picture?: string;
    public events?: iEvents;
    public callOpen?: boolean;

    constructor(profile: iSystemProfile){
        this.id = profile.id;
        this.created_at = profile.created_at;
        this.tags = profile.tags;
        this.sig = profile.sig;
        this.nostrId = profile.nostrId;
        this.name = profile.name;
        this.about = profile.about;
        this.picture = profile.picture;
        this.preferredRelays = profile.preferredRelays;
        this.callOpen = false;
        this.events = {
            all: profile.events?.all?profile.events.all:[],
            root: profile.events?.root?profile.events.root:[],
            replies: profile.events?.replies?profile.events.replies:[],
            media: profile.events?.media?profile.events.media:[],
            likes: profile.events?.likes?profile.events.likes:[]
        }
    }

    public updateProfile(profile: iSystemProfile): boolean {
        this.id = profile.id;
        this.created_at = profile.created_at instanceof Date?
            profile.created_at:
            profile.created_at?
                this.convertUnixTimestampToDate(profile.created_at):
                undefined;
        this.tags = profile.tags;
        this.sig = profile.sig;
        this.nostrId = profile.nostrId;
        this.name = profile.name;
        this.about = profile.about;
        this.picture = profile.picture;
        this.preferredRelays = profile.preferredRelays;
        this.callOpen = false;
        return true;
    }

    addToAllEvents(event: iSystemEventListItem): boolean {
        return this.checkAndPush(event, this.events?.all);
    }

    addToRootEvents(event: iSystemEventListItem): boolean {
        return this.checkAndPush(event, this.events?.root);
    }

    addToRepliesEvents(event: iSystemEventListItem): boolean {
        return this.checkAndPush(event, this.events?.replies);
    }

    addToMediaEvents(event: iSystemEventListItem): boolean {
        return this.checkAndPush(event, this.events?.media);
    }

    addToLikesEvents(event: iSystemEventListItem): boolean {
        return this.checkAndPush(event, this.events?.likes);
    }

    addPreferredRelay(newRelay: string): SystemProfile {
        let notFound = true;
        if (!this.preferredRelays) {
            this.preferredRelays = [newRelay];
            return this;
        }            
        
        this.preferredRelays.some(relay => {
            if (relay === newRelay) {
                notFound = false;
                return true;
            }
            return false;                
        });

        if (notFound) {
            this.preferredRelays.push(newRelay);
        }

        return this;
    }

    setCreatedAtFromUnix(createdAt: number): boolean {
        this.created_at = this.convertUnixTimestampToDate(createdAt);
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

    setNostrId(pubkey:string): boolean {
        this.nostrId = pubkey;
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

    clearAllEvents(): boolean {
        if (this.events)
            this.events.all = [];

        return true;
    }

    clearRootEvents(): boolean {
        if (this.events)
            this.events.root = [];

        return true;
    }

    clearReplyEvents(): boolean {
        if (this.events)
            this.events.replies = [];

        return true;
    }

    clearMediaEvents(): boolean {
        if (this.events)
            this.events.media = [];

        return true;
    }

    clearLikeEvents(): boolean {
        if (this.events)
            this.events.likes = [];

        return true;
    }

    private convertUnixTimestampToDate(timestamp: number): Date {
      return new Date(timestamp*1000);
    }

    private checkAndPush(eventToPush: iSystemEventListItem, events?: iSystemEventListItem[]): boolean {
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

export class SystemEvent {
    public content?: string;
    public created_at?: Date;
    public id?: string;
    public profileId?: string;
    public sig?: string;
    public relay?: string;
    public root?: string;
    public reply?: string;
    public callOpen?: boolean;

    constructor(event: iSystemEvent) {
        this.content = event.content;
        this.relay = event.relay;
        this.created_at = event.created_at instanceof Date?
            event.created_at:
            event.created_at?
                this.convertUnixTimestampToDate(event.created_at):
                undefined;
        this.id = event.id;
        this.profileId = event.profileId;
        this.sig = event.sig;
        this.root = event.root;
        this.reply = event.reply;
        this.callOpen = false;
    }

    public updateEvent(event: iSystemEvent): boolean {
        this.relay = event.relay;
        this.content = event.content;
        this.created_at = event.created_at instanceof Date?
            event.created_at:
            event.created_at?
                this.convertUnixTimestampToDate(event.created_at):
                undefined;
        this.id = event.id;
        this.profileId = event.profileId;
        this.sig = event.sig;
        this.root = event.root;
        this.reply = event.reply;
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

    getProfileId(): string | undefined {
        return this.profileId;
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