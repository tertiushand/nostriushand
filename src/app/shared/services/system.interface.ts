export interface iSystemUserInfo {
    pubkey?: string;
    theme?: Theme;
}

export interface iSystemProfile {
    id?: string;
    preferredRelays?: string[];
    created_at?: Date;
    tags?: string[][];
    sig?: string;
    nostrId?: string;
    name?: string;
    about?: string;
    picture?: string;
    events?: iEvents
    callOpen?: boolean;
}

export interface iSystemEvent {
    content?: string;
    created_at?: Date;
    id?: string;
    profileId?: string;
    sig?: string;
    relay?: string;
    root?: string;
    reply?: string;
}

export interface iSystemEventListItem {
    id: string;
    date: Date;
}

export interface iEvents {
    all?: iSystemEventListItem[];
    root?: iSystemEventListItem[];
    replies?: iSystemEventListItem[];
    media?: iSystemEventListItem[];
    likes?: iSystemEventListItem[];
}

export enum Theme {
    default,
    dark
}

