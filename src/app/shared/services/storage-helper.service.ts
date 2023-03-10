import { Injectable } from '@angular/core';
import { SystemEvent, SystemProfile, SystemUserInfo } from './system.class';
import { iSystemEventListItem } from './system.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageHelperService {

  constructor() { }

  

  //Events are used to store all gathered Events by event id.
  setEvents(events: {[key: string]:SystemEvent}): boolean {
    sessionStorage.setItem(StorageLabels.events, this.convertJsonToString(events));
    return true;
  }

  getEvents(): {[key: string]:SystemEvent} {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.events));
  }

  clearEvents(): boolean {
    sessionStorage.removeItem(StorageLabels.events);
    return true;
  }

  //Profiles are a collection of user information by pubkeys
  setProfiles(profiles: {[key: string]:SystemProfile}) {
    sessionStorage.setItem(StorageLabels.profiles, this.convertJsonToString(profiles));
  }

  getProfiles(): {[key: string]:SystemProfile} {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.profiles));
  }

  clearProfiles(): boolean {
    sessionStorage.removeItem(StorageLabels.profiles);
    return true;
  }

  //Set User
  setUserInfo(user: SystemUserInfo): boolean {
    localStorage.setItem(StorageLabels.user, this.convertJsonToString(user));
    return true;
  }

  getUserInfo(): SystemUserInfo {
    return this.convertStringToJson(localStorage.getItem(StorageLabels.user));
  }

  clearUserInfo(): boolean {
    localStorage.removeItem(StorageLabels.user);
    return true;
  }

  //Arrays of events of followed accounts
  //AllEvents is every Event regardless of type.
  setAllEvents(events: iSystemEventListItem[]): boolean {
    sessionStorage.setItem(StorageLabels.allEvents, this.convertJsonToString(events));
    return true;
  }

  getAllEvents(): iSystemEventListItem[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.allEvents));
  }

  clearAllEvents(): boolean {
    sessionStorage.removeItem(StorageLabels.allEvents);
    return true;
  }

  //Roots are events that are not a reply. A root event.
  setRootEvents(events: iSystemEventListItem[]): boolean {
    sessionStorage.setItem(StorageLabels.roots, this.convertJsonToString(events));
    return true;
  }

  getRootEvents(): iSystemEventListItem[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.roots));
  }

  clearRootEvents(): boolean {
    sessionStorage.removeItem(StorageLabels.roots);
    return true;
  }

  //Replies are all the events that are replies to another event.
  setReplyEvents(events: iSystemEventListItem[]): boolean {
    sessionStorage.setItem(StorageLabels.replies, this.convertJsonToString(events));
    return true;
  }

  getReplyEvents(): iSystemEventListItem[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.replies));
  }

  clearReplyEvents(): boolean {
    sessionStorage.removeItem(StorageLabels.replies);
    return true;
  }

  //Media are all events with a link to some form of media to display
  setMedia(events: iSystemEventListItem[]): boolean {
    sessionStorage.setItem(StorageLabels.media, this.convertJsonToString(events));
    return true;
  }

  getMedia(): iSystemEventListItem[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.media));
  }

  clearMedia(): boolean {
    sessionStorage.removeItem(StorageLabels.media);
    return true;
  }

  //Notifications are the people who have replied or interacted with the user's event in some way.
  setNotifications(events: iSystemEventListItem[]): boolean {
    sessionStorage.setItem(StorageLabels.notifications, this.convertJsonToString(events));
    return true;
  }

  getNotifications(): iSystemEventListItem[] {
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
  public addToEvents(event: SystemEvent): boolean {
    let updateEvents = this.getEvents();
    if (!updateEvents)
      updateEvents = {};

    if (event.id && updateEvents[event.id]) {
      updateEvents[event.id] = new SystemEvent(updateEvents[event.id]);
      updateEvents[event.id].updateEvent(event);
    } else if (event.id) {
      updateEvents[event.id] = event;
    }

    this.setEvents(updateEvents);
    return true;
  }

  public addToProfiles(profile: SystemProfile): boolean {
    let updateProfile = this.getProfiles();
    if (!updateProfile)
      updateProfile = {};

    if (profile.nostrId) {
      updateProfile[profile.nostrId] = new SystemProfile(profile);
      this.setProfiles(updateProfile);
    }
    return true;
  }

  addRelayToProfile(pubkey: string, relay: string) {
    let updateProfile = this.getProfiles();
    if (!updateProfile)
      updateProfile = {};
    
    if (!updateProfile[pubkey]) {
      updateProfile[pubkey] = new SystemProfile({nostrId: pubkey, preferredRelays: [relay]});
    } else {
      updateProfile[pubkey] = new SystemProfile(updateProfile[pubkey]).addPreferredRelay(relay);
    }

    this.setProfiles(updateProfile);
  }

  public addToAllEvents(event: iSystemEventListItem): boolean {
    this.setAllEvents(this.checkAndPush(this.getAllEvents(), event));
    return true;
  }

  public addToEventsList(event: iSystemEventListItem): boolean {
    this.setRootEvents(this.checkAndPush(this.getRootEvents(), event));
    return true;
  }

  public addToReplies(event: iSystemEventListItem): boolean {
    this.setReplyEvents(this.checkAndPush(this.getReplyEvents(), event));
    return true;
  }

  public addToMedia(event: iSystemEventListItem): boolean {
    this.setMedia(this.checkAndPush(this.getMedia(), event));
    return true;
  }

  public addToNotifications(event: iSystemEventListItem): boolean {
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
    return JSON.parse(parsable?parsable:'{}')?JSON.parse(parsable?parsable:'{}'):{};
  }

  //Private methods
  checkAndPush(events: iSystemEventListItem[], eventToPush: iSystemEventListItem): iSystemEventListItem[] {
    if (!(events instanceof Array))
      events = [];
    
    let eventInserted: boolean = false;
    if (events.length === 0) {
      events.push(eventToPush);
      eventInserted = true;
      return events;
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
                events.splice(i,0,eventToPush);
                eventInserted = true;
                return true;
            }
            return false;
        });
      }
    }

    if (!eventInserted)
        events.push(eventToPush);
    
    return events;
  }
}

export enum StorageLabels {
  roots = 'nostriushand-roots',
  events = 'nostriushand-events',
  profiles = 'nostriushand-profiles',
  allEvents = 'nostriushand-allEvents',
  eventList = 'nostriushand-eventList',
  replies = 'nostriushand-replies',
  media = 'nostriushand-media',
  notifications = 'nostriushand-notifications',
  muted = 'nostriushand-muted',
  relays = 'nostriushand-relays',
  user = 'nostriushand-user',
  currentPubKey = 'nostriushand-current-pubkey'
}