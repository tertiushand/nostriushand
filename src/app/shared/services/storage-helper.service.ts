import { Injectable } from '@angular/core';
import { UserInfo } from './system.class';
import { iNipProfile, iNoteStorage, NipNote, NipProfile, NipResponseEvent } from './websocket/nostr.class';

@Injectable({
  providedIn: 'root'
})
export class StorageHelperService {

  constructor() { }

  //Notes are used to store all gathered Notes by event id.
  setNotes(events: {[key: string]:NipNote}): boolean {
    sessionStorage.setItem(StorageLabels.notes, this.convertJsonToString(events));
    return true;
  }

  getNotes(): {[key: string]:NipNote} {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.notes));
  }

  clearNotes(): boolean {
    sessionStorage.removeItem(StorageLabels.notes);
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
  //AllNotes is every Note regardless of type.
  setAllNotes(events: iNoteStorage[]): boolean {
    sessionStorage.setItem(StorageLabels.allNotes, this.convertJsonToString(events));
    return true;
  }

  getAllNotes(): iNoteStorage[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.allNotes));
  }

  clearAllNotes(): boolean {
    sessionStorage.removeItem(StorageLabels.allNotes);
    return true;
  }

  //Notes are notes that are not a reply. A root note.
  setNotesList(events: iNoteStorage[]): boolean {
    sessionStorage.setItem(StorageLabels.notesList, this.convertJsonToString(events));
    return true;
  }

  getNotesList(): iNoteStorage[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.notesList));
  }

  clearNotesList(): boolean {
    sessionStorage.removeItem(StorageLabels.notesList);
    return true;
  }

  //Replies are all the events that are replies to another event.
  setReplies(events: iNoteStorage[]): boolean {
    sessionStorage.setItem(StorageLabels.replies, this.convertJsonToString(events));
    return true;
  }

  getReplies(): iNoteStorage[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.replies));
  }

  clearReplies(): boolean {
    sessionStorage.removeItem(StorageLabels.replies);
    return true;
  }

  //Media are all events with a link to some form of media to display
  setMedia(events: iNoteStorage[]): boolean {
    sessionStorage.setItem(StorageLabels.media, this.convertJsonToString(events));
    return true;
  }

  getMedia(): iNoteStorage[] {
    return this.convertStringToJson(sessionStorage.getItem(StorageLabels.media));
  }

  clearMedia(): boolean {
    sessionStorage.removeItem(StorageLabels.media);
    return true;
  }

  //Notifications are the people who have replied or interacted with the user's note in some way.
  setNotifications(events: iNoteStorage[]): boolean {
    sessionStorage.setItem(StorageLabels.notifications, this.convertJsonToString(events));
    return true;
  }

  getNotifications(): iNoteStorage[] {
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
  public addToNotes(note: NipNote): boolean {
    let updateNotes = this.getNotes();
    if (!updateNotes)
      updateNotes = {};

    if (note.id && updateNotes[note.id]) {
      updateNotes[note.id] = new NipNote(updateNotes[note.id]);
      updateNotes[note.id].updateNote(note);
    } else if (note.id) {
      updateNotes[note.id] = note;
    }

    this.setNotes(updateNotes);
    return true;
  }

  public addToProfiles(profile: NipProfile): boolean {
    let updateProfile = this.getProfiles();
    if (!updateProfile)
      updateProfile = {};

    if (profile.id) {
      updateProfile[profile.id] = new NipProfile(profile);
      this.setProfiles(updateProfile);
    }
    return true;
  }

  public addToAllNotes(event: iNoteStorage): boolean {
    this.setAllNotes(this.checkAndPush(this.getAllNotes(), event));
    return true;
  }

  public addToNotesList(event: iNoteStorage): boolean {
    this.setNotesList(this.checkAndPush(this.getNotesList(), event));
    return true;
  }

  public addToReplies(event: iNoteStorage): boolean {
    this.setReplies(this.checkAndPush(this.getReplies(), event));
    return true;
  }

  public addToMedia(event: iNoteStorage): boolean {
    this.setMedia(this.checkAndPush(this.getMedia(), event));
    return true;
  }

  public addToNotifications(event: iNoteStorage): boolean {
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
  checkAndPush(events: iNoteStorage[], eventToPush: iNoteStorage): iNoteStorage[] {
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
  events = 'nostriushand-events',
  notes = 'nostriushand-notes',
  profiles = 'nostriushand-profiles',
  allNotes = 'nostriushand-allNotes',
  notesList = 'nostriushand-notesList',
  replies = 'nostriushand-replies',
  media = 'nostriushand-media',
  notifications = 'nostriushand-notifications',
  muted = 'nostriushand-muted',
  relays = 'nostriushand-relays',
  user = 'nostriushand-user'
}