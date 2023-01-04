import { Injectable } from '@angular/core';
import { UserInfo } from './system.class';
import { iEventStorage, NipProfile, NipResponseEvent } from './websocket/nostr.class';

@Injectable({
  providedIn: 'root'
})
export class StorageHelperService {

  constructor() { }

  //Events are used to store all gathered posts by event id.
  setEvents(events: {[key: string]:NipResponseEvent}): boolean {
    sessionStorage.setItem(StorageLabels.events, this.convertJsonToString(events));
    return true;
  }

  getEvents(): {[key: string]:NipResponseEvent} {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.events));
  }

  clearEvents(): boolean {
    sessionStorage.removeItem(StorageLabels.events);
    return true;
  }

  //Profiles are a collection of user information by pubkeys
  setProfiles(profiles: {[key: string]:NipProfile}) {
    sessionStorage.setItem(StorageLabels.profiles, this.convertJsonToString(profiles));
  }

  getProfiles(): {[key: string]:NipProfile} {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.profiles));
  }

  clearProfiles(): boolean {
    sessionStorage.removeItem(StorageLabels.profiles);
    return true;
  }

  //Set User
  setUserInfo(user: UserInfo): boolean {
    sessionStorage.setItem(StorageLabels.user, this.convertJsonToString(user));
    return true;
  }

  getUserInfo(): UserInfo {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.user));
  }

  //Arrays
  //AllPosts is every post regardless of type.
  setAllPosts(events: iEventStorage[]): boolean {
    sessionStorage.setItem(StorageLabels.allPosts, this.convertJsonToString(events));
    return true;
  }

  getAllPosts(): iEventStorage[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.allPosts));
  }

  clearAllPosts(): boolean {
    sessionStorage.removeItem(StorageLabels.allPosts);
    return true;
  }

  //Posts are notes that are not a reply. A root note.
  setPosts(events: iEventStorage[]): boolean {
    sessionStorage.setItem(StorageLabels.posts, this.convertJsonToString(events));
    return true;
  }

  getPosts(): iEventStorage[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.posts));
  }

  clearPosts(): boolean {
    sessionStorage.removeItem(StorageLabels.posts);
    return true;
  }

  //Replies are all the events that are replies to another event.
  setReplies(events: iEventStorage[]): boolean {
    sessionStorage.setItem(StorageLabels.replies, this.convertJsonToString(events));
    return true;
  }

  getReplies(): iEventStorage[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.replies));
  }

  clearReplies(): boolean {
    sessionStorage.removeItem(StorageLabels.replies);
    return true;
  }

  //Media are all events with a link to some form of media to display
  setMedia(events: iEventStorage[]): boolean {
    sessionStorage.setItem(StorageLabels.media, this.convertJsonToString(events));
    return true;
  }

  getMedia(): iEventStorage[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.media));
  }

  clearMedia(): boolean {
    sessionStorage.removeItem(StorageLabels.media);
    return true;
  }

  //Notifications are the people who have replied or interacted with the user's note in some way.
  setNotifications(events: iEventStorage[]): boolean {
    sessionStorage.setItem(StorageLabels.notifications, this.convertJsonToString(events));
    return true;
  }

  getNotifications(): iEventStorage[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.notifications));
  }

  clearNotifications(): boolean {
    sessionStorage.removeItem(StorageLabels.notifications);
    return true;
  }

  //Relays stored locally
  setRelays(relays: string[]): boolean {
    localStorage.setItem(StorageLabels.relays, this.convertJsonToString(relays));
    return true;
  }

  getRelays(): string[] {
    return this.convertStringToJson(localStorage.getItem(StorageLabels.relays));
  }

  clearRelays(): boolean {
    localStorage.removeItem(StorageLabels.relays);
    return true;
  }

  //list of users to ignore.
  setMutedUsers(users: string[]): boolean {
    localStorage.setItem(StorageLabels.muted, this.convertJsonToString(users));
    return true;
  }

  getMutedUsers(): string[] {
    return this.convertStringToJson(localStorage.getItem(StorageLabels.muted));
  }

  clearMutedUsers(): boolean {
    localStorage.removeItem(StorageLabels.muted);
    return true;
  }

  //Adding to the storage
  public addToEvents(event: NipResponseEvent): boolean {
    let updateEvent = this.getEvents();
    updateEvent[event.id] = event;
    this.setEvents(updateEvent);
    return true;
  }

  public addToProfiles(profile: NipProfile): boolean {
    let updateProfile = this.getProfiles();
    updateProfile[profile.getPubkey()] = profile;
    this.setProfiles(updateProfile);
    return true;
  }

  public addToAllPosts(event: iEventStorage): boolean {
    this.setAllPosts(this.checkAndPush(this.getAllPosts(), event));
    return true;
  }

  public addToPosts(event: iEventStorage): boolean {
    this.setPosts(this.checkAndPush(this.getPosts(), event));
    return true;
  }

  public addToReplies(event: iEventStorage): boolean {
    this.setReplies(this.checkAndPush(this.getReplies(), event));
    return true;
  }

  public addToMedia(event: iEventStorage): boolean {
    this.setMedia(this.checkAndPush(this.getMedia(), event));
    return true;
  }

  public addToNotifications(event: iEventStorage): boolean {
    this.setNotifications(this.checkAndPush(this.getNotifications(), event));
    return true;
  }

  public addToRelay(relay: string): boolean {
    let updateRelay: string[] = this.getRelays();
    updateRelay.push(relay);
    this.setRelays(updateRelay);
    return true;
  }

  public addToMuted(pubkey: string): boolean {
    let updateMuted: string[] = this.getMutedUsers();
    updateMuted.push(pubkey);
    this.setMutedUsers(updateMuted);
    return true;
  }

  //converters
  convertJsonToString(object: any) {
    return JSON.stringify(object);
  }

  convertStringToJson(parsable: string | null): any {
    return JSON.parse(parsable?parsable:'')?JSON.parse(parsable?parsable:''):{};
  }

  //Private methods
  checkAndPush(events: iEventStorage[], eventToPush: iEventStorage): iEventStorage[] {
    if (events.length === 0) {
      events.push(eventToPush);
      return events;
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
    
    return events;
  }
}

export enum StorageLabels {
  events = 'nostriushand-events',
  posts = 'nostriushand-posts',
  profiles = 'nostriushand-profiles',
  allPosts = 'nostriushand-allPosts',
  notes = 'nostriushand-notes',
  replies = 'nostriushand-replies',
  media = 'nostriushand-media',
  notifications = 'nostriushand-notifications',
  muted = 'nostriushand-muted',
  relays = 'nostriushand-relays',
  user = 'nostriushand-user'
}