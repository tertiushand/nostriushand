import { NipResponseTag } from "./nostr.class";

export interface iNipResponseEventUpgrade {
    id: string; //32-bytes sha256 of the the serialized event data
    pubkey: string; //32-bytes hex-encoded public key of the event creator
    created_at: number; //unix timestamp in seconds
    kind: number; //0 - profile information, 1 - all notes matching filter, 2 - the URL (e.g., wss://somerelay.com) of a relay the event creator wants to recommend to its followers, 3 - follows list
    tags: NipResponseTag[]; //Array of arrays of "e" (event) and "p" (pubkey) with id/key then recommended relay.
    content: string; //arbitrary string
    profile?: iNipKind0Content;
    sig: string; //64-bytes signature of the sha256 hash of the serialized event data, which is the same as the "id" field
    ots?: any;
}

export interface iNipFilter {
    ids?: string[]; //a list of event ids or prefixes
    authors?: string[]; //a list of pubkeys or prefixes, the pubkey of an event must be one of these
    kinds?: number[]; //0 - profile information, 1 - get all notes matching filter, 2 - the URL (e.g., wss://somerelay.com) of a relay the event creator wants to recommend to its followers, 3 - follows list
    '#e'?: string[]; //a list of event ids that are referenced in an "e" tag
    '#p'?: string[]; //a list of pubkeys that are referenced in a "p" tag
    since?: number; //a timestamp, events must be newer than this to pass
    until?: number; //a timestamp, events must be older than this to pass
    limit?: number; //maximum number of events to be returned in the initial query
}

export interface iNipEvent {
    content: string;
    created_at: number;
    id: string;
    kind: number;
    pubkey: string;
    sig: string;
    tags: string[][];
}

export interface iNipKind0Content {
    name: string; //username
    about: string; //profile about text
    picture: string; //url of profile picture
}