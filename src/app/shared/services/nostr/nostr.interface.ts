export interface iNostrQueryFilter {
    ids?: string[]; //a list of event ids or prefixes
    authors?: string[]; //a list of pubkeys or prefixes, the pubkey of an event must be one of these
    kinds?: number[]; //0 - profile information, 1 - get all notes matching filter, 2 - the URL (e.g., wss://somerelay.com) of a relay the event creator wants to recommend to its followers, 3 - follows list
    '#e'?: string[]; //a list of event ids that are referenced in an "e" tag
    '#p'?: string[]; //a list of pubkeys that are referenced in a "p" tag
    since?: number; //a timestamp, events must be newer than this to pass
    until?: number; //a timestamp, events must be older than this to pass
    limit?: number; //maximum number of events to be returned in the initial query
}

export interface iNostrEvent {
    content: string;
    created_at: number;
    id: string;
    kind: number;
    pubkey: string;
    sig: string;
    tags: [nostrTag: NostrTagType, id: string, url: string, marker: NostrTagMarker][];
}

export interface iNostrProfile {
    name: string; //username
    about: string; //profile about text
    picture: string; //url of profile picture
}

export interface Nos2x extends Window {
    nostr: NostrExtension;
}

export interface NostrExtension {
    getPublicKey: Function; // returns your public key as hex
    signEvent: Function; // returns the full event object signed. pass Event as argument.
    getRelays: Function; // returns a map of relays
    nip04: Nip04Extension;
}

export interface Nip04Extension {
    encrypt: Function; //has pubkey, plaintext arguments. returns ciphertext+iv as specified in nip04
    decrypt: Function; //has pubkey, ciphertext arguments. takes ciphertext+iv as specified
}

export enum NostrTagType {
    event = "e",
    pubkey = "p"
}

export enum NostrTagMarker {
    root = 'root',
    reply = 'reply'
}

export enum NostrEventId {
    event = 'EVENT',
    root = 'ROOT',
    reply = 'REPLY'
  }