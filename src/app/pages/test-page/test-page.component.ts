import { Component, OnInit } from '@angular/core';
import { StorageHelperService } from 'src/app/shared/services/storage-helper.service';
import { EventIds, NostrMsgHelperService } from 'src/app/shared/services/nostr/nostr-msg-helper.service';
import { UserInfoService } from 'src/app/shared/services/user-info.service';

import { RelayService } from '../../shared/services/nostr/relay.service';
import { iNostrEvent } from 'src/app/shared/services/nostr/nostr.interface';
import { SystemUserInfo } from 'src/app/shared/services/system.class';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {

  constructor(
    private relays: RelayService,
    private nostrMsg: NostrMsgHelperService,
    public storage: StorageHelperService,
    private userInfo: UserInfoService
  ){}

  private relayUrl: string = this.relays.relays[0];

  ngOnInit(): void {
  }

  listenToRelay() {
    this.relays.initializedRelays[this.relayUrl].listen().subscribe(profile => {
      if (profile[2])
        this.nostrMsg.scrutinizeResponse(profile[2] as iNostrEvent, profile[1] as EventIds, this.relayUrl)
    });
    console.log('listening to '+this.relayUrl)
  }

  closeRelay1() {
    this.relays.initializedRelays[this.relayUrl].closeRequest('adhoc');
  }

  getProfile() {
    if (this.storage.getUserInfo().pubkey)
      this.nostrMsg.getUserProfile(this.storage.getUserInfo().pubkey as string,this.relayUrl);
  }

  getPosts() {
    if (this.storage.getUserInfo().pubkey)
      this.nostrMsg.getUserEvents(this.storage.getUserInfo().pubkey as string,this.relayUrl);
  }

  getRelays() {
    if (this.storage.getUserInfo().pubkey)
      this.nostrMsg.getUserRelay(this.storage.getUserInfo().pubkey as string,this.relayUrl);
  }

  getEvent() {
    if (this.storage.getUserInfo().pubkey)
      this.nostrMsg.getEvent(this.storage.getUserInfo().pubkey as string,this.relayUrl);
  }

  getContacts() {
  if (this.storage.getUserInfo().pubkey)
    this.nostrMsg.getUserContacts(this.storage.getUserInfo().pubkey as string,this.relayUrl);
  }

  showNotes() {
    console.log(this.storage.getEvents());
  }

  showProfiles() {
    console.log(this.storage.getProfiles());
  }

  setPubKey() {
    this.nostrMsg.getCurrentUserPubKey().then(pubkey => {
      this.storage.setUserInfo(new SystemUserInfo({pubkey: pubkey}))
    })
  }

}
